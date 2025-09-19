import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const StaticFilters = ({
  items,
  selectedItems,
  multiselect = false,
  setSelectedItems,
  title = "",
}: {
  items: string[];
  selectedItems: string[];
  multiselect?: boolean;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <View className="w-full">
      <TouchableOpacity
        className="flex-row justify-between items-center px-4 py-1  rounded-t-lg"
        onPress={() => setIsVisible(!isVisible)}
      >
        <View className="flex-row items-center">
          <Text className="text-[15px] font-bold mb-2 text-gray-300">
            {title}
          </Text>
          <Text className="text-[15px] font-bold mb-2 text-gray-300 ml-2">
            {items.length > 0 ? `(${items.length})` : "(0)"}
          </Text>
        </View>
        <Icon
          name={isVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
      {!isVisible ? (
        <View className="flex-row flex-wrap justify-start items-center w-full px-2 py-1 ml-2">
          {items.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (multiselect) {
                    if (selectedItems.includes(item)) {
                      setSelectedItems(selectedItems.filter((i) => i !== item));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  } else {
                    setSelectedItems([item]);
                  }
                }}
                key={index}
                className={`p-2 rounded-[5px] m-1 ${selectedItems.includes(item) ? "bg-blue-500" : "bg-gray-500"}`}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default StaticFilters;
