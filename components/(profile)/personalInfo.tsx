import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "@expo/vector-icons/FontAwesome"
import InfoModule from '../(tabs)/infoModule'
import { useGlobalContext } from '@/context/GlobalProvider'
import CustomTextInput from '../(general)/customTextInput'
import CustomTextInput1 from '../(general)/customTextInput1'
import { useWindowDimensions } from 'react-native'

const PersonalInfo = ({setPage}) => {
    const {user} = useGlobalContext()
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
      const isVertical = width > 700;

    const personalInput = (value,title) => {
        return (
            <TouchableOpacity className='flex-1 w-full'>
                <Text className='text-gray-300 font-bold text-[13px] m-2'>{title}</Text>
                <CustomTextInput1 value={value} />
            </TouchableOpacity>
        )
    }

  return (
    <View className='flex-1 items-center '>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70'></View> : null }
    <View className='flex-1 w-full bg-[#0c111d] rounded-[10px]'>
      <TouchableOpacity className='w-full h-[70px] rounded-t-[10px] bg-gray-800 bg-gray-800 flex-row items-center justify-start px-5 border-w-[1px] border-gray-600' onPress={()=> setPage()}>
              <TouchableOpacity className='rounded-full p-2' onPress={()=> setPage()}>
                <Icon name="arrow-left" size={20} color="white"/>
              </TouchableOpacity>
              <Text className='text-white text-[20px] font-semibold ml-4 mb-1'>Einstellungen</Text>
        </TouchableOpacity>
        <View className='mt-2'>
            <InfoModule content={()=> {
                return(
                    <View className='flex-1 items-center'>
                        <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user.name[0]}</Text></View>
                        {personalInput("Felix","Vorname")}
                        {personalInput("Manemann","Nachname")}
                        {personalInput("test@test.test","Email")}
                        {
                            true ?
                            <View className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}>
                                <Text className='text-red-300 font-bold text-[12px]'>Bitte bestätige deine Email-Adresse über den Link in der Email, die wir dir gesendet haben.</Text>
                                <TouchableOpacity className='py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]'><Text className='font-bold text-gray-300'>Email erneut senden</Text> </TouchableOpacity>
                            </View>
                            : null
                        }
                        {personalInput("Status","Telefonnummer")}
                        {personalInput("Student","Status")}
                        <View className='justify-start w-full my-3'>
                        <Text className='font-bold text-white '>Hochschule/ Universität</Text>
                        <Text className='font-semibold text-white'>Testuni</Text>
                        <Text className='font-bold text-white mt-3'>Studiengang</Text>
                        <Text className='font-semibold text-white'>Informatik</Text>
                        </View>
                        <View className={`flex-row w-full justify-between items-center py-2 `}>
                            <TouchableOpacity className='py-2 px-3 rounded-full border-gray-500 border-[1px]'><Text className='font-bold text-gray-300'>Email erneut senden</Text> </TouchableOpacity>
                        </View>



                    </View>
                )
            }} hideHead={true}/>
        </View>
    </View>
    </View>
  )
}

export default PersonalInfo