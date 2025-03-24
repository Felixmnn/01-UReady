import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {router } from 'expo-router';
import ModalNewQuestion from '../(modals)/newQuestion';
import AiQuestion from '../(modals)/aiQuestion';
import ModalSessionList from '../(modals)/modalSessionList';
const Header = ({setSelectedScreen,selectedModule, selected, sessions, setSessions}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;

    const [ tab, setTab ] = useState(0)
    const tabWidth = width / 2; // Da es zwei Tabs gibt
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleAI, setIsVisibleAI] = useState(false)

    const [showSessionList, setShowSessionList] = useState(false)
  return (
    <View className={`${!isVertical ? "bg-[#0c111d]" : null}`}>
        <ModalNewQuestion sessions={sessions} selected={selected} module={selectedModule} isVisible={isVisible} setIsVisible={setIsVisible} setSelected={setSelectedScreen} selectAi={()=> {setIsVisible(false);setIsVisibleAI(true) } } /> 
        <AiQuestion isVisible={isVisibleAI} setIsVisible={setIsVisibleAI} sessions={selectedModule} />
        <ModalSessionList isVisible={showSessionList} setIsVisible={setShowSessionList} sessions={sessions} setSessions={setSessions} />
        <View className='flex-row w-full justify-between p-4 items-center'>
                    <TouchableOpacity onPress={()=> setSelectedScreen("AllModules")} >
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
                    <Text className='text-gray-200 font-bold text-2xl'>{sessions[selected].title}</Text>
                    <View className='flex-row items-center'>
                    <TouchableOpacity onPress={()=> setShowSessionList(true)} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
                            <Icon name={"layer-group"} color={"white"} size={15 }/>
                            {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>Sessions</Text> : null}
                    </TouchableOpacity>
                        <TouchableOpacity onPress={()=> setIsVisible(true)} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
                            <Icon name="plus" size={15} color="white"/>
                            {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>Material hinzufügen</Text> : null}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> {}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
                            <Icon name="play" size={15} color="white"/>
                            {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>Jetzt lernen</Text> : null}
                        </TouchableOpacity>
                    </View>
                </View>
    </View>
  )
}

export default Header