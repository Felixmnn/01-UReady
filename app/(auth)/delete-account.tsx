import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { deletingAccount } from '@/lib/appwrite';
import * as Updates from 'expo-updates';
import { useGlobalContext } from '@/context/GlobalProvider';


const DeleteAccount = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useGlobalContext();

  async function handleDelete () {
    const res = await deletingAccount(); 
    console.log(res);
    setModalVisible(false);
    await Updates.reloadAsync();
    
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#0c111d] "    >
      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded-xl"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-semibold">Account löschen</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-[#8B0000] p-6 rounded-lg w-80">
            <Text className="text-lg text-xl font-bold mb-4 text-white">
              Account löschen
            </Text>
            <Text className="mb-6 font-bold text-white">
              Bist du sicher, dass du deinen Account dauerhaft löschen möchtest?
            </Text>
            <View className="flex-row justify-between space-x-4">
              <TouchableOpacity
                onPress={() => router.push('/profil')}
                className="px-4 py-2 rounded bg-gray-300"
              >
                <Text>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                className="px-4 py-2 rounded bg-red-600"
              >
                <Text className="text-white">Löschen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccount;
