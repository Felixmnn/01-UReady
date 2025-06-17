import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { stripeFunction } from '@/lib/appwrite'
import { useStripe } from '@stripe/stripe-react-native';

const ModalBudyNow = ({isVisible, setIsVisible, imageSource, imageColor,kathegory, price,purcharses=[], itemId,amount=0, name, free=false, texts}) => {
    const { userUsage, setUserUsage } = useGlobalContext();
    const [ loadingPayment, setLoadingPayment] = useState(false)
      const { initPaymentSheet, presentPaymentSheet } = useStripe();
    
    function priceWithCommas(priceInCents) {
        const euros = (priceInCents / 100).toFixed(2); 
        const parts = euros.split('.');
        return `${parts[0]},${parts[1]}`;
    }
    async function fetchPaymentSheetParams() {
      console.log("Starte fetchPaymentSheetParams");
      
      try {
        console.log("Price", price)
        const res = await stripeFunction({price:price});
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
        
      });
    
      if (initError) {
        alert("Fehler beim Initialisieren: " + initError.message);
        setLoadingPayment(false);
        return;
      }
    
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        
        alert("Zahlung fehlgeschlagen: " + presentError.message);
      } else {
        handleBuyNow()
        alert("Zahlung erfolgreich! 🎉");
      }
    
      setLoadingPayment(false);
    };
    

    const handleBuyNow = () => {
        // Hier kannst du die Logik für den Kauf implementieren
        // Zum Beispiel: setUserData({ ...userData, chips: userData.chips - price });
        console.log("Setting Invisible")
        if (kathegory == "ENERGY") {
            setUserUsage({
                ...userUsage,
                microchip: userUsage.microchip - price, // Beispiel: Chips abziehen
                energy: userUsage.energy + amount, // Beispiel: Energie erhöhen
                purcharses: [...purcharses,itemId], // Beispiel: Käufe erhöhen
            });
        } else if (kathegory == "CHIPS") {
            setUserUsage({
                ...userUsage,
                microchip: userUsage.microchip + amount, // Beispiel: Chips abziehen
                purcharses: [...purcharses,itemId], // Beispiel: Käufe erhöhen

            });
        
        }
        setIsVisible(false);
    
    };

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}>
        <TouchableOpacity
                    activeOpacity={1} 
                    onPress={() => setIsVisible(false)}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 30,
                    }}
        >
           <View className="bg-gray-900 p-5 rounded-2xl shadow-xl items-center space-y-4 w-[90%] max-w-[250px] self-center">
  <Text className="text-xl font-semibold text-center text-white pb-2">
    {texts.validdatePurchase}
  </Text>

  <View
    className="p-4 rounded-xl"
    style={{
      backgroundColor: imageColor,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={imageSource}
      style={{
        height: 120,
        resizeMode: 'contain',
      }}
    />
  </View>

  <Text className="text-base text-center text-gray-300 px-2 py-2">
    {texts.doYouWant}
    <Text className="font-bold text-white"> {name} </Text>
    {texts.für}
    <Text className="font-bold text-white">
      {free ? '0,00' : priceWithCommas(price)}€
    </Text>{' '}
    {texts.kaufen}
  </Text>

  <View className="flex-row justify-between w-full px-4">
    <TouchableOpacity
      onPress={() => setIsVisible(false)}
      className="bg-red-900 rounded-xl flex-1 py-2 w-[45%]"
    >
      <Text className="text-white font-semibold text-center">{texts.cancel}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => initializePaymentSheet()}
      className="bg-green-900 rounded-xl flex-1 ml-2 py-2 w-[45%]"
    >
      <Text className="text-white font-semibold text-center">{texts.buy}</Text>
    </TouchableOpacity>
  </View>
</View>

        </TouchableOpacity>
    </Modal>
  )
}

export default ModalBudyNow