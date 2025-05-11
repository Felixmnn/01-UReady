import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
//import Flag from "react-world-flags";
import CountryFlag from 'react-native-country-flag';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import ProgressBar from './(components)/progressBar';

const StepTwo = ({selectedLanguage, setSelectedLanguage, languages, userData, setUserData, name }) => {
    const [isActive, setIsActive] = useState(false)
    const continueButtonText = {
        "DE": "Weiter gehts",
        "GB": "Let's carry on!",
        "US": "Let's move on!",
        "AU": "Let’s keep moving!",
        "ES": "Vamos",
    }
    const robotMessage = {
        "DE": `Freut mich, dich kennenzulernen ${name}. In welcher Sprache wollen wir uns unterhalten?`,
        "GB": `Nice to meet you, ${name}. Which language would you like to speak?`,
        "US": `Nice to meet you, ${name}. What language do you wanna talk in?`,
        "AU": `G’day ${name}! Which language ya keen to chat in?`,
        "ES": `Encantado de conocerte, ${name}. ¿En qué idioma quieres hablar?`,
      };
      
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <ProgressBar percent={30} handlePress={()=> setUserData({...userData,signInProcessStep:"ONE"})}/>
                <View className='items-center justiy-center'>
                        <View className={`w-full ${Platform.OS === "web" ? "max-w-[310px]" : "max-w-[300px]"} px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10`}
                        >
                            <Text className='font-semibold text-[15px] text-gray-100 text-center'>{
                                selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]
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
                                    <CountryFlag isoCode={selectedLanguage == null ? "DE" : languages[selectedLanguage].code} style={{ width: 30, height: 18 }} />
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
                                            <CountryFlag isoCode={language.code} style={{ width: 30, height: 18 }} />
                                            <Text className='text-gray-300 font-semibold text-center ml-2 mt-[1px] '>{language.name}</Text>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                    ) : null}
                                </View>
                    </View>
            <View className='w-full max-w-[200px]'>
                <GratisPremiumButton aditionalStyles={"rounded-full w-full bg-blue-500 "} handlePress={()=> {
                    if (selectedLanguage == null) {
                        setSelectedLanguage(0);
                    }
                    setUserData({...userData,signInProcessStep:"THREE"});
                     setIsActive(false);
                    }}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{
                        selectedLanguage == null ? continueButtonText.DE : continueButtonText[languages[selectedLanguage].code]
                        }</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepTwo