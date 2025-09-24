import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const Tabbar = ({
  content,
  page,
  hide,
}: {
  content: () => React.JSX.Element;
  page: string;
  hide?: boolean;
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions(); // Bildschirmbreite holen

  const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

  const tabbarIcon = (
    name: string,
    size: number,
    color: string,
    pageName: string,
    route: string,
    disabled = false
  ) => {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => router.push(route as any)}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
        className={`m-2 items-center ${pageName === page.toLowerCase() ? "w-[80px] bg-gray-800 border border-gray-600 border-[1px]" : ""} rounded-md p-2 `}
      >
        <Icon name={name} size={size} color={color} />
        <Text className="text-white text-[12px] ">
          {t(`tabbar.${pageName}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-[#0c111d] flex-1">
      {isVertical ? (
        <SafeAreaView className="bg-gradient-to-b from-blue-800 to-[#0c111d] flex-1 py-3 pr-3 flex-row "
                    edges={["top", "left", "right"]} // ⬅️ 'bottom' entfernt

        >
          <View className="bg-gradient-to-b from-blue-800 to-[#0c111d] h-full w-[100px] items-center justify-between">
            <View className="items-center my-1">
              {tabbarIcon("home", 25, "white", "home", "/home")}
              {tabbarIcon("book", 25, "white", "bibliothek", "/bibliothek")}
              {tabbarIcon("search", 25, "white", "entdecken", "/entdecken")}
              {tabbarIcon("store", 25, "white", "shop", "/shop")}
              {tabbarIcon("user", 25, "white", "profil", "/profil")}
            </View>
            <View className="items-center my-1">
              {tabbarIcon("share", 25, "white", "share", "/profil", true)}
            </View>
          </View>
          <View className={`flex-1 ${isVertical ? "flex-row" : "flex-col"}`}>
            <View
              className={`flex-1  rounded-[10px]  ${hide ? null : "bg-gradient-to-b from-[#001450] to-[#0c111e] border border-gray-700 border-w-[1px]"}`}
            >
              {content()}
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          edges={["top", "left", "right"]} // ⬅️ 'bottom' entfernt
          className="flex-1 bg-gradient-to-b from-[#001450] to-[#0c111e] itmes-center justify-between"
        >
          {content()}
        </SafeAreaView>
      )}
    </View>
  );
};

export default Tabbar;
