import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';

const ProgressBar = ({handlePress, percent}) => {
  return (
    <View className='w-full '>
        <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
            <View className={`bg-blue-500 h-full w-[${percent}%] rounded-full`} style={{width:`${percent}%`}}/>
        </View>
        <TouchableOpacity onPress={handlePress} className='m-2'>
            <Icon name="arrow-left" size={20} color="#4B5563" />
        </TouchableOpacity>
    </View>
  )
}

export default ProgressBar