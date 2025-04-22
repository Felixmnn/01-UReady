import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'

const DropDownList = ({
    title = "Titel",
    options = [],
    selectedOptions,
    setSelectedOptions,
    height
  }) => {
    
    const [droppedDown, setDroppedDown] = useState(false);
  
    return (
      <View className="flex-1 relative z-10 mx-1">
        <TouchableOpacity
          className="flex-1"
          
          onPress={() => setDroppedDown(!droppedDown)}
        >
          {/* Titel + Auswahl */}
          <View className="bg-gray-800 border border-gray-600 rounded-[10px] p-2 h-[35px]">
            <Text className="text-gray-200 font-semibold text-[13px]" numberOfLines={1}>
              {title}: {selectedOptions}
            </Text>
          </View>
        </TouchableOpacity>
  
        {droppedDown && (
            <View
                className="absolute left-0 right-0 bg-gray-900 border border-gray-700 rounded-[10px] mt-1"
                style={{ zIndex: 999, top: 30, maxHeight: height - 200 }}
            >
                <FlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                style={{
                    scrollbarWidth: 'thin', 
                    scrollbarColor: 'gray transparent',
                  }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={() => {
                        setSelectedOptions(item);
                        setDroppedDown(false);
                    }}
                    className={`p-2 hover:bg-gray-700 ${
                        selectedOptions.includes(item) ? "bg-blue-500 rounded-[10px] m-1" : ""
                    }`}
                    >
                    <Text className="text-white" numberOfLines={1}>
                        {item}
                    </Text>
                    </TouchableOpacity>
                )}
                />
            </View>
            )}
      </View>
    );
  };

export default DropDownList