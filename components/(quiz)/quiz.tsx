import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { use } from 'react'
import SmileyStatus from '../(bibliothek)/(components)/smileyStatus';
import Question from './question';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

const Quiz = ({
    questionsParsed,
    selectedQuestion,
    selectedAnswers,
    setSelectedAnswers,
    showAnsers,
    width,
    changeVisibility,
    nextQuestion,
    correctAnswers,
    setShowSolution,
    sheetRef,

}:{
    questionsParsed: any[],
    selectedQuestion: number,
    selectedAnswers: string[],
    setSelectedAnswers: React.Dispatch<React.SetStateAction<string[]>>,
    showAnsers: boolean,
    width: number,
    changeVisibility: ()=>void,
    nextQuestion: (status: "GOOD" | "BAD", step: number)=>void,
    correctAnswers: ()=> boolean,
    setShowSolution: React.Dispatch<React.SetStateAction<boolean>>,
    sheetRef: React.RefObject<any>,
}) => {
    const { t } = useTranslation();
    
        return (
            <View className='flex-1 justify-end'>
                <View className='flex-1 rounded-[10px] bg-gray-900 border-gray-600 border-[1px] m-4'>	
                    <View className='w-full justify-between flex-row items-center p-4 '>
                        <View className='flex-row items-center'>
                        {questionsParsed[selectedQuestion].status !== null ? <SmileyStatus status={questionsParsed[selectedQuestion].status}/> : null}
                        
                        </View>
                        <View className='flex-row items-center'>
                            {questionsParsed[selectedQuestion].aiGenerated ? <Image
                                                                source={require('../../assets/bot.png')}
                                                                tintColor={"#fff"}
 
                                                                style={{
                                                                  height: 20, 
                                                                  width: 20, 
                                                                }} 
                                                              /> : null}
                            
                        </View>
                    </View>
                    <Question
                        question={questionsParsed[selectedQuestion]}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                        showAnsers={showAnsers}
                        width={width}
                    />
                    
                    <View className='flex-row items-center justify-center'>
                        
                        {
                            showAnsers ? (

                                <View className={`${true ? "justify-start" : "justify-between flex-row"}  items-center w-full bg-gray-800 p-4 rounded-b-[10px] `}>
                                <View className='w-full justify-start'>
                                    {
                                        correctAnswers() ? (
                                            <View className='flex-row items-center gap-2'>
                                                <Icon name="check-circle" size={20} color={"green"} />
                                                <Text className='text-green-500'>{t("quiz.right")}</Text>
                                            </View>
                                        ): 
                                        (   
                                            <View className='flex-row items-center gap-2'>
                                                <Icon name="times-circle" size={20} color={"#ff0a14"} />
                                            <Text className='text-red-500 font-bold text-[16px]'
                                                style={{
                                                    color: "#ff0a14"
                                                }}
                                            >{t("quiz.wrong")}</Text>
                                            </View>
                                        )
                                    }
                                </View>
                                <View className={`${true ? "w-full mt-2" : ""} justify-start flex-row items-center gap-2`}>
                                    {

                                    questionsParsed[selectedQuestion].explaination?.length > 0  ?
                                    <TouchableOpacity className='items-center justify-center p-2 bg-gray-700 rounded-[10px] mr-2' onPress={()=> {setShowSolution(true); sheetRef.current?.snapToIndex(0)}}>
                                        <Text className='text-gray-300 text-[15px] font-semibold'>
                                            {t("quiz.showExplanation")}
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    null}
                                    <TouchableOpacity className='items-center justify-center p-2 bg-blue-900 rounded-[10px]' onPress={()=> {
                                        nextQuestion(correctAnswers() ? "GOOD" : "BAD",1)
                                        setSelectedAnswers([]);
                                        }}>
                                        <Text className='text-white text-[15px] font-semibold'>
                                            {t("quiz.next")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                </View>
                            ) : (
                                <View className='w-full justify-center items-center w-full px-3 py-2'>
                                    <TouchableOpacity onPress={changeVisibility} className='items-center w-full max-w-[200px] justify-center p-2 bg-blue-900 rounded-[10px]'>
                                        <Text className='text-white text-[15px] font-semibold'>{t("quiz.checkAnswer")}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                       
                    </View>
                </View>
            </View>
        )
    }

export default Quiz