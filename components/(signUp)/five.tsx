import { View, Text, TouchableOpacity,Image, FlatList, TextInput,ScrollView } from 'react-native'
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
    const numColumns = width < 400 ? 2 : 3;

    const chunkArray = (arr, size) => {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) {
            chunked.push(arr.slice(i, i + size));
        }
        return chunked;
        };


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
    const robotMessage = {
        "DE": "Super! Welchen Abschluss machst du?",
        "GB": "Great! What type of degree are you pursuing?",
        "US": "Great! What kind of degree are you working towards?",
        "AU": "Great! What type of degree are you studying for, mate?",
        "ES": "¡Genial! ¿Qué tipo de título estás cursando?",
    }
    
    return (
            <View  className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                    <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>
                    <BotTopLeft source={require('../../assets/Check.gif')} text={selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]}/>

                </View>
                <View className='justify-center items-center'>
                    <FlatList
                        data = {degrees}
                        numColumns={width < 400 ? 2 : 3}
                        className='z-100'
                        renderItem={({item}) => (
                            <TouchableOpacity key={item.name} onPress={()=> {setDegree(item); setUserData({...userData,signInProcessStep:"SIX"})}} className='p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900  items-center justify-center m-1'
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
        const robotMessage = {
            "DE": "Ein interessantes Gebiet. Mal schauen ob wir deine Ausbildung finden.",
            "GB": "An interesting field. Let's see if we can find your apprenticeship.",
            "US": "An interesting field. Let's see if we can find your trade school or apprenticeship.",
            "AU": "An interesting field. Let's see if we can find your apprenticeship.",
            "ES": "Un campo interesante. Vamos a ver si podemos encontrar tu formación profesional.",
        }
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                <ProgressBar percent={75} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>  
                <BotTopLeft source={require('../../assets/Check.gif')} text={selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]}/>
                  
                </View>
                <SearchList 
                    data={selectedLanguage == null ? ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase())) : ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase()))}
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
            "DE": `${school.name === "Sonstige" ? "Interessant, du" : "Du"} gehst also auf ${school.name === "Gymnasium" ? "ein" : "eine"} ${school.name === "Sonstige" ? "Schulform, die nicht in der Liste war" : school.name}. In welche Klasse gehst du dort?`,
            "GB": `${school.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school.name === "Gymnasium" ? "a" : "an"} ${school.name === "Sonstige" ? "education type not listed" : school.name}. What year are you in?`,
            "US": `${school.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school.name === "Gymnasium" ? "a" : "an"} ${school.name === "Sonstige" ? "school type that's not listed" : school.name}. What grade are you in?`,
            "AU": `${school.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school.name === "Gymnasium" ? "a" : "an"} ${school.name === "Sonstige" ? "school type not listed" : school.name}. What year level are you in?`,
            "ES": `${school.name === "Sonstige" ? "Interesante, tú" : "Entonces, estás en"} ${school.name === "Gymnasium" ? "un" : "una"} ${school.name === "Sonstige" ? "tipo de escuela no listado" : school.name}. ¿En qué curso estás?`,
        }
        const groupedData = chunkArray(school.klassenstufen, numColumns);    

        return (
            <ScrollView className='w-full h-full'>
                <View className='h-full  w-full justify-between items-center py-5'>
                    <View className='w-full'>
                        <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>
                        <BotTopLeft source={require('../../assets/Check.gif')} text={selectedLanguage == null ? robotMessage.DE : robotMessage[languages[selectedLanguage].code]}/>
                    </View>
                    <View className='justify-center items-center'>
                    {groupedData.map((row, rowIndex) => (
                        <View key={rowIndex} style={{ flexDirection: 'row' }}>
                        {row.map((item) => (
                            <TouchableOpacity
                            key={item}
                            onPress={() => {
                                setClass(item);
                                setUserData({ ...userData, signInProcessStep: "SIX" });
                            }}
                            className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
                            style={{ width: 120, height: 120 }}
                            >
                            <Text
                                className="text-gray-100 font-semibold text-[15px] text-center"
                                numberOfLines={item.length > 13 ? 2 : null}
                            >
                                {item}
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
}

export default StepFive