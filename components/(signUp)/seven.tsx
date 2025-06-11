import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData } from '@/lib/appwriteDaten';

const StepSeven = () => {
  const {user, isLoggedIn,isLoading } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  const [userData, setUserData] = useState(null);

  async function fetchUserData() {
    try {
      const res = await loadUserData()
      if (res) {
        setUserData(res);
        return res;
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      return null;
    }
  };
  useEffect(() => {
    if (!userData) {
      fetchUserData()
    }  
    if (userData?.signInProcessStep === "FINISHED") {
      router.replace("/getting-started");
    }
  }, [userData]);
  

  return (
      <View className='h-full w-full justify-center items-center py-5 flex-row'>
        <ActivityIndicator size="large" color="#fff" />
        <Text className='text-white'>...</Text>
      </View>
    ) 
 
}

export default StepSeven