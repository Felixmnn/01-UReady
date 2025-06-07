import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
import { ScrollView } from 'react-native-gesture-handler'
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
                kategoryType: ["OTHER","UNIVERSITY","EDUCATION","SCHOOL"],
                creationSubject: selectedOtherSubjects
            })
        },[selectedOtherSubjects])

    function handlePress(item) {
        if (selectedOtherSubjects.includes(item)) {
            setSelectedOtherSubjects(selectedOtherSubjects.filter((subject) => subject !== item))
        } else {
            setSelectedOtherSubjects([...selectedOtherSubjects, item])
        }
    }
  return (
    <ScrollView className=' w-full' style={{ scrollbarWidth: 'thin', 
                        scrollbarColor: 'gray transparent',}}>
      <Text className='text-[15px] font-bold mb-2 px-2 text-gray-300'>
        Subjects
      </Text>
      <View className='flex-row flex-wrap justify-start items-center w-full px-2 py-1 ml-2'>
      {
        otherSubjects.map((item, index) => {
          return (
            <TouchableOpacity key={index} className={`p-2 rounded-[5px] m-1 ${selectedOtherSubjects.includes(item) ? "bg-blue-500" : "bg-gray-500"}`} onPress={()=> handlePress(item)} >
              <Text>
                {item}
              </Text>
            </TouchableOpacity>
          )
        })
      }
      </View>
    </ScrollView>
  )
}

export default OtherFilters