import { TextInput } from 'react-native'
import React from 'react'

const FinalTextInput = ({handleChangeText, onBlur, containerStyles, aditionalSyles, value, placeHolder}) => {
  return (
    <TextInput
        className={`text-white flex-1 rounded-[10px] p-1 bg-[#0c111d] p-2 my-1 mx-2 border-blue-700 border-[1px] ${containerStyles}`}
        style={{aditionalSyles}}
        onChangeText={handleChangeText}
        value={value}
        placeholder={placeHolder}
        onBlur={onBlur}
    />
  )
}

export default FinalTextInput