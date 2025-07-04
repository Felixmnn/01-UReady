import { View, Text, TouchableOpacity, ScrollView,FlatList, Image, RefreshControl, Platform } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { loadUserDataKathegory} from "../../../lib/appwriteDaten"
import AddModule from '@/components/(general)/(modal)/addModule';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateUserUsageModules } from '@/lib/appwriteUpdate';
import  languages  from '@/assets/exapleData/languageTabs.json';
import TokenHeader from '@/components/(general)/tokenHeader';
import AddAiModule from '@/components/(general)/(modal)/addAiModule';
import AddAiBottomSheet from '@/components/(general)/(modal)/addAiBttomSheet';
import AddModuleBottomSheet from '@/components/(general)/(modal)/addModuleBottomSheet';

const AllModules = ({setSelected, modules, setSelectedModule, onRefresh, refreshing}) => {
    const [last7Hidden, setLast7Hidden ] = useState(true)
    const [ last30Hidden, setLast30Hidden ] = useState(true)
    const [ lastYearHidden, setLastYearHidden ] = useState(true)

    

    const { user,language, userUsage } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
      
    const texts = languages.allModules;
   
      
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
    const numColumns = Math.floor(width / 300);

    function isBetweenNDaysAgo(targetDateIso: string, minDaysAgo: number, maxDaysAgo: number): boolean {
    const now = new Date().getTime();
    const target = new Date(targetDateIso).getTime();

    const minAgo = now - minDaysAgo * 24 * 60 * 60 * 1000;
    const maxAgo = now - maxDaysAgo * 24 * 60 * 60 * 1000;

    return target <= minAgo && target >= maxAgo;
}

function calculatePercent(questions){
  const parsedQuestions = questions.map(q => JSON.parse(q));
  let sum = 0;
    for (let i = 0; i < parsedQuestions.length; i++) {
      if (parsedQuestions[i].status =="BAD") sum -= 1;
      if (parsedQuestions[i].status =="OK") sum += 0;
      if (parsedQuestions[i].status =="GOOD") sum += 1;
      if (parsedQuestions[i].status =="GREAT") sum += 2;

  }    
  
  return Math.floor((sum / (questions.length * 2)) * 100);

}


    const [ newModule, setNewModule] = useState({
          name: "",
          subject: "",
          questions: 0,
          notes: 0,
          documents: 0,
          "public": false,
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
          synchronization: false

          });

    const [ userData, setUserData] = useState(null)

    useEffect(() => {
      if (userData == null) return ;
      setNewModule({
          ...newModule, 
          releaseDate: new Date(),
          creator:userData.$id,
          creationCountry: userData.country,
          creationUniversity: userData.university,
          creationUniversityProfession: userData.studiengangZiel,
          creationRegion: userData.region,
          creationUniversitySubject: userData.studiengang,
          creationSubject: userData.schoolSubjects,
          creationEducationSubject: userData.educationSubject,
          creationUniversityFaculty: userData.faculty,
          creationSchoolForm: userData.schoolType,
          creationKlassNumber: userData.schoolGrade,
          creationLanguage: userData.language,
          creationEducationKathegory:userData.educationKathegory,
          studiengangKathegory:userData.studiengangKathegory,
          
          kategoryType: userData.kategoryType,
      });
  },[userData])

    useEffect(() => {
        if (user == null) return;
        async function fetchUserData() {
           const res = await loadUserDataKathegory(user.$id);
           setUserData(res);
        }
        fetchUserData()
    }, [user])

      
    const [ isVisibleAI, setIsVisibleAI] = useState(false)

    const ModuleList = ({items=[], header="Letzte 7 Tage" }) => {
      const [ isVisible, setIsVisible] = useState(false);
      return (
        <View className={`flex-1 mb-4`}>
        <TouchableOpacity className='' onPress={()=> setIsVisible(!isVisible)}>
          <View className='flex-row items-center justify-between w-full mb-2'>
            <Text className='font-bold text-gray-100 text-[18px]'>{header}</Text>
            <Icon name={isVisible ? "chevron-down" : "chevron-up"} size={20} color="white"/>
          </View>
        </TouchableOpacity>
          {!isVisible && (
          <View className={`flex-1 flex-row flex-wrap`}
          
          >
            {items.map((item, index) => (
              <View key={item.$id} className='flex-1 mr-2 mb-2' style={{ width: `${100 / numColumns}%` , minWidth:300}} >

                <Karteikarte
                  handlePress={async () => {
                    await updateUserUsageModules(user.$id, {
                      name: item.name,
                      percent: Number.isInteger(calculatePercent(item.questionList)) ? calculatePercent(item.questionList) : 0,
                      color: item.color,
                      fragen: item.questions,
                      sessions: item.sessions.length,
                      sessionID: item.$id
                    });
                    setSelected("SingleModule");
                    setSelectedModule(index);
                  }}
                  farbe={item.color}
                  percentage={Number.isInteger(calculatePercent(item.questionList)) ? calculatePercent(item.questionList) : 0}
                  titel={item.name}
                  studiengang={item.description}
                  fragenAnzahl={item.questions}
                  notizAnzahl={item.notes}
                  creator={item.creator}
                  availability={item.public}
                  icon={"clock"}
                  publicM={item.public}
                />
              </View>
            ))}
          </View>
        )}
        </View>
      )

    }
  return (
    <View className='flex-1 rounded-[10px] bg-[#0c111d] '>
        <TokenHeader userUsage={userUsage}/>
        <View className={`flex-row justify-start items-center rouned-[10px] mx-5 my-2 `}>
          
          <TouchableOpacity onPress={()=> {setIsVisibleNewModule(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Icon name="cubes" size={15} color="white"/>
              <Text className='text-gray-300 text-[12px] ml-2'>{texts[selectedLanguage].erstelleModul}</Text> 
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {setIsVisibleAI(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Image source={require("../../../assets/bot.png")} style={{height: 16, width: 16}} />
              <Text className='text-gray-300 text-[12px] ml-2'>{texts[selectedLanguage].erstelleModul}</Text> 
          </TouchableOpacity>
          
        </View>
        <View className='border-t-[1px] border-gray-700 w-full  ' />
        <ScrollView
          className={`flex-1 bg-gray-900 ${isVertical ? "p-4" : "p-2"}`}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={Platform.OS === 'android' ? ['#3b82f6'] : undefined}
              progressBackgroundColor={Platform.OS === 'android' ? '#000' : undefined}
              tintColor={Platform.OS === 'ios' ? '#3b82f6' : undefined}
              title={Platform.OS === 'ios' ? 'Aktualisieren...' : undefined}
              titleColor={Platform.OS === 'ios' ? '#374151' : undefined}
            />
          }
        >
          <View style={{flexGrow:1.5}}>
          <ModuleList
            items={modules.documents.filter(i => isBetweenNDaysAgo(i.$updatedAt, 0, 7))}
            header={texts[selectedLanguage].last7}
          />
          </View>
          { modules.documents.filter(i => isBetweenNDaysAgo(i.$updatedAt, 7, 30)).length > 0 ? (
        <ModuleList
          items={modules.documents.filter(i => isBetweenNDaysAgo(i.$updatedAt, 7, 30))}
          header={texts[selectedLanguage].last30}
        />
        ):null}
        { modules.documents.filter(i => isBetweenNDaysAgo(i.$updatedAt, 30, 365)).length > 0 ? (
        <ModuleList
          items={modules.documents.filter(i => isBetweenNDaysAgo(i.$updatedAt, 30, 365))}
          header={"365"}
        />
        ):null}
        
        

        </ScrollView>
        { isVisibleAI ?
        <AddAiBottomSheet isVisibleAiModule={isVisibleAI} setIsVisibleAiModule={setIsVisibleAI}/>
        : null}
        { isVisibleNewModule ?
        <AddModuleBottomSheet isVisibleAiModule={isVisibleNewModule} setIsVisibleAiModule={setIsVisibleNewModule}/>
        : null}
      </View>
  )
}

export default AllModules