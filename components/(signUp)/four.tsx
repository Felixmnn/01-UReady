import { View, Text, TouchableOpacity, FlatList, useWindowDimensions,ScrollView, Image, TextInput, Platform } from 'react-native'
import React, {  useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProgressBar from './(components)/progressBar';
import BotTopLeft from './(components)/botTopLeft';

const StepFour = ({selectedLanguage,schoolListDeutschland, universityListDeutschland, ausbildungsTypen, setUserData, userData, languages, setSelectedRegion ,selectedRegion, selectedKathegorie, setSchool, setAusbildungKathegorie, ausbildungKathegorie, selectedUniversity, setSelectedUniversity, message }) => {
    const {width} = useWindowDimensions()
    const numColumns = width < 400 ? 2 : 3;
    const [isActive, setIsActive] = useState(false) 
    const Sonstige ={name:"Sonstige", id:"4058177f-0cd4-4820-8f71-5dsfsf57c4b27dd42", klassenstufen: [1,2,3,4,5,6,7,8,9,10,11,12,13] }
    const [universityFilter, setUniversityFilter] = useState("")
    const chunkArray = (arr, size) => {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) {
          chunked.push(arr.slice(i, i + size));
        }
        return chunked;
      };
    const groupedData = chunkArray(schoolListDeutschland.schoolTypes, numColumns);
    const groupedDataEdu = chunkArray(ausbildungsTypen, numColumns);
    if (selectedKathegorie == "SCHOOL") {
    return ( 
        <ScrollView className='w-full '
            style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: 'gray transparent',       
            }}
        >
            <View className='w-full justify-between items-center '>
            <View className={`w-full ${Platform.OS == "android" ? "top-5" : null} `}>
                <ProgressBar percent={50} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
                <BotTopLeft text={selectedLanguage == null ? message.robotMessageSchool.DE : message.robotMessageSchool[languages[selectedLanguage].code]}/>
            </View>
                <View className='items-center'>
                <View style={{ position: 'relative', zIndex: 10 }}>
                    <TouchableOpacity onPress={() => setIsActive(!isActive)} className='flex-row  bg-gray-900 border-gray-800 border-[1px] rounded-[10px] py-2 px-3 my-2 items-center justify-between mx-1'
                        style={{width:250}}
                        >           
                                    <View className='flex-row items-center justify-center'
                                    >
                                    <Image
                                        source={{ uri: selectedRegion == null ? schoolListDeutschland.regions[0].image : schoolListDeutschland.regions[selectedRegion].image }}
                                        style={{ width: 30, height: 30, borderRadius: 5  }}
                                        />
                                    <Text className='text-gray-300 font-semibold text-center mx-2 mt-[1px]'>{selectedRegion == null ? schoolListDeutschland.regions[0].name : schoolListDeutschland.regions[selectedRegion].name}</Text>
                                    </View>

                                    <Icon name={!isActive ? "caret-down" : "caret-up"} size={20} color="#4B5563"  />
                        </TouchableOpacity>
                        {isActive ? (
                            <View
                            className={`${Platform.OS == "android" ? "" : "absolute left-1 "} bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 shadow-lg`}
                            style={{
                              zIndex: 10,
                              elevation: 10,
                              width: 250,
                              top: Platform.OS == "android" ? -8 : 55,
                              left: Platform.OS == "android" ? 4 : 1,
                            }}
                          >
                            {schoolListDeutschland.regions.map((item, index) => (
                                <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    setSelectedRegion(index);
                                    setIsActive(false);
                                }}
                                className="flex-row justify-start items-center p-2 rounded-lg m-1"
                                >
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: 30, height: 30, borderRadius: 5 }}
                                />
                                <Text className="text-gray-300 font-semibold text-start ml-2 mt-[1px]">
                                    {item.name}
                                </Text>
                                </TouchableOpacity>
                            ))}
                          </View>
                            ) : null}
                        </View>
                        <View className='justify-center items-center w-full'>
                        {groupedData.map((row, rowIndex) => (
                                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                                    {row.map((item) => (
                                        <TouchableOpacity
                                        key={item.id}
                                        onPress={() => {
                                            if (selectedRegion == null) setSelectedRegion(0);
                                            setSchool(item);
                                            setUserData({ ...userData, signInProcessStep: "FIVE" });
                                        }}
                                        className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
                                        style={{ width: 120, height: 120 }}
                                        >
                                        <Icon name="school" size={20} color="#D1D5DB" />
                                        <Text
                                            className="text-gray-100 font-semibold text-[15px] text-center"
                                            numberOfLines={item.name.length > 13 ? 2 : null}
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



    } else if (selectedKathegorie == "UNIVERSITY") {
        return (
            <View className='h-full  w-full justify-between items-center py-5'>
            <View className='w-full'>
                <ProgressBar percent={60} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
                <BotTopLeft text={selectedLanguage == null ? message.robotMessageUniversity.DE : message.robotMessageUniversity[languages[selectedLanguage].code]}/>
            </View>
            <View className='flex-1 bg-gray-900 w-full  max-w-[600px] max-h-[700px] rounded-[10px] '
                style={{maxWidth:600, maxHeight:700}}
                >
                <TextInput
                    className={`text-gray-400 rounded-[10px] bg-[#0c111d] p-2 m-2 border-blue-700 border-[1px]  `} 
                    value={universityFilter}
                    onChangeText={(text) => setUniversityFilter(text)}
                    placeholder="Deine Universität"
                    placeholderTextColor="#AAAAAA" // 👈 Farbe vom Placeholder
                />
                <View className='flex-1'>
                    <FlatList
                        data={universityListDeutschland.filter((item) => item.name.toLowerCase().includes(universityFilter.toLowerCase()))}
                        keyExtractor={(item => item.id)}
                        style={{
                            scrollbarWidth: 'thin', 
                            scrollbarColor: 'gray transparent'  
                        }}
                        renderItem={({item}) => (
                            <TouchableOpacity key={item.id} onPress={()=> {setSelectedUniversity(item); setUserData({...userData,signInProcessStep:"FIVE"})}} 
                            className='flex-row p-2 border-gray-800 border-[1px] rounded-[10px] bg-gray-800  items-center justify-start m-2'
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: 30, height: 30, borderRadius: 5  }}
                                    />
                                <Text className='text-gray-100 font-semibold text-[15px] text-center ml-2' numberOfLines={item.name.length > 13 ? 2 : null}>
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



    } else if ( selectedKathegorie == "EDUCATION" ) {
        return (
            <ScrollView className='w-full '>
                <View className='h-full  w-full justify-between items-center py-5'>
                <View className='w-full'>
                    <ProgressBar percent={60} handlePress={()=> setUserData({...userData,signInProcessStep:"THREE"})}/>
                    <BotTopLeft text={selectedLanguage == null ? message.robotMessageEducation.DE : message.robotMessageEducation[languages[selectedLanguage].code]}/>
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
                                    ? item.name.DE.length > 13 ? 2 : null
                                    : item.name[languages[selectedLanguage].code].length > 13 ? 2 : null
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
}

export default StepFour