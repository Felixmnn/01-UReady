import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getSepcificModules } from '@/lib/appwriteQuerys'
import Karteikarte from '../(karteimodul)/karteiKarte'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import { addNewModule } from '@/lib/appwriteAdd'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { setUserDataSetup } from '@/lib/appwriteEdit'

const PageDiscover = ({userChoices, setUserChoices, userData}) => {
    const [ loading, setLoading] = useState(true)
    const { user } = useGlobalContext()
    const [ matchingModules, setMatchingModules] = useState([])
    const [ selectedModules, setSelectedModules] = useState([])
    const { width } = useWindowDimensions()
    useEffect(() => {   
        console.log("userData", userData)    
        if (userData == null) return;
        async function fetchModules() {
            const modules = await getSepcificModules(userData)
            console.log("Modules", modules)
            modules.length > 0 ? setMatchingModules(modules) : setMatchingModules([])
            setLoading(false)
        }
        fetchModules()
    },[userData])

    async function add(mod) {
        setLoading(true)
        console.log("Module", mod)
        try {
            const res = await addNewModule(mod)
            console.log("Module added", res)
            setLoading(false)
            setUserChoices(null)
        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }
  return (
    <View>
        <View className='items-center justiy-center'>
            <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                <Text className='font-semibold text-[15px] text-gray-100 text-center'>{loading ? "Gib mir einen Moment..." : matchingModules.length > 0  ? "Ich habe da was gefunden drücke einfach auf die Module und ich füge sie für dich hinzu" : "Leider habe ich nichts gefunden aber kein Problem"}</Text>
            </View>
            <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
            <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
            <Image source={require('../../assets/Search.gif')}  style={{height:150, width:150}}/>
        </View>
        <ScrollView className="rounded-[10px] p-1 bg-gray-900  border-gray-800 border-[1px] m-2 w-full  h-[75px] items-center justify-center z-10 py-3"
            style={{height: 500, maxWidth: 700,shadowColor: "#2970ff", // Grau-Blauer Glow
                paddingTop: width < 668 ? 100 : null,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: 10, // Für Android
                scrollbarWidth: 'thin', // Dünne Scrollbar
                scrollbarColor: 'gray transparent', 
            }}>
            <View className='w-full h-full items-ceter justify-start p-4 mt-4'>
            { loading ? 
                <View className='flex-row items-center justify-center '>
                    
                    <ActivityIndicator size="small" color="#20c1e1" />
                    <Text className='text-gray-100 font-semibold text-[15px] m-2'>Suche läuft...</Text>
                    
                </View>
                :
                <View>
                    {
                        matchingModules.length > 0 ?
                        <View>
                            <Text className='text-gray-300 font-semibold text-[15px]'>
                                Hier sind einige Module, die zu dir passen könnten:
                            </Text>
                            <View className='flex-row flex-wrap justify-start items-center'>
                                {
                                    matchingModules.map((module, index) => (
                                        <View key={index} className={`min-w-[250px]  m-2 rounded-b-[10px] `}
                                        style={{
                                            borderTopLeftRadius: 5,
                                            borderTopRightRadius: 5,
                                            opacity: selectedModules.includes(module.name) ? 1 : 0.5,
                                            shadowColor: selectedModules.includes(module.name) ? "#2970ff" : null, 
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.8,
                                            shadowRadius: 12,
                                            elevation: 12, 
                                        }}
                                        >
                                            <Karteikarte 
                                                titel={module.name}
                                                studiengang={module.description} //Das Feld wird umfunktioniert
                                                fragenAnzahl={module.questions}
                                                notizAnzahl={module.notes}
                                                farbe={module.color}
                                                creator={module.creator}
                                                icon={"clock"}
                                                percentage={null}
                                                publicM={module.public}
                                                handlePress={()=> {
                                                    if (selectedModules.includes(module.name)){
                                                        setSelectedModules(selectedModules.filter((item) => item !== module.name))
                                                    } else {
                                                        setSelectedModules([...selectedModules, module.name])
                                                    }
                                                }}
                                            />
                                        </View>
                                    ))
                                }
                            </View>
                        </ View>
                        : 
                        <TouchableOpacity>
                            <Text className='text-gray-300 font-semibold text-[15px] m-2'>
                               Wollen wir zusammen kurz ein Modul erstellen?
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                }
            </View>
        </ScrollView>
        <View className='items-center justify-center m-2'>
            <GratisPremiumButton
                aditionalStyles={"w-full max-w-[300px] rounded-[10px]  "}
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
                                    creator: module.$id,
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
                                console.log("Module", mod)
                                add(mod)
                            }

                        }
                        
                    )
                    } else {
                        console.log("Please select")
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
        </View>
    </View>
  )
}

export default PageDiscover