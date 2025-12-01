import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { router } from 'expo-router';
import { deletingAccount } from '@/lib/appwrite';
import * as Updates from 'expo-updates';
import { useGlobalContext } from '@/context/GlobalProvider';
import { deleteAllModules, deleteUserData, deleteUserDataKathegory, deleteUserUsage } from '@/lib/appwriteDelete';
import CustomButton from '@/components/(general)/customButton';
import { useTranslation } from 'react-i18next';
import { resetMMKVStorage } from '@/lib/mmkvFunctions';

 
const DeleteAccount = () => {
  const { t } = useTranslation();
  
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (!user) {
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
      router.push('/sign-in');
    }
    resetMMKVStorage()
    await deleteModules();
    await deleteData();
    const res = await deletingAccount(); 
    setModalVisible(false);
    if ( Platform.OS === 'web') {
      router.push('/sign-in');
    } else {
    await Updates.reloadAsync();
    }
    
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#0c111d] p-2 ">
      <CustomButton 
        title={t("deleteAccount.title")}
        handlePress={() => setModalVisible(true)}
        containerStyles='rounded-lg bg-red-600 mb-10 w-full'
      />
      <CustomButton
        title={t("deleteAccount.backToProfile")}
        handlePress={() => router.push('/profil')}
        containerStyles='rounded-lg bg-gray-600 w-full'
      />
      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-[#8B0000] p-6 rounded-lg w-80">
            <Text className="text-lg text-xl font-bold mb-4 text-white">
              {t("deleteAccount.header")}
            </Text>
            <Text className="mb-6 font-bold text-white">
              {t("deleteAccount.message")}
            </Text>
            <View className="flex-row justify-between space-x-4">
              <TouchableOpacity
                onPress={() => {router.push('/profil'); setModalVisible(false)}}
                className="px-4 py-2 rounded bg-gray-300"
              >
                <Text>{t("deleteAccount.cancel")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                className="px-4 py-2 rounded bg-red-600"
              >
                <Text className="text-white">{t("deleteAccount.deleteAccount")}

                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccount;
