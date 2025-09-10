import { View, Text, Image, TextInput, useWindowDimensions} from 'react-native'
import React from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import ProgressBar from './(components)/progressBar'
import BotCenter from './botCenter'
import { useTranslation } from 'react-i18next'

/**
 * StepOne Component
 * This component is the first step in the sign-in process, asking the user for their name.
 */
const StepOne = (
    {name, setName, userData, setUserData}:{
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    userData: any,
    setUserData: React.Dispatch<React.SetStateAction<any>>
}) => {
    const {height} = useWindowDimensions()
    const { t } = useTranslation();
    return (
        <View className='h-full  w-full justify-between items-center py-5'>   
            <ProgressBar percent={20} handlePress={()=> setUserData({...userData,signInProcessStep:"ZERO"})}/>
                <View className='items-center justiy-center'>
                    <BotCenter message={t("personalizeOne.greeting")} imageSource="Frage" spechBubbleStyle="bg-blue-500" spBCStyle="max-w-[200px]"/>
                        <TextInput
                                className={`text-white  rounded-[10px] p-1 bg-[#0c111d] text-center p-2 my-1 mx-2 border-blue-700 border-[1px]  `} 
                                style={{width:200, color: 'white'}}
                                value={name}
                                onChangeText={(text) => setName(text)}
                                placeholder={t("personalizeOne.name")}
                                placeholderTextColor="#AAAAAA"
                        />
                </View>
            <View className=' max-w-[200px]' style={{width:200}}>
                <GratisPremiumButton active={true} aditionalStyles={"rounded-full w-full bg-blue-500 "} handlePress={()=> setUserData({...userData,signInProcessStep:"TWO"})}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{t("personalizeOne.continue")}</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepOne