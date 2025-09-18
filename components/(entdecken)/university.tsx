import { View, TouchableOpacity, useWindowDimensions, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
import StaticFilters from './staticFilters'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import { Filter } from 'react-native-svg'
import FilterPicker from './filterPicker'

const UniversityFilters = ({
  filters,
  setFilters
}:{
  filters: any,
  setFilters: any
}) => {
    
    //Allgemeine Universitätsdaten
    const abschlussziele = ["Bachelor", "Master", "Staatsexamen","Diplom","Magister","Others"]

    const { t } = useTranslation();
    const subjectsRaw = t("personalizeSix.universitySubjects", { returnObjects: true });
    const subjects: Array<{ name: string; icon?: string }> = Array.isArray(subjectsRaw) ? subjectsRaw : [];
    const filteredData = subjects.sort((a, b) => a.name.localeCompare(b.name));

    const univeristyDegreeType = t("universityCategories", { returnObjects: true });
    

    const degreeObject = t("universityCategories.degrees", { returnObjects: true });
    const keys = Object.keys(degreeObject);
    const degreeNames = keys.map((key) => degreeObject[key].name);

    const subjectObjects = t("universityCategories.universitySubjects", { returnObjects: true });
    const subjectKeys = Object.keys(subjectObjects);
    const subjectList = subjectKeys.map((key) => subjectObjects[key].name);
  
  return (
    <ScrollView className=' w-full  '>
      <FilterPicker
        title='Anschlussziel'
        options={degreeNames}
        selectedOptions={filters.universityDegreeType}
        handlePress={(option) => {
          console.log("Pressed: ", option)
          if (filters.universityDegreeType && filters.universityDegreeType.includes(option)) {
            setFilters({
              ...filters,
              universityDegreeType: filters.universityDegreeType.length > 1 ? filters.universityDegreeType.filter((item:string) => item !== option) : []
            })
          } else {
            setFilters({
              ...filters,
              universityDegreeType:filters.universityDegreeType ?  [...filters.universityDegreeType, option] : [option]
            })
          }
        }}
      />
      <FilterPicker
        title='Fachrichtung'
        options={subjectList}
        selectedOptions={filters.universityKategorie}
        handlePress={(option) => {
          console.log("Pressed: ", option)
          if (filters.universityKategorie && filters.universityKategorie.includes(option)) {
            setFilters({
              ...filters,
              universityKategorie: filters.universityKategorie.length > 1 ? filters.universityKategorie.filter((item:string) => item !== option) : []
            })
          } else {
            setFilters({
              ...filters,
              universityKategorie:filters.universityKategorie ?  [...filters.universityKategorie, option] : [option]
            })
          }
        }}
      />
      
    </ScrollView>
  )
}

export default UniversityFilters