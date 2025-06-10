import { View, Text, FlatList, TouchableOpacity, useWindowDimensions, Platform,  } from 'react-native'
import React, { useEffect, useState } from 'react'
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';


/**
 * Navigation component for the new and existing questions.
 * @param questions - Array of questions to display.
 * @param selectedQuestion - Index of the current question if new the -1 is used.
 * @returns The JSX for the questions navigation.
 */
const Questions = ({screenHeight, questions, setSelectedQuestion, selectedQuestion,newQuestion, checkNewQuestion}) => {
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.editQuestions;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
      const {width} = useWindowDimensions()
      const isVertical = width < 700;
      console.log("Questions", questions, selectedQuestion, newQuestion)
        return (
            <View className={` border-r-[1px] border-gray-500`} 
            style={{height: !isVertical ? screenHeight-100 : null}}
                >
                <FlatList
                    data={questions}
                    keyExtractor={(item) => item.$id}
                    horizontal={isVertical}
                    style={{
                        scrollbarWidth: 'thin', // Dünne Scrollbar
                        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
                    }}
                    ListHeaderComponent={() => {
                        return (
                        <View>
                            <TouchableOpacity
                            onPress={() => setSelectedQuestion(0)}
                            className={`${isVertical ? "ml-2 mr-1" : "mx-3"} my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${
                                selectedQuestion == 0 ? "border-blue-700" : "border-gray-500"
                            } border-[1px] p-1 items-center justify-center`}
                            >
                            <Text className="text-white text-center text-[10px]">{newQuestion.question}</Text>
                            <View className="w-full border-t-[1px] border-gray-500 my-2" />
                            <Text className="text-white text-[10px]">{newQuestion.answers[0]}</Text>
                            </TouchableOpacity>
                        </View>
                        );
                    }}
                    renderItem={({ item, index }) => {
                        return (
                        <TouchableOpacity
                            onPress={() => setSelectedQuestion(index + 1)}
                            className={`${isVertical ? "mx-1" : "mx-3"} my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${
                            selectedQuestion == index + 1 ? "border-blue-700" : "border-gray-500"
                            } border-[1px] p-1 items-center justify-center`}
                        >
                            <View className="w-full items-center justify-center">
                            <Text className="text-white text-center text-[10px]">{item.question}</Text>
                            <View className="w-full border-t-[1px] border-gray-500 my-2" />
                            <Text className="text-white text-[10px]">{item.answers[0]}</Text>
                            </View>
                        </TouchableOpacity>
                        );
                    }}
                    initialNumToRender={20} // Rendert initial 20 Elemente
                    maxToRenderPerBatch={20} // Rendert 20 Elemente pro Batch
                    windowSize={10} // Hält 10 Bildschirme an Daten im Speicher
                    disableVirtualization={Platform.OS === 'web'} // Deaktiviert Virtualisierung im Web
                    />
            </View>
        )
        }

export default Questions