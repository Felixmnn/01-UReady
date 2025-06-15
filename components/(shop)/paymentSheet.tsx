import { useStripe } from "@stripe/stripe-react-native";
import { Button, View } from "react-native";
import { useState } from "react";

export default function PaymentScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch("http://10.0.10.109:3000/api/payment-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(1500), // z.B. 15.00 USD als Cent-Wert
    });

    const {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "QReady", // Anzeige im Sheet
      allowsDelayedPaymentMethods: true,
    });

    if (error) {
      console.error("InitPaymentSheet Error", error);
    } else {
      openPaymentSheet();
    }
    setLoading(false);
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      alert(`Zahlung fehlgeschlagen: ${error.message}`);
    } else {
      alert("Zahlung erfolgreich! 🎉");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={loading ? "Lade..." : "Bezahlen mit Stripe"}
        onPress={initializePaymentSheet}
        disabled={loading}
      />
    </View>
  );
}
