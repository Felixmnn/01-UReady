import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import SessionProgress from './sessionProgress';
import RoadMap from './(sections)/roadMap';
import Data from './(sections)/data';
import Header from './(sections)/header';
import { quizQuestion } from '@/assets/exapleData/quizQuestion';
import SwichTab from '../(tabs)/swichTab';

const SingleModule = ({setSelected2}) => {
  
    const example = {
        title: "Algorithmen",
        creator: "YOU",
        questions: 21,
        notes: 1,
        subject: "Informatik",
        color: "#06aed4",
        modules: [{id:"123456", progress:10}, {id:"1234567", progress:70}, {id:"12345678",progress:40}]
    }
    const [selected, setSelected] = useState(0)
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const [ tab, setTab ] = useState(0)
    const tabWidth = width / 2; // Da es zwei Tabs gibt
    const isVertical = width > 700;
    return (
        <View className='flex-1 items-center '>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                <Header example={example} setSelected={setSelected}/>
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab1={"Fragen"} tab2={"Roadmap"} bg={"bg-gray-900"}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                <View className='flex-1 flex-row'>
                    <View className='p-4 flex-1'>
                        <Data data={example} selected={selected}/>
                    </View>
                    {isVertical ?
                    <View className='h-full border-gray-600 border-l-[1px] p-4 items-center'>
                       <RoadMap data={example} selected={selected} setSelected={setSelected}/> 
                    </View>
                    : null }
                </View>
            </View>
        </View>
    )
}

export default SingleModule