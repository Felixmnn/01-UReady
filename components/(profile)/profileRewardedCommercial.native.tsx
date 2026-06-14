import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { AdEventType, RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTranslation } from "react-i18next";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

const parseTimestamp = (value: unknown): number | null => {
  if (typeof value !== "string") return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
};

const getActiveEndTimestamp = (timestamps: unknown[]): number | null => {
  const now = Date.now();
  let max = now;
  let foundFuture = false;

  for (const item of timestamps) {
    const parsed = parseTimestamp(item);
    if (parsed && parsed > max) {
      max = parsed;
      foundFuture = true;
    }
  }

  return foundFuture ? max : null;
};

const ProfileRewardedCommercial = () => {
  const { t } = useTranslation();
  const { userUsage, setUserUsage, isOffline } = useGlobalContext();

  const adUnitId =
    Platform.OS === "android"
      ? "ca-app-pub-9834411851111627/7624634683"
      : "ca-app-pub-9834411851111627/7503014052";

  const rewardedRef = useRef(RewardedAd.createForAdRequest(adUnitId));
  const [loaded, setLoaded] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  const watchedComercials = useMemo(() => {
    if (!userUsage || !Array.isArray(userUsage.watchedComercials)) return [];
    return userUsage.watchedComercials;
  }, [userUsage]);

  const activeEndTimestamp = useMemo(
    () => getActiveEndTimestamp(watchedComercials),
    [watchedComercials]
  );

  const hasActiveWindow = activeEndTimestamp !== null;

  const remainingMinutes = useMemo(() => {
    if (!activeEndTimestamp) return 0;
    const remaining = activeEndTimestamp - nowMs;
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / 60000);
  }, [activeEndTimestamp, nowMs]);

  const remainingSeconds = useMemo(() => {
    if (!activeEndTimestamp) return 0;
    const remaining = activeEndTimestamp - nowMs;
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / 1000);
  }, [activeEndTimestamp, nowMs]);

  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDisplayMinutes = remainingMinutes % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rewarded = rewardedRef.current;

    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        setUserUsage((prev: any) => {
          if (!prev) return prev; 

          const existing = Array.isArray(prev.watchedComercials)
            ? prev.watchedComercials
            : [];

          const currentEnd = getActiveEndTimestamp(existing);
          const baseTime = currentEnd && currentEnd > Date.now() ? currentEnd : Date.now();
          const nextEnd = baseTime + TWO_HOURS_MS;

          return {
            ...prev,
            watchedComercials: [...existing, new Date(nextEnd).toISOString()],
          };
        });
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewarded.load();
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [setUserUsage]);

  const onWatchAd = () => {
    if (!loaded || isOffline) return;
    try {
      rewardedRef.current.show();
    } catch {
      rewardedRef.current.load();
    }
  };

  return (
    <View className="w-full  p-2">
      <Text className="text-white font-bold text-[14px] mb-1">
        {t("ad.blockerTitle")}
      </Text>
      <Text className="text-gray-200 text-[12px] mb-1 leading-5">
        {remainingMinutes > 0
          ? t("ad.blockerActiveDescription")
          : t("ad.blockerInactiveDescription")}
      </Text>

      {hasActiveWindow && (
        <View className="mt-2 mb-2 rounded-[14px] border border-[#1a5c38] bg-[#0d2e1f] p-3 flex-row items-center">
          <View className="ml-3 flex-1 justify-center items-center">
            <Text className={`text-[12px] ${hasActiveWindow ? "text-green-300" : "text-gray-300"}`}>
              {remainingMinutes > 0
                ? t("ad.blockerRemaining", {
                    hours: remainingHours,
                    minutes: remainingDisplayMinutes,
                  })
                : t("ad.blockerNoWindow")}
            </Text>
            <Text className="text-green-300 font-bold text-[13px]">
              ♥️ {t("ad.thankYouTitle")} ♥️
            </Text>
            <Text className="text-green-400 text-[11px] mt-0.5">
              {t("ad.thankYouDescription")}
            </Text>
          </View>
        </View>
      )}
      

      <TouchableOpacity
        className={`rounded-full px-4 py-2 items-center ${!loaded || isOffline ? "bg-gray-600" : "rounded-[14px] border border-[#3157a3] bg-[#10203f]"}`}
        disabled={!loaded || isOffline}
        onPress={onWatchAd}
      >
        <Text className="text-[#3157a3] font-bold"
        
        >
          {isOffline
            ? t("ad.offline")
            : loaded
              ? hasActiveWindow
                ? t("ad.blockerExtend")
                : t("ad.blockerWatch")
              : t("shop.loadingAds")}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default ProfileRewardedCommercial;
