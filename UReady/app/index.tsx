import { Text, View,TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { router,Redirect } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { createUser, signIn,loginWithGoogle } from "@/lib/appwrite";


export default function Index() {
  const { isLoading, isLoggedIn } = useGlobalContext();

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
  if (isLoggedIn) {
    console.log("isLoggedIn", isLoggedIn);
    return <Redirect href="/home" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center">
      <TouchableOpacity className="bg-blue-500 p-4 rounded-md " onPress={() => {router.push("/home"); signIn("test@test.test", "12345678")}}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 p-4 m-2 rounded-md" onPress={() => {router.push("/home"); createUser("test@test.test", "12345678", "test")}}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 p-4 rounded-md" onPress={() => {loginWithGoogle()}}>
        <Text>Google Sign-In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
