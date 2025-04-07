import { Text, View,TouchableOpacity, SafeAreaView, ActivityIndicator,Image } from "react-native";
import { router,Redirect } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { createUser, signIn,loginWithGoogle } from "@/lib/appwrite";
import { useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import { loadUserData } from "@/lib/appwriteDaten";


export default function Index() {

  const { isLoggedIn, isLoading,user, userData, setUserData } = useGlobalContext();

  useEffect(() => {
          if (user === null ) return;
          async function fetchUserData() {
              try {
                  console.log("Loading")
                  const userD = await loadUserData(user.$id);
                  console.log("UserData ", userD);
                  setUserData(userD);
                  if (userD.signInProcessStep !== "ZERO" ) {
                      router.push("/personalize");
                  } else if (userD.signInProcessStep === "FINISHED") {
                      router.push("/getting-started");
                  } else {
                      router.push("/home");
                  }
              } catch (error) {
                  console.log(error);
              }
          }
          fetchUserData();
      }, [user]);


  if (isLoading && userData !== null) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Lädt...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (isLoggedIn) {
    console.log("isLoggedIn", isLoggedIn);
    return <Redirect href="/home" />;
  }
  {
    /*
    <TouchableOpacity className="bg-blue-500 p-4 rounded-md " onPress={() => {router.push("/home"); signIn("test@test.test", "12345678")}}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 p-4 m-2 rounded-md" onPress={() => {router.push("/home"); createUser("test@test.test", "12345678", "test")}}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 p-4 rounded-md" onPress={() => {loginWithGoogle()}}>
        <Text>Google Sign-In</Text>
      </TouchableOpacity>
    */
  }
  

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center">
      <TouchableOpacity onPress={()=> router.push("/sign-in")} className="bg-blue-500 p-4 rounded-md m-2">
        <Text>Lock in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
