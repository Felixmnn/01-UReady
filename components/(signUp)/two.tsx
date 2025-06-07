import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import CountryFlag from 'react-native-country-flag';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import ProgressBar from './(components)/progressBar';
import BotCenter from './botCenter';

/**
 * Country selection
 * The User can select theur prefered language
 * selectedLanguage type int
 * Languages type : Array<{ name, code, enum }>
 */
const StepTwo = ({selectedLanguage, setSelectedLanguage, languages, userData, setUserData, continueButtonText, robotMessage }) => {
    console.log("Selcted Language", selectedLanguage)
    console.log("Languages", languages)
    const [isActive, setIsActive] = useState(false)
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <ProgressBar percent={30} handlePress={()=> setUserData({...userData,signInProcessStep:"ONE"})}/>
                <View className='items-center justiy-center'>
                    <BotCenter
                        message={selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]}
                        imageSource="Language"
                        spechBubbleStyle="bg-blue-500" 
                        spBCStyle="max-w-[200px]"
                        />


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
                                        <View className={`${Platform.OS == "web" ? "": "absolute top-[48px]"}  left-1 w-[150px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 z-50 shadow-lg`}>
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
            <View className='w-full max-w-[200px] z-0'>
                <GratisPremiumButton aditionalStyles={"rounded-full w-full bg-blue-500 z-0 "} handlePress={()=> {
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