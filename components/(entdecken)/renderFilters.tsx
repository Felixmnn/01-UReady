import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const RenderFilters = ({
  items,
  selectedItems,
  multiselect = false,
  setSelectedItems,
  title = "",
}:{
  items: string[];
  selectedItems: string[];
  multiselect?: boolean;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
}) => {
  return (
    <View className="w-full  ">
      <Text className="px-2 text-gray-500 font-bold text-[15px]  ">
        {title}
      </Text>
      <BottomSheetFlatList
        data={items}
        horizontal
        renderItem={({ item }) => (
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
          >
            <View
              className={`px-4 py-3 mr-2    rounded-[15px] ${selectedItems.includes(item) ? "bg-blue-500" : "bg-gray-500"}`}
            >
              <Text className="font-bold text-[15px]">{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={{
          height: "auto",
          maxHeight: 60,
          marginVertical: 10,
          paddingVertical: 5,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default RenderFilters;
