import { View, Text, StatusBar, Settings } from 'react-native'
import React, { useContext, useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import InfoModule from '@/components/(tabs)/infoModule'
import CustomButton from '@/components/(general)/customButton'
import { useWindowDimensions } from 'react-native';
import SwichTab from '@/components/(tabs)/swichTab'
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider'
import General from '@/components/(profile)/general'
import ProfileSettings from '@/components/(profile)/profileSettings'
import PersonalInfo from '@/components/(profile)/personalInfo'
import { ScrollView } from 'react-native-gesture-handler'
import SkeletonList from '@/components/(general)/(skeleton)/skeletonList'
import SkeletonListProfile from '@/components/(general)/(skeleton)/skeletonListProfile'

const profil = () => {
  const {user} = useGlobalContext();
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const isVertical = width > 700;
  const tabWidth = width / 2; // Da es zwei Tabs gibt
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