import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';

const Header = ({setSelected, moduleName, ungespeichert }) => {
    const {width} = useWindowDimensions();
    const isVertical = width > 700;
  return (
    <View className='flex-row justify-between items-center p-3 bg-gray-800  w-full rounded-t-[10px]'>
        <View className='flex-row items-center'>
            <TouchableOpacity onPress={()=> setSelected("SingleModule")} >
                <Icon name="arrow-left" size={20} color="white"/>
            </TouchableOpacity>
            <View className='items-start justify-center ml-3'>
                <Text className='text-white font-bold'>Quiz Frage für "{moduleName}" erstellen</Text>
                <Text className='text-gray-500 text-[12px]'> {ungespeichert? "Ungespeicherte Änderungen " : "Alle änderungen gespeichert"}</Text>
            </View>
        </View>
        <GratisPremiumButton>
        <View className='flex-row items-center'>
            <Icon name="robot" size={15} color="white"/>
            {isVertical ?  <Text className='text-white ml-2'>Mit AI generieren</Text> : null}
        </View>
        </GratisPremiumButton>

    </View>
  )
}

export default Header