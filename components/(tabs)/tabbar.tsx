import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import  languages  from '@/assets/exapleData/languageTabs.json';

const Tabbar = ({content,page, hide}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
      const texts = languages.tabbar;
    
    const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

    const tabbarIcon = (name, size, color, pageName, route) => {
        return <TouchableOpacity 
                onPress={() => router.push(route)}
                className={`m-2 items-center ${pageName === page.toLowerCase() ? 'w-[80px] bg-gray-800 border border-gray-600 border-[1px]' : ""} rounded-md p-2 `}>
                    <Icon name={name} size={size} color={color}/>
                    <Text className='text-white text-[12px] '>{texts[selectedLanguage][pageName]}</Text>
                </TouchableOpacity>
        }

  return (
    <View className='bg-[#0c111d] flex-1'>
        { isVertical ?
        <View className='bg-gradient-to-b from-blue-800 to-[#0c111d] flex-1 py-3 pr-3 flex-row '>
            <View className='bg-gradient-to-b from-blue-800 to-[#0c111d] h-full w-[100px] items-center justify-between'>
                <View className='items-center my-1'>
                {tabbarIcon('home', 25, 'white', 'home',"/home")}
                {tabbarIcon('book', 25, 'white', 'bibliothek',"/bibliothek")}
                {tabbarIcon('search', 25, 'white', 'entdecken',"/entdecken")}
                {tabbarIcon('store', 25, 'white', 'shop',"/shop")}
                {tabbarIcon('user', 25, 'white', 'profil',"/profil")}



                </View>  
                <View className='items-center my-1'>
                    {tabbarIcon('question', 25, 'white', 'profil',"/profil")}
                    {tabbarIcon('share', 25, 'white', 'profil',"/profil")}
                      
                </View >
            </View >
            <View className={`flex-1 rounded-[10px]  ${hide ? null : "bg-gradient-to-b from-[#001450] to-[#0c111e] border border-gray-700 border-w-[1px]"}`}>
                {content()}
            </View>
        </View>
            :
            <SafeAreaView className='flex-1 bg-gradient-to-b from-[#001450] to-[#0c111e] itmes-center justify-between'>
             {content()}
            </SafeAreaView>
        }
        
    </View>
  )
}

export default Tabbar