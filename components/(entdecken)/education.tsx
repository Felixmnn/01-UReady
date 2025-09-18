import { ScrollView, Text, TouchableOpacity, View,  useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import  languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
import Icon from 'react-native-vector-icons/FontAwesome5'
import StaticFilters from './staticFilters'
import FilterPicker from './filterPicker'
import { useTranslation } from 'react-i18next'
const EudcationFilters = ({
  filters,
  setFilters
}:{
  filters: any,
  setFilters: any
}) => {
  const { t } = useTranslation();
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



    const eduObjects = t("education.educationKategories", { returnObjects: true });
    const eduKeys = Object.keys(eduObjects);
    const eduList = eduKeys.map((key) => eduObjects[key].name);

    const indexOfKathegory = eduKeys.findIndex((key) => eduObjects[key].name === (filters.educationKathegory && filters.educationKathegory.length > 0 ? filters.educationKathegory[0] : ""));
    const keyOfKathegory = indexOfKathegory !== -1 ? eduKeys[indexOfKathegory] : null;
    const eduSubObjects = t(`education.educationSubjects.${keyOfKathegory}`, { returnObjects: true });
    const eduSubKeys = Object.keys(eduSubObjects);
    const eduSubList = eduSubKeys.map((key) => eduSubObjects[key].name);
  return (
    <ScrollView className=' w-full  ' 
        style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: 'gray transparent', }}
    >
      <FilterPicker
        title='Anschlussziel'
        options={eduList}
        selectedOptions={filters.educationKathegory}
        handlePress={(option) => {
          if (filters.educationKathegory && filters.educationKathegory.includes(option)) {
            setFilters({
              ...filters,
              educationKathegory: []
            })
          } else {
            setFilters({
              ...filters,
              educationKathegory:  [ option] 
            })
          }
        }}
      />
      {filters.educationKathegory && filters.educationKathegory.length > 0 &&
      <FilterPicker
        title='Fachrichtung'
        options={eduSubList}
        selectedOptions={filters.educationSubject}
        handlePress={(option) => {
          if (filters.educationSubject && filters.educationSubject.includes(option)) {
            setFilters({
              ...filters,
              educationSubject:filters.educationSubject && filters.educationSubject.length > 0 ? filters.educationSubject.filter((item:string) => item !== option) : []
            })
          } else {

            setFilters({
              ...filters,
              educationSubject: filters.educationSubject && filters.educationSubject.length > 0 ?  [...filters.educationSubject, option]  : [option]
            })
          }
        }}
      />
      }

    </ScrollView>
  )
}

export default EudcationFilters