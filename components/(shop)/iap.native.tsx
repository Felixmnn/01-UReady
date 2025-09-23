import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useIAP} from 'react-native-iap';

export default function SimpleStore() {
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    currentPurchase,
    finishTransaction,
  } = useIAP();

  const productIds = ['com.example.coins.pack1', 'com.example.premium'];

  useEffect(() => {
    if (connected) {
      fetchProducts({skus: productIds, type: 'in-app'});
    }
  }, [connected]);

  useEffect(() => {
    if (currentPurchase) {
      const completePurchase = async () => {
        try {
          console.log('Purchase completed:', currentPurchase.id);
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: true,
          });
        } catch (error) {
          console.error('Failed to complete purchase:', error);
        }
      };
      completePurchase();
    }
  }, [currentPurchase]);

  const handlePurchase = async (productId: string) => {
    try {
      await requestPurchase({
        request: {
          ios: {
            sku: productId,
          },
          android: {
            skus: [productId],
          },
        },
      });
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Store: {connected ? 'Connected ✅' : 'Connecting...'}
      </Text>

      {products.map((product) => (
        <View key={product.id} style={styles.product}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{product.displayPrice}</Text>
          <Button title="Buy Now" onPress={() => handlePurchase(product.id)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20},
  status: {fontSize: 16, marginBottom: 20},
  product: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {fontSize: 16, fontWeight: 'bold'},
  price: {fontSize: 14, color: '#666', marginVertical: 5},
});