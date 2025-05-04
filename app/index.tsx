import { Text, View, SafeAreaView, ActivityIndicator } from "react-native";
import { router, Redirect } from "expo-router";
import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { loadUserData } from "@/lib/appwriteDaten";
import { addNewUserConfig } from "@/lib/appwriteAdd";
import SystemNavigationBar from 'react-native-system-navigation-bar';

SystemNavigationBar.navigationHide();

export default function Index() {
  const { isLoggedIn, isLoading, user, userData, setUserData } = useGlobalContext();

  useEffect(() => {
    if (!user) return;
    async function fetchUserData() {
      try {
        let userD = await loadUserData(user.$id);
        if (userD != null) {
          setUserData(userD);
        } else {
          userD = await addNewUserConfig(user.$id);
          setUserData(userD);
          router.push("/getting-started");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData();
  }, [user]);

  // Solange geladen wird oder es noch keine userData gibt, zeigen wir einen Ladescreen
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Lädt...</Text>
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