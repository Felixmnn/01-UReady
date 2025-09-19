import { View, TouchableOpacity, FlatList, Text } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
const ColorPicker = ({
  selectedColor,
  changeColor,
  indexItem,
  title,
}: {
  selectedColor: string | null;
  changeColor: (newColor: string, index: number) => void;
  indexItem: number;
  title?: string;
}) => {
  const colorOptions = [
    null,
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
  ];
  return (
    <View>
      <Text className="text-gray-400 font-bold text-[12px]">{title}</Text>

      <View className="flex-row  items-center justify-center border-blue-700 bg-[#0c111d] border-[1px] p-2 rounded-[10px] m-2 shadow-lg">
        <FlatList
          data={colorOptions}
          keyExtractor={(item, index) =>
            item !== null ? item : `null-${index}`
          }
          horizontal={true}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                className={`p-1 m-1 rounded-full items-center justify-center`}
                onPress={() => {
                  changeColor(item ?? "", indexItem);
                }}
                style={{
                  backgroundColor:
                    selectedColor !== item
                      ? undefined
                      : item === "red"
                        ? "rgba(220, 38, 38, 0.4)"
                        : item === "blue"
                          ? "rgba(37, 99, 235, 0.4)"
                          : item === "green"
                            ? "rgba(5, 150, 105, 0.4)"
                            : item === "yellow"
                              ? "rgba(202, 138, 4, 0.4)"
                              : item === "orange"
                                ? "rgba(194, 65, 12, 0.4)"
                                : item === "purple"
                                  ? "rgba(124, 58, 237, 0.4)"
                                  : item === "pink"
                                    ? "rgba(219, 39, 119, 0.4)"
                                    : item === "cyan"
                                      ? "rgba(8, 145, 178, 0.4)"
                                      : "rgba(31, 41, 55, 0.4)",
                }}
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      item === "red"
                        ? "#DC2626"
                        : item === "blue"
                          ? "#2563EB"
                          : item === "green"
                            ? "#059669"
                            : item === "yellow"
                              ? "#CA8A04"
                              : item === "orange"
                                ? "#C2410C"
                                : item === "purple"
                                  ? "#7C3AED"
                                  : item === "pink"
                                    ? "#DB2777"
                                    : item === "cyan"
                                      ? "#0891B2"
                                      : "#1F2937",
                    width: 25,
                    height: 25,
                  }}
                >
                  {selectedColor == item && selectedColor !== null ? (
                    <Icon name="check" size={15} color="white" />
                  ) : null}
                  {selectedColor == null && index == 0 ? (
                    <Icon name="ban" size={15} color="gray" />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ColorPicker;
