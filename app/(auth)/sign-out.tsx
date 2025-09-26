import { View, Text, ActivityIndicator, Platform } from "react-native";
import React, { useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { signOut } from "@/lib/appwrite";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";

const SignOut = () => {
  const { t } = useTranslation();
  const { setUser, setIsLoggedIn, setIsLoading } = useGlobalContext();

  // Do sign-out once on mount
  useEffect(() => {
    const signOutUser = async () => {
      setIsLoading(true);
      try {
        await signOut(); // Logout from Appwrite
        setUser(undefined);
        setIsLoggedIn(false);
      } catch (err) {
        if (__DEV__) {
        console.error("Sign out failed", err);
        }
      } finally {
        setIsLoading(false);
        if (Platform.OS === "web") {
          router.push("/sign-in");
        } else {
          await Updates.reloadAsync();
        }
      }
    };

    signOutUser();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-gray-100 font-semibold text-[15px] mt-2">
        {t("signOut.signingOut")}
      </Text>
    </View>
  );
};

export default SignOut;
