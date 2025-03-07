import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
const AiQuestionSettings = ({isVisible, setIsVisible, setSelected, selectAi,sessions}) => {
    const [seltedSession, setSelectedSession] = useState(null)
 const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;    
  return (
    <View >
                {
    isVisible ? 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <TouchableOpacity 
            className="absolute top-0 left-0 w-full h-full justify-center items-center " 
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}  // 50% Transparenz
            onPress={() => setIsVisible(false)}
        >
            <View className='p-4 bg-gray-800 border-gray-700 border-[1px] rounded-xl'>
                <View className='flex-row flex-1 justify-between'>
                    <Text className='text-gray-200 mr-2 font-semibold '>Optimiere deine Ergebnisse mit den erwiterten AI-Einstellungen</Text>
                    <Icon name="times" size={20} color="white"/>
                </View>
                <View className='border-gray-500 border-t-[1px] my-2'/>
                <View className={` items-start justify-between`}>
                   <Text className='text-gray-200'>Wähle eine Session:</Text>
                   <View className='flex-wrap flex-row items-start justify-start'>
                        {
                            sessions.sessions.map((session) => {
                                return (
                                    <TouchableOpacity onPress={()=> setSelectedSession(session)} className={`flex-row items-center justify-between p-2 border-gray-500 border-[1px] m-1 rounded-[10px] ${seltedSession == session ? "bg-blue-900" : null}`}>
                                        <Text className='text-gray-200'>{session}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
                <TouchableOpacity className='w-full items-center bg-gray-700 rounded-full p-2 mt-2'>
                    <Text className='text-gray-200'>Generiere Fragen</Text>
                </TouchableOpacity>
            </View>
            
        </TouchableOpacity>
    </Modal>
    : null
}
        </View>
  )
}

export default AiQuestionSettings