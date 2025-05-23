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
import { getModules } from '@/lib/appwriteQuerys';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import { updateModuleData } from '@/lib/appwriteUpdate';
import TokenHeader from '@/components/(general)/tokenHeader';
const entdecken = () => {

  const { language, userUsage, setUserUsage } = useGlobalContext()
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
  const [ myModules, setMyModules ] = useState([])

  /**
   * Option includes the meta data for the School, University, Education and Other Filters
   */
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

  useEffect(() => {
    if (!user) return;
    const fetchMyModules = async () => {
      const modulesLoaded = await getModules(user.$id);
          if (modulesLoaded) {
            setMyModules(modulesLoaded.documents);
          }
    }
    fetchMyModules()
  }, [user])


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
      console.log("Modules", modules)


  const CopyModulesButton = () => {
    return (
        <View className={`${Platform.OS == "web" ? "absolute bottom-0" : null} w-full  rounded-full p-2`} >
          <TouchableOpacity disabled={loading  || (userUsage.energy < selectedModules.length * 3)} className='flex-row items-center justify-center p-2  rounded-full'
          style={{
            backgroundColor: userUsage.energy > selectedModules.length * 3 ? "#3b82f6" : "#f63b3b",
            borderWidth:2,
            borderColor: userUsage.energy > selectedModules.length * 3 ? "#3c6dbc" : "#bc3c3c",
          }}
          
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
                        synchronization: false,

                        questionList: module.questionList.map(item => {
                          const pItem = JSON.parse(item);
                          const newItem = {
                            ...pItem,
                            status: null
                          }
                          return JSON.stringify(newItem)
                        })
                    }
                    add(mod)
                }})}
                setUserUsage({
                  ...userUsage,
                  energy: userUsage.energy - selectedModules.length * 3
                })
                router.push("/bibliothek")
              }}>
            {
              loading ? <ActivityIndicator size="small" color="#fff" /> :
              userUsage.energy > selectedModules.length * 3 ?
              <View className='flex-row items-center'>
                <Text className='text-white  font-semibold text-[15px] mb-1'>{selectedModules.length == 1 ? texts[selectedLanguage].copy1 : texts[selectedLanguage].copy2} für {selectedModules.length*3}</Text>
                <Icon name="bolt" size={15} color="white" className="ml-2" />
              </View>
              :
              <Text className='text-white text-center  font-semibold text-[15px] mb-1'
                style={{
                  maxWidth: width < 400 ? 200 : null,
                }}
              >
                Dir fehlt Energie - warte oder kaufe neue im Shop.
              </Text>
            }
          </TouchableOpacity>
        </View>
    )}

  return (
      <Tabbar content={()=> { return(
        <View className='flex-1  w-full bg-[#0c111d] rounded-[10px] relative'>
          <TokenHeader userUsage={userUsage}/>

          {/* Head Element Containing the options (UNIVERSITY; SCHOOL; EDUCATION; OTHER) */}
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

          {/* Text Input wich filters the Modules that include the Textinput in their names*/}
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

            {/* The Filtes belonging to either (UNIVERSITY; SCHOOL; EDUCATION; OTHER) */}
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

            <View className='w-full bg-gray-500 border-gray-500 border-t-[1px]' style={{ zIndex: 0, marginTop: 10 }}/>

            {/* This part displays the Modules that match the Filter in case a result is found. */}
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
                          item.name.toLowerCase().includes(searchBarText.toLowerCase())
                        )}
                        renderItem={({ item, index }) => (
                          <View className={`flex-1 mr-2 mb-2 justify-center ${selectedModules.includes(item.$id) || myModules?.some((mod) => mod.name == item.name + " (Kopie)") ? "" : "opacity-50"} 
                          `}>
                            {myModules?.some((mod) => mod.name == item.name + " (Kopie)") && (
                              <View className="absolute w-full h-full z-10 rounded-b-[10px] rounded-t-[5px] overflow-hidden">
                                <View className={`absolute w-full h-full rounded-b-[10px]  ${item.synchronization  ? "bg-green-500" : "bg-black"} opacity-50`} 
                                style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                                />
                                  <View className="flex-row items-center justify-center h-full p-1">
                                  <Text className="text-white font-semibold text-[15px] mr-2">Synchronisation</Text>
                                  <ToggleSwitch
                                    isOn={item.synchronization}
                                    onToggle={async() => {await updateModuleData(item.$id, {synchronization: !item.synchronization})}}
                                  />
                                </View>
                              </View>
                            )}
                            
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

          {/* In Case the User selects a Module the copy Button becomes Visble */}
          {selectedModules.length == 0 ? null :
            <CopyModulesButton/>
          }
        </View>
      

    )}} page={"Entdecken"} />
  )
}

export default entdecken