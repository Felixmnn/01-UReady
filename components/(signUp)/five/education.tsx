import { View, Text } from 'react-native'
import React, { useState } from 'react'
import BotBottomLeft from '../botBottomLeft';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../(components)/progressBar';
import SearchList from '../(components)/searchList';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';

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
    setSelectedAusbildung,
    saveUserData    ,
    subjectSelection,
    selectedSubjects
}:{
    selectedLanguage: number | null,
    setUserData: (data: any) => void,
    userData: any,
    ausbildungsListDeutschland: any,
    ausbildungKathegorie: {id: string, name: {[key: string]: string}},
    setSelectedAusbildung: React.Dispatch<React.SetStateAction<any>>,
    saveUserData: () => Promise<void>,
    subjectSelection: (item: { name: string; icon: string}) => void,
    selectedSubjects: { name: string; icon: string }[],

}) => {
    const { t } = useTranslation();
  const [ isVisible, setIsVisible ] = useState(true)
    const [ausbildungsFilter, setAusbildungFilter] = useState("");

    const handlePress = (item:Item) => {
        saveUserData();
    }
  
    
    return (
        <View className='h-full  w-full justify-between py-5'>
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
                handlePress={subjectSelection}
                nameComparison={false}
                selectedItems={selectedSubjects}

                noResultsText={t("personalizeFive.noEducationFound")}
                abschlussziel={t("personalizeFive.yourEducation")}

            />
            
            <View/>
            <GratisPremiumButton active={true} aditionalStyles={"rounded-full w-full bg-blue-500 rounded-lg  "} handlePress={()=> {
                        saveUserData()} }>
                    <Text className='text-gray-100 font-semibold text-[15px]'>{ t("personalizeSix.letsGo")}
                    </Text>
                </GratisPremiumButton>  
        </View>
    )
}

export default Education