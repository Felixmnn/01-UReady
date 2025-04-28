import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ausbildungsListDeutschland, ausbildungsTypen, countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import Icon from 'react-native-vector-icons/FontAwesome5'
const EudcationFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height, width } = useWindowDimensions()

    //Algemeine Ausbildungdaten

    //Dynnamische Ausbildungdaten basierend auf dem Land
    const [ educationKathegorys, setEducationKathegorys ] = useState(ausbildungsTypen.map((type) => type.name.DE))
    const [ educationSubjects, setEducationSubjects ] = useState(ausbildungsListDeutschland[ausbildungsTypen[0].name.DE].map((subject) => subject.name))
    console.log("EducationSubjects",educationSubjects)

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
            title={"Ausbildungskathegorien"}
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