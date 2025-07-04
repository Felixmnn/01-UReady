import { View, useWindowDimensions, TouchableOpacity,ScrollView, Text } from 'react-native'
import React, { useState } from 'react'
import SessionProgress from '../sessionProgress'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateUserUsageSessions } from '@/lib/appwriteUpdate';
import { returnColor, returnColorButton, returnColorButtonShadow } from '../../../functions/returnColor';
import VektorCircle from '@/components/(karteimodul)/vektorCircle';

const RoadMap = ({  moduleSessions,
                    selected, 
                    setSelected, 
                    questions,   
                    currentModule, 
                    moduleDescription
                  }) => { 
  const { userUsage, language } = useGlobalContext();
  const percentA = getAll()
  const {width} = useWindowDimensions()

  /**
   * Returns the percentage of each status of the questions
   * @returns an object with the percentage of each status of the questions
   */
  function getAll(){
    let bad = 0
    let ok = 0
    let good = 0
    let great = 0
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].status == "BAD" ){
        bad += 1
      } else if (questions[i].status == "OK" ){
        ok += 1
      } else if (questions[i].status == "GOOD" ){
        good += 1
      } else if (questions[i].status == "GREAT" ){
        great += 1
      }
    }
    return {bad:Math.floor(bad/questions.length*100),ok:Math.floor(bad/questions.length*100),good:Math.floor(bad/questions.length*100),great:Math.floor(bad/questions.length*100)}

  }
    return (
    <ScrollView className={`${width > 700 ? "" : null} ` }  style={{
      scrollbarWidth: 'thin', 
      scrollbarColor: 'gray transparent',
    }}>
      {
        moduleSessions.map((module, index) => {
            return (

              <TouchableOpacity 
              key={`${module.$id}-${index}`}
              style={{
                margin:5,
                opacity: selected == index ? 1 : 0.5,

              }}
              onPress={() => {
                setSelected(index);
                updateUserUsageSessions(userUsage.$id, {
                  name: moduleSessions[index].title,
                  sessionID: moduleSessions[index].id,
                  percent: moduleSessions[index].percent,
                  color: moduleSessions[index].color,
                  iconName: moduleSessions[index].iconName,
                  questions: moduleSessions[index].questions,
                } )
                
              }}
              className='rounded-[10px]  bg-gray-800 '
              >
                <View className='w-full rounded-t-[10px] border-t-[1px] border-gray-700'
                    style={{
                      backgroundColor: returnColor(module.color ? module.color :"blue", currentModule.color),
                      height: 8,
                    }}
                  />
                <View className='w-full flex-row items-center justify-start py-2 px-3'> 
                  <VektorCircle sizeMultiplier={1.3} color={returnColor(module.color == null ? "blue" : module.color , currentModule.color)} percentage={module.percent} icon={module.iconName} strokeColor={returnColor(module.color == null ? "blue" : module.color , currentModule.color)}/>
                  <View className='justify-center '>
                    <Text className='text-white font-bold text-[15px] px-3 '>{module.title}</Text>
                    {
                      selected == index && module.description?.length > 0 ?
                        <Text
                          className="text-white font-semibold text-[12px] px-3"
                          style={{ flexWrap: 'wrap',
                            maxWidth: 250
                           }}
                        >
                          {module.description}
                        </Text>
                        :
                        null  
                    }
                  </View>
                </View>
              </TouchableOpacity>
            )
    })
    }
    <TouchableOpacity 
      style={{
        margin:5,
        opacity: selected == moduleSessions.length +1 ? 1 : 0.5,

      }}
      onPress={()=> setSelected(moduleSessions.length +1)}
      className='rounded-[10px]  bg-gray-800 '
      >
        <View className='w-full rounded-t-[10px] border-t-[1px] border-gray-700'
            style={{
              backgroundColor: returnColor(currentModule.color),
              height: 8,
            }}
          />
        <View className='w-full flex-row items-center justify-start py-2 px-3'> 
          <VektorCircle sizeMultiplier={1.3}  color={returnColor(currentModule.color)} percentage={Number.isNaN(percentA.bad) ? 0 : percentA.bad  } icon={"list-alt"} strokeColor={returnColor(currentModule.color)}/>
          <View >
                    <Text className='text-white font-bold text-[15px] px-3 pt-3 '>{language == "DEUTSCH" ? "Alle Fragen" : language == "SPANISH" ? "Todas las preguntas" : "All Questions"}</Text>
                    {
                      selected == moduleSessions.length +1 && moduleDescription?.length > 0 ?
                        <Text
                          className="text-gray-200 font-semibold text-[12px] px-3"
                          style={{ flexWrap: 'wrap', maxWidth: 250 }}
                        >
                          {moduleDescription}
                          </Text>
                        :
                        null  
                    }
                  </View>
        </View>
      </TouchableOpacity>
    
    </ScrollView>

  )
}

export default RoadMap
