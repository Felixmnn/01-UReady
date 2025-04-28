import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList'
import DropDownList from './dropDownList'
import { schoolQuery } from '@/lib/appwriteQuerys'
import Icon from 'react-native-vector-icons/FontAwesome5'

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

        const [selectedFilter, setSelectedFilter] = useState(0)
  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
          <View className='w-full flex-row px-4 py-1'>
            {
                width < 600 ?
            <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 0 ? 3 : selectedFilter -1)} className='bg-gray-800 rounded-full p-2'>
            <Icon name="chevron-left" size={20} color={"white"}  />
            </TouchableOpacity>
                : null
            }
            {
            selectedFilter == 0 || width > 600 || (selectedFilter == 3 && width > 400) ? 
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
            : null}
        {    
        selectedFilter == 1  || width > 600 || (selectedFilter == 0 && width > 400) ? 
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
            : null}
        {
        selectedFilter == 2 || width > 600 || (selectedFilter == 1 && width > 400)  ?

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
            : null}
        {
        selectedFilter == 3 || width > 600 || (selectedFilter == 2 && width > 400)?
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
            : null
          }
            {
                width < 600 ?
            <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 3 ? 0 : selectedFilter +1)} className='bg-gray-800 rounded-full p-2'>
            <Icon name="chevron-right" size={20} color={"white"}  />
            </TouchableOpacity>
                : null
            }
        
        </View> 
    </View>
  )
}

export default SchoolFilters