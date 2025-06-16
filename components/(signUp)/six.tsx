import { View, Text } from 'react-native'
import React, { useState } from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import BotTopLeft from './(components)/botTopLeft'
import ProgressBar from './(components)/progressBar'
import SearchList from './(components)/searchList'
import BotBottomLeft from './botBottomLeft'

const StepSix = ({selectedKathegorie,LeibnizSubjects, schoolListDeutschland, message, selectedLanguage, languages, userData, setUserData, setSelectedSubjects, selectedSubjects, selectedDegree, selectedField , setSelectedField}) => {
    
    const noSubjectsList = [
  {
    "name": "Architektur & Stadtplanung",
    "type": "null",
    "faculty": "null",
    "kathegory": "Architektur & Stadtplanung"
  },
  {
    "name": "Bildende Kunst",
    "type": "null",
    "faculty": "null",
    "kathegory": "Bildende Kunst"
  },
  {
    "name": "Erziehungswissenschaften & Pädagogik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Erziehungswissenschaften & Pädagogik"
  },
  {
    "name": "Geistes- und Sozialwissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Geistes- und Sozialwissenschaften"
  },
  {
    "name": "Geowissenschaften & Umweltwissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Geowissenschaften & Umweltwissenschaften"
  },
  {
    "name": "Geschichte & Archäologie",
    "type": "null",
    "faculty": "null",
    "kathegory": "Geschichte & Archäologie"
  },
  {
    "name": "Informatik & Technik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Informatik & Technik"
  },
  {
    "name": "Kunst, Design & Medien",
    "type": "null",
    "faculty": "null",
    "kathegory": "Kunst, Design & Medien"
  },
  {
    "name": "Musik & Musikpädagogik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Musik & Musikpädagogik"
  },
  {
    "name": "Naturwissenschaften & Mathematik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Naturwissenschaften & Mathematik"
  },
  {
    "name": "Philosophie & Ethik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Philosophie & Ethik"
  },
  {
    "name": "Politikwissenschaft & Internationale Beziehungen",
    "type": "null",
    "faculty": "null",
    "kathegory": "Politikwissenschaft & Internationale Beziehungen"
  },
  {
    "name": "Rechtswissenschaften (Jura)",
    "type": "null",
    "faculty": "null",
    "kathegory": "Rechtswissenschaften (Jura)"
  },
  {
    "name": "Soziologie & Sozialwissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Soziologie & Sozialwissenschaften"
  },
  {
    "name": "Sportwissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Sportwissenschaften"
  },
  {
    "name": "Sprach- & Literaturwissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Sprach- & Literaturwissenschaften"
  },
  {
    "name": "Theologie & Religionswissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Theologie & Religionswissenschaften"
  },
  {
    "name": "Umwelt, Landwirtschaft & Nachhaltigkeit",
    "type": "null",
    "faculty": "null",
    "kathegory": "Umwelt, Landwirtschaft & Nachhaltigkeit"
  },
  {
    "name": "Umwelttechnik",
    "type": "null",
    "faculty": "null",
    "kathegory": "Umwelttechnik"
  },
  {
    "name": "Wirtschafts- und Rechtswissenschaften",
    "type": "null",
    "faculty": "null",
    "kathegory": "Wirtschafts- und Rechtswissenschaften"
  }
]
    
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
        const [ isVisible, setIsVisible ] = useState(true)
        
        return (
            <View className='h-full  w-full justify-between items-center py-5 '>
              <BotBottomLeft
                        message={selectedLanguage == null || message.robotMessageSchool[languages[selectedLanguage].code] == undefined ? message.robotMessageSchool["DE"] : message.robotMessageSchool[languages[selectedLanguage].code]}
                        imageSource="Waving"
                        spechBubbleStyle="bg-blue-500"
                        spBCStyle="max-w-[200px]"
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                    />
                <View className='w-full '>
                        <ProgressBar progress={85} handlePress={handlePress}/>
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
                if (selectedField.some((i) => i.name === item.name)) {
                    setSelectedField(selectedField.filter((subject) => subject.name != item.name));
                }
                else {
                    setSelectedField([...selectedField, item])
                }
            }     
                    const [ isVisible, setIsVisible ] = useState(true)
 
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
              <BotBottomLeft
                        message={selectedLanguage == null || message.robotMessageUniversity[languages[selectedLanguage].code] == undefined ? message.robotMessageUniversity["DE"] : message.robotMessageUniversity[languages[selectedLanguage].code]}
                        imageSource="Waving"
                        spechBubbleStyle="bg-blue-500"
                        spBCStyle="max-w-[200px]"       
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                    />
                <View className='w-full'>  
                    <ProgressBar progress={85} handlePress={handlePress}/>
                    </View> 
                    <SearchList data={
                         LeibnizSubjects[0][selectedDegree ? selectedDegree.name : "Others"].length == 0 ? 
                            noSubjectsList.filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase())) :
                        LeibnizSubjects[0][selectedDegree ? selectedDegree.name : "Others"].filter((item) => item.name.toLowerCase().includes(subjectFilter.toLowerCase()))
                    }
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