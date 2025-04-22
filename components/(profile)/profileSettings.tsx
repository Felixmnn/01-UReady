import { View, Text, Touchable, TouchableOpacity, Modal,ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Icon from "react-native-vector-icons/FontAwesome";
import InfoModule from '../(tabs)/infoModule';
import OptionSelector from '../(tabs)/optionSelector';
import { useWindowDimensions } from 'react-native';
import SettingsOption from '../(tabs)/settingsOption';
import { useState } from 'react';
import CustomTextInput from '../(general)/customTextInput';
import CustomButton from '../(general)/customButton';
import { signOut, updateUserEmail, updateUserName } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import CustomTextInput1 from '../(general)/customTextInput1';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import SkeletonList from '../(general)/(skeleton)/skeletonList';
import { setColorMode, setLanguage } from '@/lib/appwriteEdit';

const ProfileSettings = ({setPage}) => {
    const {user} = useGlobalContext() 
    const [userData, setUserData] = useState(null)
    const [ userDataKathegory, setUserDataKathegory] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [selectedColorMode, setSelectedColorMode] = useState("Darstellung");
    const [selectedLanguage, setSelectedLanguage] = useState("Sprache")
    

    useEffect(() => {
      if (user == null) return ;
      console.log("user", user)
      async function fetchUserData() {
        const userData = await loadUserData(user.$id);
        setSelectedColorMode(userData.darkorMode ? "Dunkel" : "Hell")
        console.log("userData", userData)
        setUserData(userData)
        const userDataKathegory = await loadUserDataKathegory(user.$id);
        setSelectedLanguage(userDataKathegory.language)
        console.log("userDataKathegory", userDataKathegory)
        setUserDataKathegory(userDataKathegory)
        setLoading(false)
      }
      fetchUserData();
    },[user])
    const {setIsLoggedIn, setUser} = useGlobalContext();
  
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
          <View className='flex-1 items-center justify-center' >
            <View className='items-center bg-gray-800 p-4 rounded-[10px] border border-[1px] border-gray-600'>
              <Text className='text-white font-bold text-[15px] my-3'> Aktioncode einlösen</Text>
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
    { label: "Español", value: "ES" },
    { label: "Australian", value: "AU" },
  ];
  const colorOptions = [
    { label: "Hell", value: "light" },
    { label: "Dunkel", value: "dark" }
  ]
  
  async function updateLanguage (text) {
    setSelectedLanguage(text)
    await setLanguage(user.$id, text.toUpperCase())
  }
  async function updateColorMode (text) {
    setSelectedColorMode(text)
    await setColorMode(user.$id, text == "Hell" ? false : true)
  }

  async function logOut () {
    await signOut();
    await setIsLoggedIn(false)
    await setUser(undefined)
    router.push("/")
    
  }

  return (
    <View className='flex-1 items-center '>
      { !loading ?
      <View className='flex-1 w-full items-center'>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[96%] bg-gray-900 bg-opacity-70'
           
            ></View> : null }
        <View className={`flex-1 w-full  rounded-[10px] bg-[#0c111d] ${isVertical ? "border-gray-500 border-[1px]" :null} `}>
      <TouchableOpacity className='w-full rounded-t-[10px] h-[70px] bg-[#0c111d] flex-row items-center justify-start px-5 border-w-[1px] border-gray-600' onPress={()=> setPage()}>
        <TouchableOpacity className='rounded-full p-2 ' onPress={()=> setPage()}>
          <Icon name="arrow-left" size={20} color="white"/>
        </TouchableOpacity>
        <Text className='text-white text-[20px] font-semibold ml-4 mb-1'>Einstellungen</Text>
      </TouchableOpacity>
      <View className='mt-2  border-t-[1px] border-gray-700 '/>
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
                        {personalInput(user.name,"Vorname", (text) => updateUserName(text))}
                        {personalInput(user.email,"Email", (text) => updateUserEmail(text) )}
                        {
                            !user.emailVerification ?
                            <View className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}>
                                <Text className='text-red-300 font-bold text-[12px]'>Bitte bestätige deine Email-Adresse über den Link in der Email, die wir dir gesendet haben.</Text>
                                <TouchableOpacity className='py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]'>
                                  <Text className='text-gray-300 font-bold text-[12px]'>Erneut senden</Text>
                                </TouchableOpacity>
                            </View>

                            : 

                            <View className='w-full m-2 px-2'>
                            <Text>
                                <Text className='text-green-300 font-bold text-[12px]'>Email-Adresse bestätigt</Text>
                            </Text>
                            </View>
                        }
                        {personalInput(user.phone !== "" ? user.phone : "-","Telefonnummer")}
                        <View className='justify-start w-full my-3'>
                          {
                            userDataKathegory.kategoryType == "UNIVERSITY" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Hochschule/ Universität</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.university}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Fakultät</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.faculty}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Studiengang</Text>
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
                              >Schulform</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolType}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Schulklasse</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolGrade}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Schulfächer</Text>
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
                              >Ausbildungskathegorie</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationKathegory}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >Ausbildungfach</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationSubject}</Text> 
                              
                            </View>
                            :<View className='w-full'>
                            
                            <Text className='font-semibold text-white text-gray-500  '
                            style={{
                              color: "#808080",
                            }}
                            >Fächer</Text>
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
                <OptionSelector title={"Darstellung"} options={colorOptions} selectedValue={selectedColorMode} setSelectedValue={setSelectedColorMode} onChangeItem={updateColorMode}/>
                <OptionSelector title={"Sprache"} options={languageoptions} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} onChangeItem={updateLanguage}/>
              </View>
              )}} hideHead = {true} infoStyles="z-20"/> 
      <InfoModule content={()=> { return(
        <View>
          { !isVertical ? <SettingsOption title={"Hilfe"} iconName={"life-ring"}/> : null}
          <SettingsOption title={"Aktion einlösen"} iconName={"bolt"} item={modal()} handlePress={()=> setModalVisible(true)}/>  
          <SettingsOption title={"Abmelden"} iconName={"sign-out"} handlePress={()=> logOut()}/>
          <SettingsOption title={"Account löschen"} iconName="trash" bottom={"true"}/>
  
  
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