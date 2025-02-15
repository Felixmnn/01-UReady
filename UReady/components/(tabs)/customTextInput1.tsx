import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

const CustomTextInput1 = ({value, inputStyles, placeholderSize, placeholderBold, additional}) => {
    const [focused, setFocused] = useState(false)
    const [text,setText] = useState (value)
  return (
        <TextInput 
            className={`p-3 rounded-[10px] w-full ${focused ? "border-blue-500 border-w-[1px]" : "border-gray-500 "} ${inputStyles}`}
            style={{
                color: "gray",
                fontWeight: placeholderBold ? placeholderBold : 'bold',
                fontSize: placeholderSize ? placeholderSize : 15,
                outline: 'none',
                borderColor: focused ? "blue" :  "gray",
                borderWidth: 1,
                
            }}
            onChangeText={(newText) => setText(newText)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={text}
            placeholder={value}
        />
  )
}

export default CustomTextInput1