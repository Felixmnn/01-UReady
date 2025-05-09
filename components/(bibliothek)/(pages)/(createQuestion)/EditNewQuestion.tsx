import { View, Text,TouchableOpacity, TextInput, FlatList, useWindowDimensions } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ToggleSwitch from '@/components/(general)/toggleSwich'
import Icon from 'react-native-vector-icons/FontAwesome5'
import FinalTextInput from '@/components/(general)/finalTextInput'
import ModalSelectSession from './modalSelectSession'
import { addQUestion } from '@/lib/appwriteEdit'

const EditNewQuestion = ({newQuestion, setNewQuestion, answerActive, setAnswerActive, questionActive,setQuestionActive, selectedModule, questions, setQuestions,subjectID }) => {
     const [text, setText] = useState(newQuestion.question)
     const [selectedAnswer, setSelectedAnswer] = useState(null)
     const {width} = useWindowDimensions()
     const isVertical = width < 700;
        
        function toggleIndex(index) {
            setNewQuestion(prevState => ({
                ...prevState,
                answerIndex: prevState.answerIndex.includes(index)
                    ? prevState.answerIndex.filter(idx => idx !== index) // Entfernt den Index
                    : [...prevState.answerIndex, index] // Fügt den Index hinzu
            }));
        }    
    const RenderNewAnswers = ({ index }) => {
        const [isOn, setIsOn] = useState(newQuestion.answerIndex.includes(index));
        const [newText, setNewText] = useState(newQuestion.answers[selectedAnswer]);

        function saveChange( ) {
            setNewQuestion(prevState => ({
                ...prevState,
                answers: prevState.answers.map((ans, i) =>
                    i === selectedAnswer ? newText : ans
                )
            }));
        }
        function removeAnswer() {
            setNewQuestion(prevState => ({
                ...prevState,
                answers: prevState.answers.filter((_, i) => i !== index)
            }));
        }

        
        return (
            <View className={`my-1 w-full rounded-[10px] p-2 ${isOn ? "bg-green-900" : "bg-red-900"}`} >
                <View className='flex-row justify-between'>
                    <View className=' flex-row items-center'>
                        <Text className={`font-bold mr-2 ${isOn ? "text-green-300" : "text-red-300"}`}>
                            {isOn ? "Richtige Antwort" : "Falsche Antwort"}
                        </Text>
                        <ToggleSwitch 
                            isOn={isOn} 
                            onToggle={() => {
                                toggleIndex(index);
                                setIsOn(!isOn);
                            }}
                        />
                    </View>
                    {!isOn && (
                        <TouchableOpacity onPress={()=>removeAnswer()} >
                            <Icon name="times" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                
                <TouchableOpacity onPress={() => setSelectedAnswer(index)}>
                    {selectedAnswer === index ? (
                        <TextInput
                            value={newText}
                            style={{ borderColor: "transparent", borderWidth: 0 }}
                            className='text-white w-full rounded-[10px] p-1'
                            onBlur={saveChange}
                            onChangeText={setNewText}
                        />
                    ) : (
                        <Text className='text-gray-300 font-bold m-2 '>
                            
                            {newQuestion.answers[index] || "Antwort eingeben"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    async function saveQuestion() {
        if (newQuestion.question.length < 1) {
            console.log("Question is empty")
            return;
        } else if (newQuestion.answers.length < 1) {
            console.log("Answers are empty")
            return;
        } else if (newQuestion.answerIndex.length < 1) {
            console.log("Answer Index is empty")
            return;
        } else if (!newQuestion.sessionID) {
            console.log("Session ID is empty")
            return;
        } 
        
        addQUestion({...newQuestion, sessionID: JSON.parse(newQuestion.sessionID).id})
        setQuestions(prevState => [newQuestion, ...prevState])

        setNewQuestion({
            question: "",
            answers: [],
            answerIndex: [],
            tags: [],
            public: false,
            sessionID:null,
            aiGenerated: false,
            subjectID: subjectID,
            status:null
        })
            
        console.log("Saving Question")
    }


            const [modalVisible, setModalVisible] = useState(false)
            function changeSession(sessionID) {
                setNewQuestion(prevState => ({
                    ...prevState,
                    sessionID: sessionID
                }));
            }
  return (
    <View className='flex-1  items-center justify-center'>
        <ModalSelectSession changeSession={changeSession} modalVisible= {modalVisible} setModalVisible={setModalVisible} selectedQuestion={newQuestion} selectedModule={selectedModule}/>

                            { 
                                questionActive ?
                                <TouchableOpacity className={`w-full  p-4  justify-center`}>
                                    <Text className='text-[15px] font-bold text-gray-400'>Frage:</Text>
                                    <FinalTextInput
                                        value={text}
                                        handleChangeText={(text)=> setText(text)}
                                        onBlur={() => {
                                            if (text !== newQuestion?.question) {
                                                setNewQuestion(prevState => ({
                                                    ...prevState,
                                                    question: text
                                                }));
                                            }
                                            setQuestionActive(false)
                                        }
                                        }
                                        placeHolder='Frage'
                                        />
                                    
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=> {setQuestionActive(true);setAnswerActive(false)}} className='flex-1 flex-row items-center justify-center w-full px-2 py-1  '>
                                    {
                                        newQuestion.question.length > 0 ?
                                        <TouchableOpacity onPress={()=>{setQuestionActive(true)}} className='w-full'>
                                            <Text className='text-[15px] font-bold text-gray-400'>Frage:</Text>
                                            <Text className='text-gray-300 font-bold m-2'>{newQuestion.question}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View className='w-full flex-row items-center justify-center border-[1px] border-gray-500 rounded-full px-2 py-1 m-2'>
                                            <Icon name="plus" size={15} color="white"/>
                                            <Text className='text-white font-bold m-1 '>Frage hinzufügen</Text>
                                        </View>
                                    }
                                    
                                </TouchableOpacity>
                            }
                            <View className='border-t-[1px] border-gray-500 w-full my-2'/>
                            {
                                newQuestion.answers.length > 0 ?
                                <View className='w-full flex-1 items-center justify-center '>
                                    <FlatList
                                        data={newQuestion.answers}
                                        keyExtractor={(index)=> index.toString()}
                                        style={{ width: '100%' }} // Setzt die Breite auf 100%
    
                                        renderItem={({ item,index }) => {
                                            return (
                                               <RenderNewAnswers index={index}/>
                                            );
                                        }}
                                    />
                                </View>
                                :
                                null
                            }
                            

                            <View className='flex-1 p-1 w-full  justify-center items-center flex-row'>
                                <TouchableOpacity onPress={()=> {
                                    setNewQuestion(prevState => ({
                                                    ...prevState,
                                                    answers: [...prevState.answers, "Neue Antwort"] // Neue Antwort hinzufügen
                                                }));
                                                selectedAnswer == null || !(newQuestion.answers.length > 0)  ? setSelectedAnswer(0) : setSelectedAnswer(selectedAnswer + 1 );
                                        }} className='w-full flex-row items-center justify-center px-2 py-1 rounded-full border-gray-500 border-[1px] m-2 '

                                        >
                                            <Icon name="plus" size={15} color="white"/>
                                            { !isVertical ? 
                                                                <Text className='text-white font-bold m-1 '>
                                                                    Antwort hinzufügen
                                                                </Text>
                                                                :
                                                                <Text className='text-white font-bold m-1 '>
                                                                    Antwort hinzufügen
                                                                </Text>
                                                                }
                                </TouchableOpacity>
                                
                            </View> 
                            <View className='flex-row items-center justify-between w-full px-2 py-1'>
                                <TouchableOpacity onPress={()=> setModalVisible(!modalVisible)} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                                        
                                        <Text className='text-gray-400 text-[12px] font-semibold'>{newQuestion.sessionID ? newQuestion.sessionID : "Select a Session"}</Text>
                                        
                                </TouchableOpacity>
                                <TouchableOpacity className='p-2 bg-blue-500 rounded-full' onPress={()=> saveQuestion()}>
                                    <Text className='text-white text-[12px] font-semibold'>Frage Speichern</Text>
                                </TouchableOpacity>
                            </View> 
                        </View>
  )
}

export default EditNewQuestion