import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useGlobalContext } from '@/context/GlobalProvider'
const EudcationFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height, width } = useWindowDimensions()

    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
      
    const texts = {
        "DEUTSCH": {
            kathegory: "Kathegorie",
            subject: "Ausbildungsfach", 
        },
        "ENGLISH(US)": {
            kathegory: "Category",
            subject: "Subject", 
        },
        "ENGLISH(UK)": {
            kathegory: "Category",
            subject: "Subject", 
        },
        "AUSTRALIAN": {
            kathegory: "Category",
            subject: "Subject", 
        },
        "SPANISH": {
            kathegory: "Categoría",
            subject: "Asignatura", 
        },
    }
    //Algemeine Ausbildungdaten

    //Dynnamische Ausbildungdaten basierend auf dem Land
    const [ educationKathegorys, setEducationKathegorys ] = useState(ausbildungsTypen.map((type) => type.name.DE))
    const [ educationSubjects, setEducationSubjects ] = useState(ausbildungsListDeutschland[ausbildungsTypen[0].name.DE].map((subject) => subject.name))

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedEducationKathegory, setSelectedEducationKathegory] = useState([])
    const [ selectedEducationSubjects, setSelectedEducationSubjects] = useState([])

    const [ selectedFilter, setSelectedFilter] = useState(0)
  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
              <View className='w-full flex-row px-4 py-1'>
            {
                width < 450 ?
            <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 0 ? 3 : selectedFilter -1)} className='bg-gray-800 rounded-full p-2'>
                <Icon name="chevron-left" size={20} color={"white"}  />
            </TouchableOpacity>
                : null
            }
            {

                width > 450 || selectedFilter == 0 ?
        <DropDownList
            title={texts[selectedLanguage].kathegory}
            options={educationKathegorys.map((item) => item)}
            selectedOptions={selectedEducationKathegory}
            setSelectedOptions={(item)=> {
                setSelectedEducationKathegory(item)
                setEducationSubjects(ausbildungsListDeutschland[item].map((subject) => subject.name))
            }}
            height={height}
        />
        : null}
        {
            width > 450 || selectedFilter == 1 ?
        <DropDownList
            title={texts[selectedLanguage].subject}
            options={educationSubjects.map((item) => item)}
            selectedOptions={selectedEducationSubjects}
            setSelectedOptions={(item)=> {
                if (selectedEducationSubjects.includes(item)) {
                    setSelectedEducationSubjects(selectedEducationSubjects.filter((subject) => subject !== item))
                }
                else {
                    setSelectedEducationSubjects([...selectedEducationSubjects, item])
                }
            }}
            height={height}
        />
        : null}
            {
                width < 450 ?
            <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 3 ? 0 : selectedFilter +1)} className='bg-gray-800 rounded-full p-2'>
            <Icon name="chevron-right" size={20} color={"white"}  />
            </TouchableOpacity>
                : null
            }
        </View> 
    </View>
  )
}

export default EudcationFilters