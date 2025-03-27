import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Flag from "react-world-flags";
import Icon from 'react-native-vector-icons/FontAwesome5';
import GratisPremiumButton from '../(general)/gratisPremiumButton'

const StepTwo = ({selectedLanguage, setSelectedLanguage, languages, userData, setUserData, name }) => {
    const [isActive, setIsActive] = useState(false)

    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
                            <View className={`bg-blue-500 h-full w-[${30}%] rounded-full`} style={{width:`${30}%`}}/>
            </View>
                <View className='items-center justiy-center'>
                        <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                            <Text className='font-semibold text-[15px] text-gray-100 text-center'>{

                            selectedLanguage == null || languages[selectedLanguage].code == "DE"
                            ? `Freut mich, ${name}. In welcher Sprache wollen wir uns unterhalten`
                            : languages[selectedLanguage].code == "GB"
                            ? `Nice to meet you, ${name}. Which language would you like to speak?`
                            : languages[selectedLanguage].code == "US"
                            ? `Nice to meet you, ${name}. What language do you wanna talk in?`
                            : languages[selectedLanguage].code == "AU"
                            ? `G’day, ${name}! Which language ya keen to chat in?`
                            : languages[selectedLanguage].code == "ES"
                            ? `Encantado de conocerte, ${name}. ¿En qué idioma quieres hablar?`
                            : `Freut mich, ${name}. In welcher Sprache wollen wir uns unterhalten`
                            }</Text>
                        </View>
                            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
                            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
                            <Image source={require('../../assets/Language.gif')}  style={{height:150, width:150}}/>
                            <View>
                                <TouchableOpacity 
                                    onPress={() => setIsActive(!isActive)} 
                                    className='flex-row w-[150px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 my-2 items-center justify-center mx-1'
                                    >
                                    <Flag code={selectedLanguage == null ? "DE" : languages[selectedLanguage].code} style={{ width: 30, height: 18 }} />
                                    <Text className='text-gray-300 font-semibold text-center mx-2 mt-[1px]'>
                                        {selectedLanguage == null ? "Deutsch" : languages[selectedLanguage].name}
                                    </Text>
                                    <Icon name={!isActive ? "caret-down" : "caret-up"} size={20} color="#4B5563" />
                                </TouchableOpacity>

                                    {isActive ? (
                                    <View className='absolute top-[48px]  left-1 w-[150px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 z-10 shadow-lg'>
                                        {languages.map((language, index) => (
                                        <TouchableOpacity 
                                            key={index} 
                                            onPress={() => { setSelectedLanguage(index); setIsActive(false); }} 
                                            className='flex-row justify-start items-center p-2 rounded-lg m-1'
                                        >
                                            <Flag code={language.code} style={{ width: 30, height: 18 }} />
                                            <Text className='text-gray-300 font-semibold text-center ml-2 mt-[1px] '>{language.name}</Text>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                    ) : null}
                                </View>
                    </View>
            <View className='w-full max-w-[200px]'>
                <GratisPremiumButton aditionalStyles={"rounded-full w-full "} handlePress={()=> {setUserData({...userData,signInProcessStep:"THREE"}); setIsActive(false)}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{
                        selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Weiter gehts":
                        languages[selectedLanguage].code == "GB" ? "Let's carry on!":
                        languages[selectedLanguage].code == "US" ? "Let's move on!":
                        languages[selectedLanguage].code == "AU" ? "Let’s keep moving!":
                        languages[selectedLanguage].code == "ES" ? "Vamos":
                        "Weiter gehts"
                        }</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepTwo