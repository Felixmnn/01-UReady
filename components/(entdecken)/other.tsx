import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import { otherQuery } from '@/lib/appwriteQuerys'

const OtherFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height } = useWindowDimensions()

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
            title={"Fächer"}
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
        <View
            className='w-full bg-gray-500 border-gray-500 border-t-[1px] mt-2'
            style={{ zIndex: 0 }}
        />
    </View>
  )
}

export default OtherFilters