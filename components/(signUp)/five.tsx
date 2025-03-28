import { View, Text, TouchableOpacity,Image, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { LeibnizSubjects,ausbildungsListDeutschland } from '@/assets/exapleData/countryList';
import { withDecay } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import ProgressBar from './(components)/progressBar';
import SearchList from './(components)/searchList';
import BotTopLeft from './(components)/botTopLeft';

const StepFive = ({setDegree, selectedUniversity, ausbildungKathegorie,setSelectedKathegorie, school, userData, setUserData, languages, selectedLanguage, setSelected, setSelectedAusbildung, setClass}) => {
    const { width } = useWindowDimensions();
  if ("UNIVERSITY" == setSelectedKathegorie) {
    const [ degreeFilter, setDegreeFilter ] = useState("");
    const degrees = [
        { name: "Bachelor", icon: "graduation-cap" },
        { name: "Master", icon: "user-graduate" }, 
        { name: "Staatsexamen", icon: "file-signature" },
        { name: "Diplom", icon: "scroll" }, 
        { name: "Magister", icon: "book-reader" }, 
        { name: "Others", icon: "question-circle" } 
    ];
    return (
        <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                    <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>
                </View>
                <View className='justify-center items-center'>
                    <FlatList
                        data = {degrees}
                        numColumns={width < 400 ? 2 : 3}
                        className='z-100'
                        renderItem={({item}) => (
                            <TouchableOpacity key={item.name} onPress={()=> {console.log("hello World");setDegree(item); setUserData({...userData,signInProcessStep:"SIX"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900  items-center justify-center m-1'
                                style={{width:120, height:120}}
                            >
                                <Icon name={item.icon} size={20} color="#D1D5DB" />
                                <Text className='text-gray-100 font-semibold text-[15px] text-center' numberOfLines={item.name.length > 13 ? 2 : null}>
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

    } else if (setSelectedKathegorie == "EDUCATION") {
        const [ausbildungsFilter, setAusbildungFilter] = useState("");
        const handlePress = (item) => {
            setSelectedAusbildung(item);
             setUserData({...userData,signInProcessStep:"SEVEN"})
        }
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                <ProgressBar percent={75} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>                    
                </View>
                <SearchList 
                    data={ausbildungsListDeutschland[ausbildungKathegorie.name].filter((item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase()))}
                    filter={ausbildungsFilter}
                    setFilter={setAusbildungFilter}
                    handlePress={handlePress}
                    selectedItems={null}
                />
                <View/>
            </View>
        )
    }
    else if (setSelectedKathegorie == "SCHOOL") {
        const robotMessage = {
            "DE":"In welcher Klasse bist du?",
            "GB":"In which field are you doing your apprenticeship?",
            "US":"What field is your trade school or apprenticeship in?",
            "AU":"What field’s your apprenticeship in?",
            "ES":"¿En qué área estás haciendo tu formación profesional?",
        }
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
            <View className='w-full'>
                <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
                <BotTopLeft source={require('../../assets/Check.gif')} text={selectedLanguage == null ? robotMessage.DE : robotMessage.languages[selectedLanguage].code}/>
            </View>
            <View className='justify-center items-center'>
                <FlatList
                    data = {school.klassenstufen}
                    numColumns={width < 400 ? 2 : 3}
                    className='z-100'
                    renderItem={({item}) => (
                        <TouchableOpacity key={item} onPress={()=> {setClass(item); setUserData({...userData,signInProcessStep:"SIX"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900  items-center justify-center m-1'
                            style={{width:120, height:120}}
                        >
                            <Text className='text-gray-100 font-semibold text-[15px] text-center' numberOfLines={item.length > 13 ? 2 : null}>
                                {item}
                            </Text> 
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    
                />
            </View>
            <View className='items-center justiy-center'></View>

        </View>
        )
    }
}

export default StepFive