import { View, Text , Image, TouchableOpacity} from 'react-native'
import React, { useState } from 'react'
import { LeibnizSubjects, schoolListDeutschland } from '@/assets/exapleData/countryList'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FlatList, TextInput } from 'react-native-gesture-handler'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import BotTopLeft from './(components)/botTopLeft'
import ProgressBar from './(components)/progressBar'
import SearchList from './(components)/searchList'

const StepSix = ({selectedKathegorie, selectedLanguage, languages, userData, setUserData, setSelectedSubjects, selectedSubjects, selectedDegree, selectedField , setSelectedField}) => {
    const handlePress = () => {
        setUserData({...userData,signInProcessStep:"FIVE"})
        };

    const handleItemPress = (item) => {
        if (selectedSubjects.includes(item)) {
            setSelectedSubjects(selectedSubjects.filter((subject) => subject !== item))
        }
        else {
            setSelectedSubjects([...selectedSubjects, item])
        }
    }
    const robotMessage = {
        "DE":"Perfekt! In welchem Bereich machst du deine Ausbildung 1234?",
        "GB":"Perfect! In which field are you doing your apprenticeship?",
        "US":"Perfect! What field is your trade school or apprenticeship in?",
        "AU":"Perfect! What field’s your apprenticeship in?",
        "ES":"¡Perfecto! ¿En qué área estás haciendo tu formación profesional?",
        }
    const continueMessage = {
        "DE":"Fertig!",
        "GB":"Let's carry on!",
        "US":"Let's move on!",
        "AU":"Let’s keep moving!",
        "ES":"Vamos"
    }

    if (selectedKathegorie === "SCHOOL" || selectedKathegorie === "OTHER") {
        const [ subjectFilter, setSubjectFilter ] = useState("");
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
            
                <View className='w-full'>
                        <ProgressBar progress={85} handlePress={handlePress}/>
                        <BotTopLeft text={selectedLanguage == null || robotMessage[languages[selectedLanguage].code] == undefined ? robotMessage["DE"] : robotMessage[languages[selectedLanguage].code]} source={"../../assets/Check.gif"}/>     
                </View>
                <SearchList data={schoolListDeutschland.schoolSubjects.filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase()))}
                            handlePress={handleItemPress}
                            selectedItems={selectedSubjects}
                            filter={subjectFilter}
                            setFilter={setSubjectFilter}
                            />
            <View className='w-full max-w-[200px]'>

                    <GratisPremiumButton aditionalStyles={"rounded-full w-full "} handlePress={()=> {setUserData({...userData,signInProcessStep:"SEVEN"})}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{selectedLanguage == null || continueMessage[languages[selectedLanguage].code] == undefined ? continueMessage["DE"] : continueMessage[languages[selectedLanguage].code]}</Text>
                </GratisPremiumButton>  
            </View>
            </View>
        )
    }   
    
    else if (selectedKathegorie === "UNIVERSITY") {
        const [ subjectFilter, setSubjectFilter ] = useState("");
        const message = {
            "DE":"Perfekt! In welchem Bereich machst du deine Ausbildung 1234?",
            "GB":"Perfect! In which field are you doing your apprenticeship?",
            "US":"Perfect! What field is your trade school or apprenticeship in?",
            "AU":"Perfect! What field’s your apprenticeship in?",
            "ES":"¡Perfecto! ¿En qué área estás haciendo tu formación profesional?",
            }
        const continueMessage = {
            "DE":"Fertig!",
            "GB":"Let's carry on!",
            "US":"Let's move on!",
            "AU":"Let’s keep moving!",
            "ES":"Vamos"
        }
        const handlePress = () => {
            setUserData({...userData,signInProcessStep:"FIVE"})
            };
        const handleItemPress = (item) => {
                if (selectedField.includes(item)) {
                    setSelectedField(selectedField.filter((subject) => subject !== item))
                }
                else {
                    setSelectedField([...selectedField, item])
                }
            }      
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>  
                    <ProgressBar progress={85} handlePress={handlePress}/>
                    <BotTopLeft text={selectedLanguage == null || message[languages[selectedLanguage].code] == undefined ? message["DE"] : message[languages[selectedLanguage].code]} source={"../../assets/Check.gif"}/>
                </View> 
                    <SearchList data={LeibnizSubjects[0][selectedDegree ? selectedDegree.name : "Other"].filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase()))}
                                handlePress={handleItemPress}
                                selectedItems={selectedField}
                                filter={subjectFilter}
                                setFilter={setSubjectFilter}
                                />
            <View className='w-full max-w-[200px]'>
                    <GratisPremiumButton aditionalStyles={"rounded-full w-full "} handlePress={()=> {setUserData({...userData,signInProcessStep:"SEVEN"})}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{selectedLanguage == null || continueMessage[languages[selectedLanguage].code] == undefined ? continueMessage["DE"] : continueMessage[languages[selectedLanguage].code]}</Text>
                </GratisPremiumButton>  
            </View>
            </View>
        )
    }   
}

export default StepSix