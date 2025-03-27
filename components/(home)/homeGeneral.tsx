import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
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
import { ScrollView } from 'react-native-gesture-handler';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import AddModule from '../(general)/(modal)/addModule';
import { loadUserData } from '@/lib/appwriteDaten';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addNewUserConfig } from '@/lib/appwriteAdd';
import ModalAddFile from '../(general)/(modal)/addFile';

const HomeGeneral = ({setSelectedPage}) => {
  const {user} = useGlobalContext();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  console.log("Api URl",apiUrl)
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
          <TouchableOpacity className='flex-1 p-3 border-gray-700 border-[1px] rounded-[10px] bg-gray-900 h-[100px] items-start justify-center m-1 ' onPress={handlePress}>
            <View className={`rounded-full ${iconBackground} h-[35px] w-[35px] items-center justify-center mb-1`}>
              <Icon name={icon} color={iconColor} size={20}/>
            </View>
            <Text className='font-bold text-gray-100'>{title}</Text>
          </TouchableOpacity>
        )
      }
    
      {/*Aktionsempfehlungen */}
      const Aktionsempfehlung = ({icon, iconColor, iconBackground, title, subTitle, handlePress}) => {
        return (
        <TouchableOpacity className='flex-1 flex-row px-3 border-gray-700 border-[1px] rounded-[10px] bg-gray-900 items-center justify-start m-1 h-[60px]'>
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
        <ModalAddFile isVisible={isvisibleNewFile} setIsVisible={setIsVisibleNewFile}/>
        <ScrollView className='flex-1 mx-4 mb-2 mt-4'>
        {/*Top Bar*/}
        <View className='flex-row justify-between'>
          <TouchableOpacity className='flex-row rounded-full bg-gradient-to-b from-black to-[#ed481c] items-center py-1 px-2' onPress={()=> setIsVisible(true)}>
            <Icon name="fire" size={15} color="#f79009"/>
            <Text className='text-gray-400 font-bold ml-1'>12</Text>
          </TouchableOpacity>
          <GratisPremiumButton/>
        {/*Speaking Bubble*/}
        </View>
        <View className='w-full items-center my-3'>
          <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
            <Text className='font-semibold text-[15px] text-gray-100 text-center'> Hey Test, hierauf solltest du dich heute konzentrieren!</Text>
          </View>
          <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
          <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
          <Image
           source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")}
           style={{ width:150, height:150}}
          />
        </View>
        <View className='flex-row w-full items-center justify-center'>
          <DaySelect day={"Mo"} date={"Feb.10"} status={"fire"}  handlePress={()=> setSelected(0)}/>
          <DaySelect day={"Di"} date={"Feb.11"} status={"miss"}   handlePress={()=> setSelected(1)}/>
          <DaySelect day={"Mi"} date={"Feb.12"} status={"open"}   handlePress={()=> setSelected(2)}/>
          <DaySelect day={"Do"} date={"Feb.13"} status={"open"}   handlePress={()=> setSelected(3)}/>
          <DaySelect day={"Fr"} date={"Feb.14"} status={"pause"}   handlePress={()=> setSelected(4)}/>
          <DaySelect day={"Sa"} date={"Feb.15"} status={"pause"}   handlePress={()=> setSelected(5)}/>
          <DaySelect day={"So"} date={"Feb.16"} status={"pause"}   handlePress={()=> setSelected(6)}/>
        </View>
        <View className='flex-row justify-between items-center m-2'>
          <Text className='font-bold text-[18px] text-gray-100'>{days[selected].lDay}, {getDay()}</Text>
          <View className='flex-row'>
            <TouchableOpacity className='mx-3' onPress={()=> changeSelected(-1)}>
              <Icon name="chevron-left" size={20} color="gray"/>
            </TouchableOpacity>
            <TouchableOpacity className='mx-3' onPress={()=> changeSelected(+1)}>
              <Icon name="chevron-right" size={20} color="gray"/>
            </TouchableOpacity>
          </View>
          
        </View>
        
        
          {
            longVertical ?
            <View className='w-full flex-row'>
              <Aktionsempfehlung title={"Starte ein kurzes Quizz"} subTitle={"5 Fragen über Algorythmen"} icon={"clock"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
              <Aktionsempfehlung title={"Starte ein kurzes Quizz"} subTitle={"15 Fragen über Dantestrukturen"} icon={"brain"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
              <Aktionsempfehlung title={"Starte ein kurzes Quizz"} subTitle={"15 Fragen über Gesellschaft"} icon={"brain"} iconColor={"#21c3e4"} iconBackground={"bg-[#0d2d3a]"}/>
            </View>
            :
            null
        }
          
        {
            !isVertical ?
            <View className='px-3 '>
              <Text className='font-bold text-[15px] text-gray-100'>Schnelle Aktionen</Text>
              <View className='flex-1 pt-3 flex-row'>
                <QuickAccess icon={"file-alt"} iconColor={"#7a5af8"} iconBackground={"bg-[#372292]"} title={"AI Quiz Generieren"}/>
                <QuickAccess icon={"file-pdf"} iconColor={"#519d19"} iconBackground={"bg-[#2b5314]"} title={"PDF zusammenfassen"}/>
              </View>
              <View className='flex-1 flex-row'>
                <QuickAccess icon={"lightbulb"} iconColor={"#c1840b"} iconBackground={"bg-[#713b12]"} title={"Thema Verstehen"}/>
                <QuickAccess icon={"folder"} iconColor={"#15b79e"} iconBackground={"bg-[#134e48]"} title={"Modul zusammenfassen"}/>
              </View>
            </View>
            :
            null
          }
        </ScrollView>
        <View className='border-t-[1px] border-gray-700'>
          {
            isVertical ?
            <View className='flex-1 px-3 pt-3 flex-row'>
              <QuickAccess icon={"robot"} iconColor={"#7a5af8"} iconBackground={"bg-[#372292]"} title={"AI Quiz Generieren"} handlePress={()=> setSelectedPage("HomeChat")}/>
              <QuickAccess icon={"cubes"} iconColor={"#519d19"} iconBackground={"bg-[#2b5314]"} title={"Modul Hinzufügen"} handlePress={()=> setIsVisibleNewModule(true)}/>
              <QuickAccess icon={"file-alt"} iconColor={"#c1840b"} iconBackground={"bg-[#713b12]"} title={"Datei Hochladen"} handlePress={()=> setIsVisibleNewFile(true)}/>
              <QuickAccess icon={"layer-group"} iconColor={"#15b79e"} iconBackground={"bg-[#134e48]"} title={"Session Hinzufügen"} />
            </View>
            :
            null
          }
        <View className='flex-row p-3 items-center'>
          <TouchableOpacity className='rounded-full h-[40px] w-[40px] bg-gray-900 items-center justify-center border-gray-700 border-[1px]' onPress={()=> setIsVisibleDataUpload(true)} >
            <Icon name="paperclip" size={15} color="gray"/>
          </TouchableOpacity>
          <View className='flex-1 ml-2'>
          <CustomTextInputChat placeholder={"Frag mich was cooles..."}/>
          </View>
          </View>
        </View>
      </View>
  )
}

export default HomeGeneral