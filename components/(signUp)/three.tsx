import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import CountryFlag from 'react-native-country-flag';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BotCenter from './botCenter';
import { useTranslation } from 'react-i18next';
import TouchSquare from './(components)/touchSquare';
import ProgressBar from './(components)/progressBar';
import { userData } from '@/types/moduleTypes';

/**
 * Selction of Education Category and his Country
 */
const StepThree = ({    
                        selectedCountry, 
                        setSelectedCountry, 
                        countryList ,
                        setSelectedKathegorie, 
                        userData, 
                        setUserData, 
                    }:{
                        selectedCountry: {id: string, name: string, code: string},
                        setSelectedCountry: React.Dispatch<React.SetStateAction<{ name: string; code: string; id: string; schoolListID: string; universityListID: string; educationListID: string; educationSubjectListID: string; }>>;                        countryList: Array<{id: string, name: string, code: string}>,
                        setSelectedKathegorie: React.Dispatch<React.SetStateAction<string>>,
                        userData: userData,
                        setUserData: React.Dispatch<React.SetStateAction<any>>
                    }) => {

    const  { t } = useTranslation();
    const [isActive, setIsActive] = useState(false)

    

    
    const textIcons = [[
        {text: t("personalizeThree.school"), icon: "school", handlePress:()=> {setSelectedKathegorie("SCHOOL"), setUserData({...userData,signInProcessStep:"FOUR"})}},
        {text: t("personalizeThree.university"), icon: "university", handlePress:()=> {setSelectedKathegorie("UNIVERSITY"), setUserData({...userData,signInProcessStep:"FIVE"})}},
    ],[
        {text: t("personalizeThree.education"), icon: "tools", handlePress:()=> {setSelectedKathegorie("EDUCATION"), setUserData({...userData,signInProcessStep:"FOUR"})}},
        {text: t("personalizeThree.other"), icon: "ellipsis-h", handlePress:()=> {setSelectedKathegorie("OTHER"), setUserData({...userData,signInProcessStep:"SIX"})}},
    ]]
          return (
              <View className='h-full  w-full justify-between items-center py-5'>
                <ProgressBar
                    percent={40}
                    handlePress={()=> setUserData({...userData,signInProcessStep:"TWO"})}
                />
                  <View className='items-center justiy-center'>
                        <BotCenter
                            message={t("personalizeThree.whereDoYouStudy")}
                            imageSource="Location"
                            spechBubbleStyle="bg-blue-500" 
                            spBCStyle="max-w-[200px]"
                        />
                        
                          <View style={{ position: 'relative', zIndex: 10 }}>
                          <TouchableOpacity onPress={() => setIsActive(!isActive)} className='flex-row w-[180px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] py-2 px-3 my-2 items-center justify-center mx-1'>
                                          <CountryFlag isoCode={selectedCountry.code} size={18} style={{ width: 30, height: 18 }} />
                                          <Text className='text-gray-300 font-semibold text-center mx-2 mt-[1px]'>{selectedCountry.name}</Text>
                                          <Icon name={!isActive ? "caret-down" : "caret-up"} size={20} color="#4B5563"  />
                              </TouchableOpacity>
                              {isActive ? (
                                  <View 
                                  className='absolute top-[48px] left-1 w-[180px] max-h-[300px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 shadow-lg'
                                  style={{ zIndex: 10, elevation: 10,}}>
                                      <FlatList
                                        data={countryList}
                                        className='z-100'
                                        renderItem={({item}) => (
                                            <TouchableOpacity 
                                            onPress={() => { setSelectedCountry({ ...item, schoolListID: '', universityListID: '', educationListID: '', educationSubjectListID: '' }); setIsActive(false); }} 
                                            className='flex-row justify-start items-center p-2 rounded-lg m-1'
                                            >
                                            <CountryFlag isoCode={item.code} size={18} style={{ width: 30, height: 18 }} />
                                            <Text className='text-gray-300 font-semibold text-center ml-2 mt-[1px] '>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item) => item.id}
                                        />
                                      </View>
                                  ) : null}
                              </View>
                          
                          <View className='p-2 my-2 items-center justify-center mx-1'>
                                {
                                    textIcons.map((itextIconList, index) => (
                                        <View key={index} className='flex-row'>
                                            {itextIconList.map((item, idx) => (
                                                <TouchSquare
                                                    key={idx}  
                                                    text={item.text}
                                                    handlePress={item.handlePress}
                                                    icon={item.icon}    
                                                />
                                            ))}
                                        </View>
                                    ))
                                }
                            </View>
                  </View>
                  <View className='w-full max-w-[200px]'>
                      
                  </View>
              </View>
          )
      }

export default StepThree