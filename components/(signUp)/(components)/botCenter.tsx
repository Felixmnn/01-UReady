import { View, Text, Image } from "react-native";
import React from "react";

const BotCenter = ({ text }: { text: string }) => {
  return (
    <View>
      <View className="w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10">
        <Text className="font-semibold text-[15px] text-gray-100 text-center">
          {text}
        </Text>
      </View>
      <View className="absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 " />
      <View className="rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]" />
      <Image
        source={require("../../../assets/Check.gif")}
        style={{ height: 150, width: 150 }}
      />
    </View>
  );
};

export default BotCenter;
