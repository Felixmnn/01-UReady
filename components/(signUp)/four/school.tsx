import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import ProgressBar from '../(components)/progressBar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';


type SchoolType = {
  id: string;
  name: string;
  icon?: string;
  image?: string;
};


const School = ({
    userData,
    setUserData,
    setSchool,
    Sonstige,
    groupedData,

}:{
    userData: any,
    setUserData: React.Dispatch<React.SetStateAction<any>>,
    setSchool: React.Dispatch<React.SetStateAction<any>>,
    Sonstige: any,
    groupedData: any[],

}) => {
    const { t } = useTranslation();
    const [ isVisible, setIsVisible ] = useState(true)
    
  return ( 
        <ScrollView className='w-full '
        >   
            <BotBottomLeft
                message={t("personalizeFour.whichSchool")}
                imageSource="Location"
                spechBubbleStyle="bg-blue-500" 
                spBCStyle="max-w-[200px]"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />

            <View className='w-full justify-between items-center '>
            <View className={`w-full ${Platform.OS == "android" ? "top-5" : null} `}>
                <ProgressBar percent={50} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
            </View>
                <View className='items-center'>
                   
                        <View className='justify-center items-center w-full'>
                        {groupedData.map((row, rowIndex) => (
                                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                                    {row.map((item:SchoolType) => (
                                        <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                            setSchool(item);
                                            setUserData({ ...userData, signInProcessStep: "FIVE" });
                                        }}
                                        className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
                                        style={{ width: 120, height: 120 }}
                                        >
                                        <Icon name="school" size={20} color="#D1D5DB" />
                                        <Text
                                            className="text-gray-100 font-semibold text-[15px] text-center"
                                            numberOfLines={item.name.length > 13 ? 2 : undefined}
                                        >
                                            {item.name}
                                        </Text>
                                        </TouchableOpacity>
                                    ))}
                                    </View>
                                ))}

                                {/* Footer Element (Sonstige) */}
                                <View className="w-full justify-center items-center">
                                    <TouchableOpacity
                                    onPress={() => {
                                        setSchool(Sonstige);
                                        setUserData({ ...userData, signInProcessStep: "FIVE" });
                                    }}
                                    key={Sonstige.id}
                                    className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
                                    style={{ width: 120, height: 120 }}
                                    >
                                    <Icon name="ellipsis-h" size={15} color="#D1D5DB" />
                                    <Text className="text-gray-100 font-semibold text-[15px] text-center">
                                        {Sonstige.name}
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

            </View> 
            <View className='items-center justiy-center'></View>
            </View>
            </ScrollView>
    )
}

export default School