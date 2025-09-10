import { Stack, SplashScreen } from "expo-router";
import GlobalProvider from "./../context/GlobalProvider";

import "./../global.css";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from 'expo-navigation-bar';
import "../assets/languages/i18n/index"; 


import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";

export default function RootLayout() {
   useEffect(() => {
    
     NavigationBar.setVisibilityAsync('hidden');

  }, []);


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

/*
  
*/