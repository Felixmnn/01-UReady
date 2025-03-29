import { View, Text, TouchableOpacity,Image,ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import { getSepcificModules} from '@/lib/appwriteQuerys'
import { schoolListDeutschland } from '@/assets/exapleData/countryList'
import Svg, { SvgUri } from 'react-native-svg'
import ContinueBox from './(components)/continueBox'
import { TextInput } from 'react-native-gesture-handler'
import ColorPicker from '../(general)/colorPicker'
import { router } from 'expo-router'

const StepSeven = ({userDataKathegory, saveUserData, languages, userData, setUserData, selectedField,selectedSubjects,classNumber,selectedAusbildung,degree,selectedUniversity,ausbildungKathegorie,school,selectedRegion,selectedKathegorie,selectedLanguage,name,selectedCountry}) => {
    useEffect(() => {
      if (userDataKathegory != null) {
        router.push({
          pathname:"getting-started",
          params: { userData:JSON.stringify(userDataKathegory)}
        })
      }
      saveUserData();
      router.push("getting-started")
    }, []);
    const [ userChoices, setUserChoices ] = useState(null);

    async function getMatchingModules() {
      if (userDataKathegory == "SCHOOL"){
        /*
        1.Query -> Land, Region, Schulform, Jahrgangsstufe, Fach, Sprache
        2.Query -> Land, Region, Schulform, Jahrgangsstufe, Fach
        3.Query -> Land, Schulform, Jahrgangsstufe, Fach
        4.Query -> Land, Jahrgangsstufe, Fach
        5.Query -> Land, Fach
        6.Query -> Fach
        */
      } else if (userDataKathegory == "UNIVERSITY") {
        /*
        1.Query -> Land, Universität,  Fakultät, Abschlussart, Studiengang, Sprache
        2.Query -> Land, Universität,  Fakultät, Abschlussart, Studiengang
        3.Query -> Land, Universität,  Fakultät, Studiengang, 
        4.Query -> Land, Universität,  Falkultät
        */
      } else if (userDataKathegory == "EDUCATION") {
       
      } else if (userDataKathegory == "OTHER") {
      }
    }

  return (
      <View className='h-full w-full justify-between items-center py-5'>
        <View className='w-full'>
        </View>
            
      <View/>
      </View>
    ) 

}

export default StepSeven