import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import EditeOldQuestion from './EditeOldQuestion';
import EditNewQuestion from './EditNewQuestion';
import { removeQuestion } from '@/lib/appwriteEdit';

const EditQuestions = ({selectedModule,setQuestions,questionActive,setQuestionActive,questions,selectedQuestion,setSelectedQuestion, answerActive, setAnswerActive, newQuestion, setNewQuestion}) => {    
    const [isVisible, setIsVisible] = useState(false)
    const [showEllipse, setShowEllipse] = useState(false)
    function addTags(tags){
        setQuestions(prevQuestions =>
            prevQuestions.map((question, i) =>
                i === selectedQuestion-1 ? { ...question, tags: [...question.tags, ...tags] } : question
            )
        )
    }

    async function removeQuestions (){
        await removeQuestion(questions[selectedQuestion-1].$id)
        questions.splice(selectedQuestion-1, 1);
        setSelectedQuestion(0);

    }
        return (
            <View className='flex-1 h-full  items-center justify-center p-4'
            >
                
                <View className='flex-1 w-full h-full bg-gray-800 border-gray-700 border-[1px] p-4 rounded-[10px] '
                
                >
                    <View className='flex-row justify-between'>
                       
                        <TouchableOpacity onPress={()=> setShowEllipse(!showEllipse)} >
                            <Icon name="ellipsis-v" size={15} color="white"/>
                        </TouchableOpacity>
                        {
                            showEllipse ?
                            <View className='absolute top-5 right-0 bg-gray-700 border-gray-500 border-[1px] p-2 rounded-[5px] z-100'>
                                <View className='flex-row items-center justify-center'>
                                    <TouchableOpacity onPress={()=> {selectedQuestion == 0 ? 
                                        setNewQuestion({
                                            question: "",
                                            answers: [],
                                            answerIndex: [],
                                            tags: [],
                                            public: false,
                                            sessionID:null,
                                            aiGenerated: false,
                                            subjectID: selectedModule.$id,
                                            status:null
                                        }) :removeQuestions()}} className='flex-row items-center justify-center px-2 py-1 m-1 rounded-[5px] '>
                                        <Icon name="trash" size={15} color="red"/>
                                        <Text className=' font-bold text-[12px] ml-2 text-red-500'>Löschen</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                        }
                    </View>
                    {
                        selectedQuestion == 0 ?
                    <EditNewQuestion
                        newQuestion={newQuestion}
                        setNewQuestion={setNewQuestion}
                        answerActive={answerActive}
                        setAnswerActive={setAnswerActive}
                        questionActive={questionActive}
                        setQuestionActive={setQuestionActive}
                        selectedModule={selectedModule}
                        questions={questions}
                        setQuestions={setQuestions}
                        subjectID={selectedModule.$id}
                    />
                        :
                    <EditeOldQuestion
                        selectedModule={selectedModule}
                        setQuestions={setQuestions}
                        questionActive={questionActive}
                        setQuestionActive={setQuestionActive}
                        questions={questions}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                        answerActive={answerActive}
                        setAnswerActive={setAnswerActive}
                    />
                    }
                </View>
            </View>

        )
    }

export default EditQuestions