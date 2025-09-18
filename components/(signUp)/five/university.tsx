import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import ProgressBar from '../(components)/progressBar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

const University = ({
    userData,
    setUserData,
    setDegree
}:{
    userData: any,
    setUserData: React.Dispatch<React.SetStateAction<any>>,
    setDegree: React.Dispatch<React.SetStateAction<{name: string, icon: string} | null>>

}) => {

        const [ isVisible, setIsVisible ] = useState(true)
        const { width } = useWindowDimensions();
        const { t } = useTranslation();


        const degreesRaw = t("universityCategories.degrees", { returnObjects: true });
        console.log("Degrees Raw: ", degreesRaw);
        const degreeKeys = Object.keys(degreesRaw);
        console.log("Degree Keys: ", degreeKeys);
        const degrees = degreeKeys.map((key) => {
            return { name: degreesRaw[key].name, icon: degreesRaw[key].icon, id: key };
        });
        console.log("Degrees: ", degrees);
    return (
            <View  className='h-full  w-full justify-between items-center py-5'>
                <BotBottomLeft
                    message={t("personalizeFive.whatDegree")}
                    imageSource="Waving"
                    spechBubbleStyle="bg-blue-500" 
                    spBCStyle="max-w-[200px]"
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
                <View className='w-full'>
                    <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>

                </View>
                <View className='justify-center items-center'>
                    <FlatList
                        data = {degrees}
                        numColumns={width < 400 ? 2 : 3}
                        className='z-100'
                        renderItem={({item}) => (
                            <TouchableOpacity key={item.name} onPress={()=> {
                                setDegree(item); 
                                setUserData({...userData,signInProcessStep:"SIX"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900  items-center justify-center m-1'
                                style={{width:120, height:120}}
                            >
                                <Icon name={item.icon} size={20} color="#D1D5DB" />
                                <Text className='text-gray-100 font-semibold text-[15px] text-center' numberOfLines={item.name.length > 13 ? 2 : undefined}>
                                    {item.name}
                                </Text> 
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.name}  
                    />
                </View>
                <View/>
            </View>
    )
}

export default University