import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {router } from 'expo-router';
import ModalNewQuestion from '../(modals)/newQuestion';
const Header = ({example,setSelected}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const [ tab, setTab ] = useState(0)
    const tabWidth = width / 2; // Da es zwei Tabs gibt
    const isVertical = width > 700;
    const [isVisible, setIsVisible] = useState(false)
  return (
    <View>
        <ModalNewQuestion isVisible={isVisible} setIsVisible={setIsVisible} setSelected={()=> setSelected("CreateQuestion")}/> 
      <View className='flex-row w-full justify-between p-4 items-center'>
                    <TouchableOpacity onPress={setSelected} >
                        <Icon name="arrow-left" size={20} color="white"/>
                    </TouchableOpacity>
                    <View className='flex-row items-center mx-2'>
                        <TouchableOpacity className='flex-row bg-gray-800 rounded-full px-2 py-1 border-[1px] border-gray-600 items-center mr-2'>
                            <Icon name="globe" size={15} color="white"/>
                            <Text className='text-white ml-2'>Teilen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ellipsis-v" size={15} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='w-full  flex-row px-4 justify-between items-center'>
                    <Text className='text-gray-200 font-bold text-2xl'>{example.title}</Text>
                    <View className='flex-row items-center'>
                        <TouchableOpacity onPress={()=> setIsVisible(true)} className='flex-row items-center rounded-full p-2 bg-gray-800 border-gray-600 border-[1px] mr-2'>
                            <Icon name="plus" size={15} color="white"/>
                            <Text className='text-gray-300 text-[12px] ml-1'>Material hinzufügen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-row items-center rounded-full p-2 bg-white mr-2 '>
                            <Icon name="play" size={15} color="black"/>
                            <Text className='text-[12px] ml-1'>Jetzt lernen</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    </View>
  )
}

export default Header