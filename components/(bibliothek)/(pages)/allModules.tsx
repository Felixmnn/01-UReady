import { View, Text, TouchableOpacity, ScrollView,FlatList, Image, RefreshControl, Platform } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, {   useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import TokenHeader from '@/components/(general)/tokenHeader';
import AddAiBottomSheet from '@/components/(general)/(modal)/addAiBttomSheet';
import AddModuleBottomSheet from '@/components/(general)/(modal)/addModuleBottomSheet';
import { module } from '@/types/appwriteTypes';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSpecificModule } from '@/lib/appwriteShare';
import { ModuleProps } from '@/types/moduleTypes';
import AcceptShareModule from '../(components)/acceptShareModule';
import { returnNewLastModule } from '@/functions/addLastSessionModule';
import { getPublicProfile, updatePublicProfile } from '@/lib/collections/publicProfile';

export function calculatePercent(questions:string[]){
  let parsedQuestions = []
   parsedQuestions = questions.map(q => 
   {
    try {
      if (typeof q == "object") {
        return q
      } else {
     return JSON.parse(q);
      }
    } catch (error) {
      console.log("Error parsing question:", q, error);
      return { status: null }; 
    }
  })
  
  let sum = 0;
    for (let i = 0; i < parsedQuestions.length; i++) {
      if (parsedQuestions[i].status =="BAD") sum -= 1;
      if (parsedQuestions[i].status =="OK") sum += 0.25;
      if (parsedQuestions[i].status =="GOOD") sum += 1;
      if (parsedQuestions[i].status =="GREAT") sum += 1.5;

  }    
  const percent = Math.floor((sum / (questions.length)) * 100)
  return typeof percent === "number" && !isNaN(percent) ? percent : 0;

}


type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";
  
const AllModules = ({
  setSelected,
  modules,
  setSelectedModule,
  onRefresh,
  refreshing,
  setModules  
}:{
  setSelected: React.Dispatch<React.SetStateAction<ScreenType>>,
  modules: module[] | null,
  setSelectedModule: React.Dispatch<React.SetStateAction<number | null>>,
  onRefresh: () => void,
  refreshing: boolean,
  setModules: React.Dispatch<React.SetStateAction<module[] | []>>
}) => {

    const { t } = useTranslation();

    const { user, userUsage, setUserUsage } = useGlobalContext()
    

      
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
    const numColumns = Math.floor(width / 300);

  



  const [ moduleToBeAdded, setModuleToBeAdded ] = useState<ModuleProps | null>(null);

  useEffect(() => {
    if (!user) return;
    async function showCopyModuleIfAvailable() {

      const moduleToBeAdded = await AsyncStorage.getItem("moduleToBeAddedAfterSignUp");
      if (moduleToBeAdded) {
        await getSpecificModule(JSON.parse(moduleToBeAdded)).then((res => {
          if (res) {
            setModuleToBeAdded(res as any as ModuleProps);
          }
      }))
    }
  }
    showCopyModuleIfAvailable();
  
  }, []);

  useEffect(() => {
    if (!user || !modules) return;

    async function syncPublicProfileModules() {
      const moduleList: module[] = modules ?? [];
      const publicModuleIds = moduleList
        .filter((mod) => mod.public && mod.creator === user.$id)
        .map((mod) => mod.$id)
        .filter((id): id is string => typeof id === "string");

      const profile = await getPublicProfile(user.$id, { name: user.name });
      if (!profile) return;

      const currentModuleIds = profile.modules || [];
      const unchanged =
        currentModuleIds.length === publicModuleIds.length &&
        currentModuleIds.every((id, index) => id === publicModuleIds[index]);

      if (unchanged) return;

      await updatePublicProfile({
        ...profile,
        modules: publicModuleIds,
      });
    }

    syncPublicProfileModules();
  }, [modules, user]);


    const [ presenation, setPresentation ] = useState<"list" | "grid">("list")
    const [ filters , setFilters ] = useState<"all" | "public" | "private" | "archived">("all")
    const goToNextFilter = () => {
      if (filters == "all") setFilters("public");
      else if (filters == "public") setFilters("private");
      else if (filters == "private") setFilters("archived");
      else if (filters == "archived") setFilters("all");
    }

    const [ isVisibleAI, setIsVisibleAI] = useState(false)
    const ModuleList = ({
      items,
      presentation = "grid"
     }:{
        presentation?: "grid" | "list";
      items: module[]
     }) => {
      return (
        <View className={` mb-4`}>
          <View className={`flex-1 flex-row flex-wrap py-2 mb-[65px]`}>
            {items.map((item:module, index) => (
              <View key={item.$id} className='flex-1 mr-2 mb-2' style={{ 
                width: `${100 / numColumns}%` , 
                minWidth: presentation == "grid" ? 150 : 300,
                }} >
                <Karteikarte
                  grid={presentation == "grid"}
                  handlePress={async () => {
                    setSelected("SingleModule");
                    const newUserUsage = returnNewLastModule(userUsage.lastModules || [], {
                      name: item.name,
                      percent: Number.isInteger(calculatePercent(item.questionList)) ? calculatePercent(item.questionList) : 0,
                      color: item.color,
                      fragen: item.questions,
                      sessions: item.sessions.length,
                      sessionID: item.$id ? item.$id : "",
                    });
                    setUserUsage({
                      ...userUsage,
                      lastModules: newUserUsage
                    });
                    const moduleSessions = item.sessions.map(s => JSON.parse(s));
                    setSelectedModule(index);
                  }}
                  farbe={item.color ?? ""}
                  percentage={Number.isInteger(calculatePercent(item.questionList)) ? calculatePercent(item.questionList) : 0}
                  titel={item.name}
                  studiengang={item.description}
                  fragenAnzahl={item.questionList.length}
                  notizAnzahl={item.notes}
                  creator={item.creator}
                  publicM={item.public}
                />
              </View>
            ))}
          </View>
        </View>
      )

    }
    
  return (
    <View className='flex-1 rounded-[10px] bg-[#0c111d] '>
        <TokenHeader />
        <View className={`flex-row justify-start items-center rouned-[10px] mx-5 my-2 `}>
          
          <TouchableOpacity onPress={()=> {setIsVisibleNewModule(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Icon name="cubes" size={15} color="white"/>
              <Text className='text-gray-300 text-[12px] ml-2'>{t("bibliothek.createModule")}</Text> 
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {setIsVisibleAI(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Image source={require("../../../assets/bot.png")} style={{height: 16, width: 16}} />
              <Text className='text-gray-300 text-[12px] ml-2'>{t("bibliothek.createModule")}</Text> 
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {if (presenation == "grid") setPresentation("list"); else setPresentation("grid")}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Icon name={presenation == "grid" ? "th" : "th-list"} size={15} color="white"/> 
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextFilter} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  p-2  `}>
              <Icon name={filters == "all" ? "filter" : filters == "public" ? "globe" : filters == "private" ? "lock" : "archive"} size={15} color="white"/>
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
            {
              moduleToBeAdded &&
                <AcceptShareModule
                  module={ moduleToBeAdded }
                  user={user}
                  setModuleToBeAdded={setModuleToBeAdded}
                  setModules={setModules}
                  />
            }
            {modules && modules.length > 0 && (
          <ModuleList
            presentation={presenation}
            items={modules.filter(mod => {
              if (filters == "all") return !mod.tags.includes("archived");
              if (filters == "public") return mod.public && !mod.tags.includes("archived");
              if (filters == "private") return !mod.public && !mod.tags.includes("archived");
              if (filters == "archived") return mod.tags.includes("archived");
              return true;
              
            })}
          />)}
          </View>
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