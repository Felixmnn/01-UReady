import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';

const Header = ({setSelected, moduleName, ungespeichert }) => {
  return (
    <View className='flex-row justify-between items-center p-3 bg-gray-800  w-full rounded-t-[10px]'>
        <View className='flex-row items-center'>
            <TouchableOpacity onPress={setSelected}>
                <Icon name="arrow-left" size={20} color="white"/>
            </TouchableOpacity>
            <View className='items-start justify-center ml-3'>
                <Text className='text-white font-bold'>Quiz Frage für "{moduleName}" erstellen</Text>
                <Text className='text-gray-500 text-[12px]'> {ungespeichert? "Ungespeicherte Änderungen " : "Alle änderungen gespeichert"}</Text>
            </View>
        </View>
        <View className='flex-row bg-gradient-to-b from-[#2b3d69] to-blue-500 items-center justify-center px-2 py-1 rounded-full'>
            <Icon name="microchip" size={15} color="white"/>
            <Text className='text-white ml-2'>Mit AI generieren</Text>
        </View>
    </View>
  )
}

export default Header