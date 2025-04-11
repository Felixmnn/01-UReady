import { View, Text, Touchable, TouchableOpacity, Modal,ScrollView } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";
import InfoModule from '../(tabs)/infoModule';
import OptionSelector from '../(tabs)/optionSelector';
import { useWindowDimensions } from 'react-native';
import SettingsOption from '../(tabs)/settingsOption';
import { useState } from 'react';
import CustomTextInput from '../(general)/customTextInput';
import CustomButton from '../(general)/customButton';
import { signOut } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import CustomTextInput1 from '../(general)/customTextInput1';

const ProfileSettings = ({setPage}) => {
    const {user} = useGlobalContext()
    const {setIsLoggedIn, setUser} = useGlobalContext();
  
    const [modalVisible, setModalVisible] = useState(false);
    const [inputTouched, setInputTouched] = useState(false);
    const [ missingEntry, setMissingEntry ] = useState(false);
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };

    const personalInput = (value, title) => {
      return (
        <TouchableOpacity className="flex-1 w-full">
          <Text className="text-gray-300 font-bold text-[13px] m-2">{title}</Text>
          <CustomTextInput1 value={value} />
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
                <CustomButton title="Ok" handlePress={toggleModal} containerStyles={!isFocused && firstFocus && text == "" ? "w-[50%] bg-gray-700 mx-1 border-gray-700" :"w-[50%] bg-white mx-1"} textStyles={"text-black"} disabled={!isFocused && firstFocus && text == ""}/>
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
    { label: "Deutsch", value: "de" },
    { label: "English (UK)", value: "en-UK" },
    { label: "English (US)", value: "en-US" },
    { label: "Español", value: "es" },
    { label: "Français", value: "fr" },
    { label: "Português", value: "pt" },
  ];
  const colorOptions = [
    { label: "Hell", value: "light" },
    { label: "Dunkel", value: "dark" }
  ]
  
  async function logOut () {
    await signOut();
    await setIsLoggedIn(false)
    await setUser(null)
    router.push("/")
    
  }

  return (
    <View className='flex-1 items-center '>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70'></View> : null }
        <View className={`flex-1 w-full  rounded-[10px] bg-[#0c111d] ${isVertical ? "border-gray-500 border-[1px]" :null} `}>
      <TouchableOpacity className='w-full rounded-t-[10px] h-[70px] bg-gray-800 bg-gray-800 flex-row items-center justify-start px-5 border-w-[1px] border-gray-600' onPress={()=> setPage()}>
        <TouchableOpacity className='rounded-full p-2' onPress={()=> setPage()}>
          <Icon name="arrow-left" size={20} color="white"/>
        </TouchableOpacity>
        <Text className='text-white text-[20px] font-semibold ml-4 mb-1'>Einstellungen</Text>
      </TouchableOpacity>
      <View className='mt-2'/>
      <ScrollView>
      <InfoModule content={()=> {
                return(
                    <View className='flex-1 items-center'>
                        <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user.name[0]}</Text></View>
                        {personalInput("Felix","Vorname")}
                        {personalInput("Man","Nachname")}
                        {personalInput("test@test.test","Email")}
                        {
                            true ?
                            <View className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}>
                                <Text className='text-red-300 font-bold text-[12px]'>Bitte bestätige deine Email-Adresse über den Link in der Email, die wir dir gesendet haben.</Text>
                                <TouchableOpacity className='py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]'><Text className='font-bold text-gray-300'>Email erneut senden</Text> </TouchableOpacity>
                            </View>
                            : null
                        }
                        {personalInput("Status","Telefonnummer")}
                        {personalInput("Student","Status")}
                        <View className='justify-start w-full my-3'>
                        <Text className='font-bold text-white '>Hochschule/ Universität</Text>
                        <Text className='font-semibold text-white'>Testuni</Text>
                        <Text className='font-bold text-white mt-3'>Studiengang</Text>
                        <Text className='font-semibold text-white'>Informatik</Text>
                        </View>
                        <View className={`flex-row w-full justify-between items-center py-2 `}>
                            <TouchableOpacity className='py-2 px-3 rounded-full border-gray-500 border-[1px]'><Text className='font-bold text-gray-300'>Email erneut senden</Text> </TouchableOpacity>
                        </View>



                    </View>
                )
            }} hideHead={true}/>
      <InfoModule content={()=> { return(
              <View className={`flex-1 ${isVertical ? "flex-row justify-start items-center" : "items-start"}`}>
                <OptionSelector title={"Darstellung"} options={colorOptions}/>
                <OptionSelector title={"Sprache"} options={languageoptions}/>
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
  )
}

export default ProfileSettings