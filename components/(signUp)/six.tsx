import { View, Text } from 'react-native'
import React, { useState } from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import BotTopLeft from './(components)/botTopLeft'
import ProgressBar from './(components)/progressBar'
import SearchList from './(components)/searchList'

const StepSix = ({selectedKathegorie,LeibnizSubjects, schoolListDeutschland, message, selectedLanguage, languages, userData, setUserData, setSelectedSubjects, selectedSubjects, selectedDegree, selectedField , setSelectedField}) => {
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
    if (selectedKathegorie === "SCHOOL" || selectedKathegorie === "OTHER") {
        const [ subjectFilter, setSubjectFilter ] = useState("");
        return (
            <View className='h-full  w-full justify-between items-center py-5 '>
                <View className='w-full '>
                        <ProgressBar progress={85} handlePress={handlePress}/>
                        <BotTopLeft text={selectedLanguage == null || message.robotMessageSchool[languages[selectedLanguage].code] == undefined ? message.robotMessageSchool["DE"] : message.robotMessageSchool[languages[selectedLanguage].code]} source={"../../assets/Check.gif"}/>     
                </View>
                <SearchList data={schoolListDeutschland.schoolSubjects.filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase()))}
                            handlePress={handleItemPress}
                            selectedItems={selectedSubjects}
                            filter={subjectFilter}
                            setFilter={setSubjectFilter}
                            abschlussziel='Deine Fächer'
                            />
            <View className='w-full max-w-[200px]'>
                <GratisPremiumButton aditionalStyles={"rounded-full w-full bg-blue-500 mt-2 "} handlePress={()=> {setUserData({...userData,signInProcessStep:"SEVEN"})}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{selectedLanguage == null || message.continueMessage[languages[selectedLanguage].code] == undefined ? message.continueMessage["DE"] : message.continueMessage[languages[selectedLanguage].code]}</Text>
                </GratisPremiumButton>  
            </View>
            </View>
        )
    }   
    
    else if (selectedKathegorie === "UNIVERSITY") {
        const [ subjectFilter, setSubjectFilter ] = useState("");
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
                    <BotTopLeft text={selectedLanguage == null || message.robotMessageUniversity[languages[selectedLanguage].code] == undefined ? message["DE"] : message.robotMessageUniversity[languages[selectedLanguage].code]} source={"../../assets/Check.gif"}/>
                </View> 
                    <SearchList data={LeibnizSubjects[0][selectedDegree ? selectedDegree.name : "Others"].filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase()))}
                                handlePress={handleItemPress}
                                selectedItems={selectedField}
                                filter={subjectFilter}
                                setFilter={setSubjectFilter}
                                />
            <View className='w-full max-w-[200px] mt-3'>
                    <GratisPremiumButton aditionalStyles={"rounded-full w-full bg-blue-500  "} handlePress={()=> {setUserData({...userData,signInProcessStep:"SEVEN"})}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{selectedLanguage == null || message.continueMessage[languages[selectedLanguage].code] == undefined ? message.continueMessage["DE"] : message.continueMessage[languages[selectedLanguage].code]}</Text>
                </GratisPremiumButton>  
            </View>
            </View>
        )
    }   
}

export default StepSix