import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { deleteDocument } from '@/lib/appwriteDelete'; 
import { router } from 'expo-router'; 
import Icon from "react-native-vector-icons/FontAwesome5";
import { updateModuleData } from '@/lib/appwriteUpdate';
import { useTranslation } from 'react-i18next';


//Name might be missleading - this modal is for editing module data and also for deleting the module
const DeleteModule = ({
  moduleID = "id",
  moduleName = "Name",
  description = "",
  tags = [],
  isVisible = false,
  setIsVisible,
  modules,
  setModules,
  setSelectedModule,
}: {
  moduleID: string,
  moduleName: string,
  description: string,
  tags: string[],
  isVisible: boolean, 
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  modules: any,
  setModules: React.Dispatch<React.SetStateAction<any>>,
  setSelectedModule: React.Dispatch<React.SetStateAction<string>>,
}) => {
  const [showWarning, setShowWarning] = React.useState(false);  
  const [savedChanges, setSavedChanges] = React.useState(false);
  const { t } = useTranslation();

  const [newModuleName, setNewModuleName] = React.useState(moduleName);
  const [newModuleDescription, setNewModuleDescription] = React.useState(description);
  const [newTags, setNewTags] = React.useState(tags);
  async function handleDelete() {
    if (!showWarning) {
      setShowWarning(true);
      return;
    }
    await deleteDocument(moduleID);
    const updatedModules = modules.documents.filter((module:any) => module.$id !== moduleID);
    setModules({ ...modules, documents: updatedModules });
    setSelectedModule("AllModules");
    setIsVisible(false);
    router.push("/bibliothek");
  }

  async function handleSaveChanges() {
    if ((newModuleName === moduleName && newModuleDescription === description)) {
      setIsVisible(false);
      return;
    } else {
      try {
      await updateModuleData(moduleID , {
        name: newModuleName,
        description: newModuleDescription,
        tags: newTags,
      })
      } catch (error) {
        console.error(error);
        return;
      }
      setSavedChanges(true);
    }
  }

  const [ newUser, setNewUser ] = React.useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View className="w-full h-full bg-gray-900 p-6">
        
        {/* Header */}
        <View className="w-full flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => {
              if (savedChanges) {
                setSelectedModule("AllModules");
              } else {
                setIsVisible(false);
              }
            }}
          >
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>

          { (newModuleName !== moduleName || newModuleDescription !== description) && !savedChanges ? (
            <TouchableOpacity onPress={handleSaveChanges} className="bg-blue-600 rounded-lg px-4 py-2">
              <Text className="text-white font-semibold">{t("deleteModule.saveChanges")}</Text>
            </TouchableOpacity>
          ) : savedChanges ? (
            <View className="bg-green-600 rounded-lg px-4 py-2">
              <Text className="text-white font-semibold">{t("deleteModule.changesSaved")}</Text>
            </View>
          ) : (
            <View />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-white font-semibold text-lg mb-2">{t("deleteModule.moduleName")}</Text>
          <TextInput
            maxLength={50}
            className="mb-6 px-4 py-3 ml-2 bg-gray-800 text-white rounded-lg border border-gray-700"
            placeholder={t("deleteModule.typeModuleName")}
            placeholderTextColor="gray"
            value={newModuleName}
            onChangeText={(text) => { setNewModuleName(text); setSavedChanges(false); }}
          />

          <Text className="text-white font-semibold text-lg mb-2">{t("deleteModule.moduleDescription")}</Text>
          <TextInput
            className="mb-6 px-4 py-3 ml-2 bg-gray-800 text-white rounded-lg border border-gray-700"
            placeholder={t("deleteModule.typeModuleDescription")}
            multiline
            numberOfLines={3}
            maxLength={200}
            placeholderTextColor="gray"
            value={newModuleDescription}
            onChangeText={(text) => { setNewModuleDescription(text); setSavedChanges(false); }}
          />

          {/* In einer andren Verison
          <Text className="text-white font-semibold text-lg mb-2">{t("deleteModule.addUsers")}</Text>
          {
            newTags.length > 0 ? (
              newTags.filter((t) => t.startsWith("USER")).map((user, index) => (
                <View key={index} className="bg-gray-800 rounded-lg p-3 mb-2 border border-gray-700 justify-between flex-row items-center">
                  {
                    user.startsWith("USER_REQUEST_") ?
                    <Text className="text-white italic">{user.replace("USER_REQUEST_", "")} ({t("deleteModule.pending")})</Text>
                  :
                  <Text className="text-white">{user}</Text>
                  } 
                  <TouchableOpacity onPress={() => {
                    if (user.startsWith("USER_REQUEST_")) {
                      const updatedTags = newTags.filter((t) => t !== user);
                      setNewTags(updatedTags);
                      setSavedChanges(false);
                      return;
                    }
                    const updatedTags = newTags.filter((t) => t !== user);
                    setNewTags(updatedTags);
                    setSavedChanges(false);
                  }}>
                    <Icon name="times" size={15} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-gray-400 italic">{t("deleteModule.noUsersAdded")}</Text>
            )
          }
            
          

          <View className="w-full flex-row items-center">
            <TextInput
              className="flex-1 mb-6 mt-4 px-4 ml-2 bg-gray-800 text-white rounded-lg border border-gray-700"
              placeholder={t("deleteModule.enterAUsername")}
              multiline
              numberOfLines={3}
              maxLength={200}
              placeholderTextColor="gray"
              value={newUser}
              onChangeText={(text) => { setNewUser(text);  }}
            />
            <TouchableOpacity className=" bg-blue-600 rounded-lg px-4 ml-2 mb-2 items-center justify-center"
              onPress={() => {
                if (newUser.trim() === "") return;
                if (tags.includes(newUser.trim())) {
                  setNewUser("");
                  return;
                } else {
                  const updatedTags = [...tags, "USER_REQUEST_" + newUser.trim()];
                  setNewTags(updatedTags);
                  setNewUser("");
                  setSavedChanges(false);
                }
              }}
              style={{
                height: 40, 
              }}
            >
              <Icon name="plus" size={15} color="white" />
            </TouchableOpacity>
            
        </View>
        */}
        {/* Delete Section */}
        <View className={`rounded-xl p-4 ${showWarning ? "bg-red-900" : "bg-gray-800"} border border-gray-700`}>
          {showWarning && (
            <View className="mb-3">
              <Text className="text-white font-bold text-base">{t("deleteModule.areYousureDelete")}</Text>
              <Text className="text-gray-300">{t("deleteModule.cannotBeUndone")}</Text>
            </View>
          )}
          
          <View className="flex-row justify-end space-x-3">
            {showWarning && (
              <TouchableOpacity
                onPress={() => setShowWarning(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 flex-row items-center"
              >
                <Text className="text-white mr-2">{t("deleteModule.cancel")}</Text>
                <Icon name="times" size={15} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 ml-2 justify-between px-4 py-2 rounded-lg bg-red-600 flex-row items-center"
            >
              <Text className="text-white mr-2">{t("deleteModule.delete")}</Text>
              <Icon name="trash" size={15} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        </View>


      </View>
    </Modal>
  )
}

export default DeleteModule
