import { View, Text, TouchableOpacity, ScrollView,FlatList, Image, RefreshControl, Platform } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, {   useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateUserUsageModules, updateUserUsageSessions } from '@/lib/appwriteUpdate';
import TokenHeader from '@/components/(general)/tokenHeader';
import AddAiBottomSheet from '@/components/(general)/(modal)/addAiBttomSheet';
import AddModuleBottomSheet from '@/components/(general)/(modal)/addModuleBottomSheet';
import { module } from '@/types/appwriteTypes';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSpecificModule } from '@/lib/appwriteShare';
import { ModuleProps } from '@/types/moduleTypes';
import AcceptShareModule from '../(components)/acceptShareModule';

const AllModules = ({
  setSelected,
  modules,
  setSelectedModule,
  onRefresh,
  refreshing,
  setModules  
}:{
  setSelected: React.Dispatch<React.SetStateAction<"AllModules" | "SingleModule" | "CreateModule" | "AiModule">>,
  modules: module[],
  setSelectedModule: React.Dispatch<React.SetStateAction<number>>,
  onRefresh: () => void,
  refreshing: boolean,
  setModules: React.Dispatch<React.SetStateAction<module[]>>
}) => {

    const { t } = useTranslation();

    const { user, userUsage } = useGlobalContext()
    

      
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
    const numColumns = Math.floor(width / 300);

  

function calculatePercent(questions:string[]){
  let parsedQuestions = []
   parsedQuestions = questions.map(q => 
   {
    try {
     return JSON.parse(q);
    } catch (error) {
      console.log("Error parsing question:", q, error);
      return { status: null }; 
    }
  })
  
  let sum = 0;
    for (let i = 0; i < parsedQuestions.length; i++) {
      if (parsedQuestions[i].status =="BAD") sum -= 1;
      if (parsedQuestions[i].status =="OK") sum += 0;
      if (parsedQuestions[i].status =="GOOD") sum += 1;
      if (parsedQuestions[i].status =="GREAT") sum += 2;

  }    
  
  return Math.floor((sum / (questions.length * 2)) * 100);

}

  const [ moduleToBeAdded, setModuleToBeAdded ] = useState<ModuleProps | null>(null);

  useEffect(() => {
    if (!user) return;
    async function showCopyModuleIfAvailable() {

      const moduleToBeAdded = await AsyncStorage.getItem("moduleToBeAddedAfterSignUp");
      console.log("Module to be added after sign up:", moduleToBeAdded);
      if (moduleToBeAdded) {
        await getSpecificModule(JSON.parse(moduleToBeAdded)).then((res => {
          if (res) {
            setModuleToBeAdded(res as  ModuleProps);
          }
      }))
    }
  }
    showCopyModuleIfAvailable();
  
  }, []);



      
    const [ isVisibleAI, setIsVisibleAI] = useState(false)
    const ModuleList = ({
      items
     }:{
      items: module[]
     }) => {
      return (
        <View className={` mb-4`}>
          <View className={`flex-1 flex-row flex-wrap py-2`}>
            {items.map((item:module, index) => (
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
                    const moduleSessions = item.sessions.map(s => JSON.parse(s));
                    updateUserUsageSessions(userUsage.$id, {
                                      name: moduleSessions[0].title,
                                      sessionID: moduleSessions[0].id,
                                      percent: moduleSessions[0].percent,
                                      color: moduleSessions[0].color,
                                      iconName: moduleSessions[0].iconName,
                                      questions: moduleSessions[0].questions,
                                      moduleID: item.$id
                                    } )
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
          <ModuleList
            items={modules}
          />
          </View>
          {/*
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
        ):null}*/}
        
        

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