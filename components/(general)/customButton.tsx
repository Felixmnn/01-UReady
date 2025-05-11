import {  Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";

const CustomButton = ({title, handlePress, containerStyles, textStyles, iconName, iconSize, iconColor,disabled }) => {
  {/*General Styled Button*/}
  return (
    <TouchableOpacity disabled={disabled} className={`items-center border border-[1px] justify-center flex-row h-[40px] min-w-[40px] my-2 rounded-[20px] ${title ? "px-5" : null } ${disabled ? "bg-gray-700" :null} ${containerStyles}`} onPress={handlePress}>
      <Icon name={iconName} size={iconSize} color={iconColor}/>
      {
        title ?
        <Text className={`text-white font-semibold ${textStyles}`}>{title}</Text>
        : null
      }
    </TouchableOpacity>
  )
}

export default CustomButton