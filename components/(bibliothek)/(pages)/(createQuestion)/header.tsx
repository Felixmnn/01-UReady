import { View, Text,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';

const Header = ({setSelected, moduleName, ungespeichert }) => {
  const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.editQuestions;
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])
  return (
    <View className='flex-row justify-between items-center p-3 bg-gray-800  w-full rounded-t-[10px]'>
        <View className='flex-row items-center'>
            <TouchableOpacity onPress={()=> setSelected("SingleModule")} >
                <Icon name="arrow-left" size={20} color="white"/>
            </TouchableOpacity>
            <View className='items-start justify-center ml-3'>
                <Text className='text-white font-bold'>{texts[selectedLanguage].quizFor} "{moduleName}" {texts[selectedLanguage].create}</Text>
                <Text className='text-gray-500 text-[12px]'> {ungespeichert? texts[selectedLanguage].unsavedChanges : texts[selectedLanguage].allChangesSaved}</Text>
            </View>
        </View>
    </View>
  )
}

export default Header