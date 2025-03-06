import { View, Text } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState } from 'react'
import CustomButton from '../../(general)/customButton';
import {loadModules} from "../../../lib/appwriteDaten"

const AllModules = ({setSelected, modules, setSelectedModule}) => {
    const [last7Hidden, setLast7Hidden ] = useState(true)
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    console.log("Modules",modules.documents)
  return (
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
          <TouchableOpacity className='' onPress={()=> setLast7Hidden(!last7Hidden)}>
            <View className='flex-row items-center justify-between'>
              <Text className='font-bold text-gray-100 text-[18px]'>Last 7 Days</Text>
              <Icon name={last7Hidden ? "chevron-down" : "chevron-up"} size={15} color="white"/>
            </View>
          </TouchableOpacity>
        <View className={`w-full ${isVertical ? "flex-row": "flex-1 w-full"}`}>
            {
              modules && modules.documents.map((module,index) => {
                if (index < 7) {
                  return <Karteikarte handlePress={()=> {setSelected("SingleModule"); setSelectedModule(index)}} farbe={"#06aed4"}percentage={module.progress} titel={module.name} studiengang={module.subject} fragenAnzahl={module.questions} notizAnzahl={module.notes} creator={module.creator} availability={module.public} icon={"clock"} />
                }
              })
            }
            {/*
            <Karteikarte handlePress={()=> setSelected("SingleModule")} farbe={"#06aed4"} titel={"modules[0].name"} studiengang={"Informatik"} fragenAnzahl={21} notizAnzahl={1} creator={"YOU"} availability={false} icon={"clock"}/>
            <Karteikarte farbe={"#06aed4"} titel={"Algorythmen"} studiengang={"Informatik"} fragenAnzahl={21} notizAnzahl={1} creator={"YOU"} availability={false} icon={"clock"}/>
            */}
            </View>
        </View>
      </View>
  )
}

export default AllModules