import { View, Text, Image, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useEffect } from 'react'
import images from "@/assets/shopItems/itemConfig";
import { useTranslation } from 'react-i18next';
import { finishTransaction, purchaseErrorListener, purchaseUpdatedListener, useIAP } from 'react-native-iap';
import { triggerSubscriptionVerification } from '@/lib/appwriteFunctions';


export default function IapAbo () {
  
  const { t } = useTranslation(); 
  const {connected, subscriptions, fetchProducts, requestPurchase} = useIAP();
  const [output, setOutput] = React.useState('');
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
  const processed = new Set();
  let purchaseDetails = ''; // Für Kaufdetails
  let verificationDetails = ''; // Für Verifizierungsdetails
  let transactionDetails = ''; // Für Transaktionsdetails
  let newOutput = ''; // Gesamt-Ausgabe
  
  const update = purchaseUpdatedListener(async (purchase) => {
    purchaseDetails += JSON.stringify(purchase) + '\n\n';
    
    // Wenn der Kauf-Token nicht vorhanden ist, keine Verarbeitung
    if (!purchase.purchaseToken) return;
    
    // Verhindere doppelte Verarbeitung des gleichen Kaufs
    if (processed.has(purchase.purchaseToken)) {
      return;
    }
    processed.add(purchase.purchaseToken);
    
    try {
      // Verifiziere das Abo (oder die Transaktion) über den Backend-Server
      const response = await triggerSubscriptionVerification(
        purchase.productId,
        purchase.purchaseToken
      );
      
      if (!response.success) {
        verificationDetails += "❌ Backend responded with error\n\n";
        newOutput = purchaseDetails + verificationDetails; // Kombiniere bis hierhin
        setOutput(newOutput);
        return;
      }
      
      // Wenn die Verifizierung erfolgreich war, beende die Transaktion
      const res = await finishTransaction({ purchase });
      
      // Transaktionsdetails
      transactionDetails += "✅ Transaction finished.\n\n";
      newOutput = purchaseDetails + verificationDetails + transactionDetails; // Kombiniere alle Details
      setOutput(newOutput);
      
    } catch (error) {
      // Fehlerfall (optional: Logge Fehler, falls nötig)
      console.error("Fehler während der Verarbeitung:", error);
      newOutput = purchaseDetails + verificationDetails + "❌ Error during processing.\n\n"; // Fehler-Ausgabe
      setOutput(newOutput);
      return; // Bei Fehler nichts weiter tun
    }
  });

  // Aufräumen des Listeners bei Verlassen des Components
  return () => {
    update.remove(); // Entfernt den Listener bei Unmount
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

