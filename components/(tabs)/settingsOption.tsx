import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const SettingsOption = ({
  iconName,
  title,
  handlePress,
  bottom,
  item,
}: {
  iconName: string;
  title: string;
  handlePress: () => void;
  bottom?: boolean;
  item?: React.ReactNode;
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between p-4 ${bottom ? null : "border-b border-gray-600"}`}
      onPress={handlePress}
    >
      <View className="flex-row items-center">
        <Icon name={iconName} size={20} color="white" />
        <Text className="text-white text-[15px] ml-3">{title}</Text>
      </View>
      <Icon name="chevron-right" size={15} color="white" />
      {item}
    </TouchableOpacity>
  );
};

export default SettingsOption;
