import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { loadModules } from '@/lib/appwriteDaten'
import Icon from "react-native-vector-icons/FontAwesome5";
import { addDocument } from '@/functions/(createItems)/createDocument';
import { router } from 'expo-router';

const ModalAddFile = ({isVisible, setIsVisible}) => {
    const [modules, setModules] = useState([])
    const [selectedModule, setSelectedModule] = useState(null)
    const [selectedSession, setSelectedSession] = useState(null)

    useEffect(() => {
        async function getModules() {
            const modules = await loadModules();
            setModules(modules.documents)
        }
        getModules()
    }, [])

  return (
    <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
        >
            <View  className='absolute top-0 left-0 w-full h-full justify-center items-center '>
                <View className='w-full max-w-[400px] bg-gray-900 p-4 rounded-xl '>
                <View className='flex-row justify-between items-center'>
                    <Text className='text-gray-300 font-semibold text-[15px]'>Select a Module</Text>
                    <TouchableOpacity  className='flex-row justify-between items-center p-2' onPress={()=> setIsVisible(false)}>
                        <Icon name="times" size={20} color="white"/>
                    </TouchableOpacity>
                </View>

                        {
                        modules.length > 0 ?
                            <View className='flex-row flex-wrap  items-center w-full'>
                                {
                                    modules.map((module, index) => {
                                        return (
                                            <TouchableOpacity onPress={()=> {setSelectedModule(index); setSelectedSession(null)}} className={`p-2 rounded-lg m-1 ${selectedModule == index ? "bg-blue-700" : "border-gray-500 border-[1px]"} `}>
                                                <Text className='text-gray-300 font-semibold text-[12px]'>{module.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            :
                        null
                        }
                    <Text className='text-gray-300 font-semibold text-[15px] my-1'>Select a Session</Text>

                        {
                        selectedModule !== null && modules[selectedModule].sessions.length > 0 ?  
                            <View className='flex-row flex-wrap  items-center w-full'>
                                {modules[selectedModule].sessions.map((session, index) => {
                                    const pSession = JSON.parse(session)
                                    return (
                                        <TouchableOpacity onPress={()=> setSelectedSession(index)} className={`p-2 rounded-lg m-1 ${selectedSession == index ? "bg-blue-700" : "border-gray-500 border-[1px]"} `}>
                                            <Text className='text-gray-300 font-semibold text-[12px]'>{pSession.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            :
                            <Text className='text-gray-500 mb-2'> No Sessions available</Text>
                        }
                    <TouchableOpacity onPress={async ()=> {setIsVisible(false); await addDocument(modules[selectedModule].$id,JSON.parse(modules[selectedModule].sessions[selectedSession].id)); router.push("bibliothek")}} disabled={selectedModule === null ||  selectedSession === null} className={`w-full items-center justify-center bg-blue-700 p-2 rounded-full m-1 ${selectedModule === null ||  selectedSession === null ? "bg-gray-500 opacity-50" : ""}`} >
                        <Text className='text-gray-300 font-semibold text-[15px]'>Add File</Text>
                    </TouchableOpacity> 
                </View>
            </View>
    </Modal>
                    
  )
}

export default ModalAddFile