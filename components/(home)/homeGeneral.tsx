import { View, Dimensions, Text,ScrollView, TouchableOpacity } from 'react-native'
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


const { width } = Dimensions.get('window');

const HomeGeneral = ({setSelectedPage}) => {
  const { user,language, userUsage } = useGlobalContext()
  
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  const texts = languages.home;

  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])

  async function getPersonalData() {
    const res = await getCountryList();
    const universityListID = res[0].universityListID
    const educationListID = res[0].educationListID
    const schoolListID = res[0].schoolListID
    const universityList = await getUniversityList(universityListID);
    const educationList = await getEducationList(educationListID);
    const schoolList = await getSchoolList(schoolListID);
    console.log(res,universityList,educationList,schoolList);
  }
  
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
        className={`bg-${item.color.toLowerCase()}-500 rounded-t-[10px]`}
        style={{
          width: "100%",
          height: 5, 
        }}
          />
        <View className='p-3 justify-start'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-white font-bold text-[15px]'>{item.name}</Text>
            <VektorCircle color={item.color.toLowerCase()} percentage={item.percent} icon={"clock"} strokeColor={item.color.toLowerCase()}/>

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
                  params: {questions: JSON.stringify(questions)}
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
  return (
    <ScrollView>
      <AddModule isVisible={isVisibleNewModule} setIsVisible={setIsVisibleNewModule} newModule={newModule} setNewModule={setNewModule} />
      <AddAiModule isVisible={isVisibleNewAiModule} setIsVisible={setIsVisibleAiModule} />

    <View className='flex-1 p-2 rounded-[10px]'>
      <View className='w-full flex-row justify-between'>
          <TouchableOpacity className='flex-row m-2 p-5' >
            <Icon name="fire" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.streak}</Text>
          </TouchableOpacity>

          <View className='flex-row m-2 p-5' >
            <TouchableOpacity className='flex-row mx-5' onPress={()=> router.push("/shop")} >
              <Icon name="microchip" size={20} color={"white"}/>
              <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.microchip}</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row' onPress={()=> router.push("/shop")}
            >
              <Icon name="bolt" size={20} color={"white"}/>
              <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.boostActive ? "∞" : userUsage?.energy}</Text>
            </TouchableOpacity>
          </View>

      </View>
      <Header title={texts[selectedLanguage].lastModules}/>
      <ScrollView  horizontal={true} className='flex-row'
      style={{
        scrollbarWidth: 'thin', // Dünne Scrollbar
        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
      }}>
          {
            !userUsage || userUsage.lastModules.length == 0 ?
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
            userUsage.lastModules.map((item, index) => {
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
            !userUsage || userUsage.lastModules.length == 0 ?
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
            userUsage.lastSessions.map((item, index) => {
              return (
                <Session key={index} item={item} />
              )
            })
          }
      </ScrollView>
      <Header title={texts[selectedLanguage].quickActions}/>
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
    <TouchableOpacity className='bg-gray-900 rounded-[10px] p-3 mx-2 border-gray-800 border-[1px]  items-center justify-between' onPress={async() => await getPersonalData() }>
        <Text className='text-white font-bold'> Load Country List</Text>
    </TouchableOpacity>
    </ScrollView>
  )
}

export default HomeGeneral