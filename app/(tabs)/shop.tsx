import { View, Text, Image,ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import images from '@/assets/shopItems/itemConfig'
import TokenHeader from '@/components/(general)/tokenHeader'
import { BannerAd } from 'react-native-google-mobile-ads'


const shop = () => {
  const {user, isLoggedIn,isLoading, userUsage } = useGlobalContext();
   
    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);

   


    
  return (
    <Tabbar content={()=> { return( 
      <View className='flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]'>
        <TokenHeader userUsage={userUsage}/>
        <ScrollView className='w-full'>
          <View className="relative w-full h-[60px] mt-1 items-center justify-center">
            <Image source={images.head} style={{
              width: 350,
              resizeMode: 'contain',
              marginTop: 5,
            }} />
            <Text className="absolute text-white text-2xl font-bold pt-2"
              style={{
                color: "#bc8e00",
              }}
            >{"Buy Energy"}</Text>
          </View>
          <View className="relative w-full h-[60px] mt-1 items-center justify-center">
              <Image source={images.head} style={{
                width: 350,
                resizeMode: 'contain',
                marginTop: 5,
              }} />
              <Text className="absolute text-white text-2xl font-bold pt-2"
                style={{
                  color: "#bc8e00",
                }}
              >{"Watch Ad for Energy"}</Text>
          </View>
        </ScrollView>
      </View>
      
  )}} page={"Shop"} hide={false}/>
  )
  }


export default shop