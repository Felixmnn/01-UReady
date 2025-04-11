import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import RNPickerSelect from "react-native-picker-select";
import { useState,useRef } from 'react';
import Icon from "react-native-vector-icons/FontAwesome";
const OptionSelector = ({title, options, selectedOption, containerStyles, marginChanges, hideTitle, width,selectedValue, setSelectedValue, onChangeItem}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef(null);

  
  return (
    <View className={` items-start justify-end mr-2 `} >
        {hideTitle ? null  :<Text className='text-gray-200 font-semibold text-[13px] m-2'>{title}</Text>}
      {/* Dropdown Button */}
      <TouchableOpacity
        ref={buttonRef}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        className={` flex-row items-center justify-between w-full bg-gray-800 p-4 rounded-[10px] ${ isDropdownOpen ? "border-[1px] border-blue-500" : " border-[1px] border-gray-600"}`}
        style={{
          padding: 10,
          alignItems: "center",
        }}
      >
        <Text className='text-white text-semibold mr-2'>{selectedValue ? selectedValue :  options[0].label}</Text>
        <Icon name="chevron-down" size={18} color="white" />
      </TouchableOpacity>

      {/* Dropdown Liste mit absoluter Positionierung */}
      {isDropdownOpen && (
        <View
         className={`bg-gray-800 border-[1px] border-gray-600 mt-[14px] rounded-[10px] ${marginChanges ? marginChanges : "mt-[14px]" }`}
          style={{
            position: "absolute",
            top: 60, // Abstand nach unten
            elevation: 5, // Schatten für Android
            shadowColor: "#000", // Schatten für iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            zIndex: 10, // Damit es über anderen Elementen liegt
          }}
        >
          {
              options.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={async () => {
                  setSelectedValue(item.label);
                  setIsDropdownOpen(false);
                  await onChangeItem(item.label);
                }}
                className='border-gray-600 rounded-[10px]'
                style={{
                  padding: 10,
                  
                }}
              >
                <Text className='text-white font-semibold'>{item.label}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      )}
    </View>)
}

export default OptionSelector