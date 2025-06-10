import { View, TouchableOpacity, useWindowDimensions, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import RenderFilters from './renderFilters'
import StaticFilters from './staticFilters'
import { ScrollView } from 'react-native-gesture-handler'

const UniversityFilters = ({country=countryList[0], setFilters}) => {
  const { language } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])
  const texts = languages.university;
    
    //Allgemeine Universitätsdaten
    const abschlussziele = ["Bachelor", "Master", "Staatsexamen","Diplom","Magister","Others"]

    //Dynamische Universitätsdaten basierend auf dem Land
    const [ universityList, setUniversityList ] = useState([universityListDeutschland])
    const [ universityFacultys, setUniversityFacultys ] = useState(LeibnizFaculties)
    const [ universitySubjects, setUniversitySubjects ] = useState(LeibnizSubjects[0]["Bachelor"])
    const noSubjectsList = [
  {
    "name": "Architektur & Stadtplanung",
  },
  {
    "name": "Bildende Kunst",
  },
  {
    "name": "Erziehungswissenschaften & Pädagogik",
  },
  {
    "name": "Geistes- und Sozialwissenschaften",
  },
  {
    "name": "Geowissenschaften & Umweltwissenschaften",
  },
  {
    "name": "Geschichte & Archäologie",
  },
  {
    "name": "Informatik & Technik",
  },
  {
    "name": "Kunst, Design & Medien",
  },
  {
    "name": "Musik & Musikpädagogik",
  },
  {
    "name": "Naturwissenschaften & Mathematik",
  },
  {
    "name": "Philosophie & Ethik",
  },
  {
    "name": "Politikwissenschaft & Internationale Beziehungen",
  },
  {
    "name": "Rechtswissenschaften (Jura)",
  },
  {
    "name": "Soziologie & Sozialwissenschaften",
  },
  {
    "name": "Sportwissenschaften",
  },
  {
    "name": "Sprach- & Literaturwissenschaften",
  },
  {
    "name": "Theologie & Religionswissenschaften",
  },
  {
    "name": "Umwelt, Landwirtschaft & Nachhaltigkeit",
  },
  {
    "name": "Umwelttechnik",
  },
  {
    "name": "Wirtschafts- und Rechtswissenschaften",
  }
      ];

    //Dynamische Filter basierend auf den User eingaben
    const [ selectedAbschlussziele, setSelectedAbschlussziele] = useState(["Bachelor"])
    const [ selectedFacultys, setSelectedFacultys] = useState([])
    const [ selectedSubjects, setSelectedSubjects] = useState([])
    const [ selectedUniversity, setSelectedUniversity] = useState([])

    useEffect(() => {
      if (! abschlussziele.includes(selectedAbschlussziele[0] )) return;
      setUniversitySubjects(LeibnizSubjects[0][selectedAbschlussziele[0]]);
    }, [selectedAbschlussziele])
    
    useEffect(() => {
      if (selectedUniversity.length === 0) return;
      if (selectedUniversity[0].name == "Other"){
        setSelectedSubjects(noSubjectsList.map((item) => item.name));
      }
    },[selectedUniversity])

    useEffect(() => {
      setFilters({
                creationCountry: country.name.toUpperCase(),
                kategoryType: "UNIVERSITY",
                creationUniversity: selectedUniversity,
                creationUniversityFaculty: selectedFacultys,
                creationUniversitySubject: selectedSubjects
      })
    },[selectedUniversity,selectedFacultys,selectedSubjects])
    
  return (
    <ScrollView className=' w-full  ' 
      style={{
        scrollBarscrollbarWidth: 'thin', 
        scrollbarColor: 'gray transparent',
      }}
    >
      <StaticFilters
          items={universityList[0].map((item) => item.name)} 
          selectedItems={selectedUniversity} 
          setSelectedItems={setSelectedUniversity}
          multiselect={false}
          title={"Universitys"}
          />
      <StaticFilters
          items={abschlussziele}
          selectedItems={selectedAbschlussziele}    
          setSelectedItems={setSelectedAbschlussziele}
          multiselect={false}
          title={texts[selectedLanguage].abschlussziel}
          />
      <StaticFilters
          items={noSubjectsList.map((item) => item.name)}
          selectedItems={selectedSubjects}
          setSelectedItems={setSelectedSubjects}
          multiselect={true}
          title={"Kathegorys"}
          />
      <StaticFilters
          items={selectedUniversity[0] == "Other" ? [] : universityFacultys}
          selectedItems={selectedFacultys}
          setSelectedItems={setSelectedFacultys}
          multiselect={true}
          title={"Facultys"}
          />
      

      
      <StaticFilters
          items={selectedUniversity[0] == "Other" ? [] :  universitySubjects.filter((item) => item.type == selectedAbschlussziele[0]).map((item) => item.name)}
          selectedItems={selectedSubjects}
          setSelectedItems={setSelectedSubjects}
          multiselect={true}
          title={texts[selectedLanguage].subject}
          />    
    </ScrollView>
  )
}

export default UniversityFilters