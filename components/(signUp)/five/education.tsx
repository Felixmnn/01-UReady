import { View, Text } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../(components)/progressBar';
import SearchList from '../(components)/searchList';

type Item = {
    id: string;
    name: string;
    icon?: string;
    image?: string;
};


const Education = ({
    selectedLanguage,
    setUserData,
    userData,
    ausbildungsListDeutschland,
    ausbildungKathegorie,
    setSelectedAusbildung
}:{
    selectedLanguage: number | null,
    setUserData: (data: any) => void,
    userData: any,
    ausbildungsListDeutschland: any,
    ausbildungKathegorie: {id: string, name: {[key: string]: string}},
    setSelectedAusbildung: React.Dispatch<React.SetStateAction<any>>

}) => {
    console.log(ausbildungsListDeutschland)
    const { t } = useTranslation();
  const [ isVisible, setIsVisible ] = useState(true)
    const [ausbildungsFilter, setAusbildungFilter] = useState("");

    const handlePress = (item:Item) => {
        setSelectedAusbildung(item);
            setUserData({...userData,signInProcessStep:"SEVEN"})
    }
    
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
            <BotBottomLeft
                message={t("personalizeFive.interestingArea")}
                imageSource="Waving"
                spechBubbleStyle="bg-blue-500"
                spBCStyle="max-w-[200px]"
                isVisible={isVisible}
                setIsVisible={setIsVisible}
            />
            <View className='w-full'>
            <ProgressBar percent={75} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>  
            </View>
            <SearchList
                data={selectedLanguage == null ? ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item:Item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase())) : ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item:Item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase()))}
                filter={ausbildungsFilter}
                setFilter={setAusbildungFilter}
                handlePress={handlePress}
                nameComparison={false}
                selectedItems={[]}
                noResultsText={t("personalizeFive.noEducationFound")}
                abschlussziel={t("personalizeFive.yourEducation")}

            />
            <View/>
        </View>
    )
}

export default Education