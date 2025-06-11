import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { deleteDocument } from '@/lib/appwriteDelete'; 
import { router } from 'expo-router'; 

const DeleteModule = ({moduleID="id", moduleName="Name", isVisible=false, setIsVisible, modules, setModules, setSelectedModule,texts}) => {
    async function handleDelete() {
        await deleteDocument(moduleID);
        const updatedModules = modules.documents.filter(module => module.$id !== moduleID);
        setModules({
            ...modules,
            documents: updatedModules
        });
        setSelectedModule("AllModules");
        setIsVisible(false);
        router.push("/bibliothek");
        
    }
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        >
        <View className='flex-1 justify-center items-center bg-black bg-opacity-50'>
            <View className='bg-gray-800 rounded-lg p-6 w-11/12 max-w-md'>
                <Text className=' text-lg font-bold text-gray-300'>{texts.areYousureDelete} </Text>
                <Text className='text-lg font-bold text-gray-300'>{moduleName}</Text>
                <Text className='mb-4 text-[12px] text-red-500'>{texts.cannotBeUndone}</Text>

                <View className="flex-row justify-between space-x-4">
                    <TouchableOpacity
                    onPress={() => {setIsVisible(false)}}
                    className="px-4 py-2 rounded bg-gray-300"
                    >
                    <Text>{texts.cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={handleDelete}
                    className="px-4 py-2 rounded bg-red-600"
                    >
                    <Text className="text-white">{texts.delete}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default DeleteModule