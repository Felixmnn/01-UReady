import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import images from "@/assets/shopItems/itemConfig";
import { useGlobalContext } from "@/context/GlobalProvider";
import { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads"
import { useTranslation } from "react-i18next";
import { loadAproved } from "@/lib/appwriteDaten";

export default function RewardedAdScreen({
    aproved
}:{
    aproved: boolean
  }) {
  const { t } = useTranslation();
  const { userUsage, setUserUsage } = useGlobalContext();
  // Dynamically require to avoid bundling on web

  const adUnitId = !aproved
    ? TestIds.REWARDED
    : "ca-app-pub-9834411851111627~1536371503"
      "ca-app-pub-9834411851111627~5284044824"

  let rewarded = RewardedAd.createForAdRequest(adUnitId);
  
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
  const unsubscribeLoaded = rewarded.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      setLoaded(true);
    }
  );

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      setUserUsage({
        ...userUsage,
        energy: userUsage.energy + 5,
      });
    }
  );

  rewarded.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  }; 
}, []);

  if (!loaded) {
    return null;
  }
  return (
    <View className="flex-1  h-20 bg-[#294a67] rounded-[10px] p-2 flex-row items-center mb-2">
      <Image
        source={images.COMERCIAL}
        style={{
          height: 50,
          width: 50,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
      <View className="flex-1">
        <Text className="text-white font-bold">{t("ad.watchAd")}</Text>
        <Text className="text-gray-400">{t("ad.get1EnergyFree")}</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-900 px-4 py-2 rounded-[10px]"
       onPress={() => {
        try {
          rewarded.show();
        } catch (error) {
          rewarded.load();
        }
        }}
        disabled={!loaded}
      >
        <Text className="text-white font-bold">
          {t("ad.watch") /* Watch Ad */}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
