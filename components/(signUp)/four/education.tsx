import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import ProgressBar from '../(components)/progressBar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

type TranslatedName = {
  [langCode: string]: string; // z.B. DE, EN, FR
};

export type AusbildungTyp = {
  id: string;
  icon: string;
  name: TranslatedName;
};

const Education = ({
    selectedLanguage,
    setUserData,
    userData,
    languages,
    setAusbildungKathegorie,
    groupedDataEdu

}:{
    selectedLanguage: number | null,
    setUserData: (data: any) => void,
    userData: any,
    languages: any,
    setAusbildungKathegorie: React.Dispatch<React.SetStateAction<any>>,
    groupedDataEdu: AusbildungTyp[][]

}) => {
    const { t } = useTranslation();
    const [ isVisible, setIsVisible ] = useState(true)

  return (

    <ScrollView className='w-full '>
                <BotBottomLeft
                    message={t("personalizeFour.wichEducation")}
                    imageSource="Location"
                    spechBubbleStyle="bg-blue-500"
                    spBCStyle="max-w-[200px]"
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
                <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                    <ProgressBar percent={60} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
                </View>
                <View className='justify-center items-center'>
                {groupedDataEdu.map((row, rowIndex) => (
                        <View key={rowIndex} style={{ flexDirection: 'row' }}>
                        {row.map((item) => (
                            <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                                setAusbildungKathegorie(item);
                                setUserData({ ...userData, signInProcessStep: "FIVE" });
                            }}
                            className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
                            style={{ width: 125, height: 125 }}
                            >
                            <Icon name={item.icon} size={20} color="#D1D5DB" />
                            <Text
                                className="text-gray-100 font-semibold text-[15px] text-center"
                                numberOfLines={
                                selectedLanguage == null
                                    ? item.name.DE.length > 13 ? 2 : undefined
                                    : item.name[languages[selectedLanguage].code].length > 13 ? 2 : undefined
                                }
                            >
                                {selectedLanguage == null
                                ? item.name.DE
                                : item.name[languages[selectedLanguage].code]}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    ))}
                </View>
                <View className='items-center justiy-center'></View>
                </View>
            </ScrollView>
  )
}

export default Education