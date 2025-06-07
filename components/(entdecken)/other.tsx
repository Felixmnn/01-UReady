import { View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
const OtherFilters = ({country=countryList[0], setFilters}) => {
    const { height,width } = useWindowDimensions()

    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
    const texts = languages.other;
    
    //Dynnamische Schuldaten basierend auf dem Land
    const [ otherSubjects, setOtherSubjects ] = useState(schoolListDeutschland.schoolSubjects.map((subject) => subject.name))

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedOtherSubjects, setSelectedOtherSubjects] = useState([])

    useEffect(() => {
        setFilters({
                creationCountry: country.name.toUpperCase(),
                kategoryType: "OTHER",
                creationOtherSubjects: selectedOtherSubjects
            })
        },[selectedOtherSubjects])

  return (
    <View className=' w-full' style={{ position: "relative" /* Wichtig! */ }}>
      <RenderFilters
            items={otherSubjects.map((item) => item)}
            selectedItems={selectedOtherSubjects}
            multiselect={true}
            setSelectedItems={(item)=> {
                if (selectedOtherSubjects.includes(item)) {
                    setSelectedOtherSubjects(selectedOtherSubjects.filter((type) => type !== item))
                }
                else {
                    setSelectedOtherSubjects([...selectedOtherSubjects, item])
                }
            }}
            title={texts[selectedLanguage].subjects}
        />
    </View>
  )
}

export default OtherFilters