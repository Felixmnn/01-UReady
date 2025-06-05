import { ActivityIndicator, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';

const StepSeven = () => {
  const {user, isLoggedIn,isLoading } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  return (
      <View className='h-full w-full justify-between items-center py-5'>
        <ActivityIndicator size="large" color="#fff" />
        <Text className='text-white'>Lädt...</Text>
      </View>
    ) 

}

export default StepSeven