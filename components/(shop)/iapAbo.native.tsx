import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect } from 'react'
import images from "@/assets/shopItems/itemConfig";
import { useTranslation } from 'react-i18next';
import { finishTransaction, purchaseErrorListener, purchaseUpdatedListener, useIAP } from 'react-native-iap';
import { triggerSubscriptionVerification } from '@/lib/appwriteFunctions';


export default function IapAbo () {
  
  const { t } = useTranslation(); 
  const {connected, subscriptions, fetchProducts, requestPurchase} = useIAP();

  // 1) Fetch subscription products
  useEffect(() => {
    if (connected) {
      fetchProducts({skus: ['no_ads','no_ads_12'], type: 'subs'});
    }
  }, [connected]);


  const purchaseSubscription = async (productId: string) => {
    const sub = subscriptions.find(s => s.id === productId);
    if (!sub) return;


    await requestPurchase({
      type: 'subs',
      request: {
        android: {
          skus: [productId],
        },
        ios: {
          sku: productId
        }
      }
    });
  };

 useEffect(() => {
  const update = purchaseUpdatedListener(async (purchase) => {
    console.log("📥 Purchase received:", purchase);

    try {
      const response = await triggerSubscriptionVerification(
        purchase.productId,
        purchase.purchaseToken
      );

      const json = await response.json();
      console.log("🔎 Backend verification result:", json);

      if (!response.ok) {
        console.log("❌ Backend responded with error");
        console.log(json);
        return; // Wichtig!
      }

      if (!json.status || json.status !== "active") {
        console.log("❌ Subscription NOT active, aborting transaction finish.");
        return;
      }

      console.log("✅ Subscription verified. Finishing transaction…");
      await finishTransaction(purchase);

    } catch (error) {
      console.log("❌ Error during purchase verification:", error);
      return; 
    }
  });

  const error = purchaseErrorListener((e) => {
    console.log("❌ Purchase error", e);
  });

  return () => {
    update.remove();
    error.remove();
  };
}, []);



  


 const DisableAds = ({ price, amount, duration ,subscription}: { subscription:any; price?: string; amount?: number; duration?:number }) => {
    return (
      <View style={{ flex: 1, height: 80, backgroundColor: "#0560a5", borderRadius: 10, padding: 8, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={images.ads}
          style={{ height: 50, width: 50, resizeMode: "contain", marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>A moth without Ads</Text>
          <Text style={{ color: "#ccc" }}>Disable ads for {duration ? duration + " month" : "1 month"} for {price}€

          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "#003f7f", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
          onPress={() => purchaseSubscription(subscription.id)}
          className="ml-2"
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    );
  };



  return (
    <View>
      <View className='w-full ' style={{ paddingHorizontal: 16, marginTop: 10 }}>
      {subscriptions.map((subscription) => (
        <DisableAds
          key={subscription.displayName}
          price={subscription.price ? subscription.price + " " + subscription.currency: undefined}
          duration={subscription.displayName === 'no_ads_12' ? 12 : 1}
          subscription={subscription}
        />
      ))}
    </View>
    </View>
  )
}

