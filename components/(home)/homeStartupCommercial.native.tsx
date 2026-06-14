import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Animated, Easing } from "react-native";
import {
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTranslation } from "react-i18next";

const STARTUP_AD_WINDOW_MS = 120 * 60 * 1000; // 2 Stunden werbefrei nach dem Ansehen der Werbung.

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
  const { userUsage, setUserUsage, isOffline } = useGlobalContext();
  const rewardedRef = useRef(
    RewardedAd.createForAdRequest(
      Platform.OS === "android"
        ? "ca-app-pub-9834411851111627/7624634683"
        : "ca-app-pub-9834411851111627/7503014052"
    )
  );

  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const thankYouTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const earnedRewardRef = React.useRef(false);
  const thankYouOpacity = React.useRef(new Animated.Value(1)).current;

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
        earnedRewardRef.current = true;

        setUserUsage((prev: any) => {
          if (!prev) return prev;

          const existing = Array.isArray(prev.watchedComercials)
            ? prev.watchedComercials
            : [];

          const currentEnd = getActiveEndTimestamp(existing);
          const baseTime =
            currentEnd && currentEnd > Date.now() ? currentEnd : Date.now();
          const nextEnd = baseTime + STARTUP_AD_WINDOW_MS;

          return {
            ...prev,
            watchedComercials: [...existing, new Date(nextEnd).toISOString()],
          };
        });

        setIsVisible(false);
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (earnedRewardRef.current) {
          thankYouOpacity.setValue(1);
          setShowThankYou(true);
          if (thankYouTimerRef.current) clearTimeout(thankYouTimerRef.current);
          thankYouTimerRef.current = setTimeout(() => {
            Animated.timing(thankYouOpacity, {
              toValue: 0,
              duration: 280,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) {
                setShowThankYou(false);
              }
            });
          }, 3000);
          earnedRewardRef.current = false;
        }

        setLoaded(false);
        rewarded.load();
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      if (thankYouTimerRef.current) clearTimeout(thankYouTimerRef.current);
      thankYouOpacity.stopAnimation();
    };
  }, [setUserUsage, thankYouOpacity]);

  const onWatchAd = () => {
    if (!loaded || isOffline) return;

    try {
      rewardedRef.current.show();
    } catch {
      rewardedRef.current.load();
    }
  };

  if (showThankYou ) {
    return (
      <Animated.View style={{ opacity: thankYouOpacity }} className="mx-3 mb-3 rounded-[14px] border border-[#1a5c38] bg-[#0d2e1f] p-3 flex-row items-center">
        <View className="ml-3 flex-1 justify-center items-center">
          <Text className="text-green-300 font-bold text-[13px]">
            ♥️ {t("ad.thankYouTitle")} ♥️
          </Text>
          <Text className="text-green-400 text-[11px] mt-0.5">
            {t("ad.thankYouDescription")}
          </Text>
        </View>
      </Animated.View>
    );
  }

  if (!isVisible || hasActiveWindow) return null;

  return (
    <View className="mx-3 mb-3 rounded-[14px] border border-[#3157a3] bg-[#10203f] p-3">
      <View className="flex-row items-start justify-between">
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
        </View>
        <View className=" justify-between">
            <TouchableOpacity className="flex-1 justify-start items-end p-1" onPress={() => setIsVisible(false)}>
                <Icon name="times" size={14} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
            className="rounded-full bg-[#1d4ed8] px-3 py-2"
            onPress={onWatchAd}
            disabled={!loaded || isOffline}
            >
            <Text className="text-white font-bold text-[12px]">
                {isOffline ? t("ad.offline") : loaded ? t("ad.blockerWatch") : t("shop.loadingAds")}
            </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeStartupCommercial;
