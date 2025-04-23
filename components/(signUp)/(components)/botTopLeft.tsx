import { View, Text,Image } from 'react-native'
import React from 'react'

const BotTopLeft = ({text,source}) => {
  return (
    <View className='flex-row p-4 ml-4 absoloute'
    style={{
      left:-40,
    }}
    >
      
      <Image source={require("../../../assets/Check.gif")}  style={{height:100, width:100}}/> 
          <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]' style={{height:10, width:10, top:20, left:10}}/> 
          <View className='absoloute rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 ' style={{height:15, width:15, top:12, left:10}}/>
          <View className='w-full max-w-[200px] h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10 p-3'
          style={{maxWidth:200}}
          >
          <Text className='font-semibold text-[15px] text-gray-100 text-center'>{
              text
              }</Text>
    </View>
    </View>
  )
}

export default BotTopLeft