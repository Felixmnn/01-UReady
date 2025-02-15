import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { View } from "react-native";

const RootLayout = () => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

    return (
        <View className="flex-1">
         <Tabs
            screenOptions={{
            tabBarStyle: { display: isVertical ? 'none' : 'flex' } // Verstecke die Tab-Leiste auf kleinen Bildschirmen
            }}
        >
          <Tabs.Screen name="home" 
            options={{
                headerShown: false,
            }}
          />
          <Tabs.Screen name="bibliothek" 
          options={{
            headerShown: false,
             }}
        />
          <Tabs.Screen name="entdecken" 
          options={{
            headerShown: false,
            }}
        />
          <Tabs.Screen name="profil" 
            options={{
                headerShown: false,
            }}  
        />
          
        </Tabs>
      </View>
    )
}
export default RootLayout