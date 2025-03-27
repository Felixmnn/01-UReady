import { View, Text,SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData } from '@/lib/appwriteDaten';
import { router } from 'expo-router';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import Flag from "react-world-flags";
import { countryList } from '@/assets/exapleData/countryList';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import StepZero from '@/components/(signUp)/zero';
import StepOne from '@/components/(signUp)/one';
import StepTwo from '@/components/(signUp)/two';
import StepFour from '@/components/(signUp)/four';
import StepThree from '@/components/(signUp)/three';
import StepFive from '@/components/(signUp)/five';

const personalize = () => {
    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState("");
    const [ isActive, setIsActive ] = useState(false);
    const languages = [
        {name:"Deutsch", enum:"DEUTSCH", code:"DE"},
        {name:"English", enum:"BRITISH", code:"GB"},
        {name:"English", enum:"AMERICAN", code:"US"},
        {name:"Spanish", enum:"SPANISH", code:"ES"},
        {name:"Australian", enum:"AUSTRALIAN", code:"AU"},
    ]
    const [ selectedCountry, setSelectedCountry ] = useState( {name:"Deutschland",code:"DE", id:"4058177f-0cd4-4820-8f71-557c4b27dd42" }
    );
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedKathegorie, setSelectedKathegorie] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [school, setSchool] = useState(null);

    const [grade, setGrade] = useState(null);
    const [ausbildungKathegorie, setAusbildungKathegorie] = useState(null);

    const [uni, setUni] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [other, setOther] = useState(null);
    const [selectedOther, setSelectedOther] = useState(null);

    useEffect(() => {
              if (user === null ) return;
              async function fetchUserData() {
                  try {
                      console.log("Loading")
                      const userD = await loadUserData(user.$id);
                      setUserData(userD);
                  } catch (error) {
                      console.log(error);
                  } 
              }
              fetchUserData();
          }, [user]);
    
    console.log("User Data",userData)

  return (
    <SafeAreaView className="flex-1 p-4 bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center">
        {userData !== null && userData.signInProcessStep == "ZERO" ? <StepZero userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "ONE" ? <StepOne name={name} setName={setName} userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "TWO" ? <StepTwo name={name} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languages={languages} userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "THREE" ? <StepThree userData={userData} setUserData={setUserData} setSelectedKathegorie={setSelectedKathegorie} selectedLanguage={selectedLanguage} languages={languages} name={name} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} countryList={countryList}/> : null}
        {userData !== null && userData.signInProcessStep == "FOUR" ? <StepFour selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} ausbildungKathegorie={ausbildungKathegorie} setAusbildungKathegorie={setAusbildungKathegorie} school={school} setSchool={setSchool} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} selectedKathegorie={selectedKathegorie} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} setUserData={setUserData} userData={userData} languages={languages}/> : null}
        {userData !== null && userData.signInProcessStep == "FIVE" ? <StepFive/> : null}
    </SafeAreaView>
  )
}

export default personalize 