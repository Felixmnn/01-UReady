import { View, Dimensions, Text,ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContinueBox from '../(signUp)/(components)/continueBox';
import Icon from 'react-native-vector-icons/FontAwesome5'
import VektorCircle from '../(karteimodul)/vektorCircle';
import { router } from 'expo-router';
import AddModule from '../(general)/(modal)/addModule';
import AddAiModule from '../(general)/(modal)/addAiModule';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getModules, getSessionQuestions } from '@/lib/appwriteQuerys';
import { getCountryList, getEducationList, getSchoolList, getUniversityList } from '@/lib/appwritePersonalize';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { returnColor } from '@/functions/returnColor';
import TokenHeader from '../(general)/tokenHeader';
import { loadUserUsage } from '@/lib/appwriteDaten';


const { width } = Dimensions.get('window');

const HomeGeneral = () => {
  const { user,language, userUsage } = useGlobalContext()
  
  const [ userUsageP, setUserUsageP ] = useState(null)
  useEffect(() => {
    if(userUsage) {
      setUserUsageP({
        ...userUsage,
        lastModules: userUsage.lastModules.map((item) => JSON.parse(item)),
        lastSessions: userUsage.lastSessions.map((item) => JSON.parse(item)),
      })
    }
  },[userUsage])

 

  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  const texts = languages.home;

  useEffect(() => {
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
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{item.fragen} Fragen • {item.sessions} Sessions</Text>
          
        </View>
      </TouchableOpacity>
    )
  }




  async function startQuiz(session) {
    const questions = await getSessionQuestions(session.sessionID)
    if (!questions || questions.length == 0) {
      router.push("/bibliothek")
      return;
    }
    router.push({
                  pathname:"quiz",
                  params: {questions: JSON.stringify(questions), moduleID: session.moduleID }
              }) 
  }



  const Session = ({item}) => {
    return (
      <TouchableOpacity className='bg-gray-900 rounded-[10px] p-3 mx-2 border-gray-800 border-[1px]  items-center justify-between' onPress={() => startQuiz(item)}>
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
            backgroundColor: returnColor(item.color?.toLowerCase()),

          }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  {/* Schnelle Aktionen für den Nutzer */}
  const [quickActions, setQuickActions] = useState([
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
  ])

  const [ newModule, setNewModule] = useState({
            name: "",
            subject: "",
            questions: 0,
            notes: 0,
            documents: 0,
            public: false,
            progress: 0,
            creator: "",
            color: null,
            sessions: [],
            tags: [],
            description: "",
            releaseDate: null,
            connectedModules: [],
            qualityScore: 0,
            duration: 0,
            upvotes: 0,
            downVotes: 0,
            creationCountry: null,
            creationUniversity: null,
            creationUniversityProfession: null,
            creationRegion: null,
            creationUniversitySubject: [],
            creationSubject: [],
            creationEducationSubject: "",
            creationUniversityFaculty: [],
            creationSchoolForm: null,
            creationKlassNumber: null,
            creationLanguage: null,
            creationEducationKathegory:"",
            copy: false,
            questionList: [],
            synchronization: false,

            });
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
    console.log("Refreshing...");
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(()=> {
    async function fetchData() {
      const userUsage = await loadUserUsage(user.$id)
      setUserUsageP({
        ...userUsage,
        lastModules: userUsage.lastModules.map((item) => JSON.parse(item)),
        lastSessions: userUsage.lastSessions.map((item) => JSON.parse(item)),
      })
    }
  },[refreshing])


  return (
    <ScrollView
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
      <AddModule isVisible={isVisibleNewModule} setIsVisible={setIsVisibleNewModule} newModule={newModule} setNewModule={setNewModule} />
      <AddAiModule isVisible={isVisibleNewAiModule} setIsVisible={setIsVisibleAiModule} />
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
            <View>
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
            !userUsageP || userUsageP.lastModules.length == 0 ?
            <View className='flex-row'>
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
            userUsageP.lastSessions.map((item, index) => {
              return (
                <Session key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={texts[selectedLanguage].quickActions}/>
      <View className={`${width > 700 ? "flex-row" : ""} `}>
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