import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const ProgressBar = ({
  handlePress,
  percent,
}: {
  handlePress: () => void;
  percent: number;
}) => {
  return (
    <View className="w-full flex-row items-center justify-between mb-4">
      <TouchableOpacity onPress={handlePress} className="mr-2">
        <Icon name="arrow-left" size={20} color="#4B5563" />
      </TouchableOpacity>
      <View
        className="bg-gray-900 flex-1 rounded-[10px] "
        style={{ height: 6 }}
      >
        <View
          className={`bg-blue-500 h-full w-[${percent}%] rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
