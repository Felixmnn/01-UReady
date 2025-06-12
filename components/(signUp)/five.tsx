import { View, Text, TouchableOpacity, FlatList,ScrollView } from 'react-native'
import React, {  useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useWindowDimensions } from 'react-native';
import ProgressBar from './(components)/progressBar';
import SearchList from './(components)/searchList';
import BotBottomLeft from './botBottomLeft';
const StepFive = ({setDegree, message, ausbildungKathegorie,setSelectedKathegorie, ausbildungsListDeutschland, school, userData, setUserData, languages, selectedLanguage, setSelected, setSelectedAusbildung, setClass}) => {
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
    const degrees = [
        { name: "Bachelor", icon: "graduation-cap" },
        { name: "Master", icon: "user-graduate" }, 
        { name: "Staatsexamen", icon: "file-signature" },
        { name: "Diplom", icon: "scroll" }, 
        { name: "Magister", icon: "book-reader" }, 
        { name: "Others", icon: "question-circle" } 
    ];
        const [ isVisible, setIsVisible ] = useState(true)
    
    return (
            <View  className='h-full  w-full justify-between items-center py-5'>
                <BotBottomLeft
                    message={selectedLanguage == null ? message.robotMessageUniversity.DE : message.robotMessageUniversity[languages[selectedLanguage].code]}
                    imageSource="Waving"
                    spechBubbleStyle="bg-blue-500" 
                    spBCStyle="max-w-[200px]"
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
                <View className='w-full'>
                    <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>

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
            const [ isVisible, setIsVisible ] = useState(true)

        const [ausbildungsFilter, setAusbildungFilter] = useState("");
        
        const handlePress = (item) => {
            setSelectedAusbildung(item);
             setUserData({...userData,signInProcessStep:"SEVEN"})
        }
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
                <BotBottomLeft
                    message={selectedLanguage == null ? message.robotMessageEducation.DE : message.robotMessageEducation[languages[selectedLanguage].code]}
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
                    data={selectedLanguage == null ? ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase())) : ausbildungsListDeutschland[ausbildungKathegorie.name.DE].filter((item) => item.name.toLowerCase().includes(ausbildungsFilter.toLowerCase()))}
                    filter={ausbildungsFilter}
                    setFilter={setAusbildungFilter}
                    handlePress={handlePress}
                    selectedItems={null}
                    nameComparison={false}
                />
                <View/>
            </View>
        )
    } else if (setSelectedKathegorie == "SCHOOL") {
        const groupedData = chunkArray(school.klassenstufen, numColumns);    
        const [ isVisible, setIsVisible ] = useState(true)

        return (
            <ScrollView className='w-full h-full'>
                <BotBottomLeft
                    message={selectedLanguage == null ? message.robotMessageSchool.DE : message.robotMessageSchool[languages[selectedLanguage].code]}
                    imageSource="Waving"
                    spechBubbleStyle="bg-blue-500"
                    spBCStyle="max-w-[200px]"
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
                <View className='h-full  w-full justify-between items-center py-5'>
                    <View className='w-full'>
                        <ProgressBar percent={65} handlePress={()=> setUserData({...userData,signInProcessStep:"FOUR"})}/>
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