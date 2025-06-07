import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, useWindowDimensions, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getSepcificModules } from '@/lib/appwriteQuerys'
import Karteikarte from '../(karteimodul)/karteiKarte'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import { addNewModule } from '@/lib/appwriteAdd'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { setUserDataSetup } from '@/lib/appwriteEdit'
import Icon from 'react-native-vector-icons/FontAwesome'
import ContinueBox from '../(signUp)/(components)/continueBox'
import { recommendationSearch, searchDocuments } from '@/lib/appwriteQuerySerach'

const PageDiscover = ({userChoices, setUserChoices, userData}) => {
    const [ loading, setLoading] = useState(true)
    const { user } = useGlobalContext()
    const [ matchingModules, setMatchingModules] = useState([])
    const [ selectedModules, setSelectedModules] = useState([])
    const { width } = useWindowDimensions()
    const numColumns = Math.floor(width / 300);
    console.log("User Data", userData)
    

    useEffect(() => {   
        if (userData == null) return;
        async function fetchModules() {
            let modules = []
            if (userData.kategoryType == "UNIVERSITY") {
                modules = await recommendationSearch({
                kategoryType: userData.kategoryType,
                studiengangKathegory: userData.studiengangKathegory,
                creationUniversityFaculty: userData.faculty,
                creationUniversity: userData.university,
                creationUniversityProfession: userData.studiengangZiel,
                creationUniversitySubject: userData.studiengang,
                creationCountry: userData.country,
            })
            } else if (userData.kategoryType == "SCHOOL") {
                modules = await recommendationSearch({
                    kategoryType: userData.kategoryType,
                    creationCountry: userData.country,
                    creationSubject: userData.schoolSubjects,
                    creationRegion: userData.region,
                    creationSchoolForm: userData.schoolType,
                    creationLanguage: userData.language,
                    creationKlassNumber: userData.schoolGrade,
                })
            } else if (userData.kategoryType == "EDUCATION") {
                modules = await recommendationSearch({
                    kategoryType: userData.kategoryType,
                    creationCountry: userData.country,
                    creationEducationKathegory: userData.educationKathegory,
                    creationEducationSubject: userData.educationKathegory,
                })
            } else if (userData.kategoryType == "OTHER") {
                modules = await recommendationSearch({
                    creationCountry: userData.country,
                    creationLanguage: userData.language,
                    creationSubject: userData.schoolSubjects,
                })
            }
            modules.length > 0 ? setMatchingModules(modules) : setMatchingModules([])
            setLoading(false)
        }
        fetchModules()
    },[userData])

    async function add(mod) {
        setLoading(true)
        try {
            const res = await addNewModule(mod)
            setLoading(false)
            setUserChoices(null)
        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }
  return (
    <SafeAreaView className='w-full h-full p-4'>
        <View>
            <Icon name="arrow-left" size={20} color="#20c1e1" onPress={() => {
                setUserChoices(null)
            }}/>
        </View>
        <View className=' items-center justiy-center '>
            <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                <Text className='font-semibold text-[15px] text-gray-100 text-center'>{loading ? "Gib mir einen Moment..." : matchingModules.length > 0  ? "Ich habe da was gefunden drücke einfach auf die Module und ich füge sie für dich hinzu" : "Leider habe ich nichts gefunden aber kein Problem"}</Text>
            </View>
            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
            <Image source={require('../../assets/Search.gif')}  style={{height:150, width:150}}/>
        </View>
        { loading || matchingModules.length > 0 ?
        <View className="flex-1    rounded-[10px] ml-2  justify-center z-10   "
            >
        <ScrollView 
        style={{
            scrollbarWidth: 'thin', // Dünne Scrollbar
            scrollbarColor: 'gray transparent', 
        }}
        className='w-full'
        >
            
            <View className=' w-full h-full items-ceter justify-start  mt-4 '>
            { loading ? 
                <View className='w-full flex-row items-center justify-center '>
                    
                    <ActivityIndicator size="small" color="#20c1e1" />
                    <Text className='text-gray-100 font-semibold text-[15px] m-2'>Suche läuft...</Text>
                    
                </View>
                :
                <View className={`${matchingModules.length > 0 ? "" : " items-center  justify-center"}`}>
                        <View className='flex-1 '>
                            <View className='flex-row flex-wrap justify-start items-center'>
                            <FlatList
                                data={matchingModules}
                                renderItem={({ item,index }) => (
                                    <View className={`flex-1 mr-2  ${selectedModules.includes(item.name) ? "" : "opacity-50"} `}>
                                    <Karteikarte handlePress={()=> {
                                                    if (selectedModules.includes(item.name)){
                                                        setSelectedModules(selectedModules.filter((module) => module !== item.name))
                                                    } else {
                                                        setSelectedModules([...selectedModules, item.name])
                                                    }
                                                }}
                                                farbe={item.color} studiengang={item.description} percentage={item.progress} titel={item.name}  fragenAnzahl={item.questions} notizAnzahl={item.notes} creator={user.$id} availability={item.public} icon={"clock"} publicM={item.public} />
                                    </View>
                                )}
                                keyExtractor={(item) => item.$id}
                                key={numColumns}
                                numColumns={numColumns}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </ View>
                </View>
                }
            </View>
        </ScrollView>
        </View>
        :
        <View className={`flex-1 justify-center ${width > 500 ? "flex-row " : ""}`}
        style={{
            height:200
        }}
        >
                            <ContinueBox
                                text={"Erstellen wir zusammen ein Lernset."}
                                colorBorder={"#7a5af8"}
                                colorBG={"#372292"}
                                iconName={"bot"}
                                handlePress={() => setUserChoices("GENERATE")}
                                horizontal={width > 700 ? false : true}
                                selected={true}
                                />
                            <ContinueBox
                                text="Erstelle dein eigenes Lernset."
                                colorBorder={"#4f9c19"}
                                colorBG={"#2b5314"}
                                iconName={"cubes"}
                                handlePress={() => setUserChoices("CREATE")}
                                horizontal={width > 700 ? false : true}
                                selected={true}
                            />
                        </View>
}
        <View className='items-center justify-center m-2'>
            {selectedModules.length > 0 ?
            <GratisPremiumButton
                aditionalStyles={"w-full max-w-[300px] rounded-[10px] bg-blue-500  "}
                handlePress={async ()=> {
                    if (selectedModules.length > 0){
                        matchingModules.map((module) => {
                            if (selectedModules.includes(module.name)){
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
                                    synchronization: false

                                }
                                add(mod)
                            }

                        }
                        
                    )
                    } else {
                    }
                    setUserDataSetup(user.$id)
                    router.push("/bibliothek")
                    
                }}
            >
                <Text className='text-gray-700 font-semibold text-[15px] '
                
                >   
                {
                    selectedModules.length > 0 ? selectedModules.length == 1 ? "Dieses Modul verwenden" : `Diese ${selectedModules.length} Module verwenden` : "Noch keine Module ausgewählt"
                }
                </Text>
            </GratisPremiumButton>
            : null}
        </View>
    </SafeAreaView>
  )
}

export default PageDiscover