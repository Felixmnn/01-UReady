import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { stripeFunction } from '@/lib/appwriteShop';
import { useStripe } from '@stripe/stripe-react-native'


const StripeComponentNative = ({price=999}) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [loadingPayment, setLoadingPayment] = React.useState(false);
    
    async function fetchPaymentSheetParams() {
      console.log("Starte fetchPaymentSheetParams");
      
      try {
        const res = await stripeFunction({price:price});
        const data = JSON.parse(res.responseBody);
    
        console.log(data.customer);                    
        console.log(data.customerEphemeralKeySecret); 
        console.log(data.paymentIntentClientSecret);
        console.log("PaymentSheet Params erhalten:", data);
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
        console.log("Payment Data:", paymentData);
        if (!paymentData) {
            alert(`Fehler beim Abrufen der Zahlungsdaten. ${paymentData}`);
            setLoadingPayment(false);
            return;
        }
        
        const { paymentIntent, ephemeralKey, customer } = paymentData;
        
        const { error: initError } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: "QReady",
            allowsDelayedPaymentMethods: true,
            returnURL: "qready://stripe-redirect", 
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
    };

  return (
    <TouchableOpacity onPress={initializePaymentSheet} disabled={loadingPayment}>
      <Text>Start Payment Process</Text>
    </TouchableOpacity>
  )
}

export default StripeComponentNative