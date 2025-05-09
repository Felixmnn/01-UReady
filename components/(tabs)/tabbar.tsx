import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';

const Tabbar = ({content,page, hide}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])

    const texts = {
        "DEUTSCH": {
            home: "Startseite",
            bibliothek: "Bibliothek",
            entdecken: "Entdecken",
            profil: "Profil",
            help: "Hilfe",
            share: "Teilen"
        },
        "ENGLISH(US)": {
            home: "Home",
            bibliothek: "Library",
            entdecken: "Discover",
            profil: "Profile",
            help: "Help",
            share: "Share"
        },
        "ENGLISH(UK)": {
            home: "Home",
            bibliothek: "Library",
            entdecken: "Discover",
            profil: "Profile",
            help: "Help",
            share: "Share"
        },
        "AUSTRALIAN": {
            home: "Home",
            bibliothek: "Library",
            entdecken: "Discover",
            profil: "Profile",
            help: "Help",
            share: "Share"
        },
        "SPANISH": {
            home: "Inicio",
            bibliothek: "Biblioteca",
            entdecken: "Descubrir",
            profil: "Perfil",
            help: "Ayuda",
            share: "Compartir"
        },
        // Weitere Sprachen hier hinzufügen
    };
    const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

    const tabbarIcon = (name, size, color, pageName, route) => {
        return <TouchableOpacity 
                onPress={() => router.push(route)}
                className={`m-2 items-center ${pageName === page.toLowerCase() ? 'w-[80px] bg-gray-800 border border-gray-600 border-[1px]' : null} rounded-md p-2 `}>
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
                <Image source={require('../../assets/bot.gif')} style={{width:50, height:50}}/>
                {tabbarIcon('home', 25, 'white', 'home',"/home")}
                {tabbarIcon('book', 25, 'white', 'bibliothek',"/bibliothek")}
                {tabbarIcon('search', 25, 'white', 'entdecken',"/entdecken")}
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