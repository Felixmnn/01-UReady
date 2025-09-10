import { Tabs } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

const RootLayout = () => {
  const { width } = useWindowDimensions();
  const isVertical = width > 700;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  // Basis-Höhe der Tabbar (ohne SafeArea)
  const baseHeight = 60;
  // Gesamt-Höhe inkl. SafeArea
  const tabBarHeight = baseHeight + insets.bottom;
  // Icon-Größe dynamisch: kleiner, wenn insets groß sind
  const iconSize = insets.bottom > 20 ? 24 : 28;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: "#1e1e1e",
            borderTopWidth: 0,
            height: tabBarHeight,
            paddingBottom: insets.bottom,
          },
          default: {
            display: isVertical ? "none" : "flex",
            backgroundColor: "#1e1e1e",
            borderTopWidth: 0,
            paddingTop: 10,
            height: tabBarHeight,
            paddingBottom: insets.bottom,
          },
        }),
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#b6b5b5ff",
        tabBarIcon: ({ color, size }) => {
          let iconName: string | undefined;
          if (route.name === "home") iconName = "home";
          else if (route.name === "bibliothek") iconName = "book";
          else if (route.name === "shop") iconName = "store";
          else if (route.name === "entdecken") iconName = "search";
          else if (route.name === "profil") iconName = "user";

          return (
            <Icon
              name={iconName!}
              size={size ?? iconSize}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="shop" options={{ headerShown: false }} />
      <Tabs.Screen name="bibliothek" options={{ headerShown: false }} />
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="entdecken" options={{ headerShown: false }} />
      <Tabs.Screen name="profil" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default RootLayout;
