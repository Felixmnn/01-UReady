import { View, Text,TouchableOpacity, TextInput, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ToggleSwitch from '@/components/(general)/toggleSwich'
import Icon from 'react-native-vector-icons/FontAwesome5'
import FinalTextInput from '@/components/(general)/finalTextInput'
import ModalSelectSession from './modalSelectSession'

const EditNewQuestion = ({newQuestion, setNewQuestion, answerActive, setAnswerActive, questionActive,setQuestionActive, selectedModule }) => {
     const [text, setText] = useState(newQuestion.question)
     const [selectedAnswer, setSelectedAnswer] = useState(null)
        
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
            const [modalVisible, setModalVisible] = useState(false)
            function changeSession(sessionID) {
                setNewQuestion(prevState => ({
                    ...prevState,
                    sessionID: sessionID
                }));
            }
  return (
    <View className='flex-1 items-center justify-center'>
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
                                <TouchableOpacity onPress={()=> {setQuestionActive(true);setAnswerActive(false)}} className='flex-row w-full px-2 py-1 '>
                                    {
                                        newQuestion.question.length > 0 ?
                                        <TouchableOpacity onPress={()=>{setQuestionActive(true)}} className='w-full'>
                                            <Text className='text-[15px] font-bold text-gray-400'>Frage:</Text>
                                            <Text className='text-gray-300 font-bold m-2'>{newQuestion.question}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View className='flex-row items-center'>
                                        <Icon name="plus" size={15} color="white"/>
                                        <Text className='text-white font-bold ml-2'>Frage hinzufügen</Text>
                                        </View>
                                    }
                                    
                                </TouchableOpacity>
                            }
                            <View className='border-t-[1px] border-gray-500 w-full my-2'/>
                            {
                                newQuestion.answers.length > 0 ?
                                <View className='w-full flex-1 items-center justify-center'>
                                    <FlatList
                                        data={newQuestion.answers}
                                        keyExtractor={(item)=> item}
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
                            

                            <View className='p-1 w-full  justify-between items-center flex-row'>
                                <TouchableOpacity onPress={()=> {
                                    setNewQuestion(prevState => ({
                                                    ...prevState,
                                                    answers: [...prevState.answers, "Neue Antwort"] // Neue Antwort hinzufügen
                                                }));
                                                selectedAnswer == null || !(newQuestion.answers.length > 0)  ? setSelectedAnswer(0) : setSelectedAnswer(selectedAnswer + 1 );
                                        }} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                                    <Icon name="plus" size={10} color="white"/>
                                    <Text className='text-[12px] ml-2 text-gray-300 font-semibold '>
                                        Antwort hinzufügen
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> setModalVisible(!modalVisible)} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                                    
                                    <Text className='text-gray-400 text-[12px] font-semibold'>{newQuestion.sessionID ? newQuestion.sessionID : "Select a Session"}</Text>
                                    
                                </TouchableOpacity>
                            </View>  
                            
                        </View>
  )
}

export default EditNewQuestion