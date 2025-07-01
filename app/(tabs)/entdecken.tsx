import { View, Text, TouchableOpacity, TextInput ,Image, ActivityIndicator, FlatList, Platform} from 'react-native'
import React,{useRef, useState, useEffect} from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import {countryList,} from '@/assets/exapleData/countryList';
import UniversityFilters from '@/components/(entdecken)/university';
import SchoolFilters from '@/components/(entdecken)/school';
import EudcationFilters from '@/components/(entdecken)/education';
import OtherFilters from '@/components/(entdecken)/other';
import { router } from 'expo-router';
import { adddModule } from '@/lib/appwriteAdd';
import languages from '@/assets/exapleData/languageTabs.json';
import { getModules } from '@/lib/appwriteQuerys';
import { updateModuleData } from '@/lib/appwriteUpdate';
import TokenHeader from '@/components/(general)/tokenHeader';
import BottomSheet, {  BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet'
import RenderResults from '@/components/(entdecken)/renderResults';
import { searchDocuments } from '@/lib/appwriteQuerySerach';
import { loadAllModules } from '@/lib/appwriteDaten';


const entdecken = () => {

  const { language, userUsage, setUserUsage, userData } = useGlobalContext()
  const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
  useEffect(() => {
    if(language) {
      setSelectedLanguage(language)
    }
  }, [language])

  useEffect(() => {
    async function fetchAllModules(){
      const modules = await loadAllModules();
      console.log("Filterd Modules",modules.filter(m => m.public == true && m.questions > 0 && m.name.includes("Kopie") == false))
      if (modules) {
        setModules(modules.filter(m => m.public == true && m.questions > 0 && m.name.includes("Kopie") == false));
      } else {
        setModules([]);
      }
    }
    fetchAllModules();
  },[])

  const texts = languages.endecken;
  const sheetRef = useRef<BottomSheet>(null);
  const [ isOpen, setIsOpen ] = useState(true);
  const snapPoints = ["40%","60%","90%"];

  {/*Ersetze die is Copyed durch orginal Id für den Fal eines Clon Updates */}
  const {user, isLoggedIn,isLoading, setReloadNeeded, reloadNeeded } = useGlobalContext();
  const [ rel, setRel ] = useState(false);
    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);
  
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 300);

  const [ selectedModules, setSelectedModules] = useState([])
  
  //Allgemeine Filter
  const [ selectedCountry, setSelectedCountry] = useState(countryList[0])
  const [ filterVisible, setFilterVisible] = useState(false)
  const [ selectedKathegory, setSelectedKathegory ] = useState("UNIVERSITY")


  //Module entdecken
  const [ loading, setLoading ] = useState(false)
  const [ modules, setModules ] = useState([])
  const [ myModules, setMyModules ] = useState([])

  //____ The filter Part _____________________________________________________________
    const [ filters, setFilters ] = useState({})

    async function fetchModules(filters) {
      const keys = Object.keys(filters);
      if (keys.length > 1) {
        const modules = await searchDocuments(filters);
        if (modules) {
          setModules(modules);
        } else {
          setModules([]);
        }
      } 
    }

    useEffect(() => {
      fetchModules(filters)
    },[filters])

    useEffect(() => {
      if (!userData) {
        return;
      } else {
      if (userData.kategoryType == "UNIVERSITY") {
        setFilters({
        kategoryType: userData.kategoryType,
        studiengangKathegory: userData.studiengangKathegory,
        creationUniversityFaculty: userData.faculty,
        creationUniversity: userData.university,
        creationUniversityProfession: userData.studiengangZiel,
        creationUniversitySubject: userData.studiengang,
        creationCountry: userData.country,
    })
    } else if (userData.kategoryType == "SCHOOL") {
        setFilters({
            kategoryType: userData.kategoryType,
            creationCountry: userData.country,
            creationSubject: userData.schoolSubjects,
            creationRegion: userData.region,
            creationSchoolForm: userData.schoolType,
            creationLanguage: userData.language,
            creationKlassNumber: userData.schoolGrade,
        })
    } else if (userData.kategoryType == "EDUCATION") {
        setFilters({
            kategoryType: userData.kategoryType,
            creationCountry: userData.country,
            creationEducationKathegory: userData.educationKathegory,
            creationEducationSubject: userData.educationKathegory,
        })
    } else if (userData.kategoryType == "OTHER") {
        setFilters({
            creationCountry: userData.country,
            creationLanguage: userData.language,
            creationSubject: userData.schoolSubjects,
        })
    }}
    }, [userData]);
    //_____________________________________________________________________________________

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
    if (user == null) return;
    const fetchMyModules = async () => {
      const modulesLoaded = await getModules(user.$id);
          if (modulesLoaded) {
            setMyModules(modulesLoaded.documents);
          }
    }
    fetchMyModules()
  }, [user, rel  ])

  const [ searchBarText, setSearchBarText ] = useState("")
  const [ focused, setFocused ] = useState(false)

  async function add(mod) {
          setLoading(true)
          try {
              const res = await adddModule(mod)
              if (res){
                setModules((prev) => [...prev, res])
              }
              setLoading(false)

          } catch (error) {
            if (__DEV__) {
              console.log("Error", error)
            }
              setLoading(false)
          }
      }

  const CopyModulesButton = ({topButton=false}) => {
    function calculateEnergyCost() {
      let price = 0;
      selectedModules.forEach((moduleId) => {
        const module = modules.find((m) => m.$id === moduleId);
        if (module) {
          const mprice =  1 + (Math.floor((module.questions)/20 * 1)); // Assuming each question costs 3 energy
          if (mprice > 10){
            price += 10; // Cap the price at 10 energy
          } else {
            price += mprice; // Add the price of the module
          }
        }
      });
      return price;
    }
      
    return (
        <View className={`${Platform.OS == "web" ? "" : null} w-full  rounded-full  ${topButton ? "" : "p-2"}`} >
          <TouchableOpacity disabled={loading  || (userUsage.energy < calculateEnergyCost())} className={`${topButton ? "px-2" : "p-2"} flex-row items-center justify-center rounded-full`}
          style={{
            backgroundColor: userUsage.energy > selectedModules.length * 3 ? "#3b82f6" : "#f63b3b",
            borderWidth: topButton ? 1 : 2,
            borderColor:  userUsage.energy > selectedModules.length * 3 ? "#3c6dbc" : "#bc3c3c",
          }}
          
          onPress={async ()=> {
              setReloadNeeded([...reloadNeeded, "Bibliothek"])
              if (selectedModules.length > 0){
                modules.map((module) => {
                if (selectedModules.includes(module.$id)){
                    const mod = {
                        name: module.name + " (Kopie)",
                        subject: module.subject,
                        questions: module.questionList.length,
                        notes: module.notes,
                        documents: module.documents,
                        "public": false,
                        progress: 0,
                        creator: user.$id,
                        color: module.color,
                        sessions: module.sessions,
                        tags: module.tags,
                        description: module.description,
                        releaseDate: new Date() ,
                        connectedModules: [],
                        qualityScore: module.qualityScore,
                        copy: true,
                        synchronization: false,
                        questionList: module.questionList
                    }
                    add(mod)
                }})}
                setUserUsage({
                  ...userUsage,
                  energy: userUsage.energy - calculateEnergyCost()
                })
              setRel(!rel)
               setSelectedModules([])
               setMyModules([])
                router.push("/bibliothek")
              }}>
            {
              loading ? <ActivityIndicator size="small" color="#fff" /> :
              userUsage.energy > selectedModules.length * 3 ?
              <View className='flex-row items-center'>
                <Text className={`${topButton ? "text-[12px]" : "text-[15px] mb-1"} font-semibold  text-white  `}>{selectedModules.length == 1 ? texts[selectedLanguage].copy1 : texts[selectedLanguage].copy2} für {calculateEnergyCost()}</Text>
                <Icon name="bolt" size={topButton ?10 :15} color="white" className="ml-2" />
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
    /**
     * This Component lets the User Pick SCHOOL, UNIVERSITY, EDUCATION or OTHER 
     */
    const EducationFiel = () => {
      function handlePress(option) {
          setFilters({
            kategoryType: option.enum,
            creationCountry : userData?.country || "DEUTSCHLAND"
          })
      }
      return (
        <View className={`flex-row p-2 justify-between items-center rouned-[10px] w-full `}>
            
            <View className={` flex-row  items-center ${width > 400 ? "w-full" : "justify-between w-full"}`}>
              <View className='flex-1 justify-between flex-row items-center bg-gray-900 rounded-full' style={{ 
                height: 40, paddingHorizontal: 2, paddingVertical: 2,
              }}>
                {
                  options.map((option, index) => (
                        <TouchableOpacity key={option.enum} className={` rounded-full  ${width > 600 ? "p-2" : "p-2"} ${selectedKathegory == option.enum ? "bg-blue-500 w-[120px] items-center" : ""}`} 
                        onPress={() => {
                          setSelectedKathegory(option.enum)
                          handlePress(option)
                          }}>
                        <View className='flex-row items-center '>
                          <Icon name={option.icon} size={20} color="#D1D5DB" />
                          {selectedKathegory == option.enum || width > 500? <Text className='ml-1 text-white font-semibold'>{option.name}</Text> : null}
                        </View>
                    </TouchableOpacity>
                      ))
                }
              </View>
            </View>
          </View>
      )
    }



    
  return (
      <Tabbar content={()=> { return(
        <View className='flex-1  w-full bg-[#0c111d] rounded-[10px] '>
          <TokenHeader userUsage={userUsage}/>

          {/* Searchbar and Filter Activation */}
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
                              outline: 'none',
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
              <TouchableOpacity onPress={()=> {setFilterVisible(!filterVisible), sheetRef.current?.snapToIndex(0);setIsOpen(true);}} className='h-[35px] rounded-[10px] mr-4 p-2 mb-2 bg-gray-800 items-center justify-center'>
                <Icon name="filter" size={15} color="white"/> 
              </TouchableOpacity>
          </View>
          <View className='w-full flex-row items-center justify-between mb-2'>
            <View className=' bg-gray-500 rounded-full items-center justify-center'
            style={{
              width: 80,
              marginLeft: 18,
              paddingVertical: 2,
              paddingHorizontal: 4,
              marginBottom: 8,
              
            }}
            >
              <Text className='text-white font-semibold text-[10px] '>
                {modules.filter(m => m.public == true).length} {texts[selectedLanguage].results}

              </Text>
            </View>
            <View

              className='flex-row items-center justify-between mr-4'>
              {
                selectedModules.length > 0 ?
                <CopyModulesButton topButton={true}/>
                :
                <Text className='px-3 py-[1px] bg-blue-500 rounded-full text-white font-semibold text-[10px]'>
                  Wähle ein Modul aus, um es zu kopieren.
                </Text>
              }
            </View>
          </View>
          <RenderResults 
            modules={modules.filter(m => m.public == true)}
            texts={texts}
            selectedLanguage={selectedLanguage}
            selectedModules={selectedModules}
            myModules={myModules}
            updateModuleData={updateModuleData}
            setSelectedModules={setSelectedModules}
            numColumns={numColumns}
            searchBarText={searchBarText}
            setModules={setModules}
            setLoading={setLoading}
          />

          {/* In Case the User selects a Module the copy Button becomes Visble */}
          {selectedModules.length == 0 ? null :
            <CopyModulesButton/>
          }
        {
          filterVisible ?
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setFilterVisible(false)}
              backgroundStyle={{ backgroundColor: '#1F2937' }} 
            >
            <BottomSheetScrollView 
              contentContainerStyle={{ backgroundColor: '#1F2937', paddingBottom: 40 }}
              style={{ backgroundColor: '#1F2937' }}
              showsVerticalScrollIndicator={false}>
                <View className='w-full'>
                  <EducationFiel />
                  {selectedKathegory == "UNIVERSITY" ? <UniversityFilters filters={filters} setFilters={setFilters} country={countryList[0]} searchbarText={searchBarText} /> : null}
                  {selectedKathegory == "SCHOOL" ? <SchoolFilters  filters={filters} setFilters={setFilters} country={countryList[0]} searchbarText={searchBarText} /> : null}
                  {selectedKathegory == "EDUCATION" ? <EudcationFilters filters={filters} setFilters={setFilters} country={countryList[0]} searchbarText={searchBarText} /> : null}
                  {selectedKathegory == "OTHER" ? <OtherFilters filters={filters} setFilters={setFilters} country={countryList[0]} searchbarText={searchBarText} /> : null}
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
          : null}
        </View>
      

    )}} page={"Entdecken"} />
  )
}

export default entdecken