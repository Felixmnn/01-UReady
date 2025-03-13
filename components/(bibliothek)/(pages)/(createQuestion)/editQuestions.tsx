import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import EditeOldQuestion from './EditeOldQuestion';
import EditNewQuestion from './EditNewQuestion';
import ModalAddTags from './modalAddTags';

const EditQuestions = ({selectedModule,setQuestions,questionActive,setQuestionActive,questions,selectedQuestion,setSelectedQuestion, answerActive, setAnswerActive, newQuestion, setNewQuestion}) => {    
    const [isVisible, setIsVisible] = useState(false)
    
    function addTags(tags){
        setQuestions(prevQuestions =>
            prevQuestions.map((question, i) =>
                i === selectedQuestion-1 ? { ...question, tags: [...question.tags, ...tags] } : question
            )
        )
    }
        return (
            <View className='flex-1 items-center justify-center p-4'>
                <ModalAddTags isVisible={isVisible} setIsVisible={setIsVisible} selectedModule={selectedModule} addTags={addTags} selectedTags={questions[selectedQuestion].tags} selectedQuestion={questions[selectedQuestion]}/>
                
                <View className='w-full bg-gray-800 border-gray-700 border-[1px] p-4 rounded-[10px]'>
                    <View className='flex-row justify-between'>
                        <View>
                            {
                                selectedQuestion !== 0 && questions[selectedQuestion-1].tags.length > 0 ?
                                <View>
                                </View>
                                :
                                <TouchableOpacity onPress={()=> setIsVisible(true)} className='flex-row items-center px-2 py-1 border-[1px] border-gray-500'>
                                    <Icon name="plus" size={15} color="white"/>
                                    <Text className='text-white font-bold ml-2 text-[12px]'>Tags hinzufügen</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <TouchableOpacity>
                            <Icon name="ellipsis-v" size={15} color="white"/>
                        </TouchableOpacity>
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