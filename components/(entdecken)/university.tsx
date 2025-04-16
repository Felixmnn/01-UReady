import { View, Text, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import OptionSelector from '../(tabs)/optionSelector'
import SwichTab from '../(tabs)/swichTab'
import { universityQuery } from '@/lib/appwriteQuerys'
import DropDownList from './dropDownList'

const UniversityFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height } = useWindowDimensions();

    //Allgemeine Universitätsdaten
    const abschlussziele = ["Bachelor", "Master", "Staatsexamen","Diplom","Magister","Other"]

    //Dynamische Universitätsdaten basierend auf dem Land
    const [ universityList, setUniversityList ] = useState(universityListDeutschland)
    const [ universityFacultys, setUniversityFacultys ] = useState(LeibnizFaculties)
    const [ universitySubjects, setUniversitySubjects ] = useState(LeibnizSubjects[0][abschlussziele[0]])

    //Dynamische Filter basierend auf den User eingaben
    const [ textInput, setTextInput ] = useState("");
    const [ selectedAbschlussziele, setSelectedAbschlussziele] = useState([abschlussziele[0]])
    const [ selectedFacultys, setSelectedFacultys] = useState([])
    const [ selectedSubjects, setSelectedSubjects] = useState([])
    const [ selectedUniversity, setSelectedUniversity] = useState([universityListDeutschland[0].name])


    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const query = {
                creationCountry: country.name,
                creationUniversity: selectedUniversity,
                creationUniversityFaculty: selectedFacultys,
                creationUniversitySubject: selectedSubjects
            }
            try {
                const res = await universityQuery(query);
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
        

    },[selectedUniversity,selectedFacultys,selectedSubjects])

  return (
    <View className=' w-full' style={{ position: "relative" /* Wichtig! */ }}>
        <View className='flex-row' style={{  paddingHorizontal:11,zIndex: 1, position: 'relative', }}>
        <DropDownList
        title={"Universität"}
        options={universityList.map((item) => item.name)}
        selectedOptions={selectedUniversity}
        setSelectedOptions={()=> {}}
        height={height}
        />
        <DropDownList
        title={"Abschlussziel"}
        options={abschlussziele.map((item) => item)}
        selectedOptions={selectedAbschlussziele}
        setSelectedOptions={(item)=> {setSelectedAbschlussziele(item)}}
        />
        <DropDownList
        title={"Fakultät"}
        options={universityFacultys}
        selectedOptions={selectedFacultys}
        setSelectedOptions={(item)=> {
            if (selectedFacultys.includes(item)) {
                setSelectedFacultys(selectedFacultys.filter((i) => i !== item));
              }
              else {
                setSelectedFacultys([...selectedFacultys, item]);
              }
        }}
        />
        <DropDownList
        title={"Subjects"}
        options={universitySubjects.map((item) => item.name)}
        selectedOptions={selectedSubjects}
        setSelectedOptions={(item)=> {
            if (selectedSubjects.includes(item)) {
                setSelectedSubjects(selectedSubjects.filter((i) => i !== item));
              }
              else {
                setSelectedSubjects([...selectedSubjects, item]);
              }
        }}
        />
        </View> 
        <View
            className='w-full bg-gray-500 border-gray-500 border-t-[1px] mt-2'
            style={{ zIndex: 0 }}
        />
    </View>
  )
}

export default UniversityFilters