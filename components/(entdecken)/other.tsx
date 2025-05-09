import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import { otherQuery } from '@/lib/appwriteQuerys'
import { useGlobalContext } from '@/context/GlobalProvider'

const OtherFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height } = useWindowDimensions()

    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])

    const texts = {
      "DEUTSCH": {
        subjects: "Fächer",

    },
      "ENGLISH(US)": {
        subjects: "Subjects",
      },
      "ENGLISH(UK)": {
        subjects: "Subjects",
      },
      "AUSTRALIAN": {
        subjects: "Subjects",
      },
      "SPANISH": {
        subjects: "Asignaturas",
      },
    }
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
                    console.log(res)
                    if (res) {
                      setModules(res);
                    } else {
                      setModules([]);
                    }
                  } catch (e) {
                    console.error("Fehler bei Datenfetch:", e);
                    setModules([]);
                  }
                console.log("Query",query)
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