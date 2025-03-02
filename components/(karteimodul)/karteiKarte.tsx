import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import VektorCircle from './vektorCircle'
import Icon from "react-native-vector-icons/FontAwesome5";

const Karteikarte = ({titel, studiengang, fragenAnzahl,notizAnzahl , farbe, creator, availability, icon,handlePress}) => {
    return(
    <TouchableOpacity className='flex-1 my-2 mr-2 max-w-[456px]' onPress={handlePress}>
      <View className={` rounded-t-[10px] border-t-[1px] border-gray-700 max-w-[450px]`} style={{height:5, backgroundColor:farbe}}/>
      <View className=' p-3 bg-[#1f242f] border-[1px] border-gray-700 rounded-b-[10px] max-w-[450px]' style={{borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
        <View className='flex-row justify-between items-start'>
          <View >
            <Text className='my-1 font-semibold text-[15px] text-gray-100'>{titel}</Text>
            <Text className='my-1 text-[12px] text-gray-400'>{studiengang}</Text>
          </View>
          <VektorCircle color={"#00AEEF"} percentage={45} icon={"clock"} strokeColor={"#6d788c"}/>
        </View>
        <View className='flex-row'>
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{fragenAnzahl} Fragen • {notizAnzahl} Notizen</Text>
        </View>
        <View className='border-t-[1px] border-gray-700 my-2'/>
        <View className='flex-row justify-between items-center'>
          <View className='py-[2px] px-2 border-[1px] border-gray-700 rounded-full flex-row items-center'>
            <Icon name="user" size={10} color="white"/>
            <Text className='text-gray-300 text-[12px] ml-1'>{creator == "YOU" ? "Von Dir" : creator}</Text>
          </View>
          <View className='flex-row justify-between'>
            <TouchableOpacity className='mr-4'>
              <Icon name="globe" size={18} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity className='mr-1'>
              <Icon name="ellipsis-h" size={18} color="white"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    )
  }

export default Karteikarte