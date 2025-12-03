import React, { useEffect, useRef, useState } from "react";
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
  const [key, setKey] = useState(0); // <--- Neu

  // Dynamically require to avoid bundling on web

  const adUnitId = !aproved
    ? TestIds.REWARDED
    : Platform.OS == "android" ? "ca-app-pub-9834411851111627/7624634683"
    :  "ca-app-pub-9834411851111627/7503014052"

  let rewarded = useRef(
    RewardedAd.createForAdRequest(adUnitId)
  ).current;
  
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("AdUnitId:", adUnitId);
  const unsubscribeLoaded = rewarded.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      setLoaded(true);
    }
  );
  console.log("Rewarded Ad Object:", rewarded);
  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      setUserUsage({
        ...userUsage,
        energy: userUsage.energy + 1,
      });
      setKey(k => k + 1); // <--- Komponente neu laden nach Ad
    }
  );

  rewarded.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  }; 
}, [key]); // <--- key als Dependency

  if (!loaded) {
    return null;
  }
  return (
    <View key={key} className="flex-1 w-full  h-20 bg-[#294a67] rounded-[10px] p-2 flex-row items-center mb-2">
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
            setKey(k => k + 1); // <--- Komponente neu laden nach Ad
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
