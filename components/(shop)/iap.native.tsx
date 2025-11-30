import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { purchaseUpdatedListener, useIAP } from "react-native-iap";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";
import images from "@/assets/shopItems/itemConfig";

export default function SimpleStore() {
  const { userUsage, setUserUsage } = useGlobalContext();
  const { connected, products, fetchProducts, requestPurchase, finishTransaction } = useIAP();
  const { t } = useTranslation();

  // Produkt-IDs je Plattform
  const productIds = Platform.select({
    ios: [ "small_refill_10","medium_refill_55","large_refill_100","extraLarge_refill"],
    android: ["small_refill","medium_refill","large_refill","extra_large_refill"],
  });

  // Produkte laden
  useEffect(() => {
    if (connected && productIds) {
      fetchProducts({ skus: productIds, type: "in-app" });
    }
  }, [connected]);

  // Listener für abgeschlossene Käufe
  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      if (purchase && purchase.transactionId) {
        try {
          // Kauf abschließen
          await finishTransaction({ purchase, isConsumable: true });

          // Belohnung vergeben
          const energyToAdd = getEnergyAmount(purchase.productId);
          setUserUsage((prevUsage:any) => ({
            ...prevUsage,
            energy: prevUsage.energy + energyToAdd,
          }));

        } catch (error) {
          console.error("Fehler beim Abschließen des Kaufs:", error);
        }
      }
    });

    // Aufräumen
    return () => {
      purchaseUpdateSubscription.remove();
    };
  }, [finishTransaction, setUserUsage]);

  const handlePurchase = async (productId: string) => {
    try {
      await requestPurchase({
        request: {
          ios: { sku: productId, quantity: 1 },
          android: { skus: [productId] },
        },
        type: 'in-app',
      });
    } catch (error) {
      console.error("Kauf fehlgeschlagen:", error);
    }
  };

  // Hilfsfunktion: Produkt-ID → Energy Menge
  function getEnergyAmount(productId: string): number {
    switch (productId) {
      case "extra_large_refill":
      case "extraLarge_refill":
        return 1000;
      case "large_refill":
      case "large_refill_100":
        return 200;
      case "medium_refill":
      case "medium_refill_55":
        return 80;
      case "small_refill":
      case "small_refill_10":
        return 20;
      default:
        return 1;
    }
  }

  // Komponente für ein einzelnes Produkt
  const BuyEnergy = ({ price, amount }: { price?: number; amount?: number }) => {
    return (
      <View style={{ flex: 1, height: 80, backgroundColor: "#0560a5", borderRadius: 10, padding: 8, flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={images.bolt}
          style={{ height: 50, width: 50, resizeMode: "contain", marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{t("shop.refillXEnergy", { amount })}</Text>
          <Text style={{ color: "#ccc" }}>{t("shop.getXEnergyForY", { amount, price })}</Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "#003f7f", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
          onPress={() => handlePurchase(getProductIdByAmount(amount))}
          className="ml-2"
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{t("shop.buy")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Hilfsfunktion, um Produkt-ID anhand Energy-Menge zu ermitteln
  function getProductIdByAmount(amount?: number): string {
    switch (amount) {
      case 1000:
        return Platform.OS === "ios" ? "extraLarge_refill" : "extra_large_refill";
      case 200:
        return Platform.OS === "ios" ? "large_refill_100" : "large_refill";
      case 80:
        return Platform.OS === "ios" ? "medium_refill_55" : "medium_refill";
      case 20:
        return Platform.OS === "ios" ? "small_refill_10" : "small_refill";
      default:
        return "";
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Produkte */}
      <View style={{ padding: 16 }}>
        {products.map((product) => (
          <BuyEnergy
            key={product.id}
            amount={getEnergyAmount(product.id)}
            price={parseFloat(String(product.price ?? "0"))}
          />
        ))}
      </View>
    </View>
  );
}
