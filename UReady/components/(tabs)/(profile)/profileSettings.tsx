import { View, Text, Touchable, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome";
import InfoModule from '../infoModule';
import OptionSelector from '../optionSelector';
import { useWindowDimensions } from 'react-native';
import SettingsOption from '../settingsOption';
import { useState } from 'react';
import CustomTextInput from '../customTextInput';
import CustomButton from '../customButton';
import { signOut } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';

const ProfileSettings = ({setPage}) => {
    const {setIsLoggedIn, setUser} = useGlobalContext();
  
    const [modalVisible, setModalVisible] = useState(false);
    const [inputTouched, setInputTouched] = useState(false);
    const [ missingEntry, setMissingEntry ] = useState(false);
    const toggleModal = () => {
      setModalVisible(!modalVisible);
    };


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
  const AktionModal = () => {
    return (
      <Modal>
        <Text>Hello world</Text>
      </Modal>
    )
  }
  async function logOut () {
    await signOut();
    await setIsLoggedIn(false)
    await setUser(null)
    router.push("/")
    
  }

  return (
    <View className='flex-1 items-center '>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70'></View> : null }
        <View className='flex-1 w-full bg-[#0c111d] rounded-[10px]'>
      <TouchableOpacity className='w-full rounded-t-[10px] h-[70px] bg-gray-800 bg-gray-800 flex-row items-center justify-start px-5 border-w-[1px] border-gray-600' onPress={()=> setPage()}>
        <TouchableOpacity className='rounded-full p-2' onPress={()=> setPage()}>
          <Icon name="arrow-left" size={20} color="white"/>
        </TouchableOpacity>
        <Text className='text-white text-[20px] font-semibold ml-4 mb-1'>Einstellungen</Text>
      </TouchableOpacity>
      <View className='mt-2'/>
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
      
    </View>
    </View>
  )
}

export default ProfileSettings