import { View, Text, TouchableOpacity, FlatList } from 'react-native'
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
  "pen",
  "pencil-alt",
  "clipboard-list",
  "file-alt",
  "calendar-alt",
  "clock",
  "microscope",
  "atom",
  "language",
  "users",
  "question-circle",
  "lightbulb",
  "headphones",
  "video",
];

  return (
    <View style={{
      height: 80,
    }}>
    <Text className='text-gray-400 font-bold text-[12px]'>
                        {title}
                      </Text>
                      <View className='flex-row flex-1 items-center justify-center border-gray-700  border-[1px] p-2 rounded-[10px] m-2 shadow-lg bg-[#0c111d]'
                      style={{
                        height: 60,
                      }}
                      >
                        

                          <FlatList
                          data={icons}
                          keyExtractor={(item) => item}
                          horizontal={true}
                          renderItem={({ item,index }) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              className={`p-1 m-1 rounded-full items-center justify-center`}
                              onPress={() => setSelectedIcon(item,indexItem)}
                            >
                              <View className={`items-center justify-center rounded-full border-gray-500 border-[1px] `} 
                              style={{
                                width: 25,
                                height: 25,
                                backgroundColor:
                                    selectedIcon === item && selectedColor === "red" ? "#DC2626" :
                                    selectedIcon === item && selectedColor === "blue" ? "#2563EB" :
                                    selectedIcon === item && selectedColor === "green" ? "#059669" :
                                    selectedIcon === item && selectedColor === "yellow" ? "#CA8A04" :
                                    selectedIcon === item && selectedColor === "orange" ? "#C2410C" :
                                    selectedIcon === item && selectedColor === "purple" ? "#7C3AED" :
                                    selectedIcon === item && selectedColor === "pink" ? "#DB2777" :
                                    selectedIcon === item && selectedColor === "emerald" ? "#059669" :
                                    selectedIcon === item && selectedColor === "cyan" ? "#0891B2" :
                                    "rgba(31, 41, 55, 0.4)"
                            }}>
                                

                                {item == null ? 
                                    <Icon name="ban" size={12} color="gray" /> 
                                    :
                                    <Icon name={item} size={12} color={selectedIcon == item ? "white" : "gray"} /> 
                                }
                              </View>
                            </TouchableOpacity>
                          );
                        }}/>
    </View>
    </View>
  )
}

export default IconPicker