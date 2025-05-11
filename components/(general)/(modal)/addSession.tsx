import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5"
import { loadModules } from '@/lib/appwriteDaten'

const AddSession = ({isVisible,setIsVisible}) => {
    const [modules, setModules] = useState([])
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
        visible={isVisible}>
        <View className='absolute top-0 left-0 w-full h-full justify-center items-center '>
            <View className='w-full max-w-[400px] bg-gray-800 p-4 rounded-xl '>
                <View className='flex-row justify-between items-center'>
                    <Text className='text-gray-300 font-semibold text-[15px]'>Select a Module</Text>
                    <TouchableOpacity  className='flex-row justify-between items-center p-2' onPress={()=> setIsVisible(false)}>
                        <Icon name="times" size={20} color="white"/>
                    </TouchableOpacity>
                </View>
                <Text className='text-gray-300 font-semibold text-[15px] my-1'>Select a Session</Text>
            </View>
        </View>
    </Modal>
  )
}

export default AddSession