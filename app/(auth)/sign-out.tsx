import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { signOut } from '@/lib/appwrite';

const SingOut = () => {
  const {user, setUser,setIsLoggedIn, setIsLoading,isLoggedIn, isLoading } = useGlobalContext() 
  
  
  useEffect(() => {
    if (user == undefined && isLoggedIn == false && isLoading) {
      router.push("/sing-in")
    }
  },[user, isLoggedIn, isLoading])

  useEffect(() => {
    async function signOutCompleat() {
      await setIsLoading(true)
      await signOut();
      await setIsLoggedIn(false)
      await setUser(undefined)
    }
    signOutCompleat()

  },[]);

  return (
    <View className='flex-1 items-center justify-center bg-gray-900'>
      <ActivityIndicator size="large" color="#fff" />
      <Text className='text-gray-100 font-semibold text-[15px] mt-2'>
        Abmelden...
      </Text>
    </View>
  )
}

export default SingOut