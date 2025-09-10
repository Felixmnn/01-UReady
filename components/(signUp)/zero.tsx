import { View, Text,Image, Platform } from 'react-native'
import React from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import BotCenter from './botCenter'
import { UserData } from '@/types/moduleTypes'
import { useTranslation } from 'react-i18next'
import { userData } from '@/types/moduleTypes'
/** 
    * StepZero Component
    * This component is the first step in the sign-in process, introducing the user to the app mascot
*/


const StepZero = ({userData, setUserData}:{
    userData: UserData,
    setUserData: React.Dispatch<React.SetStateAction<userData | undefined>>
}) => {

    const { t } = useTranslation();
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <View className='bg-gray-900 w-full rounded-[10px] ' style={{height:6}}>
                <View className={`bg-blue-500 h-full w-[${10}%] rounded-full`} style={{width:`${10}%`}}/>
            </View>
            <BotCenter message={t("personalizeZero.intro")} imageSource="Waving" spechBubbleStyle="bg-blue-500" spBCStyle="max-w-[200px]"/>
            <View className='w-full max-w-[200px]'>
                <GratisPremiumButton active={true} aditionalStyles={"rounded-full w-full bg-blue-500 "} handlePress={()=> setUserData({...userData,signInProcessStep:"ONE"})}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{t("personalizeZero.letsGo")}</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepZero