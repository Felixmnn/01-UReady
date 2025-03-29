import { View, Text, ActivityIndicator, Image } from 'react-native'
import React from 'react'

const PageDiscover = ({userChoices, setUserChoices}) => {
  return (
    <View>
        <View className='items-center justiy-center'>
            <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                <Text className='font-semibold text-[15px] text-gray-100 text-center'>Gib mir einen Moment...</Text>
            </View>
            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
            <Image source={require('../../assets/Search.gif')}  style={{height:150, width:150}}/>
        </View>
        <View className="rounded-[10px] p-1 bg-gray-900  border-gray-800 border-[1px] m-2 w-full max-w-[600px] h-[75px] items-center justify-center z-10"
            style={{height: 500, width: 800,shadowColor: "#2970ff", // Grau-Blauer Glow
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 10, // Für Android
            }}>
            <View className='w-full h-full items-ceter justify-center'>
                <View className='flex-row items-center justify-center '>
                    <ActivityIndicator size="small" color="#20c1e1" />
                    <Text className='text-gray-100 font-semibold text-[15px] m-2'>Suche läuft...</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default PageDiscover