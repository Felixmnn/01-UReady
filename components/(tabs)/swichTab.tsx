import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const SwichTab = ({tabWidth,setTab, tab1, tab2, bg}) => {
const [activeTab, setActiveTab] = useState(0);
const translateX = useSharedValue(0);

const switchTab = (index) => {
    setActiveTab(index);
    setTab(index)
    translateX.value = withTiming(index * 68, { duration: 300 }); // Weicher Übergang
};

const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
}));
  return (
    <View className=" pt-4 bg-[#0c111d] ">
            <View className="flex-row justify-start relative">
              <TouchableOpacity
                className="ml-2 w-[60px] items-center pb-2"
                onPress={() => switchTab(0)}
              >
                <Text className={` ${activeTab === 0 ? "font-bold text-white" : "text-gray-400"}`}>
                  {tab1}
                </Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                className="w-[80px] items-center pb-2 ml-2"
                onPress={() => switchTab(1)}
              >
                <Text className={` ${activeTab === 1 ? "font-bold text-white" : "text-gray-400"}`}>
                  {tab2}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="relative h-[2px] bg-[#0c111d] ml-2">
              <Animated.View
                className={`absolute left-0 h-[2px] bg-blue-500 ${activeTab == 1 ? "w-[80px]" : "w-[60px]"} `}
                style={animatedIndicatorStyle}
              />
    </View>
    </View>
  )
}

export default SwichTab