import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";

const CustomTextInputChat = ({placeholder, handlePress}) => {
  {/*Wie die anderen nur eben mit commit Button*/}
    const [focused, setFocused] = useState(false)
    const [text,setText] = useState ("")
  return (
    <View className={`justify-between items-center flex-row p-3 rounded-full h-[40px] border-[1px] border-gray-700`}>
      <TextInput

      style={{
        width: "90%",
        color: "gray",
        fontWeight: 'semibold',
        fontSize: 15,

        outline: 'none',
        
        }}
        onChangeText={(newText) => setText(newText)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={text}
        placeholder={placeholder}
      />
      <TouchableOpacity className='flex-row pt-1 px-1 items-center rounded-full justify-center bg-gradient-to-b from-[#001450] to-pink-500'>
        <Icon name="paper-plane" size={15} color="white"/>
        <Text className='text-white ml-1 mb-1'>8/10</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CustomTextInputChat