import { View, Text, TouchableOpacity, Image, Modal,ScrollView } from 'react-native'
import React, { useState } from 'react'
import { signOut } from '@/lib/appwrite'
import Tabbar from '@/components/(tabs)/tabbar'
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomButton from '@/components/(general)/customButton';
import { useWindowDimensions } from 'react-native';
import CustomTextInput1 from '@/components/(general)/customTextInput1';
import ModalStreak from '@/components/(home)/modalStreak';
import ModalPremium from '@/components/(home)/modalPremium';
import ModalDataUpload from '@/components/(home)/modalDataUpload';
import CustomTextInputChat from '../(general)/customTextInputChat';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import AddModule from '../(general)/(modal)/addModule';
import { loadUserData } from '@/lib/appwriteDaten';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addNewUserConfig } from '@/lib/appwriteAdd';
import { callAppwriteFunction } from '@/lib/appwriteFunctions';
import ModalAddFile from '../(general)/(modal)/addFile';
import Battery from '../tokens/battery';
import Fusioncharge from '../tokens/fusioncharge';
import Supercharge from '../tokens/supercharge';
import RadioactiveCharege from '../tokens/radioactivecharege';
import MikroChip from '../tokens/mikroChip';
import {router} from 'expo-router';

const HomeGeneral = ({setSelectedPage}) => {
  const {user} = useGlobalContext();
  const [ userDataUsage, setUserDataUsage] = useState({
    flameActive: false,
    flameCount: 0,
    flameLastCharge: new Date(),
    itemActive: null,
    itemActivationTime: null,
    batteryCharge: 5,
    batteryLastCharge: new Date(),
    mikroChips: 10000,
    superCharges:0,
    fusionCharges:0,
    radioactiveCharges:0,
  })
  {/*Homepage allgemein*/}
      const t = new Date().getDay();
    
      const [selected, setSelected] = useState(t)
      const [isVisible, setIsVisible] = useState(false);
      const [isVisiblePremium, setIsVisiblePremium] = useState(false);
      const [isVisibleDataUpload, setIsVisibleDataUpload] = useState(false);
      const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
      const [isvisibleNewFile, setIsVisibleNewFile] = useState(false);
    
      const { width } = useWindowDimensions(); // Bildschirmbreite holen
        const isVertical = width > 700;
        const toTight = width > 800;
        const longVertical = width > 900;
    
        {/*Day Settings */}
        const days = [
          {sDay:"Mo",lDay:"Montag"},
          {sDay:"Di",lDay:"Dienstag"},
          {sDay:"Mi",lDay:"Mittwoch"},
          {sDay:"Do",lDay:"Donnerstag"},
          {sDay:"Fr",lDay:"Freitag"},
          {sDay:"Sa",lDay:"Samstag"},
          {sDay:"So",lDay:"Sonntag"},
        ]
      function getDay() {
        const t = new Date().getDay();
        let diff = selected - t + 1
        const date = new Date();
        date.setDate(date.getDate() + diff)
        const today = date.toLocaleDateString("de-DE", { month: "long", day: "numeric" })
        return (today)
      }
      const DaySelect = ({date, day, status, handlePress}) => {
        return (
        <TouchableOpacity onPress={()=> handlePress()} className={`flex-1 m-1 ${toTight ? "flex-row p-3" : "p-2"} items-center justify-center rounded-[10px] ${days[selected].sDay == day ? "border-blue-500 border-[2px] bg-blue-500 bg-opacity-30" : "border-gray-700 border-[1px]"} `}>
          <View className={`${toTight ? "items-start" : "items-center"}`}> 
            <Text className='font-bold text-gray-100'>{day}</Text>
            {toTight ? <Text className='text-[12px] text-gray-500 font-semibold'>{date}</Text> :null}
          </View>
          { status == "fire" ? <View className='mx-2'><Icon name="fire" size={25} color="#f79009"/></View> : null}
          { status == "miss" ? <View className='mx-2 items-center justify-center rounded-full bg-gray-600 h-[25px] w-[25px]'><Icon name="times" size={15} color="gray" /></View> : null}
          { status == "pause" ? <View className='mx-2 items-center justify-center rounded-full bg-gray-600 h-[25px] w-[25px]'><Text className='text-white'>II</Text></View> : null}
          { status == "open" ? <View className={`mx-2 h-[25px] w-[25px] bg-gray-900 rounded-full border-dashed border-[1px] ${days[selected].sDay == day ? "border-blue-500" : "border-gray-500"}`}></View> : null}
    
        </TouchableOpacity>
        )
      }
      function changeSelected (input) {
        if (selected + input < 0){
          setSelected(days.length -1)
        } else if (selected + input == days.length){
          setSelected(0)
        } else {
          setSelected(selected + input )
        }
      }
    
    
      {/* Quick Access */}
      const QuickAccess = ({icon, iconColor, iconBackground, title, handlePress}) => {
        return (
          
          <TouchableOpacity className={`flex-1 p-1  border-[1px] rounded-[10px] bg-gray-900  items-start justify-center  ${isVertical ? " items-center m-2" : " items-center m-1 border-gray-700"}`} 
          onPress={handlePress}
          style={{
            borderColor: iconColor,
            shadowColor: iconColor, // Grau-Blauer Glow
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10, // Für Android
          }}
          >
            <View className={`rounded-full ${iconBackground} h-[50px] w-[50px] items-center justify-center`}
            style={{
              height: 40,
              width: 40,
             
            }}
            >
             { icon == "bot" ? 
                                  
                                    <Image 
                                    source={require('../../assets/bot.png')} 
                                    style={{
                                      height: 28, 
                                      width: 28, 
                                      tintColor: iconColor 
                                    }} 
                                  />
                                  : 
                                  <Icon name={icon} size={25} color={iconColor}/>}
            </View>
          </TouchableOpacity>
        )
      }
    
      {/*Aktionsempfehlungen */}
      const Aktionsempfehlung = ({icon, iconColor, iconBackground, title, subTitle, handlePress}) => {
        return (
        <TouchableOpacity className='flex-1 flex-row px-3 border-gray-700 border-[1px]  rounded-[10px] bg-gray-900 items-center justify-start m-1 h-[60px]'
        style={{
          height: 60,
        }}

        >
            <View className={`rounded-[5px] ${iconBackground} h-[25px] w-[25px] items-center justify-center mb-1 m-1`} >
              <Icon name={icon} color={iconColor} size={15}/>
            </View>
            <View className='m-1'>
              <Text className='font-bold text-gray-100'>{title}</Text>
              <Text className=' text-gray-100 text-[12px]'>{subTitle}</Text>
            </View>
        </TouchableOpacity>
        )
      }
  return (
    <View className='flex-1 justify-between '>
        <ModalStreak isVisible={isVisible} setIsVisible={setIsVisible} tage={12} days={days}/>
        <ModalPremium isVisible={isVisiblePremium} setIsVisible={setIsVisiblePremium}/>
        <ModalDataUpload isVisible={isVisibleDataUpload} setIsVisible={setIsVisibleDataUpload}/>
        <AddModule isVisible={isVisibleNewModule} setIsVisible={setIsVisibleNewModule}/>
        {/*<ModalAddFile isVisible={isvisiGbleNewFile} setIsVisible={setIsVisibleNewFile}/>*/}
        <View className='flex-1 mx-4 mb-2 mt-4'>
        {/*Top Bar*/}
        
        <View className='flex-row justify-between items-center'>
          <View className='flex-row items-center justify-center'>
          <TouchableOpacity className='flex-row rounded-full bg-gradient-to-b from-black to-[#ed481c] items-center justify-center ' onPress={()=> setIsVisible(true)}
            style={{
              height: 30,
              width: 50,
              shadowColor: "#ed481c",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 10, // Für Android
            }}
            >
            <Icon name="fire" size={15} color="#f79009"/>
            <Text className='text-gray-400 font-bold ml-1'>{userDataUsage.flameCount}</Text>
          </TouchableOpacity>
          <View className=' flex-row justify-between items-center  rounded-full mx-2'
          style={{
            height: 30,
            width: 50,
            paddingBottom:2,
            backgroundColor: "#2e5118",
            shadowColor: "#2e5118",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 10, // Für Android

           
          }}
          >
            
            <TouchableOpacity className='flex-1 flex-row items-center justify-center'>
              <Battery charge={3}/>
            </TouchableOpacity>
          </View>
          </View>
          

          <View className='flex-1 flex-row justify-between items-center bg-black rounded-[10px] mx-2'
          style={{
            height: 20,
            maxWidth: 150
          }}
          >
            
          <View  className='bg-blue-500 border-blue-600 border-[2px] h-[25px] w-[25px] items-center justify-center rounded-[5px]' >
              <Icon name="plus" size={15} color="#f79009" onPress={()=> router.push("/shop")}/>
            </View>
          <View className='flex-row items-center justify-center'>
            <Text className='text-gray-400 font-bold mr-2'>{userDataUsage.mikroChips}</Text>
            <MikroChip/>
          </View>
          </View>
          
        
        </View >
        <View className='flex-1 items-center justify-center '>
        <View className='w-full items-center my-3'>
          <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
            <Text className='font-semibold text-[15px] text-gray-100 text-center'> Hier sind ein paar vorschläge mit denen du durchstarten könntest:</Text>
          </View>
          <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
          <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
          <Image
           source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")}
           style={{ width:150, height:150}}
          />
        </View>
          <View className='  items-center justify-center m-2'
          style={{
            height: 60,
          }}
          >
          <View className='flex-row items-center justify-center '
          style={{
            marginTop: 20
          }}
          >
            <Aktionsempfehlung title={"Bullet Quizz"} subTitle={"5 Fragen"} icon={"rocket"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
            <Aktionsempfehlung title={"Blitz Quizz"} subTitle={"10 Fragen"} icon={"bolt"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
          </View>
          <View className='flex-row items-center justify-center'>
            <Aktionsempfehlung title={"Quick Quizz"} subTitle={"15 Fragen"} icon={"clock"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
            <Aktionsempfehlung title={"Long Quizz"} subTitle={"30 Fragen"} icon={"brain"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
          </View>
          </View>
        </View>
        
        </View>
        <View className='flex-row justify-between mx-4 mb-2'>
          <QuickAccess icon={"bot"} iconColor={"#7a5af8"} iconBackground={"bg-[#372292]"} title={"Erstellen wir ein Modul"} handlePress={()=> setSelectedPage("HomeChat")}/>
          <QuickAccess icon={"search"} iconColor={"#20c1e1"} iconBackground={"bg-[#0d2d3a]"} title={"Entdecke Module"} handlePress={()=> setIsVisibleNewModule(true)}/>
          <QuickAccess icon={"cubes"} iconColor={"#4f9c19"} iconBackground={"bg-[#2b5314]"} title={"Erstelle dein eigenes Modul."} handlePress={()=> setIsVisibleNewFile(true)}/>
        </View>
      </View>
  )
}

export default HomeGeneral