import { Text, View, SafeAreaView, ActivityIndicator, Image, Animated } from "react-native";
import { router, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { loadUserData, loadUserUsage } from "@/lib/appwriteDaten";
import { addNewUserConfig } from "@/lib/appwriteAdd";
import SystemNavigationBar from 'react-native-system-navigation-bar';
SystemNavigationBar.navigationHide();

export default function Index() {
  const { isLoggedIn, isLoading, user, userData, setUserData, setUserUsage } = useGlobalContext();

  useEffect(() => {
  let isMounted = true;
  if (user == null) return;

  async function fetchUserData() {
    try {
      let userD = await loadUserData(user.$id);
      if (!isMounted) return; // Nur setzen, wenn noch mounted

      if (userD != null) {
        setUserData(userD);
      } else {
        userD = await addNewUserConfig(user.$id);
        if (!isMounted) return;
        setUserData(userD);
        router.push("/personalize");
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
  //const [progress, setProgress] = useState(new Animated.Value(0));

  /*
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);
  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  */

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
        {/*
        <View style={{ height: 8, width: "100%", maxWidth:300, backgroundColor: "#444", borderRadius: 4 }}>
        <Animated.View
          style={{
            height: 8,
            width: widthInterpolated,
            backgroundColor: "#00ccff",
            borderRadius: 4,
          }}
        />
      </View>
      */}
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
        <Text className="text-white">Bitte warten, wir verarbeiten deine Daten...</Text>
      </View>
    </SafeAreaView>
  );
}