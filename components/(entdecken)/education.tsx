import { ScrollView, Text, TouchableOpacity, View,  useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import  languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import StaticFilters from './staticFilters'
const EudcationFilters = ({country=countryList[0], setFilters }) => {
    const { height, width } = useWindowDimensions()

    const {language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
    const texts = languages.education;
   
    //Algemeine Ausbildungdaten

    //Dynnamische Ausbildungdaten basierend auf dem Land
    const [ educationKathegorys, setEducationKathegorys ] = useState(ausbildungsTypen.map((type) => type.name.DE))
    const [ educationSubjects, setEducationSubjects ] = useState(ausbildungsListDeutschland[ausbildungsTypen[0].name.DE].map((subject) => subject.name))

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedEducationKathegory, setSelectedEducationKathegory] = useState(["Bau & Handwerk"])
    const [ selectedEducationSubjects, setSelectedEducationSubjects] = useState([])

    useEffect(() => {
        if (! educationKathegorys.includes(selectedEducationKathegory[0])) return;
        setEducationSubjects(ausbildungsListDeutschland[selectedEducationKathegory[0]].map((subject) => subject.name));
    }, [selectedEducationKathegory])
    useEffect(() => {
      console.log("Selected education subjects:", selectedEducationKathegory);
        setFilters({
            creationCountry: country.name.toUpperCase(),
            kategoryType: "EDUCATION",
            creationEducationKathegory: selectedEducationKathegory,
            creationEducationSubject: selectedEducationSubjects
        })
    },[selectedEducationKathegory, selectedEducationSubjects])

    
  return (
    <ScrollView className=' w-full  ' 
        style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: 'gray transparent', }}
    >
        <StaticFilters
            items={educationKathegorys}
            selectedItems={selectedEducationKathegory}
            setSelectedItems={setSelectedEducationKathegory}
            multiselect={false}
            title={texts[selectedLanguage].kathegory}
        />
        <StaticFilters
            items={educationSubjects}
            selectedItems={selectedEducationSubjects}
            setSelectedItems={setSelectedEducationSubjects}
            multiselect={true}
            title={texts[selectedLanguage].subject}
        />
    </ScrollView>
  )
}

export default EudcationFilters