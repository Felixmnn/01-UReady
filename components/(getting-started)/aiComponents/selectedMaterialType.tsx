import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const SelectMaterialType = ({
  iconName,
  type,
  handlePress,
  text,
  selectedMaterialType,
  setSelectedMaterialType,
}: {
  iconName: string;
  type: "TOPIC" | "PEN" | "FILE" | "QUESTION";
  handlePress: () => void;
  text: string;
  selectedMaterialType: "TOPIC" | "PEN" | "FILE" | "QUESTION";
  setSelectedMaterialType: React.Dispatch<
    React.SetStateAction<"TOPIC" | "PEN" | "FILE" | "QUESTION">
  >;
}) => (
  <TouchableOpacity
    onPress={() => {
      setSelectedMaterialType(type);
      handlePress();
    }}
    className={`${
      selectedMaterialType === type ? "bg-gray-800" : "bg-[#0c111d]"
    } rounded-full flex-row items-center justify-center shadow-lg h-[35px] px-2 `}
  >
    {selectedMaterialType === type && (
      <Text className="text-gray-300 font-semibold text-[15px] mr-2">
        {text}
      </Text>
    )}
    <Icon name={iconName} size={20} color="#4B5563" />
  </TouchableOpacity>
);

export default SelectMaterialType;
