import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
const ColorPicker = ({selectedColor, changeColor, title,indexItem}) => {
    const colorOptions = [
        null,
        "red",
        "orange",
        "yellow",
        "emerald",
        "cyan",
        "blue",
        "purple",
        "pink"
      ];
  return (
    <View>
    <Text className='text-gray-400 font-bold text-[12px]'>
                        {title}
                      </Text>
                      <View className='flex-row flex-1 items-center justify-center border-gray-700 border-[1px] p-2 rounded-[10px] m-2'>
                        {colorOptions.map((color, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              className={`p-1 m-1 rounded-full items-center justify-center`}
                              onPress={() => {
                                console.log("The new color is",color)
                                changeColor(color,indexItem);
                            }}
                              style={{
                                backgroundColor:
                                  selectedColor !== color ? null :
                                  color === "red" ? "rgba(220, 38, 38, 0.4)" :
                                  color === "blue" ? "rgba(37, 99, 235, 0.4)" :
                                  color === "green" ? "rgba(5, 150, 105, 0.4)" :
                                  color === "yellow" ? "rgba(202, 138, 4, 0.4)" :
                                  color === "orange" ? "rgba(194, 65, 12, 0.4)" :
                                  color === "purple" ? "rgba(124, 58, 237, 0.4)" :
                                  color === "pink" ? "rgba(219, 39, 119, 0.4)" :
                                  color === "emerald" ? "rgba(5, 150, 105, 0.4)" :
                                  color === "cyan" ? "rgba(8, 145, 178, 0.4)" :
                                  "rgba(31, 41, 55, 0.4)"
                              }}
                            >
                              <View className="items-center justify-center rounded-full" style={{
                                backgroundColor:
                                  color === "red" ? "#DC2626" :
                                  color === "blue" ? "#2563EB" :
                                  color === "green" ? "#059669" :
                                  color === "yellow" ? "#CA8A04" :
                                  color === "orange" ? "#C2410C" :
                                  color === "purple" ? "#7C3AED" :
                                  color === "pink" ? "#DB2777" :
                                  color === "emerald" ? "#059669" :
                                  color === "cyan" ? "#0891B2" :
                                  "#1F2937",
                                width: 25,
                                height: 25
                              }}>
                                {selectedColor == color && selectedColor !== null ? <Icon name="check" size={15} color="white" /> : null}
                                {color == null ? <Icon name="ban" size={15} color="gray" /> : null}
                              </View>
                            </TouchableOpacity>
                          );
                        })}
    </View>
    </View>
  )
}

export default ColorPicker