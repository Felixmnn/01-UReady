import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import images from "@/assets/shopItems/itemConfig";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function RewardedAdScreen() {
  const { userUsage, setUserUsage } = useGlobalContext();

    return (
      <View className="flex-1 h-20 bg-gray-700 rounded-[10px] p-2 flex-row items-center mb-2 justify-center">
        <Text className="text-white">Ads are not available on web</Text>
      </View>
    );
  

}