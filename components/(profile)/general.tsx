import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../(general)/customButton'
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider'
import { useWindowDimensions } from 'react-native';
import SwichTab from '../(tabs)/swichTab';
import InfoModule from '../(tabs)/infoModule';
import OptionSelector from '../(tabs)/optionSelector';

const General = ({setPage, setPage2}) => {
        const {user} = useGlobalContext();
      console.log(user)
      const { width } = useWindowDimensions(); // Bildschirmbreite holen
      const isVertical = width > 700;
      const tabWidth = width / 2; // Da es zwei Tabs gibt
      const [ tab, setTab ] = useState(0)
      const timeOptions = [
        { label: "Tage", value: "d" },
        { label: "Wochen", value: "w" },
        { label: "Monate", value: "m" },
        { label: "Jahre", value: "m" }


      ]
  const durationBlock = ({duration,name,styles}) => {
    return (
      <View className={`items-center ${styles}`}>
        <Text className='font-bold text-3xl text-gray-100'>{duration}</Text>
        <Text className='text-[12px] text-gray-400'>{name}</Text>
      </View>
    )
  }
      
  return (
    <View className='flex-1 bg-[#0c111d] rounded-[10px]'>
          {
            isVertical ?
            <View className='flex-row justify-end mt-2 mx-5 '>
              <CustomButton title="Gratis Premium testen" handlePress={()=> {}} containerStyles={"bg-blue-500 mr-2"}/>
              <CustomButton iconName={"share-alt"} iconSize={20} iconColor={"white"} title={"UReady teilen"} textStyles={"ml-2"} containerStyles={"bg-gray-900 mr-2"} />
              <CustomButton iconName={"cog"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-900 mr-2"} handlePress={()=> setPage()}/>
            </View>
            :
            <View className='flex-row justify-between mt-2 mx-5'>
              <View className='flex-row'>
              <CustomButton iconName={"share-alt"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-900 mr-2"} />
              <CustomButton iconName={"cog"} iconSize={20} iconColor={"white"} containerStyles={"bg-gray-900"} handlePress={()=> setPage()}/>
              </View>
              <CustomButton title="Gratis Premium testen" handlePress={()=> {}} containerStyles={"bg-red-500"}/>

            </View>
          }
        <SwichTab tabWidth={tabWidth} setTab={setTab} tab1={"Profil"} tab2={"Statistiken"}/>
        <View className='w-full border-t-[1px] border-gray-800'/>
          { tab == 0 ?
          <View className='flex-1 justify-start '>
            <InfoModule content={()=> { return(
              <TouchableOpacity className='flex-row' onPress={()=> setPage2()}>
                <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user.name[0]}</Text></View>
                <View>
                  <Text className='text-white font-bold text-[18px]'>{user.name}</Text>
                  <Text className='text-gray-300 text-[12px] font-bold'>{user.email}</Text>
                  <Text className='text-gray-300 text-[12px] font-bold'>{user.emailVerification ? "verified" : "unverified"}</Text>
                </View>
              </TouchableOpacity>
              )}} header={"Persönliche Infos"} additional={"Optional"}/>
          </View>
          :
          <View>
            <View className='ml-3 z-10'>
              <OptionSelector  options={timeOptions} marginChanges={"mt-[-3px]"}/>
            </View>
            <InfoModule content={()=> {
              return (
                  <View className='flex-row justify-center w-full'>
                    {durationBlock({duration:"3.5h",name:"Insgesamt",styles:"px-10"})}
                    {durationBlock({duration:"0.7",name:"Pro Tag",styles:"px-10"})}
                    {durationBlock({duration:"2h",name:"Tagesrekord",styles:"px-10"})}
                  </View>
              )
            }} hideHead={true} /> 
          </View>
          }
        </View>
  )
}

export default General