import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ModuleProps } from '@/types/moduleTypes'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { copyModule } from '@/lib/appwriteShare'
import { module } from '@/types/appwriteTypes'

/**
 * Component for accepting or declining a shared module.
 * 
 * @param {Object} props - The component props.
 * @param {ModuleProps} props.module - The module to be added.
 * @param {any} props.user - The current user object.
 * @param {React.Dispatch<React.SetStateAction<ModuleProps | null>>} props.setModuleToBeAdded - Function to update the module to be added.
 * @param {React.Dispatch<React.SetStateAction<module[]>>} props.setModules - Function to update the list of modules.
 * @returns {JSX.Element} The rendered component.
 */
const AcceptShareModule = ({
    module,
    user,
    setModuleToBeAdded,
    setModules
}:{
    module: ModuleProps,
    user: any,
    setModuleToBeAdded: React.Dispatch<React.SetStateAction<ModuleProps | null>>,
    setModules: React.Dispatch<React.SetStateAction<module[]>>
}) => {
    const { t } = useTranslation();

    /**
     * Handles the "Do Not Add" action.
     * Removes the module from AsyncStorage and resets the state.
     * 
     * @async
     * @returns {Promise<void>}
     */
    async function handleDoNotAdd() {
        await AsyncStorage.removeItem("moduleToBeAddedAfterSignUp");
        setModuleToBeAdded(null);
    }

    /**
     * Handles the "Add Module" action.
     * Copies the module for the user, updates the module list, and clears the state.
     * 
     * @async
     * @returns {Promise<void>}
     */
    async function handleAddModule() {
        const res = await copyModule(module, user);
        if (res === "Not found" || res === "Error") {
            // Handle error cases (optional: add error handling logic here)
        } else {
            setModules(prev => [...prev, res as module]);
        }
        await AsyncStorage.removeItem("moduleToBeAddedAfterSignUp");
        setModuleToBeAdded(null);
    }



  return (
    <View className='w-full p-4 items-center justify-center'>
        <Text className='text-gray-300 text-center font-medium'>
            {
                t("bibliothek.wouldYouLikeToAddModule", {moduleName: module.name})
            }
        </Text>
        <View className='mt-4 flex-row justify-center w-full'>
            <TouchableOpacity className='bg-blue-600 px-4 py-2 rounded-md mr-2'
            onPress={handleAddModule}
            >
            <Text className='font-bold text-gray-100'>
                {t("bibliothek.addModule")}
            </Text>
        </TouchableOpacity>
        <TouchableOpacity className='bg-gray-600 px-4 py-2 rounded-md ml-2'
            onPress={handleDoNotAdd}
        >
            <Text className='font-bold text-gray-100'>
                {t("bibliothek.doNotAdd")}
            </Text>
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default AcceptShareModule