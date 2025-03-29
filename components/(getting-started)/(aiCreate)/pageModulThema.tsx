import { View, Text, Image } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";  
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
const PageModulThema = ({userChoices, setUserChoices}) => {
  return (
    <View>
        <View className='items-center justiy-center'>
            <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 shadow-lg border-[1px] rounded-[10px] items-center justify-center z-10'>
                <Text className='font-semibold text-[15px] text-gray-100 text-center'>Zu welchen Themen soll ich das Modul erstellen?</Text>
            </View>
            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 shadow-lg '/>
            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px] shadow-lg'/>
            <Image source={require('../../../assets/Uncertain.gif')}  style={{height:150, width:150}}/>
        </View>
        <View className="rounded-[10px] p-1 bg-gray-900  border-gray-800 border-[1px] m-2 w-full max-w-[600px] h-[75px] items-center justify-center z-10"
            style={{height: 300, width: 600,shadowColor: "#2970ff", // Grau-Blauer Glow
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 10, // Für Android

            }}>
        <View className='w-full justify-start h-full'>
            <View className='flex-1 justify-between my-2 p-4'>
                <View>
                    <Text className='text-gray-300 font-semibold text-[15px]'>
                        Deine Themen:
                    </Text>
                    <View className='bg-[#0c111d] p-3 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg'
                        style={{
                        width: 60,
                        height: 60,
                        }}>
                        <Icon name="book-open" size={30} color="#4B5563" />
                    </View>
                </View>
                <View className='mx-2 mt-2'>
                    <GratisPremiumButton aditionalStyles={"rounded-[10px] mx-3 w-full "}>
                        <Text className='text-gray-700 font-semibold text-[15px]'>
                            Generieren
                        </Text>
                    </GratisPremiumButton>
                </View>
                </View>
            </View>  
        </View>
    </View>
  )
}

export default PageModulThema