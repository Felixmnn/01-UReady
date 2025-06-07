import { View,  useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import  languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
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
    const [ selectedEducationKathegory, setSelectedEducationKathegory] = useState([])
    const [ selectedEducationSubjects, setSelectedEducationSubjects] = useState([])

    useEffect(() => {
        setFilters({
            creationCountry: country.name.toUpperCase(),
            kategoryType: "EDUCATION",
            creationEducationKathegory: selectedEducationKathegory,
            creationEducationSubject: selectedEducationSubjects
        })
    },[selectedEducationKathegory, selectedEducationSubjects])

  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
        <RenderFilters
                items={educationKathegorys}
                selectedItems={selectedEducationKathegory}
                setSelectedItems={setSelectedEducationKathegory}
                title={texts[selectedLanguage].kathegory}
                multiselect={true}
            />
            <RenderFilters
                items={educationSubjects}
                selectedItems={selectedEducationSubjects}
                setSelectedItems={setSelectedEducationSubjects}
                title={texts[selectedLanguage].subject}
                multiselect={true}
            />  
    </View>
  )
}

export default EudcationFilters