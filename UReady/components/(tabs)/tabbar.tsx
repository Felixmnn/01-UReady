import { View, Text, TouchableOpacity } from 'react-native'
import React, { Children } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tabbar = ({content,page, hide}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

    const tabbarIcon = (name, size, color, pageName, route) => {
        return <TouchableOpacity 
                onPress={() => router.push(route)}
                className={`m-2 items-center ${pageName === page ? 'w-[80px] bg-gray-800 border border-gray-600 border-[1px]' : null} rounded-md p-2 `}>
                    <Icon name={name} size={size} color={color}/>
                    <Text className='text-white text-[12px] '>{pageName}</Text>
                </TouchableOpacity>
        }

  return (
    <View className='bg-blue-500 flex-1'>
        { isVertical ?
        <View className='bg-gradient-to-b from-blue-800 to-[#0c111d] flex-1 py-3 pr-3 flex-row '>
            <View className='bg-gradient-to-b from-blue-800 to-[#0c111d] h-full w-[100px] items-center justify-between'>
                <View className='items-center my-1'>
                <View className='w-[50px] h-[50px] rounded-full bg-red-500'></View>
                {tabbarIcon('home', 25, 'white', 'Home',"/home")}
                {tabbarIcon('book', 25, 'white', 'Bibliothek',"/bibliothek")}
                {tabbarIcon('search', 25, 'white', 'Entdecken',"/entdecken")}
                {tabbarIcon('user', 25, 'white', 'Profil',"/profil")}
                </View>  
                <View className='items-center my-1'>
                    {tabbarIcon('question', 25, 'white', 'Hilfe')}
                    {tabbarIcon('share', 25, 'white', 'Teilen')}
                      
                </View >
            </View >
            <View className={`flex-1 rounded-[10px]  ${hide ? null : "bg-[#0c111d] border border-gray-700 border-w-[1px]"}`}>
                {content()}
            </View>
        </View>
            :
            <SafeAreaView className='flex-1 bg-gradient-to-b from-blue-700 to-[#0c111d] itmes-center justify-between'>
             {content()}
            </SafeAreaView>
        }
        
    </View>
  )
}

export default Tabbar