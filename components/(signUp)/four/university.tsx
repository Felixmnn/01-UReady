import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import ProgressBar from '../(components)/progressBar';
import { useTranslation } from 'react-i18next';

const University = ({
    userData,
    setUserData,
    universityListDeutschland,
    setSelectedUniversity,
    universityFilter,
    setUniversityFilter
}:{
    userData: any,
    setUserData: React.Dispatch<React.SetStateAction<any>>,
    universityListDeutschland: any,
    setSelectedUniversity: React.Dispatch<React.SetStateAction<any>>,
    universityFilter: string,
    setUniversityFilter: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { t } = useTranslation();
    const [ isVisible, setIsVisible ] = useState(true)
    
  return (
            <View className='h-full  w-full justify-between items-center py-5'>
            <BotBottomLeft
                message={t("personalizeFour.whichUniversity")}
                imageSource="Location"
                spechBubbleStyle="bg-blue-500" 
                spBCStyle="max-w-[200px]"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            <View className='w-full'>
                <ProgressBar percent={60} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
            </View>
            <View className='flex-1 bg-gray-900 w-full  max-w-[600px] max-h-[700px] rounded-[10px] '
                style={{maxWidth:600, maxHeight:700}}
                >
                <TextInput
                    className={`text-gray-400 rounded-[10px] bg-[#0c111d] p-2 m-2 border-blue-700 border-[1px]  `} 
                    value={universityFilter}
                    onChangeText={(text) => setUniversityFilter(text)}
                    placeholder={t("personalizeFour.yourUniversity")}
                    placeholderTextColor="#AAAAAA" 
                />
                <View className='flex-1'>
                    <FlatList
                        data={universityListDeutschland.filter((item: { name: string }) => item.name.toLowerCase().includes(universityFilter.toLowerCase()))}
                        keyExtractor={((item,index) => index.toString())}
                        ListEmptyComponent={() => (
                            <View className='items-center justify-center flex-1'>
                                <Text className='text-gray-400 font-semibold text-center'>{
                                    universityFilter.length > 0 ? t("personalizeFour.noUniversityFound") : t("personalizeFour.noUniversityAvailable")
                                }</Text>
                            </View>
                        )}
                        renderItem={({item}) => (
                            <TouchableOpacity key={item.id} onPress={()=> {
                                
                                    setSelectedUniversity(item); 
                                    setUserData({...userData,signInProcessStep:"FIVE"})
                            }} 
                            className='flex-row p-2 border-gray-800 border-[1px] rounded-[10px] bg-gray-800  items-center justify-start m-2'
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: 30, height: 30, borderRadius: 5  }}
                                    />
                                <Text className='text-gray-100 font-semibold text-[15px] text-center ml-2' numberOfLines={item.name.length > 13 ? 2 : undefined}>
                                    {item.name}
                                </Text> 
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
            <View className='items-center justiy-center'></View>
            
            </View>
        )
}

export default University