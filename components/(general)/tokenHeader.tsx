import { View, Text, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {router} from 'expo-router'
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useTranslation } from 'react-i18next';


const TokenHeader = ({userUsage}:{
    userUsage: {streak: number, energy: number, microchip: number, boostActive: boolean}
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.streak;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])

  const ModalStreak = () => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            >
           <TouchableOpacity onPress={()=> setIsVisible(false)} className="flex-1 items-center justify-center ">
                <View className="bg-gray-800 p-5 rounded-xl shadow-lg items-center">
                    <Image source={require('@/assets/streak.gif')} 
                            style={{
                                height: 80,
                                width:80,
                                resizeMode: 'contain',
                                borderRadius: 0,
                            }}/>
                    <Text className="text-red-500 text-center"
                      style={{color:"orange"}}
                    >{t("tokenHeader.youHave")} {userUsage?.streak} {t("tokenHeader.daysInARow")}</Text>
                    <TouchableOpacity
                        onPress={() => setIsVisible(false)}
                        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-full"
                    >
                        <Text className="text-white font-bold">{t("tokenHeader.close")}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    )
  }

  return (
    <View className='w-full flex-row justify-between'>
      <View className='w-full flex-row justify-between'>
        <ModalStreak/>
        <TouchableOpacity className='flex-row m-2 px-5 pt-2'  onPress={()=> setIsVisible(true)} >
            <Icon name="fire" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.streak}</Text>
        </TouchableOpacity>

        <View className='flex-row m-2 pt-2 px-5' >
            <TouchableOpacity className='flex-row mx-5' onPress={()=> router.push("/shop")} >
            <Icon name="microchip" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.microchip}</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row' onPress={()=> router.push("/shop")}
            >
            <Icon name="bolt" size={20} color={"white"}/>
            <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.boostActive ? "∞" : userUsage?.energy}</Text>
            </TouchableOpacity>
        </View>
      </View>
      <View>
        
      </View>
    </View>
  )
}

export default TokenHeader