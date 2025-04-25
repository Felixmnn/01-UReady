import { View, Text, StatusBar, Settings,ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { router } from 'expo-router';
import Tabbar from '@/components/(tabs)/tabbar'
import { useWindowDimensions } from 'react-native';
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider'
import General from '@/components/(profile)/general'
import ProfileSettings from '@/components/(profile)/profileSettings'
import PersonalInfo from '@/components/(profile)/personalInfo'
import SkeletonListProfile from '@/components/(general)/(skeleton)/skeletonListProfile'

const profil = () => {
  const {user, isLoggedIn,isLoading } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);
  
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const [page,setPage] = useState("profil")

  

  return (
      <Tabbar content={()=> { return(
        user ? 
        <View className='flex-1 '>
          { page == "profil" ? <General setPage={()=> setPage("profil-settings")} setPage2={()=> setPage("profil-personal-details")}/> : null}
          { page == "profil-settings" ? <ProfileSettings setPage={()=> setPage("profil")}/> : null}
          { page == "profil-personal-details" ? <PersonalInfo setPage={()=> setPage("profil")} /> : null}

        </View>
        :
        <View className='flex-1 bg-[#0c111d] rounded-[10px] p-2 border-gray-500 border-[1px]'>
          <SkeletonListProfile/>
        </View>

    )}} page={"Profil"} hide={true}/>
  )
}

export default profil