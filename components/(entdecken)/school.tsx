import { View, useWindowDimensions, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import StaticFilters from './staticFilters'
import { useTranslation } from 'react-i18next'
import FilterPicker from './filterPicker'
const SchoolFilters = ({
  country=countryList[0], 
  setFilters,
  filters
}:{
    country: {name: string, code: string},
    setFilters: (filters: any) => void,
    filters: any
}) => {
    const { t } = useTranslation();


    const grades = ["1","2","3","4","5","6","7","8","9","10","11","12","13"]
    const schoolTypesRaw = ["grundschule","hauptschule","realschule","gesamtschule","gymnasium","berufsschule","sonstige"]
    const schoolTypeObj = schoolTypesRaw.map((type) =>
      t(`school.type.${type}`, { returnObjects: true })
    );    
    
    const subjectKeys = ["mathematik","deutsch","englisch","biologie","chemie","physik","geschichte","geographie","politik","musik","kunst","sport","informatik","wirtschaftslehre","religion"]
    const subjectList = t("school.subjects", { returnObjects: true });
    console.log("subjectList", subjectList)
    const subjects = Object.values(subjectList).map((s: any) => s.name);

    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
    const texts = languages.school;
    


    //Algemeine Schuldaten

    //Dynnamische Schuldaten basierend auf dem Land
    const [ regions, setRegions ] = useState(schoolListDeutschland.regions.map((region) => region.name))
    const [ scholTypes, setScholTypes ] = useState(schoolListDeutschland.schoolTypes.map((type) => type.name))
    const [ schoolSubjects, setSchoolSubjects ] = useState(schoolListDeutschland.schoolSubjects.map((subject) => subject.name))
    const [ schoolStages, setSchoolStages ] = useState(schoolListDeutschland.schoolStages)

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedRegions, setSelectedRegions] = useState([])
    const [ selectedSchoolTypes, setSelectedSchoolTypes] = useState([])
    const [ selectedSchoolSubjects, setSelectedSchoolSubjects] = useState([])
    const [ selectedSchoolStages, setSelectedSchoolStages] = useState([])

    
    
  return (
    <ScrollView className=' w-full  '>
        <FilterPicker
            title='Schulform'
            options={schoolTypeObj.map((type) => type.title)}
            selectedOptions={filters.schoolType}
            handlePress={(type)=>{
              console.log("type", type, filters.schoolType)
              if (!filters.schoolType) {setFilters({...filters, schoolType: [type]}) ;return;}
              if (filters.schoolType && filters.schoolType.includes(type)) {
                setFilters({...filters, schoolType: filters.schoolType.filter((t: string) => t !== type)});
              } else {
                setFilters({...filters, schoolType: [...filters.schoolType, type]});
              }
            }}
        />

        <FilterPicker
          title="Klassen"
          options={grades}
          selectedOptions={filters.schoolGrades}
          handlePress={(type)=>{
            console.log("type", type, filters.schoolGrades)
            if (!filters.schoolGrades) {setFilters({...filters, schoolGrades: [type]}) ;return;}
            if (filters.schoolGrades && filters.schoolGrades.includes(type)) {
              setFilters({...filters, schoolGrades: filters.schoolGrades.filter((t: string) => t !== type)});
            } else {
              setFilters({...filters, schoolGrades: [...filters.schoolGrades, type]});
            }
          }}
        />

        <FilterPicker
            title='Fächer'
            options={subjects}
            selectedOptions={filters.schoolSubjects}
            handlePress={(type)=>{
              if (!filters.schoolSubjects) {setFilters({...filters, schoolSubjects: [type]}) ;return;}
              if (filters.schoolSubjects && filters.schoolSubjects.includes(type)) {
                setFilters({...filters, schoolSubjects: filters.schoolSubjects.filter((t: string) => t !== type)});
              } else {
                setFilters({...filters, schoolSubjects: [...filters.schoolSubjects, type]});
              }
            }}
        />
    </ScrollView>
  )
}

export default SchoolFilters