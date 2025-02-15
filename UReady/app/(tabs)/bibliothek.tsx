import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";
import VektorCircle from '@/components/(tabs)/vektorCircle';
import { useWindowDimensions } from 'react-native';
import Karteikarte from '@/components/(tabs)/karteiKarte';

const Bibliothek = () => {
  const [last7Hidden, setLast7Hidden ] = useState(true)
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
  

  return (
      <Tabbar content={()=> { return(
      <View className='flex-1 bg-[#0c111d] rounded-[10px]'>
        <View className={`flex-row p-4 justify-between items-center h-[60px] rouned-[10px] ${!isVertical ? "bg-gradient-to-b from-blue-900 to-[#0c111d]" : null}`}>
          <Text className='font-bold text-3xl text-gray-100'>
            Bibliothek
          </Text>
          <TouchableOpacity className='bg-white p-2 rounded-full flex-row items-center justify-center'>
            <Text>+ Lernset erstellen</Text>
            <View className='bg-gradient-to-b from-blue-300 to-blue-500 rounded-full px-2 py-1 mx-3 my-1'>
            <Icon name="lock" size={10} color="white"/>
            </View>
          </TouchableOpacity>
        </View>
        <View className='border-t-[1px] border-gray-700 w-full ' />
        <View className=' p-4 bg-[#0c111d]'>
          <TouchableOpacity className='flex-row' onPress={()=> setLast7Hidden(!last7Hidden)}>
            <Icon name={last7Hidden ? "chevron-up" : "chevron-down"} size={20} color="gray"/>
            <Text className='font-bold text-[15px] text-gray-300 ml-2'>Letzte 7 Tage</Text>
            <View className='bg-gray-500 rounded-[5px] h-[15px]  ml-1 items-center justify-center'>
              <Text className='text-gray-100 mx-1'>2</Text>
            </View>
          </TouchableOpacity>
          <View className={`w-full ${isVertical ? "flex-row": "flex-1 w-full"}`}>
            <Karteikarte farbe={"#06aed4"} titel={"Algorythmen"} studiengang={"Informatik"} fragenAnzahl={21} notizAnzahl={1} creator={"YOU"} availability={false} icon={"clock"}/>
            <Karteikarte farbe={"#06aed4"} titel={"Algorythmen"} studiengang={"Informatik"} fragenAnzahl={21} notizAnzahl={1} creator={"YOU"} availability={false} icon={"clock"}/>
          </View>
        </View>
      </View>
    )}} page={"Bibliothek"}/>
  )
}

export default Bibliothek