import { View, TouchableOpacity, useWindowDimensions, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { countryList, LeibnizFaculties, LeibnizSubjects, universityListDeutschland } from '@/assets/exapleData/countryList'
import { universityQuery } from '@/lib/appwriteQuerys'
import DropDownList from './dropDownList'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useGlobalContext } from '@/context/GlobalProvider'
import languages  from '@/assets/exapleData/languageTabs.json'
import { BottomSheetFlatList, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import RenderFilters from './renderFilters'

const UniversityFilters = ({country=countryList[0], setModules, setLoading}) => {
    const { height,width } = useWindowDimensions();

  const { user,language } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])
  const texts = languages.university;
    
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

    /*
    const RenderFilters = ({ items, selectedItems, multiselect=false, setSelectedItems, title="" }) => {
      return (
        <View className='w-full  '>
          <Text className='px-2 text-gray-500 font-bold text-[15px]  '>{title}</Text>
          <BottomSheetFlatList
            data={items}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                if (multiselect) {
                  if (selectedItems.includes(item)) {
                    setSelectedItems(selectedItems.filter((i) => i !== item));
                  } else {
                    setSelectedItems([...selectedItems, item]);
                  }
                } else {
                  setSelectedItems([item]);
                }}
              }>
                <View className={`px-4 py-3 mr-2    rounded-[15px] ${selectedItems.includes(item) ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <Text className='font-bold text-[15px]'>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            style={{ height: "auto", maxHeight: 60, marginVertical: 10, paddingVertical: 5, }}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )
    }
      */

  return (
    <View className=' w-full  ' style={{ position: "relative" /* Wichtig! */ }}>
      {
        width > 800 ? 
        
      
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

      :
      <View>
        <RenderFilters
          items={universityList.map((item) => item.name)} 
          selectedItems={selectedUniversity} 
          setSelectedItems={setSelectedUniversity}
          multiselect={false}
          title={texts[selectedLanguage].universtity}
          />
        <RenderFilters
          items={universityFacultys}
          selectedItems={selectedFacultys}
          setSelectedItems={setSelectedFacultys}
          multiselect={true}
          title={texts[selectedLanguage].fakultät}
          />
        <RenderFilters
          items={abschlussziele} 
          selectedItems={selectedAbschlussziele} 
          setSelectedItems={setSelectedAbschlussziele}
          multiselect={true}
          title={texts[selectedLanguage].abschlussziel}
          />
        <RenderFilters
          items={universitySubjects.map((item) => item.name)} 
          selectedItems={selectedSubjects} 
          setSelectedItems={setSelectedSubjects}
          multiselect={true}
          title={texts[selectedLanguage].subject}
          />
            </View>}
    </View>
  )
}

export default UniversityFilters