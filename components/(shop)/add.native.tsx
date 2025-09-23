import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import images from "@/assets/shopItems/itemConfig";
import { useGlobalContext } from "@/context/GlobalProvider";
import { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads"

export default function RewardedAdScreen() {
  const { userUsage, setUserUsage } = useGlobalContext();

  // Dynamically require to avoid bundling on web

  const adUnitId = __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-9834411851111627/7624634683";

  const rewarded = RewardedAd.createForAdRequest(adUnitId);

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
      (reward: any) => {
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
    <View className="flex-1 h-20 bg-[#294a67] rounded-[10px] p-2 flex-row items-center mb-2">
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
        <Text className="text-white font-bold">Watch Ad</Text>
        <Text className="text-gray-400">Get 5 energy for free</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-900 px-4 py-2 rounded-[10px]"
        onPress={() => rewarded.show()}
      >
        <Text className="text-white font-bold">Watch</Text>
      </TouchableOpacity>
    </View>
  );
}
