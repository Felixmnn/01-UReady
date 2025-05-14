import { View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import { otherQuery } from '@/lib/appwriteQuerys'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
const OtherFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height } = useWindowDimensions()

    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
    const texts = languages.other;
    
    //Algemeine Schuldaten

    //Dynnamische Schuldaten basierend auf dem Land
    const [ otherSubjects, setOtherSubjects ] = useState(schoolListDeutschland.schoolSubjects.map((subject) => subject.name))

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedOtherSubjects, setSelectedOtherSubjects] = useState([])

    useEffect(() => {
            async function fetchData() {
                setLoading(true)
                const query = {
                    creationCountry: country.name,
                    creationSubject: selectedOtherSubjects
                }
                try {
                    const res = await otherQuery(query);
                    if (res) {
                      setModules(res);
                    } else {
                      setModules([]);
                    }
                  } catch (e) {
                    console.error("Fehler bei Datenfetch:", e);
                    setModules([]);
                  }
                setLoading(false)
            }
            fetchData()
            
    
        },[selectedOtherSubjects])

  return (
    <View className=' w-full' style={{ position: "relative" /* Wichtig! */ }}>
        <View className='flex-row' style={{  paddingHorizontal:11,zIndex: 1, position: 'relative', }}>
        <DropDownList
            title={texts[selectedLanguage].subjects}
            options={otherSubjects.map((item) => item)}
            selectedOptions={selectedOtherSubjects}
            setSelectedOptions={(item)=> {
                if (selectedOtherSubjects.includes(item)) {
                    setSelectedOtherSubjects(selectedOtherSubjects.filter((type) => type !== item))
                }
                else {
                    setSelectedOtherSubjects([...selectedOtherSubjects, item])
                }
            }}
            height={height}
            />
        </View> 
        
    </View>
  )
}

export default OtherFilters