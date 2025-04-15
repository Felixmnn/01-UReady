import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import React from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useState, useEffect } from 'react'
import Svg, { Circle } from "react-native-svg";
import VektorCircle from '@/components/(karteimodul)/vektorCircle';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import SwichTab from '@/components/(tabs)/swichTab';
import OptionSelector from '@/components/(tabs)/optionSelector';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addUserDatakathegory } from '@/lib/appwriteAdd';
import { ausbildungsListDeutschland, ausbildungsTypen, countryList, languages, LeibnizSubjects, schoolListDeutschland, universityListDeutschland } from '@/assets/exapleData/countryList';

const entdecken = () => {
  const {user } = useGlobalContext(); // User aus dem Context holen
  const [ loadUserDataKathegorys, setLoadUserDataKathegorys ] = useState(null) // User Daten Kathegorys
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const [ tab, setTab ] = useState(0)
  const tabWidth = width / 2; // Da es zwei Tabs gibt
  useEffect(() => {
    if (!user) return; 
    async function fetchUserDataKathegorys() {
      const data = await loadUserDataKathegory(user.$id); // User ID aus dem Context holen
      console.log(data)
      setLoadUserDataKathegorys(data.documents); // Daten setzen
    }
    fetchUserDataKathegorys(); // Funktion aufrufen
  }
  , [user]);
  const isVertical = width > 700;
  const toTight = width > 800;
  const longVertical = width > 900;

  const filters = {
    UNIVERSITY: ["Sprache", "Land", "Universität","Abschlussziel",  "Fakultät", "Studiengang"],
    SCHOOL: ["Sprache", "Land", "Region", "Klasse", "Schultyp", "Fächer"],
    EDUCATION: ["Sprache", "Land", "Kathegorie", "Ausbildung"],
    OTHER: ["Sprache", "Land", "Fächer"],
  }

  
  const keys = Object.keys(LeibnizSubjects[0]);
  console.log(LeibnizSubjects[0].Bachelor[0].faculty)
  keys.map((key) => {

    for (let i = 0; i < LeibnizSubjects[0][key].length; i++) {
      const element = LeibnizSubjects[0][key][i].kathegory;
      if (!Kathegorie.includes(element)) {
        Kathegorie.push(element)
      }
    }
  }
  )
  console.log(Kathegorie)


  
  

  const FilterListe = ({type}) => {
    return (
      <View className='w-full flex-row justify-between items-center p-2 '>
        {
          filters[type].map((filter, index) => {
            return (
              <View className='flex-1 items-center justify-center bg-gray-700 p-2 m-1' key={index}>
                <Text>{filter}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
      <Tabbar content={()=> { return(
        <View className='flex-1 w-full bg-[#0c111d] rounded-[10px]'>
                <View className={`flex-row p-4 justify-between items-center  h-[60px] rouned-[10px] `}>
                  <Text className='font-bold text-3xl text-gray-100'>
                    Entdecken
                  </Text>
                </View>
          <View className='flex-row w-full items-center'>
          <View className='flex-1 h-[35px] bg-gray-800 rounded-[10px] ml-4 mr-2 mb-2 p-3 flex-row items-center justify-between'>
            <View className='flex-row'>
              <Icon name="search" size={18} color="white" />
              <TextInput placeholder='Was möchtest du lernen?' className='ml-3' placeholderTextColor={"#797d83"}/>
            </View>
          </View>
          {longVertical ? null : <TouchableOpacity className='h-[35px] rounded-[10px] mr-4 p-2 mb-2 bg-gray-800 items-center justify-center'><Icon name="filter" size={15} color="white"/> </TouchableOpacity> }
          </View>
          <View className='flex-row'>

          </View>
          <View className='mx-3 mt-2'>
            { longVertical ? 
          <View className='flex-row mx-1 justify-between'>
            <View className='flex-1 flex-row'>
              {
                <FilterListe type={"EDUCATION"}/>
              }
            </View>
            <TouchableOpacity className='flex-row items-center border-[1px] border-gray-700 rounded-full py-1 px-3'>
              <Icon name="undo" size={12} color="white"/>
              <Text className='text-[12px] text-gray-300 ml-2'>Filter Zurücksetzen</Text>
            </TouchableOpacity>
            
          </View>
          : null
          }
          <SwichTab tabWidth={tabWidth} setTab={setTab} tab1={"Quizsets"} tab2={"Quizfragen"}/>
          </View>
          <View className='border-t-[1px] border-gray-700 w-full ' />
        </View>
      

    )}} page={"Entdecken"} />
  )
}

export default entdecken