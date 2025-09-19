import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const TouchSquare = ({
  text,
  handlePress,
  icon,
}: {
  text: string;
  handlePress: () => void;
  icon: string;
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-2 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[120px] w-[120px] items-center justify-center m-1"
      style={{ width: 135, height: 135 }}
    >
      <Icon name={icon} size={20} color="#D1D5DB" />
      <Text className="text-gray-100 font-semibold text-[15px] text-center ">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default TouchSquare;
