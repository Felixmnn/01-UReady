import { View, Dimensions, Text,ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ModalStreak from '@/components/(home)/modalStreak';
import ContinueBox from '../(signUp)/(components)/continueBox';
import Icon from 'react-native-vector-icons/FontAwesome5'
import VektorCircle from '../(karteimodul)/vektorCircle';


const { width } = Dimensions.get('window');

const HomeGeneral = ({setSelectedPage}) => {
  const [isVisible, setIsVisible] = useState(false);
  

  
  {/*Überschrift für die einzelnen Abteie */}
  const Header = ({title}) => {
    return (
      <View className='flex-row items-center justify-between my-2'>
        <Text className='text-white font-bold text-[15px]'>{title}</Text>
      </View>
    )
  }

  {/* Letzte Module oder Sessions */}
  const [last5Sessions, setLast5Sessions] = useState([
    {
      name: "Session 1",
      percent : 50,
      color: "red",
      icon: "book",
      questions : 10,
    },
    {
      name: "Session 2",
      percent : 70,
      color: "blue",
      icon: "book",
      questions : 10,
    },
    {
      name: "Session 3",
      percent : 30,
      color: "green",
      icon: "book",
      questions : 10,
    },
    {
      name: "Session 4",
      percent : 90,
      color: "yellow",
      icon: "book",
      questions : 10,
    },
    {
      name: "Session 5",
      percent : 10,
      color: "purple",
      icon: "book",
      questions : 10,
    }
  ])
  const [last5Modules, setLast5Modules] = useState([
    {
      name: "Module 1",
      percent: 50,
      color: "red",
      fragen: 10,
      sessions: 5,
    },
    {
      name: "Module 2",
      percent: 70,
      color: "blue",
      fragen: 10,
      sessions: 5,
    },
    {
      name: "Module 3",
      percent: 30,
      color: "green",
      fragen: 10,
      sessions: 5,
    },
    {
      name: "Module 4",
      percent: 90,
      color: "yellow",
      fragen: 10,
      sessions: 5,
    },
    {
      name: "Module 5",
      percent: 10,
      color: "purple",
      fragen: 10,
      sessions: 5,
    }
  ])

  const options = [
    "Modules",
    "Sessions",
  ]

  const Module = ({item}) => {
    return (
      <View className='bg-gray-900 rounded-[10px] mx-2 border-gray-800 border-[1px]  items-center justify-between'>
        <View 
        className={`bg-${item.color}-500 rounded-t-[10px]`}
        style={{
          width: "100%",
          height: 5, 
        }}
          />
        <View className='p-3 justify-start'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-white font-bold text-[15px]'>{item.name}</Text>
            <VektorCircle color={item.color} percentage={item.percent} icon={"clock"} strokeColor={item.color}/>

          </View>
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{item.fragen} Fragen • {item.sessions} Sessions</Text>
          
        </View>
      </View>
    )
  }

  const Session = ({item}) => {
    return (
      <View className='bg-gray-900 rounded-[10px] p-3 mx-2 border-gray-800 border-[1px]  items-center justify-between'>
        <View className='flex-row items-center justify-between'>
          <View className='items-start  '>
            <Text className='text-white font-bold text-[15px]'>{item.name}</Text>
            <Text className='text-gray-500 font-bold text-[15px]'>{item.questions} Fragen</Text>
          </View>
          <View className='p-3'>
            <Icon name={item.icon} size={20} color={"white"}/>
          </View>
        </View>
        <View className='rounded-full p-2'>
          <Text className='text-white font-bold text-[15px]'>{item.percent}%</Text>
        </View>
        <View className='bg-gray-700 rounded-full w-full '>
          <View className={` bg-${item.color}-500 rounded-full p-1`}
          style={{
            width: `${item.percent}%`,

          }}
          />
        </View>
      </View>
    )
  }

  {/* Schnelle Aktionen für den Nutzer */}
  const [quickActions, setQuickActions] = useState([
    {
      text: 'Erstellen wir zusammen ein Lernset.',
      colorBorder: '#7a5af8',
      colorBG: '#372292',
      iconName: 'bot',
    },
    {
      text: 'Mal schauen was deine Komilitonen lernen.',
      colorBorder: '#20c1e1',
      colorBG: '#0d2d3a',
      iconName: 'search',
    },
    {
      text: 'Erstelle dein eigenes Lernset.',
      colorBorder: '#4f9c19',
      colorBG: '#2b5314',
      iconName: 'cubes',
    },
  ])

  const QuickAction = ({item}) => {
    return (
      <ContinueBox
        text={item.text}
        colorBorder={item.colorBorder}
        colorBG={item.colorBG}
        iconName={item.iconName}
        handlePress={()=> {}}
        horizontal={width > 700 ? false : true}
        selected={true}
      />
    )
  }

  {/*Nutzer Aktivtäts Daten*/}
  const [userActivity, setUserActivity] = useState({
    streak: 0,
    energy: 5,
    microChips: 10000,
  })

  const [ streakModalVisible, setStreakModalVisible] = useState(false);
  const days = [
    {sDay:"Mo",lDay:"Montag"},
    {sDay:"Di",lDay:"Dienstag"},
    {sDay:"Mi",lDay:"Mittwoch"},
    {sDay:"Do",lDay:"Donnerstag"},
    {sDay:"Fr",lDay:"Freitag"},
    {sDay:"Sa",lDay:"Samstag"},
    {sDay:"So",lDay:"Sonntag"},
  ]


  
  return (
    <ScrollView>
      <ModalStreak isVisible={streakModalVisible} setIsVisible={setStreakModalVisible} tage={userActivity.streak} days={days}/>
    <View className='flex-1 p-2 rounded-[10px]'>
      <View className='w-full flex-row justify-between'>
                <TouchableOpacity className='flex-row m-2 p-5' onPress={()=> {setStreakModalVisible(true)}}>
                  <Icon name="fire" size={20} color={"white"}/>
                  <Text className='text-white font-bold text-[15px] ml-2'>{userActivity.streak}</Text>
                </TouchableOpacity>

                <View className='flex-row m-2 p-5' >
                  <TouchableOpacity className='flex-row mx-5' >
                    <Icon name="microchip" size={20} color={"white"}/>
                    <Text className='text-white font-bold text-[15px] ml-2'>{userActivity.microChips}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className='flex-row' >
                    <Icon name="bolt" size={20} color={"white"}/>
                    <Text className='text-white font-bold text-[15px] ml-2'>{userActivity.energy}</Text>
                  </TouchableOpacity>
                </View>

      </View>
      <Header title={"Letzte Module"}/>
      <ScrollView  horizontal={true} className='flex-row'>
          {
            last5Modules.map((item, index) => {
              return (
                <Module key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={"Letzte Sessions"}/>
      <ScrollView  horizontal={true} className='flex-row'>
          {
            last5Sessions.map((item, index) => {
              return (
                <Session key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={"Schnelle Aktionen"}/>
      <View className={`${width > 700 ? "flex-row" : "flex-col"} `}>
        {
          quickActions.map((item, index) => {
            return (
              <QuickAction key={index} item={item} />
            )
          })
        }
      </View>
    </View>
    </ScrollView>
  )
}

export default HomeGeneral