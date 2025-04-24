import { Text, View,TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native";
import { router,Redirect } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { useEffect } from "react";
import { loadUserData, loadUserDataKathegory } from "@/lib/appwriteDaten";
import { addNewUserConfig, addUserDatakathegory } from "@/lib/appwriteAdd";


export default function Index() {

  const { isLoggedIn, isLoading,user, setUserData, setUserCategory } = useGlobalContext();
  useEffect(() => {
          console.log("🐋🐋🐋User",user)
          if (user === null ) return;
          if (user === undefined) {
              router.push("/sign-in");
              return;
          };
          async function fetchUserData() {
              try {
                  console.log("hi",user.$id)
                  let userData = await loadUserData(user.$id);
                  
                  console.log("😶‍🌫️😶‍🌫️UserData",userData)
                  if (userData != null) {
                      setUserData(userData);
                  } else {
                      userData = await addNewUserConfig(user.$id)
                      setUserData(userData);
                      router.push("/getting-started");
                  }
                  if (!userData) {
                    window.location.reload();
                  }
                  if (userData.signInProcessStep === "ZERO") {
                      router.push("/personalize");
                  } else if (userData.signInProcessStep === "FINISHED") {
                      const userKathegory = await loadUserDataKathegory(user.$id);
                      console.log("🫡🫡UserKathegory",userKathegory)
                      setUserCategory(userKathegory);
                      router.push("/getting-started");
                  } else if (userData.signInProcessStep === "DONE") {
                      const userKathegory = await loadUserDataKathegory(user.$id);
                      console.log("🫡🫡UserKathegory",userKathegory)
                      setUserCategory(userKathegory);
                      router.push("/home");   
                  }
              } catch (error) {
                  console.log(error);
              }
          }
          fetchUserData();
      }, [user]);


  if (isLoading || user === null) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4">Lädt...</Text>
        </View>
      </SafeAreaView>
    );
  }
 
  

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center">
      <TouchableOpacity onPress={()=> router.push("/sign-in")} className="bg-blue-500 p-4 rounded-md m-2">
        <Text>Lets Go</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
