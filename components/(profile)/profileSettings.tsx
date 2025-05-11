import { View, Text, TouchableOpacity, Modal,ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import InfoModule from '../(tabs)/infoModule';
import OptionSelector from '../(tabs)/optionSelector';
import { useWindowDimensions } from 'react-native';
import SettingsOption from '../(tabs)/settingsOption';
import { useState } from 'react';
import CustomTextInput from '../(general)/customTextInput';
import CustomButton from '../(general)/customButton';
import {  updateUserEmail, updateUserName } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import CustomTextInput1 from '../(general)/customTextInput1';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import SkeletonList from '../(general)/(skeleton)/skeletonList';
import { setColorMode, setLanguage } from '@/lib/appwriteEdit';
import { addNewUserConfig } from '@/lib/appwriteAdd';

const ProfileSettings = ({setPage}) => {
    const {user, setUser,setIsLoggedIn, setIsLoading } = useGlobalContext() 
    const { language,setNewLanguage } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])


    const [userData, setUserData] = useState(null)
    const [ userDataKathegory, setUserDataKathegory] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [selectedColorMode, setSelectedColorMode] = useState("Darstellung");
    const texts = {
      "DEUTSCH": {
        vorname: "Vorname",
        email: "Email",
        emailvalid: "Bitte bestätige deine Email-Adresse über den Link in der Email, die wir dir gesendet haben.",
        emailvalid2: "Email-Adresse bestätigt",
        emailrenew: "Erneut senden",
        schooltype: "Schulform",
        schoolgrade: "Schulklasse",
        schoolsubjects: "Fächer",
        university: "Hochschule/ Universität",
        faculty: "Fakultät",
        studiengang: "Studiengang",
        abschlussziel: "Abschlussziel",
        actioncode: "Aktioncode",
        actioncodeText: "Aktioncode einlösen",
        help: "Hilfe",
        share: "Teilen",
        logout: "Abmelden",
        deleteAccount: "Account löschen",
        colorMode: "Darstellung",
        language: "Sprache",
        educationKathegory: "Ausbildungskathegorie",
        educationSubject: "Ausbildungfach",
        hell: "Hell",
        dunkel: "Dunkel",

    },
      "ENGLISH(US)": {
        vorname: "First name",
        email: "Email",
        emailvalid: "Please confirm your email address using the link in the email we sent you.",
        emailvalid2: "Email address confirmed",
        emailrenew: "Resend",
        schooltype: "School type",
        schoolgrade: "School grade",
        schoolsubjects: "Subjects",
        university: "University",
        faculty: "Faculty",
        studiengang: "Course of study",
        abschlussziel: "Degree goal",
        actioncode: "Action code",
        actioncodeText: "Redeem action code",
        help: "Help",
        share: "Share",
        logout: "Log out",
        deleteAccount: "Delete account",
        colorMode: "Display mode",
        language: "Language",
        hell: "Light",
        dunkel: "Dark",
    } ,
    "ENGLISH(UK)": {
        vorname: "First name",
        email: "Email",
        emailvalid: "Please confirm your email address using the link in the email we sent you.",
        emailvalid2: "Email address confirmed",
        emailrenew: "Resend",
        schooltype: "School type",
        schoolgrade: "School grade",
        schoolsubjects: "Subjects",
        university: "University",
        faculty: "Faculty",
        studiengang: "Course of study",
        abschlussziel: "Degree goal",
        actioncode: "Action code",
        actioncodeText: "Redeem action code",
        help: "Help",
        share: "Share",
        logout: "Log out",
        deleteAccount: "Delete account",
        colorMode: "Display mode",
        language: "Language",
        hell: "Light",
        dunkel: "Dark",

    },
    "AUSTRALIAN": {
        vorname: "First name",
        email: "Email",
        emailvalid: "Please confirm your email address using the link in the email we sent you.",
        emailvalid2: "Email address confirmed",
        emailrenew: "Resend",
        schooltype: "School type",
        schoolgrade: "School grade",
        schoolsubjects: "Subjects",
        university: "University",
        faculty: "Faculty",
        studiengang: "Course of study",
        abschlussziel: "Degree goal",
        actioncode: "Action code",
        actioncodeText: "Redeem action code",
        help: "Help",
        share: "Share",
        logout: "Log out",
        deleteAccount: "Delete account",
        colorMode: "Display mode",
        language: "Language",
        hell: "Light",
        dunkel: "Dark",


    },
    "SPANISH": {
        vorname: "Nombre",
        email: "Correo electrónico",
        emailvalid: "Confirma tu dirección de correo electrónico utilizando el enlace en el correo electrónico que te enviamos.",
        emailvalid2: "Dirección de correo electrónico confirmada",
        emailrenew: "Reenviar",
        schooltype: "Tipo de escuela",
        schoolgrade: "Grado escolar",
        schoolsubjects: "Asignaturas",
        university: "Universidad",
        faculty: "Facultad",
        studiengang: "Curso de estudio",
        abschlussziel: "Objetivo del título",
        actioncode: "Código de acción",
        actioncodeText: "Canjear código de acción",
        help: "Ayuda",
        share: "Compartir",
        logout: "Cerrar sesión",
        deleteAccount: "Eliminar cuenta",
        colorMode: "Modo de visualización",
        language: "Idioma",
        hell: "Claro",
        dunkel: "Oscuro",

    },
  }

    useEffect(() => {
      if (user === null || user === undefined) return ;
      async function fetchUserData() {
        let userData = await loadUserData(user.$id);
        if (!userData) {
           userData = await addNewUserConfig(user.$id);
        }
        setSelectedColorMode(userData.darkmode ? texts[selectedLanguage].dunkel : texts[selectedLanguage].hell)
        setUserData(userData)
        const userDataKathegory = await loadUserDataKathegory(user.$id);
        setSelectedLanguage(  userDataKathegory.language === "DEUTSCH" ||
                              userDataKathegory.language === "ENGLISH(US)" || 
                              userDataKathegory.language === "ENGLISH(UK)" || 
                              userDataKathegory.language === "AUSTRALIAN" || 
                              userDataKathegory.language === "SPANISH" ? userDataKathegory.language : "DEUTSCH"  )
        setUserDataKathegory(userDataKathegory)
        setLoading(false)
      }
      fetchUserData();
    },[user])
  
    const [modalVisible, setModalVisible] = useState(false);
    const [inputTouched, setInputTouched] = useState(false);
    const [ missingEntry, setMissingEntry ] = useState(false);
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

    const personalInput = (value, title,onChange) => {
      return (
        <TouchableOpacity className="flex-1 w-full">
          <Text className="text-gray-300 font-bold text-[13px] m-2">{title}</Text>
          <CustomTextInput1 value={value} onChange={onChange} />
        </TouchableOpacity>
      )
    } 
    
    const modal = () => {
      return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View className='flex-1 items-center justify-center p-2' >
            <View className='w-full  items-center bg-gray-800 p-4 rounded-[10px] border border-[1px] border-gray-600'
            style={{
              height: 200,
            }}
            >
              <Text className='text-white font-bold text-[15px] my-3'>{texts[selectedLanguage].actioncodeText}</Text>
              <CustomTextInput text={text} setText={setText}  isFocused={isFocused} setFocused={setFocused} firstFocus={firstFocus} setFirstFocus={setFirstFocus}/>
              <View className='flex-1 flex-row items-center justify-center'>
                <CustomButton title="Abbrechen" handlePress={toggleModal} containerStyles={"w-[50%] bg-gray-800 mx-1 border-w-[1px] border-gray-500"}/>
                <CustomButton title="Ok" handlePress={toggleModal} containerStyles={!isFocused && firstFocus && text == "" ? "w-[50%] bg-gray-700 mx-1 border-gray-700" :"w-[50%] bg-blue-500 mx-1"} textStyles={"text-gray-300"} disabled={!isFocused && firstFocus && text == ""}/>
              </View>
            </View>
          </View>
        </Modal>
      )
    }
    
    const [isFocused, setFocused] = useState(false);
    const [firstFocus, setFirstFocus] = useState(false)
    const [text, setText]=useState("")
   
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
  const languageoptions = [
    { label: "Deutsch", value: "DE" },
    { label: "English(UK)", value: "GB" },
    { label: "English(US)", value: "US" },
    { label: "Spanish", value: "ES" },
    { label: "Australian", value: "AU" },
  ];
  const colorOptions = [
    { label: texts[selectedLanguage].hell, value: "light" },
    { label: texts[selectedLanguage].dunkel, value: "dark" }
  ]
  
  async function updateLanguage (text) {
    setSelectedLanguage(text.toUpperCase())
    setNewLanguage(text.toUpperCase())
    await setLanguage(user.$id, text.toUpperCase())

  }
  async function updateColorMode (text) {
    setSelectedColorMode(text)
    await setColorMode(user.$id, text == "Hell" ? false : true)
  }


  return (
    <View className='flex-1 items-center '>
      { !loading ?
      <View className='flex-1 w-full items-center'>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[96%] bg-gray-900 bg-opacity-70'
           
            ></View> : null }
        <View className={`flex-1 w-full  rounded-[10px] bg-gray-900 ${isVertical ? "border-gray-500 border-[1px]" :null} `}>
      {/*
      <TouchableOpacity className='w-full rounded-t-[10px] h-[70px] bg-[#0c111d] flex-row items-center justify-start px-5 border-w-[1px] border-gray-600' onPress={()=> setPage()}>
        <TouchableOpacity className='rounded-full p-2 ' onPress={()=> setPage()}>
          <Icon name="arrow-left" size={20} color="white"/>
        </TouchableOpacity>
        <Text className='text-white text-[20px] font-semibold ml-4 mb-1'>Einstellungen</Text>
      </TouchableOpacity>
      */}
      <View className='mt-2'/>
      <ScrollView
      className='bg-gray-900'
      style={{
        scrollbarWidth: 'thin', // Dünne Scrollbar
        scrollbarColor: 'gray transparent',
        
      }}
      >
      <InfoModule content={()=> {
                return(
                    <View className='flex-1 items-center '>
                        <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user.name[0]}</Text></View>
                        {personalInput(user.name,texts[selectedLanguage].vorname, (text) => updateUserName(text))}
                        {personalInput(user.email,texts[selectedLanguage].email, (text) => updateUserEmail(text) )}
                        {
                            !user.emailVerification ?
                            <View className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}>
                                <Text className='text-red-300 font-bold text-[12px]'>{texts[selectedLanguage].emailvalid}</Text>
                                <TouchableOpacity className='py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]'>
                                  <Text className='text-gray-300 font-bold text-[12px]'>{texts[selectedLanguage].emailrenew}</Text>
                                </TouchableOpacity>
                            </View>

                            : 

                            <View className='w-full m-2 px-2'>
                            <Text>
                                <Text className='text-green-300 font-bold text-[12px]'>{texts[selectedLanguage].emailvalid2}</Text>
                            </Text>
                            </View>
                        }
                        
                        <View className='justify-start w-full'>
                          {
                            userDataKathegory.kategoryType == "UNIVERSITY" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].university}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.university}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].faculty}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.faculty}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].studiengang}</Text>
                              <View>
                                {
                                  userDataKathegory.studiengang.map((studiengang, index) => {
                                    return(
                                      <Text key={index} className='font-semibold text-white ml-2'>{studiengang}</Text>
                                    )
                                  })
                                }
                              </View>
                            </View>
                            : userDataKathegory.kategoryType == "SCHOOL" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schooltype}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolType}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schoolgrade}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolGrade}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schoolsubjects}</Text>
                              <View>
                                {
                                  userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                                    return(
                                      <Text key={index} className='font-semibold text-white ml-2'>{schoolSubjects}</Text>
                                    )
                                  })
                                }
                              </View>
                            </View>
                            : userDataKathegory.kategoryType == "EDUCATION" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].educationKathegory}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationKathegory}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].educationSubject}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationSubject}</Text> 
                              
                            </View>
                            :<View className='w-full'>
                            
                            <Text className='font-semibold text-white text-gray-500  '
                            style={{
                              color: "#808080",
                            }}
                            >{texts[selectedLanguage].schoolSubjects}</Text>
                            <View>
                              {
                                userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                                  return(
                                    <Text key={index} className='font-semibold text-white ml-2'>{schoolSubjects}</Text>
                                  )
                                })
                              }
                            </View>
                          </View>
                          }
                        
                        
                        </View>
                        



                    </View>
                )
            }} hideHead={true}/>
      <InfoModule content={()=> { return(
              <View className={`flex-1  ${isVertical ? "flex-row justify-start  items-center" : "items-start"}`}>
                <OptionSelector title={texts[selectedLanguage].colorMode} options={colorOptions} selectedValue={selectedColorMode} setSelectedValue={setSelectedColorMode} onChangeItem={updateColorMode}/>
                <OptionSelector title={texts[selectedLanguage].language} options={languageoptions} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} onChangeItem={updateLanguage}/>
              </View>
              )}} hideHead = {true} infoStyles="z-20"/> 
      <InfoModule content={()=> { return(
        <View>
          { !isVertical ? <SettingsOption title={"Hilfe"} iconName={"life-ring"}/> : null}
          <SettingsOption title={texts[selectedLanguage].actioncode} iconName={"bolt"} item={modal()} handlePress={()=> setModalVisible(true)}/>  
          <SettingsOption title={texts[selectedLanguage].logout} iconName={"sign-out"} handlePress={ ()=>    router.push("/sign-out")}/>
          <SettingsOption title={texts[selectedLanguage].deleteAccount} iconName="trash" bottom={"true"} handlePress={ ()=>    router.push("/sign-out")}/>
  
  
        </View>
      )}} hideHead = {true}/> 
      </ScrollView>
    </View>
    </View>

    : <SkeletonList/>
    }
    </View>
  )
}

export default ProfileSettings