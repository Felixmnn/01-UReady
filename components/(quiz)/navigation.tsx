import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { tryBack } from '@/functions/(quiz)/helper'
import { router } from 'expo-router'

const Navigation = ({
    deatilsVisible,
    removeQuestion,
    questionsParsed,
    selectedQuestion,
    setQuestionList,
    setQuestionParsed,
    setSelectedQuestion,
    setDetailsVisible,
}:{
    deatilsVisible: boolean,
    removeQuestion: (id: string) => Promise<void>,
    questionsParsed: any[],
    selectedQuestion: number,
    setQuestionList: React.Dispatch<React.SetStateAction<any[]>>,
    setQuestionParsed: React.Dispatch<React.SetStateAction<any[]>>,
    setSelectedQuestion: React.Dispatch<React.SetStateAction<number>>,
    setDetailsVisible: React.Dispatch<React.SetStateAction<boolean>>,


}) => {
    //Function that returns the percentage of each status
    const questionSegmentation = ({questionList}:
    {questionList: any[]}
    ) => {
        let bad = 0
        let ok = 0
        let good = 0
        let great = 0
        for (let i = 0; i < questionList.length; i++) {
            if (questionList[i].status == "BAD") {
                bad++
            } else if (questionList[i].status == "OK") {
                ok++
            } else if (questionList[i].status == "GOOD") {
                good++
            } else if (questionList[i].status == "GREAT") {
                great++
            }
        }
        bad = Math.round((bad / questionList.length) * 100);
        ok = Math.round((ok / questionList.length) * 100);
        good = Math.round((good / questionList.length) * 100);
        great = Math.round((great / questionList.length) * 100);

        return [bad,ok,good,great]
    } 



  return (
    <View className='bg-gray-900 items-center justify-between p-4 rounded-t-[10px]'>
        <View className='flex-row items-center justify-between w-full'>
        <View className='flex-row items-center justify-between w-full'>
            <TouchableOpacity onPress={()=> tryBack(router)}>
                <Icon name="arrow-left" size={20} color="white"/>
            </TouchableOpacity>
            {
                deatilsVisible ? 
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity>
                        <Icon name="trash-alt" size={15} color="white" onPress={async ()=> {
                            await removeQuestion(questionsParsed[selectedQuestion].$id)
                            setQuestionList(prev => prev.filter((item, index) => index !== selectedQuestion));
                            setQuestionParsed(prev => prev.filter((item, index) => index !== selectedQuestion));
                            if (selectedQuestion > 0) {
                                setSelectedQuestion(selectedQuestion - 1);
                            } else if (questionsParsed.length > 1) {
                                setSelectedQuestion(0);
                            }

                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setDetailsVisible(!deatilsVisible)}>
                        <Icon name="ellipsis-v" size={15} color="white"/>   
                    </TouchableOpacity>

                </View>
                :
                <TouchableOpacity onPress={()=> setDetailsVisible(!deatilsVisible)}>
                    <Icon name="ellipsis-v" size={15} color="white"/>
                </TouchableOpacity>
            }
            
            </View>
        
        </View>
        <View className='rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row'>
            <View style={{ width: `${questionSegmentation({questionList: questionsParsed})[0]}%` }} className="h-[5px] bg-red-700 rounded-l-full" />
            <View style={{ width: `${questionSegmentation({questionList: questionsParsed})[1]}%` }} className="h-[5px] bg-yellow-500" />
            <View style={{ width: `${questionSegmentation({questionList: questionsParsed})[2]}%` }} className="h-[5px] bg-green-500" />
            <View style={{ width: `${questionSegmentation({questionList: questionsParsed})[3]}%` }} className="h-[5px] bg-blue-500 rounded-r-full" />
        </View>
    </View>
    
)
}

export default Navigation