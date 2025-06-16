import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { deletingAccount } from '@/lib/appwrite';
import * as Updates from 'expo-updates';
import { useGlobalContext } from '@/context/GlobalProvider';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { deleteAllModules, deleteUserData, deleteUserDataKathegory, deleteUserUsage } from '@/lib/appwriteDelete';


const DeleteAccount = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { user, language } = useGlobalContext();
  const texts = language ? languages.deleteAccount[language] : languages.deleteAccount['DEUTSCH'];
  useEffect(() => {
    if (!user) {
      console.error("No user is logged in.");
      router.push('/sign-in');
    }},[])
  async function deleteModules() {
    await deleteAllModules(user.$id);
    return true;
  }
  async function deleteData(){
    await deleteUserData(user.$id);
    await deleteUserUsage(user.$id);
    await deleteUserDataKathegory(user.$id);
    return true;
  }

  async function handleDelete () {
    if (!user) {
      console.error("No user is logged in.");
      router.push('/sign-in');
    }
    await deleteModules();
    await deleteData();
    const res = await deletingAccount(); 
    setModalVisible(false);
    await Updates.reloadAsync();
    
    
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#0c111d] "    >
      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded-xl"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-semibold">{texts.deleteAccount}</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-[#8B0000] p-6 rounded-lg w-80">
            <Text className="text-lg text-xl font-bold mb-4 text-white">
              {texts.deleteAccount}
            </Text>
            <Text className="mb-6 font-bold text-white">
              {texts.areYouSure}
            </Text>
            <View className="flex-row justify-between space-x-4">
              <TouchableOpacity
                onPress={() => {router.push('/profil'); setModalVisible(false)}}
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
    </View>
  );
};

export default DeleteAccount;
