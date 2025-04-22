import { View, Text, TouchableOpacity, ScrollView,FlatList } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, { useState } from 'react'
import CustomButton from '../../(general)/customButton';
import {loadModules} from "../../../lib/appwriteDaten"
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import AddModule from '@/components/(general)/(modal)/addModule';

const AllModules = ({setSelected, modules, setSelectedModule}) => {
    const [last7Hidden, setLast7Hidden ] = useState(true)
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
    const numColumns = Math.floor(width / 300);


    console.log("Modules",modules.documents)
  return (
    <View className='flex-1 bg-[#0c111d] '>
      <AddModule isVisible={isVisibleNewModule} setIsVisible={setIsVisibleNewModule}/>

        <View className={`flex-row p-4 justify-between items-center h-[60px] rouned-[10px] `}>
          <Text className='font-bold text-3xl text-gray-100'>
            Bibliothek {width}
          </Text>
          <TouchableOpacity onPress={()=> {setIsVisibleNewModule(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
              <Icon name="cubes" size={15} color="white"/>
              {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>Modul erstellen</Text> : null}
          </TouchableOpacity>
        </View>
        <View className='border-t-[1px] border-gray-700 w-full  ' />
        <View className={`flex-1  bg-gray-900 ${isVertical ? "p-4" : "p-2"} `}>
          <TouchableOpacity className='' onPress={()=> setLast7Hidden(!last7Hidden)}>
            <View className='flex-row items-center justify-between w-full mb-2'>
              <Text className='font-bold text-gray-100 text-[18px]'>Last 7 Days</Text>
              <Icon name={last7Hidden ? "chevron-down" : "chevron-up"} size={15} color="white"/>
            </View>
          </TouchableOpacity>
        {
          !last7Hidden ? null :
          <FlatList
          data={modules.documents}
          renderItem={({ item,index }) => (
            <View className='flex-1 mr-2  '>
              <Karteikarte handlePress={()=> {setSelected("SingleModule"); setSelectedModule(index)}} farbe={item.color} percentage={item.progress} titel={item.name} studiengang={item.subject} fragenAnzahl={item.questions} notizAnzahl={item.notes} creator={item.creator} availability={item.public} icon={"clock"} publicM={item.public} />
            </View>
          )}
          keyExtractor={(item) => item.$id}
          key={numColumns}
          numColumns={numColumns}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        }
        
        </View>
      </View>
  )
}

export default AllModules