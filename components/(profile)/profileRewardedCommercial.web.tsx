import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";

const ProfileRewardedCommercial = () => {
  const { userUsage } = useGlobalContext();

  const remainingMinutes = useMemo(() => {
    if (!userUsage || !Array.isArray(userUsage.watchedComercials)) return 0;

    const now = Date.now();
    let max = now;

    for (const item of userUsage.watchedComercials) {
      const parsed = new Date(item).getTime();
      if (!Number.isNaN(parsed) && parsed > max) {
        max = parsed;
      }
    }

    if (max <= now) return 0;
    return Math.ceil((max - now) / 60000);
  }, [userUsage]);

  return (
    <View className="w-full rounded-[10px] border border-gray-700 bg-[#1e3246] p-3">
      <Text className="text-gray-200 font-bold text-[13px] mb-1">Rewarded Ads</Text>
      <Text className="text-gray-400 text-[12px] mb-2">Auf Web sind Rewarded Ads nicht verfugbar.</Text>
      <Text className="text-gray-300 text-[12px]">
        {remainingMinutes > 0
          ? `Freigeschaltet fur noch ${remainingMinutes} Minute${remainingMinutes === 1 ? "" : "n"}`
          : "Aktuell kein freigeschaltetes Zeitfenster"}
      </Text>
    </View>
  );
};

export default ProfileRewardedCommercial;
