import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import { universityQuery } from '@/lib/appwriteQuerys'
import DropDownList from './dropDownList'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useGlobalContext } from '@/context/GlobalProvider'

const UniversityFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height,width } = useWindowDimensions();

  const { user,language } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])

    const texts = {
      "DEUTSCH": {
        universtity: "Universität",
        abschlussziel: "Abschlussziel",
        fakultät: "Fakultät",
        subject: "Fach",
      },
      "ENGLISH(US)": {
        universtity: "University",
        abschlussziel: "Degree",
        fakultät: "Faculty",
        subject: "Subject",
      },
      "ENGLISH(UK)": {
        universtity: "University",
        abschlussziel: "Degree",
        fakultät: "Faculty",
        subject: "Subject",
      },
      "AUSTRALIAN": {
        universtity: "University",
        abschlussziel: "Degree",
        fakultät: "Faculty",
        subject: "Subject",
      },
      "SPANISH": {
        universtity: "Universidad",
        abschlussziel: "Grado",
        fakultät: "Facultad",
        subject: "Asignatura",
      },
    }
    //Allgemeine Universitätsdaten
    const abschlussziele = ["Bachelor", "Master", "Staatsexamen","Diplom","Magister","Other"]

    //Dynamische Universitätsdaten basierend auf dem Land
    const [ universityList, setUniversityList ] = useState(universityListDeutschland)
    const [ universityFacultys, setUniversityFacultys ] = useState(LeibnizFaculties)
    const [ universitySubjects, setUniversitySubjects ] = useState(LeibnizSubjects[0][abschlussziele[0]])

    //Dynamische Filter basierend auf den User eingaben
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
        

    },[selectedUniversity,selectedFacultys,selectedSubjects])

    const [selectedFilter, setSelectedFilter] = useState(0)
  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
      <View className='w-full flex-row px-4 py-1'>
        {
          width < 800 ?
      <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 0 ? 3 : selectedFilter -1)} className='bg-gray-800 rounded-full p-2'>
        <Icon name="chevron-left" size={20} color={"white"}  />
      </TouchableOpacity>
          : null
        }
        <View className={`flex-row flex-1  `} style={{  zIndex: 1, position: 'relative', }}>
          {
            selectedFilter == 0 || width > 800 || (selectedFilter == 3 && width > 600) ? 
        <DropDownList title={texts[selectedLanguage].universtity} options={universityList.map((item) => item.name)} selectedOptions={selectedUniversity} setSelectedOptions={()=> {}} height={height} />
        : null}
        {    
        selectedFilter == 1  || width > 800 || (selectedFilter == 0 && width > 600) ? 
        <DropDownList title={texts[selectedLanguage].abschlussziel} options={abschlussziele.map((item) => item)} selectedOptions={selectedAbschlussziele} setSelectedOptions={(item)=> {
            setSelectedAbschlussziele(item)
            setUniversitySubjects(LeibnizSubjects[0][abschlussziele[abschlussziele.indexOf(item)]])
        }}/>
        : null}
        {
        selectedFilter == 2 || width > 800 || (selectedFilter == 1 && width > 600)  ?
        <DropDownList title={texts[selectedLanguage].fakultät} options={universityFacultys} selectedOptions={selectedFacultys} setSelectedOptions={(item)=> {
            if (selectedFacultys.includes(item)) {
                setSelectedFacultys(selectedFacultys.filter((i) => i !== item));
              }
              else {
                setSelectedFacultys([...selectedFacultys, item]);
              }
        }}/>
        : null}
        {
        selectedFilter == 3 || width > 800 || (selectedFilter == 2 && width > 600)?
        <DropDownList title={texts[selectedLanguage].subject} options={universitySubjects.map((item) => item.name)} selectedOptions={selectedSubjects} setSelectedOptions={(item)=> {
            if (selectedSubjects.includes(item)) {
                setSelectedSubjects(selectedSubjects.filter((i) => i !== item));
              }
              else {
                setSelectedSubjects([...selectedSubjects, item]);
              }
        }}/>
        : null
          }
        </View>

        {
          width < 800 ?
        <TouchableOpacity onPress={()=> setSelectedFilter(selectedFilter == 3 ? 0 : selectedFilter +1)} className='bg-gray-800 rounded-full p-2'>
        <Icon name="chevron-right" size={20} color={"white"}  />
      </TouchableOpacity>
          : null
        }
      </View>
    </View>
  )
}

export default UniversityFilters