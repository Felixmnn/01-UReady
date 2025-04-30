import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';

const SingOut = () => {
  const {
    user, isLoggedIn,isLoading 
  } = useGlobalContext();
  useEffect(() => {
    if (user == undefined && isLoggedIn == false && isLoading) {
      router.push("/")
    }
  },[user, isLoggedIn, isLoading])
  return (
    <View className='flex-1 items-center justify-center bg-gray-900'>
      <ActivityIndicator size="large" color="#00ff00" />
      <Text className='text-gray-100 font-semibold text-[15px] mt-2'>
        {isLoading ? "Abmelden..." : "Abgemeldet"}
      </Text>
    </View>
  )
}

export default SingOut