import { View, Text,TouchableOpacity, TextInput, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ToggleSwitch from '@/components/(general)/toggleSwich'
import Icon from 'react-native-vector-icons/FontAwesome5'

const EditNewQuestion = ({newQuestion, setNewQuestion, answerActive, setAnswerActive, questionActive,setQuestionActive, }) => {
     const [text, setText] = useState(newQuestion.question)
        const [selectedAnswer, setSelectedAnswer] = useState(0)
        const [newText, setNewText] = useState(newQuestion.answers[selectedAnswer])
        function saveChange() {
            setNewQuestion(prevState => ({
                ...prevState,
                answers: prevState.answers.map((ans, i) =>
                    i === selectedAnswer ? newText : ans
                )
        }));}
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
        const [newText, setNewText] = useState(newQuestion.answers[index] || "");
    
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
                        <TouchableOpacity>
                            <Icon name="times" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                
                <TouchableOpacity onPress={() => setAnswerActive(index)}>
                    {answerActive === index ? (
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
  return (
    <View className='flex-1 items-center justify-center'>
                            { 
                                questionActive ?
                                <TouchableOpacity className={`w-full bg-[#0c111d] rounded-[10px] border-[1px] p-2 ${true ? "border-blue-700" : "border-gray-500"}`}>
                                    <TextInput
                                    value={text}
                                    style={{borderColor:"transparent", borderWidth:0}}
                                    className='text-white w-full rounded-[10px] p-1'
                                    onChangeText={(text)=> setText(text)}
                                    onBlur={()=> {
                                        setQuestionActive(false)
                                        setNewQuestion(prevState => ({
                                            ...prevState,
                                            question: text
                                        }));
                                    }}
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=> {setQuestionActive(true);setAnswerActive(false)}} className='flex-row items-center px-2 py-1 '>
                                    {
                                        newQuestion.question.length > 0 ?
                                        <Text className='text-white font-bold'>{newQuestion.question}</Text>
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
                            <TouchableOpacity onPress={()=> {
                                    setNewQuestion(prevState => ({
                                        ...prevState,
                                        answers: [...prevState.answers, "Neue Antwort"] // Neue Antwort hinzufügen
                                    }));
                            }} className='flex-row items-center px-2 py-1 '>
                                        <Icon name="plus" size={15} color="white"/>
                                        <Text className='text-white font-bold ml-2 '>Antwort hinzufügen</Text>  
                            </TouchableOpacity>
                            
                        </View>
  )
}

export default EditNewQuestion