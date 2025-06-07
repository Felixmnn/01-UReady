import { View, TouchableOpacity, useWindowDimensions, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'

const UniversityFilters = ({country=countryList[0], setFilters}) => {
  const { language } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])
  const texts = languages.university;
    
    //Allgemeine Universitätsdaten
    const abschlussziele = ["Bachelor", "Master", "Staatsexamen","Diplom","Magister","Other"]

    //Dynamische Universitätsdaten basierend auf dem Land
    const [ universityList, setUniversityList ] = useState(universityListDeutschland)
    const [ universityFacultys, setUniversityFacultys ] = useState(LeibnizFaculties)
    const [ universitySubjects, setUniversitySubjects ] = useState(LeibnizSubjects[0][abschlussziele[0]])

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedAbschlussziele, setSelectedAbschlussziele] = useState([])
    const [ selectedFacultys, setSelectedFacultys] = useState([])
    const [ selectedSubjects, setSelectedSubjects] = useState([])
    const [ selectedUniversity, setSelectedUniversity] = useState([])

    useEffect(() => {
      setFilters({
                creationCountry: country.name.toUpperCase(),
                kategoryType: "UNIVERSITY",
                creationUniversity: selectedUniversity,
                creationUniversityFaculty: selectedFacultys,
                creationUniversitySubject: selectedSubjects
      })
    },[selectedUniversity,selectedFacultys,selectedSubjects])

  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
        <RenderFilters
          items={universityList.map((item) => item.name)} 
          selectedItems={selectedUniversity} 
          setSelectedItems={setSelectedUniversity}
          multiselect={true}
          title={texts[selectedLanguage].universtity}
          />
        <RenderFilters
          items={universityFacultys}
          selectedItems={selectedFacultys}
          setSelectedItems={setSelectedFacultys}
          multiselect={true}
          title={texts[selectedLanguage].fakultät}
          />
        <RenderFilters
          items={abschlussziele} 
          selectedItems={selectedAbschlussziele} 
          setSelectedItems={setSelectedAbschlussziele}
          multiselect={true}
          title={texts[selectedLanguage].abschlussziel}
          />
        <RenderFilters
          items={universitySubjects.map((item) => item.name)} 
          selectedItems={selectedSubjects} 
          setSelectedItems={setSelectedSubjects}
          multiselect={true}
          title={texts[selectedLanguage].subject}
          />
    </View>
  )
}

export default UniversityFilters