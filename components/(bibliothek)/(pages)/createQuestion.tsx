import { View, Text, TouchableOpacity, FlatList,TextInput } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { loadQuestions } from '@/lib/appwriteDaten';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import { setNativeProps } from 'react-native-reanimated';
import { updateDocument } from '@/lib/appwriteEdit';
import { tags } from 'react-native-svg/lib/typescript/xmlTags';
import Header from './(createQuestion)/header';
import Questions from './(createQuestion)/questions';
import EditQuestions from './(createQuestion)/editQuestions';
import ModalAddTags from './(createQuestion)/modalAddTags';

const CreateQuestion = ({setSelected2,module, selectedModule}) => {
    const { width,height } = useWindowDimensions();
    const isVertical = width > 700;
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(0)
    const [ungespeichert, setUngespeichert] = useState(true)
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        answers: [],
        answerIndex: [],
        tags: []
    })
    useEffect(() => { 
        async function fetchQuestions() {
            const questions = await loadQuestions()
            if (questions) {
                const questionArray = questions.documents
                const filteredQuestions = questionArray.filter((question) => question.subjectID == module.documents[selectedModule].$id);
                setQuestions(filteredQuestions)  
            }  
        }
        fetchQuestions()
        setLoading(false)
    }, [])
        
    useEffect(()=> {
            console.log("Changes where made")
            async function push(){
            await updateDocument(questions[selectedQuestion-1])
            }
            push()
            setUngespeichert(false)
    },[questions, setQuestions])
        
    const [questionActive, setQuestionActive] = useState(false)
    const [answerActive, setAnswerActive] = useState(0)
    
        
  return (
    <View className='flex-1 items-center '>
        
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
        {
            questions.length > 0 ?
            <View className=' w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                <Header setSelected={()=> setSelected2("SingleModule")} ungespeichert={ungespeichert} moduleName={module.documents[selectedModule].name}/>
                <View className='w-full flex-row'>
                <Questions   screenHeight={height} 
                    questions={questions} 
                    setSelectedQuestion={setSelectedQuestion} 
                    selectedQuestion={selectedQuestion}
                    newQuestion={newQuestion}
                    />
                 <EditQuestions
                    setQuestions={setQuestions} 
                    questionActive={questionActive}
                    setQuestionActive={setQuestionActive}
                    questions={questions}
                    selectedQuestion={selectedQuestion}
                    setSelectedQuestion={setSelectedQuestion}
                    answerActive={answerActive}
                    setAnswerActive={setAnswerActive}
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                    selectedModule={module.documents[selectedModule]}
                    
                />
                </View>
            </View>
        :
            <Text className='text-white'>Stelle dir einen Skeleton view vor</Text>
        }
    </View>
  )
}

export default CreateQuestion