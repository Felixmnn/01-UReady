import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {router} from 'expo-router'
const TokenHeader = ({userUsage}) => {
  return (
    <View className='w-full flex-row justify-between'>
        <TouchableOpacity className='flex-row m-2 p-5' >
            <Icon name="fire" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.streak}</Text>
        </TouchableOpacity>

        <View className='flex-row m-2 p-5' >
            <TouchableOpacity className='flex-row mx-5' onPress={()=> router.push("/shop")} >
            <Icon name="microchip" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.microchip}</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row' onPress={()=> router.push("/shop")}
            >
            <Icon name="bolt" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.boostActive ? "∞" : userUsage?.energy}</Text>
            </TouchableOpacity>
        </View>

    </View>
  )
}

export default TokenHeader