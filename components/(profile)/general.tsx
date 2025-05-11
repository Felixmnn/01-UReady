import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomButton from '../(general)/customButton'
import { useGlobalContext } from '@/context/GlobalProvider'
import { useWindowDimensions } from 'react-native';
import InfoModule from '../(tabs)/infoModule';

const General = ({setPage}) => {
    const { user } = useGlobalContext();
    
      const { width } = useWindowDimensions(); 
      const isVertical = width > 700;
  return (
    <View className={`flex-1  rounded-[10px] rounded-[10px] ${isVertical ? " border-gray-500 border-[1px] " : null} bg-[#0c111d]`}>
      {
        user ?
        <View className='flex-1 bg-[#0c111d] '>
      <View className='bg-[#0c111d]  rounded-t-[10px]'>
        
          {
            isVertical ?
            <View className='flex-row justify-end mt-2 mx-5 items-center '>
              <CustomButton iconName={"share-alt"} iconSize={20} iconColor={"white"} title={"UReady teilen"} textStyles={"ml-2"} containerStyles={"bg-gray-800 mr-2"} />
              <CustomButton iconName={"cog"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-800 mr-2"} handlePress={()=> setPage()}/>
            </View>
            :
            <View className='flex-row justify-between items-center mt-2 mr-2 '>
                <View className={`flex-row p-4 justify-between items-center  h-[60px] rouned-[10px] `}>
                  <Text className='font-bold text-3xl text-gray-100'>
                    Profil
                  </Text>
                </View>
                <View className='flex-row'>
                  <CustomButton iconName={"share-alt"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-800 mr-2"} />
                  <CustomButton iconName={"cog"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-800"} handlePress={()=> setPage()}/>
                </View>
            </View>
          }
          </View>
        <View className='w-full border-t-[1px] border-gray-700'/>
       
          <View className='flex-1 justify-start bg-gray-900 rounded-[10px] '>
            <InfoModule content={()=> { return(
              <TouchableOpacity className='flex-row' >
                <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user?.name?.[0] || "..."}</Text></View>
                <View>
                  <Text className='text-white font-bold text-[18px]'>{user?.name || "name"}</Text>
                  <Text className='text-gray-300 text-[12px] font-bold'>{user?.email || "e-mail"}</Text>
                  <Text className='text-gray-300 text-[12px] font-bold'>{user?.emailVerification ? "verified" : "unverified"}</Text>
                </View>
              </TouchableOpacity>
              )}} header={"Persönliche Infos"} additional={"Optional"}/>
          </View>
          </View>
          : <Text>Ein wunderschöner Skeleton View</Text>
          }
        </View>
  )
}

export default General