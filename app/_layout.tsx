import { Stack, SplashScreen } from "expo-router";
import GlobalProvider from "./../context/GlobalProvider";

import "./../global.css";
import { StatusBar } from "expo-status-bar";

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

// 👇 NEU HINZUFÜGEN
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <View className="flex-1 justify-center items-center px-6 bg-[#0c111e]">
              <StatusBar backgroundColor="#0c111e" style="light" />

      <Icon name="wifi-off" size={64} color="red" style={{ marginBottom: 20 }} />
      
      <Text className="text-lg font-semibold text-gray-100 text-center mb-2">
        Keine Internetverbindung
      </Text>

      <Text className="text-sm text-gray-400 text-center mb-6">
        Bitte überprüfe deine Verbindung und versuche es erneut.
      </Text>

      
    </View>
  );
}


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <StatusBar backgroundColor="#0c111e" style="light" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(quiz)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(edit)" options={{ headerShown: false }} />
          <Stack.Screen name="(about)" options={{ headerShown: false }} />
        </Stack>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
