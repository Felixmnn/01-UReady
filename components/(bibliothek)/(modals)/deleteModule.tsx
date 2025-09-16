import { View, Text, Modal, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native'
import React from 'react'
import { deleteDocument } from '@/lib/appwriteDelete'; 
import { router } from 'expo-router'; 
import Icon from "react-native-vector-icons/FontAwesome5";
import { updateModuleData } from '@/lib/appwriteUpdate';
import { useTranslation } from 'react-i18next';


/**
 * Name might be misleading, this component is used to edit a module as well as delete it
 */
const DeleteModule = ({
        moduleID="id",
        moduleName="Name",
        description="",
        isVisible=false,
        setIsVisible,
        modules,
        setModules,
        setSelectedModule,
    }:{
        moduleID: string,
        moduleName: string,
        description: string,
        isVisible: boolean, 
        setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
        modules: any,
        setModules: React.Dispatch<React.SetStateAction<any>>,
        setSelectedModule: React.Dispatch<React.SetStateAction<string>>,
    }) => {
    const [ showWarning, setShowWarning ] = React.useState(false);  
    const [ savedChanges, setSavedChanges ] = React.useState(false);
    const { t } = useTranslation();
    async function handleDelete() {
        if (showWarning === false){
            setShowWarning(true);
            return;
        }
        await deleteDocument(moduleID);
        const updatedModules = modules.documents.filter((module:any) => module.$id !== moduleID);
        setModules({
            ...modules,
            documents: updatedModules
        });
        setSelectedModule("AllModules");
        setIsVisible(false);
        router.push("/bibliothek");
        
    }
    const [newModuleName, setNewModuleName] = React.useState(moduleName);
    const [newModuleDescription, setNewModuleDescription] = React.useState(description);

    async function handleSaveChanges() {
        if (newModuleName === moduleName && newModuleDescription === description) {
            setIsVisible(false);
            return;
        } else {
            await updateModuleData(moduleID , {
                name: newModuleName,
                description: newModuleDescription
            })
            setSavedChanges(true);
        }}
  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        >
        <View className='w-full h-full bg-gray-800 p-4'
       
        >
            <View className='w-full flex-row justify-between items-center mb-4'>
                <TouchableOpacity
                    onPress={() => {
                        if (savedChanges) {
                            setSelectedModule("AllModules");
                        } else  {
                            setIsVisible(false);
                        }
                    }}
                    className=''
                >
                    <Icon name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <View/>
                {
                    (newModuleName !== moduleName || newModuleDescription !== description) && !savedChanges ?
                <TouchableOpacity onPress={()=> handleSaveChanges()} className='bg-blue-500 rounded-[5px] py-1 px-2' >
                    <Text className='text-white font-semibold '>{t("deleteModule.saveChanges")}</Text>
                </TouchableOpacity>
                : savedChanges ?
                <View className='bg-green-500 rounded-[5px] py-1 px-2'>
                    <Text className='text-white font-semibold '>{t("deleteModule.changesSaved")}</Text>
                </View>
                : null
                }
            </View>
            <View className='flex-1'>
                <Text className='text-white font-semibold text-[20px] mb-2'>{t("deleteModule.moduleName")}</Text>
                <TextInput
                    className='mb-4 px-4 py-2 bg-gray-700 text-white rounded'
                    placeholder={t("deleteModule.typeModuleName")}
                    placeholderTextColor="gray"
                    value={newModuleName}
                    onChangeText={(text) => {setNewModuleName(text), setSavedChanges(false)}}
                />
                <Text className='text-white font-semibold text-[20px] mb-2'>{t("deleteModule.moduleDescription")}</Text>
                <TextInput
                    className='mb-4 mt-2 px-4 py-2 bg-gray-700 text-white rounded'
                    placeholder={t("deleteModule.typeModuleDescription")}
                    multiline
                    numberOfLines={2}
                    maxLength={200}
                    placeholderTextColor="gray"
                    value={newModuleDescription}
                    onChangeText={(text) => {setNewModuleDescription(text), setSavedChanges(false)}}
                />
            </View>

                

                

                <View className={`flex-row justify-between space-x-4 rounded-lg ${showWarning ? "bg-red-900" : ""}`}>
                    <View>
                        {
                            showWarning ?
                            <View className='p-4'> 
                                <Text className="text-white mb-2 font-bold text-[15px]">{t("deleteModule.areYousureDelete")}</Text>
                                <Text className="text-gray-100">{t("deleteModule.cannotBeUndone")}</Text>
                            </View>
                            :
                            null
                        }
                    </View>
                    <View className='flex-row'>
                    {
                        showWarning ?
                    <TouchableOpacity
                        onPress={() => setShowWarning(false)}
                        className="px-4 py-2 rounded items-center bg-gray-600 flex-row justify-center"
                    >
                    <Text className="text-white mr-2">{t("deleteModule.cancel")}</Text>
                    <Icon name="times" size={15} color="white" />
                    </TouchableOpacity>
                        : null}
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="px-4 py-2 rounded items-center bg-red-600 flex-row justify-center"
                    >
                    <Text className="text-white mr-2">{t("deleteModule.delete")}</Text>
                    <Icon name="trash" size={15} color="white" />
                    </TouchableOpacity>
                    </View>
                </View>
        </View>
    </Modal>
  )
}

export default DeleteModule