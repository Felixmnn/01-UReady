import { View, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
const SchoolFilters = ({country=countryList[0], setFilters}) => {
    const { height,width } = useWindowDimensions()

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

    useEffect(() => {
        setFilters({
                creationCountry: country.name.toUpperCase(),
                kategoryType: "SCHOOL",
                creationRegion: selectedRegions,
                creationSchoolForm: selectedSchoolTypes,
                creationKlassNumber: selectedSchoolStages,
                creationSubject: selectedSchoolSubjects
            })
    },[selectedRegions,selectedSchoolTypes,selectedSchoolSubjects,selectedSchoolStages])

  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
        <RenderFilters  
            items={regions} 
            selectedItems={selectedRegions} 
            setSelectedItems={setSelectedRegions}
            multiselect={true}
            title={texts[selectedLanguage].region}
        />
        <RenderFilters  
            items={scholTypes} 
            selectedItems={selectedSchoolTypes} 
            setSelectedItems={setSelectedSchoolTypes}
            multiselect={true}
            title={texts[selectedLanguage].schoolform}
        />
        <RenderFilters  
            items={schoolSubjects} 
            selectedItems={selectedSchoolSubjects} 
            setSelectedItems={setSelectedSchoolSubjects}
            multiselect={true}
            title={texts[selectedLanguage].subject}
        />
        <RenderFilters  
            items={schoolStages} 
            selectedItems={selectedSchoolStages} 
            setSelectedItems={setSelectedSchoolStages}
            multiselect={true}
            title={texts[selectedLanguage].class}
        />
    </View>
  )
}

export default SchoolFilters