import { View, Text, Image, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useEffect } from 'react'
import images from "@/assets/shopItems/itemConfig";
import { useTranslation } from 'react-i18next';
import { finishTransaction, purchaseErrorListener, purchaseUpdatedListener, useIAP } from 'react-native-iap';
import { triggerSubscriptionVerification } from '@/lib/appwriteFunctions';
import { useGlobalContext } from '@/context/GlobalProvider';


export default function IapAbo () {
  
  const { t } = useTranslation(); 
  const { subscriptionStatus, setSubscriptionSatus } = useGlobalContext();
  const {connected, subscriptions, fetchProducts, requestPurchase} = useIAP();
  const [output, setOutput] = React.useState('');
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
  const processed = new Set();

  const update = purchaseUpdatedListener(async (purchase) => {
    
    // Wenn der Kauf-Token nicht vorhanden ist, keine Verarbeitung
    if (!purchase.purchaseToken) return;
    
    // Verhindere doppelte Verarbeitung des gleichen Kaufs
    if (processed.has(purchase.purchaseToken)) {
      return;
    }
    processed.add(purchase.purchaseToken);
    
    try {
      const response = await triggerSubscriptionVerification(
        purchase.productId,
        purchase.purchaseToken
      );
      if (response.success) {
        setSubscriptionSatus(response.data.subscriptionDocument);
      }

      const res = await finishTransaction({ purchase });

    } catch (error) {
      return; // Bei Fehler nichts weiter tun
    }
  });

  // Aufräumen des Listeners bei Verlassen des Components
  return () => {
    update.remove(); // Entfernt den Listener bei Unmount
  };
}, []);




  


 const DisableAds = ({ price, amount, duration ,subscription, currentSubscription}: 
  { subscription:any; price?: string; amount?: number; duration?:number; 
  currentSubscription:any
   }) => {
    const currentDate = new Date();
    const subscriptionEndDate = currentSubscription?.expiry;
    const isActive =
      !!subscriptionEndDate &&
      new Date(subscriptionEndDate) > currentDate &&
      currentSubscription?.status === 'active' &&
      subscription.id === currentSubscription?.productId;
    const otherIsActive =
      !!subscriptionEndDate &&
      new Date(subscriptionEndDate) > currentDate &&
      currentSubscription?.status === 'active' &&
      subscription.id !== currentSubscription?.productId;

    return (
      <View>
        {
          otherIsActive && subscription.id == "no_ads" ? null :
      <View style={{ flex: 1, height: 80, backgroundColor: isActive ? "#40420eff" :
      "#0560a5", borderRadius: 10, padding: 8, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={images.ads}
          style={{ height: 50, width: 50, resizeMode: "contain", marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>A moth without Ads</Text>
          <Text style={{ color: "#ccc" }}>Disable ads for {duration} month for {price}€

          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor:  isActive ? "#55580aff" :
            "#003f7f"
            , paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
          onPress={() => purchaseSubscription(subscription.id)}
          disabled={isActive}
          className="ml-2"
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{
            otherIsActive ? "Switch Plan" :
            isActive ? "Active" : "Subscribe"
        }</Text>
        </TouchableOpacity>
      </View>
   }
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
          currentSubscription={subscriptionStatus}
        />
      ))}
    </View>
    </View>
  )
}

