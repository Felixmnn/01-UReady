import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import SessionProgress from '../sessionProgress';
import RoadMap from '../(sections)/roadMap';
import Data from '../(sections)/data';
import Header from '../(sections)/header';
import { quizQuestion } from '@/assets/exapleData/quizQuestion';
import SwichTab from '../../(tabs)/swichTab';
import { loadQuestions } from '@/lib/appwriteDaten';

const SingleModule = ({setSelected2, module, selectedModule}) => {
    const [selected, setSelected] = useState(0)
    
    const [ tab, setTab ] = useState(0)
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const tabWidth = width / 2; // Da es zwei Tabs gibt
    const isVertical = width > 700;
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    useEffect(() => { 
        async function fetchQuestions() {
            const questions = await loadQuestions()
            if (questions) {
                const questionArray = questions.documents
                console.log("Questions", module.documents[selectedModule].$id)
                const filteredQuestions = questionArray.filter((question) => question.subjectID == module.documents[selectedModule].$id);
                setQuestions(filteredQuestions)  
            }  
        }
        fetchQuestions()
        setLoading(false)
    }, [])
    const example = {
        title: "Algorithmen",
        creator: "YOU",
        questions: 21,
        notes: 1,
        subject: "Informatik",
        color: "#06aed4",
        modules: [{id:"123456", progress:10}, {id:"1234567", progress:70}, {id:"12345678",progress:40}]
    }
    
    return (
        <View className='flex-1 items-center '>
            
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                { loading ? <Text>Skeleton View</Text> :
                <View className='flex-1'>
                <Header example={example} setSelected={setSelected2}/>
                {!isVertical ? <SwichTab tabWidth={tabWidth} setTab={setTab} tab1={"Fragen"} tab2={"Roadmap"} bg={"bg-gray-900"}/> : null }
                <View className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}/>
                <View className='flex-1 flex-row'>
                    <View className='p-4 flex-1'>
                        <Data data={module.documents[selectedModule].sessions} selected={selected} questions={questions}/>
                    </View>
                    {isVertical ?
                    <View className='h-full border-gray-600 border-l-[1px] p-4 items-center'>
                       <RoadMap data={module.documents[selectedModule].sessions} selected={selected} setSelected={setSelected} questions={questions}/> 
                    </View>
                    : null }
                </View>
                </View>
                }   
            </View>       
        </View>
    )
}

export default SingleModule