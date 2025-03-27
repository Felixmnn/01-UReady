import { View, Text,Image } from 'react-native'
import React from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'

const StepZero = ({userData, setUserData}) => {
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
                <View className={`bg-blue-500 h-full w-[${10}%] rounded-full`} style={{width:`${10}%`}}/>
            </View>
            <View className='items-center justiy-center'>
                <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                    <Text className='font-semibold text-[15px] text-gray-100 text-center'> Moin! Ich bin Bob. Ich helfe dir dabei, deine App so zu personalisieren, dass du direkt durchstarten kannst.</Text>
                </View>
                    <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
                    <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
                    <Image source={require('../../assets/Waving.gif')}  style={{height:150, width:150}}/>
            </View>
            <View className='w-full max-w-[200px]'>
                <GratisPremiumButton aditionalStyles={"rounded-full w-full "} handlePress={()=> setUserData({...userData,signInProcessStep:"ONE"})}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>Los geht's</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepZero