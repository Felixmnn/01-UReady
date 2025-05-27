import { Stack,SplashScreen } from "expo-router";
import GlobalProvider from "./../context/GlobalProvider";

import "./../global.css"
import { StatusBar } from "expo-status-bar";

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import {  Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function RootLayout() {
    const [isConnected, setIsConnected] = useState(true);
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
          setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
      }, []);

      if (!isConnected) {
        return (
        <View className="flex-1 justify-center items-center px-6 bg-white bg-[#0c111e]">
          <Icon name="error" size={48} color="red" className="mb-4" />
          <Text className="text-base text-gray-700 dark:text-gray-300 text-center">
            Network Error Occured...
          </Text>
        </View>
      );
    }

  return (
  <GlobalProvider>

    <StatusBar backgroundColor="#0c111e" style="light" />
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="(quiz)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(edit)" options={{ headerShown: false }} />
      <Stack.Screen name="(renderDocuments)" options={{ headerShown: false }} />
      <Stack.Screen name="(about)" options={{ headerShown: false }} />
    </Stack>
  </GlobalProvider>
  );
}
