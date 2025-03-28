import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import Flag from "react-world-flags";
import Icon from 'react-native-vector-icons/FontAwesome5';


const StepThree = ({selectedLanguage, languages, name, selectedCountry, setSelectedCountry, countryList ,setSelectedKathegorie, userData, setUserData}) => {
    const [isActive, setIsActive] = useState(false)
    const TouchSquare = ({text, handlePress,icon}) => {
        return (
            <TouchableOpacity onPress={handlePress} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[120px] w-[120px] items-center justify-center m-1' 
            style={{width:120, height:120}}
            >
                <Icon name={icon} size={20} color="#D1D5DB" />
                <Text className='text-gray-100 font-semibold text-[15px] '>{text}</Text>
            </TouchableOpacity>
        )
    }
    const buttons = [
        { "DE": "Schule", "GB": "School", "US": "School", "AU": "School", "ES": "Escuela" },
        { "DE": "Universität", "GB": "University", "US": "College", "AU": "Uni", "ES": "Universidad" },
        { "DE": "Ausbildung", "GB": "Apprenticeship", "US": "Apprenticeship", "AU": "Apprenticeship", "ES": "Educación" },
        { "DE": "Sonstiges", "GB": "Other", "US": "Other", "AU": "Other", "ES": "Otro" }
    ]
    const robotMessage = {
        "DE": "Gehst du zur Schule, an die Uni oder machst eine Ausbildung?",
        "GB": "Are you going to school, university, or doing an apprenticeship?",
        "US": "Are you in school, college, or doing an apprenticeship?",
        "AU": "Are you at school, uni, or doing an apprenticeship?",
        "ES": "¿Vas al colegio, a la universidad o estás haciendo una formación?",
    }
    console.log("selectedCountry", buttons[0]["DE"])

          return (
              <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                    <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
                        <View className={`bg-blue-500 h-full w-[${40}%] rounded-full`} style={{width:`${40}%`}}/>
                    </View>
                    <TouchableOpacity onPress={()=> setUserData({...userData,signInProcessStep:"TWO"})} className='m-2'>
                        <Icon name="arrow-left" size={20} color="#4B5563" />
                    </TouchableOpacity>
                </View>
                  <View className='items-center justiy-center'>
                      <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                          <Text className='font-semibold text-[15px] text-gray-100 text-center'>{name} {
                                selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]
                              }</Text>
                        </View>
                          <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
                          <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/> 
                          <Image source={require('../../assets/Location.gif')}  style={{height:150, width:150}}/>
                        
                          <View style={{ position: 'relative', zIndex: 10 }}>
                          <TouchableOpacity onPress={() => setIsActive(!isActive)} className='flex-row w-[180px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] py-2 px-3 my-2 items-center justify-center mx-1'>
                                          <Flag code={selectedCountry.code} style={{ width: 30, height: 18 }} />
                                          <Text className='text-gray-300 font-semibold text-center mx-2 mt-[1px]'>{selectedCountry.name}</Text>
                                          <Icon name={!isActive ? "caret-down" : "caret-up"} size={20} color="#4B5563"  />
                              </TouchableOpacity>
                              {isActive ? (
                                  <ScrollView 
                                  className='absolute top-[48px] left-1 w-[180px] max-h-[300px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 shadow-lg'
                                  style={{ zIndex: 10,
                                       elevation: 10,
                                       scrollbarWidth: 'thin', 
                                       scrollbarColor: 'gray transparent'
                                       }} // ⬅ WICHTIG
                                  
                              >
                                      <FlatList
                                          data = {countryList}
                                          className='z-100'
                                          
                                          renderItem={({item}) => (
                                              <TouchableOpacity 
                                                  key={item.id} 
                                                  onPress={() => { setSelectedCountry(item); setIsActive(false); }} 
                                                  className='flex-row justify-start items-center p-2 rounded-lg m-1'
                                              >
                                                  <Flag code={item.code} style={{ width: 30, height: 18 }} />
                                                  <Text className='text-gray-300 font-semibold text-center ml-2 mt-[1px] '>{item.name}</Text>
                                              </TouchableOpacity>
                                          )}
                                          keyExtractor={(item) => item.id}
                                      />
                                      </ScrollView>
                                  ) : null}
                              </View>
                          
                          <View className='p-2 my-2 items-center justify-center mx-1'>
                              <View className='flex-row'>
                                <TouchSquare
                                        text={selectedLanguage == null ? buttons[0]["DE"] : buttons[0][languages[selectedLanguage].code]}
                                        handlePress={()=> {setSelectedKathegorie("SCHOOL"), setUserData({...userData,signInProcessStep:"FOUR"})}}
                                        icon={"school"}
                                />
                                <TouchSquare
                                    text={selectedLanguage == null ? buttons[1]["DE"] : buttons[1][languages[selectedLanguage].code]}
                                    handlePress={()=> {setSelectedKathegorie("UNIVERSITY"), setUserData({...userData,signInProcessStep:"FOUR"})}}
                                    icon={"university"}
                                />
                              </View>
                              <View className='flex-row'>
                                <TouchSquare
                                        text={selectedLanguage == null ? buttons[2]["DE"] : buttons[2][languages[selectedLanguage].code]}
                                        handlePress={()=> {setSelectedKathegorie("EDUCATION"), setUserData({...userData,signInProcessStep:"FOUR"})}}
                                        icon={"tools"}
                                />
                                <TouchSquare
                                    text={selectedLanguage == null ? buttons[3]["DE"] : buttons[3][languages[selectedLanguage].code]}
                                    handlePress={()=> {setSelectedKathegorie("OTHER"), setUserData({...userData,signInProcessStep:"SIX"})}}
                                    icon={"ellipsis-h"}
                                />
                              </View>
                          </View>
                  </View>
                  <View className='w-full max-w-[200px]'>
                      
                  </View>
              </View>
          )
      }

export default StepThree