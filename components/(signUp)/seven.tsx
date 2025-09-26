import {  Image,  View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { loadUserData } from "@/lib/appwriteDaten";
import { userData } from "@/types/appwriteTypes";

const StepSeven = () => {
  const { user, isLoggedIn, isLoading } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  const [userData, setUserData] = useState<userData  | null>(null);

  async function fetchUserData() {
    try {
      const res = await loadUserData();
      if (res) {
        setUserData(res as unknown as userData);
        return res;
      }
    } catch (error) {
      if (__DEV__) {
      console.error("Fehler beim Abrufen der Benutzerdaten:", error);
      }
      return null;
    }
  }
  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
    if (userData?.signInProcessStep === "FINISHED") {
      router.replace("/getting-started");
    }
  }, [userData]);

  return (
    <View className="h-full w-full justify-center items-center py-5 flex-row">
      <Image
        source={require("@/assets/images/icon.png")}
        style={{ width: 100, height: 100, marginBottom: 20 }}
      />
    </View>
  );
};

export default StepSeven;
