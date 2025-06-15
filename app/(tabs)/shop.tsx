import { View, Text, ScrollView, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import Cardcombination from '@/components/(shop)/cardcombination'
import TokenHeader from '@/components/(general)/tokenHeader'
import { loadShopItems } from '@/lib/appwriteShop';
import SkeletonListShop from '@/components/(general)/(skeleton)/skeletonListShop'
import { loadComercials } from '@/lib/appwriteDaten'
import languages from '@/assets/exapleData/languageTabs.json';
import { useStripe } from '@stripe/stripe-react-native'
import { ActivityIndicator } from 'react-native'
import { stripeFunction } from '@/lib/appwrite'

const Shop = () => {
  const { user, isLoggedIn, isLoading, userUsage } = useGlobalContext();
  const { language } = useGlobalContext()
  const [selectedLanguage, setSelectedLanguage] = useState("DEUTSCH")
  const texts = languages.shop;
  const [shopItemsA, setShopItemsA] = useState(null);
  const [comercials, setComercials] = useState([]);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const items = await loadShopItems();
        setShopItemsA(items);
      } catch (error) {
        console.error("Error loading shop items:", error);
      }
    };
    fetchShopItems();
  },[]);

  useEffect(() => {
    if (!userUsage) return;
    async function fetchComercials(){
      const response = await loadComercials();
      if (response) {
        setComercials(response.length > 0 ? response : []);
      }
    }
    fetchComercials();
  }, [userUsage]);

  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

 async function fetchPaymentSheetParams() {
  console.log("Starte fetchPaymentSheetParams");
  
  try {
    const res = await stripeFunction();
    const data = JSON.parse(res.responseBody);

    console.log(data.customer);                    
    console.log(data.customerEphemeralKeySecret); 
    console.log(data.paymentIntentClientSecret);
    console.log("PaymentSheet Params erhalten:", data);

    // Je nach Appwrite Function Response anpassen
    const paymentIntent = data.paymentIntentClientSecret
    const ephemeralKey = data.customerEphemeralKeySecret
    const customer = data.customer
    const publishableKey = "pk_test_51RTSKq4hlfGTCc9pXUlwIWJFGlI1x28xjrupHBBSiyCmHrv6D8gwa3FGSA4N3BPW6cDW0PyK3PCqDJEVHcg6TSVZ00qnrxNgyj"
    return { paymentIntent, ephemeralKey, customer, publishableKey };

  } catch (error) {
    console.error("Fetch Exception:", error);
    return null;
  }
}


  const initializePaymentSheet = async () => {
  setLoadingPayment(true);
  const paymentData = await fetchPaymentSheetParams();

  if (!paymentData) {
    alert("Fehler beim Abrufen der Zahlungsdaten.");
    setLoadingPayment(false);
    return;
  }

  const { paymentIntent, ephemeralKey, customer, publishableKey } = paymentData;

  const { error: initError } = await initPaymentSheet({
    customerId: customer,
    customerEphemeralKeySecret: ephemeralKey,
    paymentIntentClientSecret: paymentIntent,
    merchantDisplayName: "QReady",
    allowsDelayedPaymentMethods: true,
    returnURL: "qready://stripe-redirect", // Optional für iOS
    applePay:{
      merchantCountryCode:"US"
    },
    googlePay:{
      merchantCountryCode:"US",
      testEnv:true
    }
  });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gi

  if (initError) {
    alert("Fehler beim Initialisieren: " + initError.message);
    setLoadingPayment(false);
    return;
  }

  const { error: presentError } = await presentPaymentSheet();
  if (presentError) {
    alert("Zahlung fehlgeschlagen: " + presentError.message);
  } else {
    alert("Zahlung erfolgreich! 🎉");
  }

  setLoadingPayment(false);
};


  return (
    <Tabbar content={() => (
      <View className='flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]'>
        <TokenHeader userUsage={userUsage} />
        <ScrollView style={{ scrollbarWidth: 'thin', scrollbarColor: 'gray transparent' }} className='w-full'>
          {
            !shopItemsA ? (
              <View className='flex-1 items-center justify-center'>
                <SkeletonListShop />
              </View>
            ) : (
              <View className='w-full items-center'>
                <Cardcombination cards={shopItemsA.filter(item => item.itemType === "ENERGY")} title={texts[selectedLanguage].recharges} />
                <Cardcombination cards={shopItemsA.filter(item => item.itemType === "CHIPS")} title={texts[selectedLanguage].chips} />
                <Cardcombination cards={shopItemsA.filter(item => item.itemType === "REWARDEDQUIZ" || item.itemType === "COMERCIAL")} title={texts[selectedLanguage].freeItems} />
              </View>
            )
          }
          {/* Stripe Payment Button unten in der ScrollView */}
          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            {loadingPayment ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Button title="Jetzt Bezahlen 2" onPress={initializePaymentSheet} />
            )}
          </View>
        </ScrollView>
      </View>
    )} page={"Shop"} hide={false} />
  );
};

export default Shop;
