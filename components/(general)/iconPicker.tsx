import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
const IconPicker = ({selectedIcon, setSelectedIcon, title,indexItem, selectedColor  }) => {
    const icons = [
        null,
        "book",
        "chalkboard-teacher",
        "graduation-cap",
        "laptop",
        "user-graduate",
        "book-open",
        "brain",
        "pizza-slice",
      ];
  return (
    <View>
    <Text className='text-gray-400 font-bold text-[12px]'>
                        {title}
                      </Text>
                      <View className='flex-row flex-1 items-center justify-center border-gray-700  border-[1px] p-2 rounded-[10px] m-2 shadow-lg bg-[#0c111d]'>
                        {icons.map((icon, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              className={`p-1 m-1 rounded-full items-center justify-center`}
                              onPress={() => setSelectedIcon(icon,indexItem)}
                            >
                              <View className={`items-center justify-center rounded-full border-gray-500 border-[1px] `} 
                              style={{
                                width: 25,
                                height: 25,
                                backgroundColor:
                                    selectedIcon === icon && selectedColor === "red" ? "#DC2626" :
                                    selectedIcon === icon && selectedColor === "blue" ? "#2563EB" :
                                    selectedIcon === icon && selectedColor === "green" ? "#059669" :
                                    selectedIcon === icon && selectedColor === "yellow" ? "#CA8A04" :
                                    selectedIcon === icon && selectedColor === "orange" ? "#C2410C" :
                                    selectedIcon === icon && selectedColor === "purple" ? "#7C3AED" :
                                    selectedIcon === icon && selectedColor === "pink" ? "#DB2777" :
                                    selectedIcon === icon && selectedColor === "emerald" ? "#059669" :
                                    selectedIcon === icon && selectedColor === "cyan" ? "#0891B2" :
                                    "rgba(31, 41, 55, 0.4)"
                            }}>
                                

                                {icon == null ? 
                                    <Icon name="ban" size={12} color="gray" /> 
                                    :
                                    <Icon name={icon} size={12} color={selectedIcon == icon ? "white" : "gray"} /> 
                                }
                              </View>
                            </TouchableOpacity>
                          );
                        })}
    </View>
    </View>
  )
}

export default IconPicker