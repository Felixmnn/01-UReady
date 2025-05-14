import { View, Text, TouchableOpacity, TextInput ,Image, ActivityIndicator, FlatList, Platform} from 'react-native'
import React from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useState, useEffect } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import {countryList,} from '@/assets/exapleData/countryList';
import UniversityFilters from '@/components/(entdecken)/university';
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import SchoolFilters from '@/components/(entdecken)/school';
import EudcationFilters from '@/components/(entdecken)/education';
import OtherFilters from '@/components/(entdecken)/other';
import CountryFlag from 'react-native-country-flag';
import { router } from 'expo-router';
import { addNewModule } from '@/lib/appwriteAdd';
import languages from '@/assets/exapleData/languageTabs.json';
const entdecken = () => {

  const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])

    const texts = languages.endecken;
  

  {/*Ersetze die is Copyed durch orginal Id für den Fal eines Clon Updates */}
  const {user, isLoggedIn,isLoading, setReloadNeeded, reloadNeeded } = useGlobalContext();
    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);
  
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const numColumns = Math.floor(width / 300);

  const longVertical = width > 900;
  const [ tab, setTab ] = useState(0)
  const [ selectedModules, setSelectedModules] = useState([])
  
  //Allgemeine Filter
  const [ selectedCountry, setSelectedCountry] = useState(countryList[0])
  const [ filterVisible, setFilterVisible] = useState(true)
  const [ selectedKathegory, setSelectedKathegory ] = useState("UNIVERSITY")

  //Module entdecken
  const [ loading, setLoading ] = useState(false)
  const [ modules, setModules ] = useState([])

  const options = [
    {
      name: texts[selectedLanguage].university,
      enum: "UNIVERSITY",
      icon: "university",
      color: "#7a5af8",
      handlePress: () => {
        setSelectedKathegory("UNIVERSITY")
        setFilterVisible(false)
      },
    },
    {
      name: texts[selectedLanguage].school,
      enum: "SCHOOL",
      icon: "school",
      color: "#20c1e1",
      handlePress: () => {
        setSelectedKathegory("SCHOOL")
        setFilterVisible(false)
      },
    },
    {
      name: texts[selectedLanguage].education,
      enum: "EDUCATION",
      icon: "tools",
      color: "#4f9c19",
      handlePress: () => {
        setSelectedKathegory("EDUCATION")
        setFilterVisible(false)
      },
    },
    {
      name: texts[selectedLanguage].other,
      enum: "OTHER",
      icon: "ellipsis-h",
      color: "#f39c12",
      handlePress: () => {
        setSelectedKathegory("OTHER")
        setFilterVisible(false)
      },
    }
  ]

  const [ searchBarText, setSearchBarText ] = useState("")
  const [ focused, setFocused ] = useState(false)
  async function add(mod) {
          setLoading(true)
          try {
              const res = await addNewModule(mod)
              setLoading(false)
          } catch (error) {
              console.log("Error", error)
              setLoading(false)
          }
      }
  return (
      <Tabbar content={()=> { return(
        <View className='flex-1  w-full bg-[#0c111d] rounded-[10px] relative'>
          <View className={`flex-row p-4 justify-between items-center  h-[60px] rouned-[10px] `}>
            {
              width > 400 ?
                <Text className='font-bold text-3xl text-gray-100'>
                  {texts[selectedLanguage].title}
                </Text>
                : null
            }
            <View className={` flex-row  items-center ${width > 400 ? "" : "justify-between w-full"}`}>
              <View className='flex-1 justify-between flex-row items-center bg-gray-800 rounded-full px-1 ' style={{ height: 40 }}>
                {
                  options.map((option, index) => (
                        <TouchableOpacity key={option.enum} className={` rounded-full ${width > 600 ? "p-3" : "p-2"} ${selectedKathegory == option.enum ? "bg-gray-500 w-[100px] items-center" : ""}`} onPress={() => {setSelectedKathegory(option.enum)}}>
                    {
                        width > 600 ?
                      <Text className='text-white'>{option.name}</Text>
                        :
                        <View className='flex-row items-center'>
                          <Icon name={option.icon} size={20} color="#D1D5DB" />
                          {selectedKathegory == option.enum? <Text className='text-white'>{option.name}</Text> : null}
                        </View>
                      }
                    </TouchableOpacity>
                      ))
                }
              </View>
              <TouchableOpacity className='h-[35px] rounded-[10px] p-2 items-center justify-center'>
                <CountryFlag isoCode={selectedCountry.code} style={{ width: 30, height: 18 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View className='flex-row w-full items-center'>
            <View className='flex-1    w-full bg-gray-800  rounded-[10px] ml-4 mr-2 mb-2  px-2 flex-row items-center justify-between'            >
              <View className='w-full flex-row items-center'
              style={{
                height:40
              }}
              >
              <Icon name="search" size={18} color="white" />
              <TextInput 
                            className='ml-3 w-full ' 
                            style = {{
                              color: "white",
                              borderColor: focused ? "#1f2937" : "#1f2937",
                              outline: 'none',
                              borderWidth: 1,
                            }}
                            value={searchBarText}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder={texts[selectedLanguage].searchText}
                            onChangeText={(text) => setSearchBarText(text)}
                            placeholderTextColor={"#797d83"} 
                            />
            </View>
          </View>
          {
            longVertical ? 
             null :
              <TouchableOpacity onPress={()=> setFilterVisible(!filterVisible)} className='h-[35px] rounded-[10px] mr-4 p-2 mb-2 bg-gray-800 items-center justify-center'>
                <Icon name="filter" size={15} color="white"/> 
              </TouchableOpacity>
          }
          </View>

          <View className="w-full flex-1" style={{ flex: 1, position: "relative", }}>
  
            {/* UniversityFilters liegt ganz oben */}
          
            <View style={{ zIndex: 10, position: "relative" }}>
              {
                selectedKathegory == "UNIVERSITY" && (filterVisible || width > 800) ? (
                  <UniversityFilters
                    setModules={setModules}
                    setLoading={setLoading}
                    country={countryList[0]}
                    searchbarText={searchBarText}
                  />
                ) : selectedKathegory == "SCHOOL" && (filterVisible || width > 800)  ? (
                  <SchoolFilters
                    setModules={setModules}
                    setLoading={setLoading}
                    country={countryList[0]}
                    searchbarText={searchBarText}

                  />
                ) : selectedKathegory == "EDUCATION" && (filterVisible || width > 800)  ? (
                  <EudcationFilters
                    setModules={setModules}
                    setLoading={setLoading}
                    country={countryList[0]}
                    searchbarText={searchBarText}

                  />
                ) : selectedKathegory == "OTHER" && (filterVisible || width > 800)  ? (
                  <OtherFilters
                    setModules={setModules}
                    setLoading={setLoading}
                    country={countryList[0]}
                    searchbarText={searchBarText}

                  /> ): null
              }
            </View>
            <View
                        className='w-full bg-gray-500 border-gray-500 border-t-[1px]'
                        style={{ zIndex: 0, marginTop: 10 }}
            
                    />


            {/* Restlicher Inhalt liegt darunter */}
            <View
              className="flex-1 p-4 bg-gray-900 "
              style={{ zIndex: 1, position: "relative" }}
            >
              {!loading ? (
                <View className='flex-1'>
                  {modules.length > 0 ? (
                    <View className='flex-1 w-full'>
                      <FlatList
                        data={modules.filter((item) =>
                          item.$id.toLowerCase().includes(searchBarText.toLowerCase())
                        )}
                        renderItem={({ item, index }) => (
                          <View className={`flex-1 mr-2  ${selectedModules.includes(item.$id) ? "" : "opacity-50"} `}>
                            <Karteikarte
                              handlePress={()=> {
                                if (selectedModules.includes(item.$id)){
                                    setSelectedModules(selectedModules.filter((module) => module !== item.$id))
                                } else {
                                    setSelectedModules([...selectedModules, item.$id])
                                }
                              }}
                              farbe={item.color}
                              percentage={null}
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
                        )}
                        keyExtractor={(item) => item.$id}
                        key={numColumns}
                        numColumns={numColumns}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                      />
                    </View>
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Image
                        source={require("../../assets/noResults.png")}
                        style={{ width: 200, height: 200, borderRadius: 5 }}
                      />
                      <Text className="text-gray-300 font-bold text-[18px]">
                        {texts[selectedLanguage].noResults}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <ActivityIndicator size="small" color="#b2e0fe" />
                  <Text className="text-gray-300 font-bold text-[18px]">
                     {texts[selectedLanguage].loading}
                  </Text>
                </View>
              )}
            </View>
            
          </View>
          {
            selectedModules.length == 0 ? null :
          <View className={`${Platform.OS == "web" ? "absolute bottom-0" : null} w-full  rounded-full p-2`} >
            <TouchableOpacity disabled={loading} className='flex-row items-center justify-center p-2 bg-blue-500 rounded-full' 
              onPress={async ()=> {
                  setReloadNeeded([...reloadNeeded, "Bibliothek"])
                if (selectedModules.length > 0){
                                      modules.map((module) => {
                                          if (selectedModules.includes(module.$id)){
                                              const mod = {
                                                  name: module.name + " (Kopie)",
                                                  subject: module.subject,
                                                  questions: module.questions,
                                                  notes: module.notes,
                                                  documents: module.documents,
                                                  public: false,
                                                  progress: 0,
                                                  creator: user.$id,
                                                  color: module.color,
                                                  sessions: module.sessions,
                                                  tags: module.tags,
                                                  description: module.description,
                                                  releaseDate: new Date() ,
                                                  connectedModules: [],
                                                  qualityScore: module.qualityScore,
                                                  duration: 0,
                                                  upvotes: 0,
                                                  downVotes: 0,
                                                  creationCountry: null,
                                                  creationUniversity: null,
                                                  creationUniversityProfession: null,
                                                  creationRegion: null,
                                                  creationUniversitySubject: [],
                                                  creationSubject: [],
                                                  creationEducationSubject: null,
                                                  creationUniversityFaculty: [],
                                                  creationSchoolForm: null,
                                                  creationKlassNumber: null,
                                                  creationLanguage: null,
                                                  creationEducationKathegory:null,
                                                  copy: true,
                                              }
                                              add(mod)
                                          }
              
                                      }
                                      
                                  )
                                  } else {
                                  }
                                  router.push("/bibliothek")
                              }}
            >
              {
                loading ? <ActivityIndicator size="small" color="#fff" /> :
                <Text className='text-white  font-semibold text-[15px]'>{selectedModules.length == 1 ? texts[selectedLanguage].copy1 : texts[selectedLanguage].copy2}</Text>


              }
            </TouchableOpacity>
          </View>
        }
        </View>
      

    )}} page={"Entdecken"} />
  )
}

export default entdecken