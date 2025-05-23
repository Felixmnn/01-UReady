import { Stack,SplashScreen } from "expo-router";
import GlobalProvider from "./../context/GlobalProvider";

import "./../global.css"
import { StatusBar } from "expo-status-bar";


export default function RootLayout() {
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
    </Stack>
  </GlobalProvider>
  );
}
