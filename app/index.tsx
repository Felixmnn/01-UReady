import { Text, View, SafeAreaView, ActivityIndicator, Image, Animated } from "react-native";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { loadUserData, loadUserUsage } from "@/lib/appwriteDaten";
import { addNewUserConfig } from "@/lib/appwriteAdd";
import * as NavigationBar from 'expo-navigation-bar';
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/assets/languages/i18n";
import { copyModule } from "@/lib/appwriteShare";


export default function Index() {
  //This paramters may be trasmitted via deeplinks
  const { moduleID } = useLocalSearchParams();

  const { isLoading, user, userData, setUserData } = useGlobalContext();


  const { t } = useTranslation();
  useEffect(() => {
     NavigationBar.setVisibilityAsync('hidden');
  }, []);

  

  useEffect(() => {
  let isMounted = true;
  if (user == null) return;
  
  async function fetchUserData() {

    try {
      if (moduleID) {
        await AsyncStorage.setItem("moduleToBeAddedAfterSignUp", JSON.stringify(moduleID));
      }
      let userD = await loadUserData(user.$id);
      if (!isMounted) return; // Nur setzen, wenn noch mounted

      if (userD != null) {
        setUserData(userD);
      } else {
        userD = await addNewUserConfig(user.$id);
        if (!isMounted) return;
        setUserData(userD);
        router.replace("/personalize");
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  }
  fetchUserData();

  return () => {
    isMounted = false;
  };
}, [user]);


  // Solange geladen wird oder es noch keine userData gibt, zeigen wir einen Ladescreen
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0c111d]">
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/images/adaptive-icon.png")} // dein Icon als PNG/SVG
          style={{ width: 200, height: 200, marginBottom: 20 }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
    );
  }

  // Falls eine Session vorliegt, leiten wir basierend auf signInProcessStep weiter
  if (userData?.signInProcessStep === "ZERO") {
    return <Redirect href="/personalize" />;
  }
  if (userData?.signInProcessStep === "FINISHED") {
    return <Redirect href="/getting-started" />;
  }
  if (userData?.signInProcessStep === "DONE") {
    return <Redirect href="/home" />;
  }

  // Falls wir hier ankommen, gibt es entweder keinen Benutzer oder
  // userData wurde bereits geladen und kein Redirect ausgelöst – in diesem Fall:
  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  // Optional: Falls ein gültiger user vorliegt, aber signInProcessStep noch nicht finalisiert ist,
  // könntest du hier eine Standardansicht oder einen weiteren Ladescreen anzeigen.
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">{t("index.loading")}</Text>
      </View>
    </SafeAreaView>
  );
}