import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import EditeOldQuestion from './EditeOldQuestion';
import EditNewQuestion from './EditNewQuestion';
import ModalAddTags from './modalAddTags';
import { removeQuestion } from '@/lib/appwriteEdit';

const EditQuestions = ({selectedModule,setQuestions,questionActive,setQuestionActive,questions,selectedQuestion,setSelectedQuestion, answerActive, setAnswerActive, newQuestion, setNewQuestion}) => {    
    const [isVisible, setIsVisible] = useState(false)
    const [showEllipse, setShowEllipse] = useState(false)
    const {width} = useWindowDimensions()
    const isVertical = width < 700;
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
                {selectedQuestion !== 0 ? 
                <ModalAddTags isVisible={isVisible} setIsVisible={setIsVisible} selectedModule={selectedModule} addTags={addTags} selectedTags={questions[selectedQuestion -1].tags} selectedQuestion={questions[selectedQuestion -1]}/> 
                : 
                <ModalAddTags isVisible={isVisible} setIsVisible={setIsVisible} selectedModule={selectedModule} addTags={addTags} selectedTags={newQuestion.tags} selectedQuestion={newQuestion} setNewQuestion={setNewQuestion}/> 
                }
                
                <View className='w-full bg-gray-800 border-gray-700 border-[1px] p-4 rounded-[10px]'>
                    <View className='flex-row justify-between'>
                        <View>
                            {
                                selectedQuestion !== 0 && questions[selectedQuestion -1 ].tags.length > 0 ?
                                <View>
                                    <Text className='text-white font-bold text-[12px]'>Tags:</Text>
                                    <View className='flex-row'>
                                        {
                                            questions[selectedQuestion -1 ].tags.map((tag, index) => {
                                                const pTag = JSON.parse(tag)
                                                return (
                                                    <TouchableOpacity onPress={()=> setIsVisible(true)} key={index} className={`flex-row items-center justify-center  px-2 py-1 m-1 border-[1px] rounded-[5px]`}
                                                    style={{
                                                        backgroundColor:
                                                        pTag.color === "red" ? "#DC2626" :
                                                        pTag.color === "blue" ? "#2563EB" :
                                                        pTag.color === "green" ? "#059669" :
                                                        pTag.color === "yellow" ? "#CA8A04" :
                                                        pTag.color === "orange" ? "#C2410C" :
                                                        pTag.color === "purple" ? "#7C3AED" :
                                                        pTag.color === "pink" ? "#DB2777" :
                                                        pTag.color === "emerald" ? "#059669" :
                                                        pTag.color === "cyan" ? "#0891B2" :
                                                        "#1F2937",
                                                        borderColor:
                                                        pTag.color === "red" ? "#F87171" :      
                                                        pTag.color === "blue" ? "#93C5FD" :     
                                                        pTag.color === "green" ? "#6EE7B7" :    
                                                        pTag.color === "yellow" ? "#FDE047" :   
                                                        pTag.color === "orange" ? "#FDBA74" :   
                                                        pTag.color === "purple" ? "#C4B5FD" :   
                                                        pTag.color === "pink" ? "#F9A8D4" :     
                                                        pTag.color === "emerald" ? "#6EE7B7" :  
                                                        pTag.color === "cyan" ? "#67E8F9" :     
                                                        "#4B5563"  
                                                      }}
                                                    >
                                                        <Text className='text-white font-bold text-[12px]'>{pTag.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                                : selectedQuestion == 0 && newQuestion.tags.length > 0 ?
                                <View>
                                    <Text className='text-white font-bold text-[12px]'>Tags:</Text>
                                    <View className='flex-row'>
                                        {
                                            newQuestion.tags.map((tag, index) => {
                                                const pTag = JSON.parse(tag)
                                                return (
                                                    <TouchableOpacity onPress={()=> setIsVisible(true)} key={index} className={`flex-row items-center justify-center  px-2 py-1 m-1 border-[1px] rounded-[5px]`}
                                                    style={{
                                                        backgroundColor:
                                                        pTag.color === "red" ? "#DC2626" :
                                                        pTag.color === "blue" ? "#2563EB" :
                                                        pTag.color === "green" ? "#059669" :
                                                        pTag.color === "yellow" ? "#CA8A04" :
                                                        pTag.color === "orange" ? "#C2410C" :
                                                        pTag.color === "purple" ? "#7C3AED" :
                                                        pTag.color === "pink" ? "#DB2777" :
                                                        pTag.color === "emerald" ? "#059669" :
                                                        pTag.color === "cyan" ? "#0891B2" :
                                                        "#1F2937",
                                                        borderColor:
                                                        pTag.color === "red" ? "#F87171" :      
                                                        pTag.color === "blue" ? "#93C5FD" :     
                                                        pTag.color === "green" ? "#6EE7B7" :    
                                                        pTag.color === "yellow" ? "#FDE047" :   
                                                        pTag.color === "orange" ? "#FDBA74" :   
                                                        pTag.color === "purple" ? "#C4B5FD" :   
                                                        pTag.color === "pink" ? "#F9A8D4" :     
                                                        pTag.color === "emerald" ? "#6EE7B7" :  
                                                        pTag.color === "cyan" ? "#67E8F9" :     
                                                        "#4B5563"  
                                                      }}
                                                    >
                                                        <Text className='text-white font-bold text-[12px]'>{pTag.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                                :

                                <TouchableOpacity onPress={()=> setIsVisible(true)} className='flex-row items-center px-2 py-1 border-[1px] border-gray-500'>
                                    
                                    <Icon name="plus" size={15} color="white"/>
                                    <Text className='text-white font-bold ml-2 text-[12px]'>Tags hinzufügen</Text>
                                </TouchableOpacity>
                            }
                        </View>
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