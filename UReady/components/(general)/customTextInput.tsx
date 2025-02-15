import { View, Text } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'

const CustomTextInput = ({text,setText,isFocused, setFocused,firstFocus,setFirstFocus}) => {
 {/*Erster Text Input empfehlung ist Input1*/}
  return (
    <View>
      <TextInput
                        className='min-w-[250px]'
                        placeholder="Enter text here"
                        style={{
                          outline: 'none',
                          borderColor: !isFocused ? firstFocus && text == "" ? "red" : null : "#2e95d3",
                          borderWidth: 1,
                          borderRadius: 10,
                          padding:10,                  
                        }}
                        value={text}
                        onChangeText={(newText) => setText(newText)}
                        placeholderTextColor={"gray"}
                        onFocus={() => {setFocused(true), setFirstFocus(true)}}
                        onBlur={() => setFocused(false)}
                      />
                    {!isFocused && firstFocus && text == "" ? <Text className='text-red-500 text-[12px]'>Das ist ein Pflichtfeld</Text> : null}
    </View>
  )
}

export default CustomTextInput