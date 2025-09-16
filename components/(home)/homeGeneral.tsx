import { View, Dimensions, Text,ScrollView, TouchableOpacity, RefreshControl, Platform, Modal, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ContinueBox from '../(signUp)/(components)/continueBox';
import Icon from 'react-native-vector-icons/FontAwesome5'
import VektorCircle from '../(karteimodul)/vektorCircle';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllQuestionsBySessionId, getModules, getSessionQuestions } from '@/lib/appwriteQuerys';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { returnColor } from '@/functions/returnColor';
import TokenHeader from '../(general)/tokenHeader';
import AddAiBottomSheet from '../(general)/(modal)/addAiBttomSheet';
import AddModuleBottomSheet from '../(general)/(modal)/addModuleBottomSheet';
import { WebView } from 'react-native-webview';
import CustomButton from '../(general)/customButton';
import { generateQuestions } from '@/functions/(aiQuestions)/materialToModule';


const { width } = Dimensions.get('window');

const HomeGeneral = () => {
  const { user, userUsage } = useGlobalContext()
  const [ userUsageP, setUserUsageP ] = useState(null)
  let count = 0
  useEffect(() => {
    count++
    if(userUsage) {
      setUserUsageP({
        ...userUsage,
        lastModules: userUsage.lastModules.map((item) => JSON.parse(item)),
        lastSessions: userUsage.lastSessions.map((item) => JSON.parse(item)),
      })
    }
  },[userUsage])

 
  const { language } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  const texts = languages.home;
  useEffect(() => {
    count++
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])

  
  {/*Überschrift für die einzelnen Abteie */}
  const Header = ({title}) => {
    return (
      <View className='flex-row items-center justify-between my-2'>
        <Text className='text-white font-bold text-[15px]'>{title}</Text>
      </View>
    )
  }

  async function directToModule(moduleID) {
    const allModules = await getModules(user.$id);
    const index = allModules?.documents.findIndex((item) => {
      item.$id === moduleID
      return item.$id === moduleID
    });
    if (index !== -1) {
      router.push({
        pathname:"/bibliothek",
        params: {selectedModuleIndex: index?.toString()}
      })
    } else {
      router.push("/bibliothek")
    }
  }

  const Module = ({item}) => {
    return (
      <TouchableOpacity className='bg-gray-900 rounded-[10px] mx-2 border-gray-800 border-[1px]  items-center justify-between' onPress={() => {directToModule(item.sessionID)}}>
        <View 
        className={`bg-${item.color?.toLowerCase()}-500 rounded-t-[10px]`}
        style={{
          backgroundColor: returnColor(item.color?.toLowerCase()),
          width: "100%",
          height: 5, 
        }}
          />
        <View className='p-3 justify-start'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-white font-bold text-[15px]'>{item.name}</Text>
            <VektorCircle color={item.color?.toLowerCase()} percentage={item.percent} icon={"clock"} strokeColor={item.color?.toLowerCase()}/>

          </View>
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{item.fragen} {texts[selectedLanguage].questions} • {item.sessions} {texts[selectedLanguage].sessions}</Text>
          
        </View>
      </TouchableOpacity>
    )
  }




  async function startQuiz(session) {
    console.log("Starting quiz for session:", session);
    const questions = await getSessionQuestions(session.sessionID)
    if (!questions || questions.length == 0 ) {
      router.push("/bibliothek")
      return;
    }
    console.log("Elements:",
      session.sessionID,
      "infinite", // infinite, limited, limitedTime, limitedAllCorrect
      "multiple", // single, multiple, questionAnswer
      null,  // How many questions should be in the quiz
      null   ,            // Timelimit will be in seconds
      questions[0].subjectID   //CHANGE REQUIRED LATER IN PRODUCTION
    )

    router.push({
                  pathname:"/quiz",
                  params: {
                    sessionID: session.sessionID,
                    quizType : "infinite", // infinite, limited, limitedTime, limitedAllCorrect
                    questionType : "multiple", // single, multiple, questionAnswer
                    questionAmount : null,  // How many questions should be in the quiz
                    timeLimit : null   ,            // Timelimit will be in seconds
                    moduleID: questions[0].subjectID
                }
              }) 
  }



  const Session = ({item}) => {
    return (
      <TouchableOpacity className='bg-gray-900 rounded-[10px] p-3 mx-2 border-gray-800 border-[1px]  items-center justify-between' 
      onPress={() => startQuiz(item)}>
        <View className='flex-row items-center justify-between'>
          <View className='items-start  '>
            <Text className='text-white font-bold text-[15px]'>{item.name}</Text>
            <Text className='text-gray-500 font-bold text-[15px]'>{item.questions} {texts[selectedLanguage].questions}</Text>
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
            backgroundColor: returnColor(item.color?.toLowerCase() || "blue"),

          }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  {/* Schnelle Aktionen für den Nutzer */}
  let quickActions = [
    {
      text: texts[selectedLanguage].learnSetKI,
      colorBorder: '#7a5af8',
      colorBG: '#372292',
      iconName: 'bot',
      handlePress: () => setIsVisibleAiModule(true),
    },
    {
      text: texts[selectedLanguage].learnSetDiscover,
      colorBorder: '#20c1e1',
      colorBG: '#0d2d3a',
      iconName: 'search',
      handlePress: () => router.push("/entdecken"),
    },
    {
      text: texts[selectedLanguage].learnSetCreate,
      colorBorder: '#4f9c19',
      colorBG: '#2b5314',
      iconName: 'cubes',
      handlePress: () => setIsVisibleNewModule(true),
      
    },
  ]



  
  const [ isVisibleNewModule, setIsVisibleNewModule] = useState(false)

  const QuickAction = ({item}) => {
    return (
      <ContinueBox
        text={item.text}
        colorBorder={item.colorBorder}
        colorBG={item.colorBG}
        iconName={item.iconName}
        handlePress={item.handlePress}
        horizontal={width > 700 ? false : true}
        selected={true}
      />
    )
  }


  const [isVisibleNewAiModule, setIsVisibleAiModule] = useState(false)


  const [ refreshing, setRefreshing ] = useState(false)
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

 

  return (
    <SafeAreaView className='h-full w-full  '>
      
    <ScrollView
       style={{
          height: '100%',
       }}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          // Android
          colors={Platform.OS === 'android' ? ['#3b82f6'] : undefined} // blue-500
          progressBackgroundColor={Platform.OS === 'android' ? '#000' : undefined} // gray-200
          // iOS
          tintColor={Platform.OS === 'ios' ? '#3b82f6' : undefined}
          title={Platform.OS === 'ios' ? 'Aktualisieren...' : undefined}
          titleColor={Platform.OS === 'ios' ? '#374151' : undefined} // gray-700
          // Web
          progressViewOffset={Platform.OS === 'web' ? 0 : 0}
        />
      }
    >
      <TokenHeader userUsage={userUsageP} />
      

    <View className='flex-1 rounded-[10px] p-3'>
      <Header title={texts[selectedLanguage].lastModules}/>
      <ScrollView  horizontal={true} className='flex-row'
      style={{
        scrollbarWidth: 'thin', // Dünne Scrollbar
        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
      }}>
          {
            !userUsageP || userUsageP.lastModules.length == 0 ?
            <View className='flex-1'>
              <Module item={{
                  name: "Getting Started",
                  percent : 100,
                  color: "blue",
                  fragen : 10,
                  sessions : 7,
              }}/>
            </View>
            :
            userUsageP.lastModules.map((item, index) => {
              return (
                <Module key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={texts[selectedLanguage].lastSessions}/>
      <ScrollView  horizontal={true} className='flex-row'
      style={{
        scrollbarWidth: 'thin', // Dünne Scrollbar
        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
      }}>
          {
            !userUsageP || userUsageP.lastSessions.filter((s)=> s.questions > 0).length == 0 ?
            <View  className='flex-row'>
              <Session item={{
                  name: "Erstes Modul",
                  percent : 100,
                  color: "blue",
                  icon: "cubes",
                  questions : 5,
              }}/>
              <Session item={{
                  name: "Personalisiertes Profil",
                  percent : 100,
                  color: "red",
                  icon: "user",
                  questions : 7,
              }}/>
              <Session item={{
                  name: "Sign Up",
                  percent : 100,
                  color: "green",
                  icon: "user",
                  questions : 3,
              }}/>
            </View> 
            :
            userUsageP.lastSessions.filter((s)=> s.questions > 0).map((item, index) => {
              return (
                <Session key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={texts[selectedLanguage].quickActions}/>
      <View key={selectedLanguage} className={`${width > 700 ? "flex-row" : ""} `}>
        {
          quickActions.map((item, index) => {
            return (
              <QuickAction key={index} item={item} />
            )
          })
        }
      </View>
    </View>

        {/*
        My testing button
        */}
      <CustomButton
            title='Do Stuff :)'
            handlePress={() => router.push(
              {
                pathname:"/quiz",
                params: {
                  sessionID: "ce9122db-03a6-4fcb-96b9-8b28adcca9a8",
                  quizType : "questionAnswer", // infinite, limited, limitedTime, limitedAllCorrect
                  questionType : "single", // single, multiple, questionAnswer
                  questionAmount : 10,  // How many questions should be in the quiz
                  timeLimit : null   ,            // Timelimit will be in seconds
                  moduleID: "686a934a4140eb9893b9"
                }
              }
            )}
            /*
              Potential Cases
              1. Unendlich Fragen kein Zeitlimit
              2. Unendlich Fragen mit Zeitlimit

              3. Limitierte Fragen kein Zeitlimit
              4. Limitierte Fragen Zeitlimit 

              5. Limitierte Fragen bis alle korrekt sind kein Zeitlimit
              6. Limitierte Fragen bis alle korrekt sind Zeitlimit


            */
            containerStyles='m-4 bg-blue-700'
            />
    </ScrollView>
    { isVisibleNewAiModule ?
        <AddAiBottomSheet isVisibleAiModule={isVisibleNewAiModule} setIsVisibleAiModule={setIsVisibleAiModule}/>
        : null}
      { isVisibleNewModule ?
        <AddModuleBottomSheet isVisibleAiModule={isVisibleNewModule} setIsVisibleAiModule={setIsVisibleNewModule}/>
        : null}
    </SafeAreaView>
  )
}

export default HomeGeneral


