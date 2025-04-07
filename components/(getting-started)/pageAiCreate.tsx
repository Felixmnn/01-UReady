import { View, Text, Image } from 'react-native'
import React from 'react'
import ContinueBox from '../(signUp)/(components)/continueBox'

const PageAiCreate = ({userChoices, setUserChoices}) => {
  return (
    <View>
        <View className='items-center justiy-center'>
            <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                <Text className='font-semibold text-[15px] text-gray-100 text-center'>Auf welcher Grundlage soll dein Lernset erstellt werden?</Text>
            </View>
            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
            <Image source={require('../../assets/Uncertain.gif')}  style={{height:150, width:150}}/>
        </View>
        <View className="flex-row">
            <ContinueBox text={"Erstelle ein Modul zu einem Text"} colorBorder={"#7a5af8"} colorBG={"#372292"} iconName={"pen"} handlePress={()=> setUserChoices("TEXTBASED")}/>
            <ContinueBox text={"Erstelle ein Modul zu einem Thema"} colorBorder={"#20c1e1"} colorBG={"#0d2d3a"} iconName={"layer-group"} handlePress={()=> setUserChoices("THEMENBASED")}/>
            <ContinueBox text={"Erstelle ein Modul aus einer Datei"} colorBorder={"#4f9c19"} colorBG={"#2b5314"} iconName={"file"} handlePress={()=> setUserChoices("DOCUMENTBASED")}/>

        </View>
    </View>
  )
}

export default PageAiCreate