import { View, Text, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'

const EudcationFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height } = useWindowDimensions()

    //Algemeine Ausbildungdaten

    //Dynnamische Ausbildungdaten basierend auf dem Land
    const [ educationKathegorys, setEducationKathegorys ] = useState(ausbildungsTypen.map((type) => type.name.DE))
    const [ educationSubjects, setEducationSubjects ] = useState(ausbildungsListDeutschland[ausbildungsTypen[0].name.DE].map((subject) => subject.name))
    console.log("EducationSubjects",educationSubjects)

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedEducationKathegory, setSelectedEducationKathegory] = useState([])
    const [ selectedEducationSubjects, setSelectedEducationSubjects] = useState([])

  return (
    <View className=' w-full' style={{ position: "relative" /* Wichtig! */ }}>
        <View className='flex-row' style={{  paddingHorizontal:11,zIndex: 1, position: 'relative', }}>
        <DropDownList
            title={"Ausbildungskathegorien"}
            options={educationKathegorys.map((item) => item)}
            selectedOptions={selectedEducationKathegory}
            setSelectedOptions={(item)=> {
                setSelectedEducationKathegory(item)
                setEducationSubjects(ausbildungsListDeutschland[item].map((subject) => subject.name))
            }}
            height={height}
        />
        <DropDownList
            title={"Ausbildungsfächer"}
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
        </View> 
        <View
            className='w-full bg-gray-500 border-gray-500 border-t-[1px] mt-2'
            style={{ zIndex: 0 }}
        />
    </View>
  )
}

export default EudcationFilters