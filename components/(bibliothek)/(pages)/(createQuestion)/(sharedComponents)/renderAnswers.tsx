import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import ToggleSwitch from '@/components/(general)/toggleSwich';
import Icon from 'react-native-vector-icons/FontAwesome5';
const RenderNewAnswers = ({ index, newQuestion, selectedAnswer, setNewQuestion,toggleIndex,  texts, selectedLanguage,setSelectedAnswer, content }) => {
        const [isOn, setIsOn] = useState(newQuestion.answerIndex.includes(index));
        const [newText, setNewText] = useState(content);
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
                            {isOn ? texts[selectedLanguage].correctAnswer : texts[selectedLanguage].wrongAnswer}
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
                            placeholderTextColor={"white"}
                        />
                    ) : (
                        <Text className='text-gray-300 font-bold m-2 '>
                            
                            {newQuestion.answers[index] || texts[selectedLanguage].addAnswer}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

export default RenderNewAnswers