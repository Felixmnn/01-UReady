import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";

let hasShownStartupCommercialBanner = false;

const parseTimestamp = (value: unknown): number | null => {
  if (typeof value !== "string") return null;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

const getActiveEndTimestamp = (timestamps: unknown[]): number | null => {
  const now = Date.now();
  let maxTimestamp = now;
  let foundFuture = false;

  for (const item of timestamps) {
    const parsed = parseTimestamp(item);
    if (parsed && parsed > maxTimestamp) {
      maxTimestamp = parsed;
      foundFuture = true;
    }
  }

  return foundFuture ? maxTimestamp : null;
};

const HomeStartupCommercial = () => {
  const { t } = useTranslation();
  const { userUsage } = useGlobalContext();
  const [isVisible, setIsVisible] = useState(false);

  const watchedCommercials = useMemo(() => {
    if (!userUsage || !Array.isArray(userUsage.watchedComercials)) return [];
    return userUsage.watchedComercials;
  }, [userUsage]);

  const hasActiveWindow = useMemo(() => {
    const activeEndTimestamp = getActiveEndTimestamp(watchedCommercials);
    return activeEndTimestamp !== null;
  }, [watchedCommercials]);

  useEffect(() => {
    if (hasShownStartupCommercialBanner) return;
    hasShownStartupCommercialBanner = true;

    if (!hasActiveWindow) {
      setIsVisible(true);
    }
  }, [hasActiveWindow]);

  if (!isVisible || hasActiveWindow) return null;

  return (
    <View className="mx-3 mb-3 rounded-[14px] border border-[#3157a3] bg-[#10203f] p-3 relative">
      <TouchableOpacity
        className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-[#1b2d55]"
        onPress={() => setIsVisible(false)}
        accessibilityRole="button"
        accessibilityLabel={t("ad.startupBannerDismiss")}
      >
        <Icon name="times" size={14} color="#ffffff" />
      </TouchableOpacity>
      <View className="flex-row items-start justify-between pr-24 pb-10">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center mb-1">
            <Icon name="play-circle" size={16} color="#cfe0ff" />
            <Text className="text-white font-bold text-[14px] ml-2">
              {t("ad.startupBannerTitle")}
            </Text>
          </View>
          <Text className="text-gray-200 text-[12px] leading-5">
            {t("ad.startupBannerDescription")}
          </Text>
          <Text className="text-gray-400 text-[11px] mt-2 leading-4">
            {t("ad.startupBannerTestNote")}
          </Text>
        </View>
        <TouchableOpacity
          className="absolute right-2 bottom-2 rounded-full bg-[#1d4ed8] px-3 py-2"
          onPress={() => setIsVisible(false)}
        >
          <Text className="text-white font-bold text-[12px]">
            {t("ad.startupBannerDismiss")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeStartupCommercial;
