// StripeComponent.web.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { stripeFunctionWeb } from '@/lib/appwriteShop';

const stripePromise = loadStripe('pk_test_51RTSKq4hlfGTCc9pXUlwIWJFGlI1x28xjrupHBBSiyCmHrv6D8gwa3FGSA4N3BPW6cDW0PyK3PCqDJEVHcg6TSVZ00qnrxNgyj');

const StripeComponent = ({ price = 999 }: { price?: number }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
        console.log("Starte handleClick");
        const resString = await stripeFunctionWeb({ price: 999 });
        const res = JSON.parse(resString?.responseBody);
        console.log("Response von stripeFunctionWeb:", res);
        if (res && res.url) {
        window.location.href = res.url;
        }
      const data = JSON.parse(res.responseBody);
        console.log(data.customer);                    
        console.log(data.customerEphemeralKeySecret); 
        console.log(data.paymentIntentClientSecret);
        console.log("PaymentSheet Params erhalten:", data);
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe konnte nicht geladen werden');

      // Du brauchst im Backend eine Session ID oder ein Checkout-Link
      // Hier nehmen wir an, du bekommst `checkoutUrl` zurück
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback: Direktes confirmCardPayment (wenn du clientSecret bekommst)
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId, // falls dein Backend das zurückgibt
        });
        if (result.error) alert(result.error.message);
      }

    } catch (error) {
      console.error(error);
      alert('Fehler beim Starten des Zahlungsvorgangs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        padding: '12px 24px',
        backgroundColor: '#635bff',
        color: '#fff',
        fontSize: 16,
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
      }}
    >
      {loading ? 'Lade...' : 'Jetzt bezahlen'}
    </button>
  );
};

export default StripeComponent;
