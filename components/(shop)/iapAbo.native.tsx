
/*import { View, Text, Image, TouchableOpacity, Platform, Alert, Linking } from 'react-native'
import React, { useEffect } from 'react'
import images from "@/assets/shopItems/itemConfig";
import { useTranslation } from 'react-i18next';
import { finishTransaction, purchaseUpdatedListener, useIAP } from 'react-native-iap';
import { triggerSubscriptionVerification } from '@/lib/appwriteFunctions';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getUserSubscriptionStatus } from '@/lib/appwriteDaten';


export default function IapAbo () {
  
  const { t } = useTranslation(); 
  const { subscriptionStatus, setSubscriptionStatus, user } = useGlobalContext();
  const {connected, subscriptions, fetchProducts, requestPurchase} = useIAP();
  const [output, setOutput] = React.useState('');
  useEffect(() => {
    if (connected) {
      fetchProducts({skus: ['no_ads','no_ads_12'], type: 'subs'});
    }
  }, [connected]);



 async function openSubscriptionManagement() {
    try {
        let url = '';

        if (Platform.OS === 'ios') {
            // Apple App Store – Abos verwalten
            url = 'https://apps.apple.com/account/subscriptions';
        } else if (Platform.OS === 'android') {
            // Google Play Store – Abos verwalten
            url = 'https://play.google.com/store/account/subscriptions';
        } else {
            Alert.alert(
                'Nicht unterstützt',
                'Abo-Verwaltung ist auf dieser Plattform nicht verfügbar.'
            );
            return;
        }

        const supported = await Linking.canOpenURL(url);

        if (!supported) {
            Alert.alert(
                'Fehler',
                'Der Store konnte nicht geöffnet werden.'
            );
            return;
        }

        await Linking.openURL(url);
    } catch (error) {
        console.log('openSubscriptionManagement error:', error);
        Alert.alert(
            'Fehler',
            'Beim Öffnen der Abo-Verwaltung ist ein Fehler aufgetreten.'
        );
    }
}


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
      if (purchase.productId !== 'no_ads' && purchase.productId !== 'no_ads_12') {
        await finishTransaction({ purchase });
        return;
      };
       
      const response = await triggerSubscriptionVerification(
        purchase.productId,
        purchase.purchaseToken
      );
      if (response.data.data != undefined) {
        return ;
      }

      
     

      if (!response.success) {
        console.log('❌ Verification failed – NOT finishing transaction');
        return;
      }    
      const res = await finishTransaction({ purchase });

      const subscriptionStatus = await getUserSubscriptionStatus(user.$id);
      if (subscriptionStatus) {
      setSubscriptionStatus(subscriptionStatus);
      }
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
          otherIsActive ? null :
      <View style={{ flex: 1, height: 80, backgroundColor: isActive ? "#40420eff" :
      "#0560a5", borderRadius: 10, padding: 8, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={images.ads}
          style={{ height: 50, width: 50, resizeMode: "contain", marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{
            subscription.id === 'no_ads_12' 
            ? t("shop.aYearWithoutAds") :
            t("shop.aMonthWithoutAds")
          }</Text>
          <Text style={{ color: "#ccc" }}>
            {
              subscription.id === 'no_ads_12'
            ? t("shop.disableAdsFor12MonthsFor", { price })
            :
            t("shop.disableAdsFor1MonthFor", { price })
            }
          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor:  isActive ? "#55580aff" :
            "#003f7f"
            , paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
          onPress={async () => {
            if (isActive) {
              await openSubscriptionManagement();
              return;
            }
            purchaseSubscription(subscription.id)}}
          className="ml-2"
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{
            otherIsActive ? t("shop.upgrade") :
            isActive ? t("shop.active") : t("shop.subscribe")
        }</Text>
        </TouchableOpacity>
      </View>
   }
      </View>
    );
  };



  return (
    <View>
    <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
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

*/