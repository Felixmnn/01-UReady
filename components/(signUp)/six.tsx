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
        if (selectedKathegorie === "SCHOOL") {
        setUserData({...userData,signInProcessStep:"FIVE"})
        } else{
            setUserData({...userData,signInProcessStep:"THREE"})

        };
    }

    const handleItemPress = (item) => {
        if (selectedSubjects.includes(item)) {
            setSelectedSubjects(selectedSubjects.filter((subject) => subject !== item))
        }
        else {
            setSelectedSubjects([...selectedSubjects, item])
        }
    }
    const robotMessage = {
        "DE":"Nur noch eins: Welche Fächer darf ich für dich eintragen?",
        "GB": "Just one more thing: Which subjects should I add for you?",
        "US": "Just one more thing: Which subjects would you like me to add for you?",
        "AU": "Just one more thing: Which subjects do you want me to add for you?",
        "ES": "Solo una cosa más: ¿Qué asignaturas quieres que añada para ti?",
        }
    const continueMessage = {
        "DE":"Los geht’s!“",
        "GB":"Let's go!",
        "US":"Let's go!",
        "AU":"Let's go!",
        "ES":"¡Vamos!"
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
            "DE":"Fast geschafft! Was genau studierst du?",
            "GB":"Just one last thing before we finish! What’s your program or field of study?",
            "US":"Almost there! What’s your major or area of study?",
            "AU":"You're almost done! What’s your course or field of study?",
            "ES":"¡Casi terminado! ¿En qué programa o área estás estudiando?",
            }
            const continueMessage = {
                "DE":"Los geht’s!“",
                "GB":"Let's go!",
                "US":"Let's go!",
                "AU":"Let's go!",
                "ES":"¡Vamos!"
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