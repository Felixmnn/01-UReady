import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import VektorCircle from './vektorCircle'
import Icon from "react-native-vector-icons/FontAwesome5";

const Karteikarte = ({titel, studiengang, fragenAnzahl,notizAnzahl , farbe, creator, availability, icon,handlePress, percentage, publicM}) => {
  console.log("The color is",farbe)
    const color = 
      farbe === "RED" ? "#DC2626" :
      farbe === "BLUE" ? "#2563EB" :
      farbe === "GREEN" ? "#059669" :
      farbe === "YELLOW" ? "#CA8A04" :
      farbe === "ORANGE" ? "#C2410C" :
      farbe === "PURPLE" ? "#7C3AED" :
      farbe === "PINK" ? "#DB2777" :
      farbe === "EMERALD" ? "#059669" :
      farbe === "CYAN" ? "#0891B2" :
      "#1F2937";


    return(
    <TouchableOpacity className='flex-1 my-2 mr-2 ' onPress={handlePress}>
      <View className={` rounded-t-[10px] border-t-[1px] border-gray-700 `} style={{height:5, backgroundColor:color}}/>
      <View className=' p-3 bg-[#1f242f] border-[1px] border-gray-700 rounded-b-[10px] ' style={{borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
        <View className='flex-row justify-between items-start'>
          <View >
            <Text className='my-1 font-semibold text-[15px] text-gray-100'>{titel}</Text>
            <Text className='my-1 text-[12px] text-gray-400'>{studiengang}</Text>
          </View>
          <VektorCircle color={color} percentage={percentage} icon={"clock"} strokeColor={color}/>
        </View>
        <View className='flex-row'>
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{fragenAnzahl} Fragen • {notizAnzahl} Notizen</Text>
        </View>
        <View className='border-t-[1px] border-gray-700 my-2'/>
        <View className='flex-row justify-between items-center'>
          <View className='py-[2px] px-2 border-[1px] border-gray-700 rounded-full flex-row items-center'>
            <Icon name="user" size={10} color="white"/>
            <Text className='text-gray-300 text-[12px] ml-1'>{creator == "YOU" ? "Von Dir" : creator.length > 10 ? creator.substring(0, 10) + "..." : creator  }</Text>
          </View>
          <View className='flex-row justify-between'>
            <TouchableOpacity className='mr-4'>
              {
                !publicM ?
                <Icon name="lock" size={18} color="white"/>
                :
                <Icon name="globe" size={18} color="white"/>
              }            
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