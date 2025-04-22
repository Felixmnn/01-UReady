import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import { schoolQuery } from '@/lib/appwriteQuerys'

const SchoolFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height,width } = useWindowDimensions()

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
            async function fetchData() {
                setLoading(true)
                const query = {
                    creationCountry: country.name,
                    region: selectedRegions,
                    creationSchoolForm: selectedSchoolTypes,
                    creationKlassNumber: selectedSchoolStages,
                    creationSubject: selectedSchoolSubjects
                }
                try {
                    const res = await schoolQuery(query);
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
            
    
        },[selectedRegions,selectedSchoolTypes,selectedSchoolSubjects,selectedSchoolStages])

  return (
    <View className=' w-full' style={{ position: "relative" /* Wichtig! */ }}>
        <View className='flex-row' style={{  paddingHorizontal:11,zIndex: 1, position: 'relative', }}>
        <DropDownList
            title={"Region"}
            options={regions.map((item) => item)}
            selectedOptions={selectedRegions}
            setSelectedOptions={(item)=> {
                if (selectedRegions.includes(item)) {
                    setSelectedRegions(selectedRegions.filter((type) => type !== item))
                }
                else {
                    setSelectedRegions([...selectedRegions, item])
                }
            }}
            height={height}
            />
        <DropDownList
            title={"Schulform"}
            options={scholTypes.map((item) => item)}
            selectedOptions={selectedSchoolTypes}
            setSelectedOptions={(item)=> {
                if (selectedSchoolTypes.includes(item)) {
                    setSelectedSchoolTypes(selectedSchoolTypes.filter((type) => type !== item))
                }
                else {
                    setSelectedSchoolTypes([...selectedSchoolTypes, item])
                }
            }}
            height={height}
            />
        <DropDownList
            title={"Fächer"}
            options={schoolSubjects.map((item) => item)}
            selectedOptions={selectedSchoolSubjects}
            setSelectedOptions={(item)=> {
                if (selectedSchoolSubjects.includes(item)) {
                    setSelectedSchoolSubjects(selectedSchoolSubjects.filter((type) => type !== item))
                }
                else {
                    setSelectedSchoolSubjects([...selectedSchoolSubjects, item])
                }
            }}
            height={height}
            />
        <DropDownList
            title={"Klasse"}
            options={schoolStages.map((item) => item)}
            selectedOptions={selectedSchoolStages}
            setSelectedOptions={(item)=> {
                if (selectedSchoolStages.includes(item)) {
                    setSelectedSchoolStages(selectedSchoolStages.filter((type) => type !== item))
                }
                else {
                    setSelectedSchoolStages([...selectedSchoolStages, item])
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

export default SchoolFilters