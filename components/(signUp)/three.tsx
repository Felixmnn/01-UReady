import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import Flag from "react-world-flags";
import Icon from 'react-native-vector-icons/FontAwesome5';


const StepThree = ({selectedLanguage, languages, name, selectedCountry, setSelectedCountry, countryList ,setSelectedKathegorie, userData, setUserData}) => {
    const [isActive, setIsActive] = useState(false)
          return (
              <View className='h-full  w-full justify-between items-center py-5'>
                  <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
                        <View className={`bg-blue-500 h-full w-[${40}%] rounded-full`} style={{width:`${40}%`}}/>
                    </View>
                  <View className='items-center justiy-center'>
                      <View className='w-full max-w-[400px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                          <Text className='font-semibold text-[15px] text-gray-100 text-center'>{name} {
                              selectedLanguage == null || languages[selectedLanguage].code == "DE"
                              ? "Gehst du zur Schule, an die Uni oder machst eine Ausbildung?"
                              : languages[selectedLanguage].code == "GB"
                              ? "Are you going to school, university, or doing an apprenticeship?"
                              : languages[selectedLanguage].code == "US"
                              ? "Are you in school, college, or doing an apprenticeship?"
                              : languages[selectedLanguage].code == "AU"
                              ? "Are you at school, uni, or doing an apprenticeship?"
                              : languages[selectedLanguage].code == "ES"
                              ? "¿Vas al colegio, a la universidad o estás haciendo una formación?"
                              :"Gehst du zur Schule, an die Uni oder machst eine Ausbildung?"
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
                                  <TouchableOpacity onPress={()=> {setSelectedKathegorie("SCHOOL"), setUserData({...userData,signInProcessStep:"FOUR"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[100px] w-[100px] items-center justify-center m-1' >
                                      <Text className='text-gray-100 font-semibold text-[15px] '>{
                                          selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Schule":
                                          languages[selectedLanguage].code == "GB" ? "School":
                                          languages[selectedLanguage].code == "US" ? "School":
                                          languages[selectedLanguage].code == "AU" ? "School":
                                          languages[selectedLanguage].code == "ES" ? "Escuela":
                                          "Schule"
                                          }</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={()=> {setSelectedKathegorie("UNIVERSITY"), setUserData({...userData,signInProcessStep:"FOUR"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[100px] w-[100px] items-center justify-center m-1'>
                                      <Text className='text-gray-100 font-semibold text-[15px]'>{
                                          selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Universität":
                                          languages[selectedLanguage].code == "GB" ? "University":
                                          languages[selectedLanguage].code == "US" ? "College":
                                          languages[selectedLanguage].code == "AU" ? "Uni":
                                          languages[selectedLanguage].code == "ES" ? "Universidad":
                                          "Universität"
                                  }</Text>
                                  </TouchableOpacity>
                              </View>
                              <View className='flex-row'>
                                  <TouchableOpacity onPress={()=> {setSelectedKathegorie("EDUCATION"), setUserData({...userData,signInProcessStep:"FOUR"})}}  className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[100px] w-[100px] items-center justify-center m-1' >
                                      <Text className='text-gray-100 font-semibold text-[15px] '>{
                                          selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Ausbildung":
                                          languages[selectedLanguage].code == "GB" ? "Education":
                                          languages[selectedLanguage].code == "US" ? "Education":
                                          languages[selectedLanguage].code == "AU" ? "Education":
                                          languages[selectedLanguage].code == "ES" ? "Educación":
                                          "Ausbildung"
                                      }</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={()=> {setSelectedKathegorie("OTHER"), setUserData({...userData,signInProcessStep:"FIVE"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 h-[100px] w-[100px] items-center justify-center m-1'>
                                      <Text className='text-gray-100 font-semibold text-[15px]'>{
                                          selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Sonstiges":
                                          languages[selectedLanguage].code == "GB" ? "Other":
                                          languages[selectedLanguage].code == "US" ? "Other":
                                          languages[selectedLanguage].code == "AU" ? "Other":
                                          languages[selectedLanguage].code == "ES" ? "Otro":
                                          "Sonstiges"
                                      }</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>
                  </View>
                  <View className='w-full max-w-[200px]'>
                      
                  </View>
              </View>
          )
      }

export default StepThree