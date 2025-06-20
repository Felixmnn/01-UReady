import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import FinalTextInput from '@/components/(general)/finalTextInput';
import ModalSelectSession from './modalSelectSession';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';


const EditeOldQuestion = ({selectedModule, setQuestions, questions, selectedQuestion, setSelectedQuestion, questionActive, setQuestionActive, setAnswerActive, answerActive }) => {
    
    const {width} = useWindowDimensions();
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.editQuestions;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])

    const isVertical = width < 700;
    function addAnswer() {
        setQuestions(prevQuestions =>
            prevQuestions.map((question, i) =>
                i === selectedQuestion - 1
                    ? { ...question, answers: [...question.answers, texts[selectedLanguage].newAnswer] }
                    : question
            )
        );
    }
   
    const EditQuestion = ()=> {
        const [newText, setNewText] = useState(questions[selectedQuestion-1].question)
        function saveChange (){
            setQuestions(prevQuestions =>
                prevQuestions.map((question, i) =>
                    i === selectedQuestion-1 ? { ...question, question: newText } : question
                )
            ) 
        }
        function handleChange (change){
            setNewText(change)
        }

        

        return (
            <TouchableOpacity className=' w-full p-4  justify-center' >
                
                {
                    questionActive ?
                    <View className='w-full'>
                        <Text className='text-[15px] font-bold text-gray-400'>{texts[selectedLanguage].question}</Text>

                        <FinalTextInput
                        value={newText}
                        handleChangeText={handleChange}
                        onBlur={() => {
                            if (newText !== questions[selectedQuestion - 1]?.question) {
                                saveChange();
                            }
                            setQuestionActive(false)
                        }
                        }
                        placeHolder={texts[selectedLanguage].question}
                        />
                    </View>
                    :
                    <TouchableOpacity onPress={()=>{setQuestionActive(true)}} className='w-full'>
                        <Text className='text-[15px] font-bold text-gray-400'>{texts[selectedLanguage].question}</Text>
                        <Text className='text-gray-300 font-bold m-2'>{questions[selectedQuestion-1].question}</Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity>
        )
    }
    
    const EditAnswers = ()=> {
            const RenderAnswer = ({index}) => {
                const [isOn, setIsOn] = useState(false)
                const [newText, setNewText] = useState(questions[selectedQuestion-1].answers[answerActive])
                function handleChange (change){
                    setNewText(change)
                }
                function saveChange( ) {
                    setQuestions(prevQuestions =>
                        prevQuestions.map((question, i) =>
                            i === selectedQuestion - 1
                                ? { 
                                    ...question, 
                                    answers: question.answers.map((answer, j) =>
                                        j === answerActive ? newText : answer
                                    ) 
                                }
                                : question
                        )
                    );
                }
                function toggleIndex(index) {
                    setQuestions(prevQuestions =>
                        prevQuestions.map((question, i) =>
                            i === selectedQuestion - 1
                                ? { 
                                    ...question, 
                                    answerIndex: question.answerIndex.includes(index)
                                        ? question.answerIndex.filter(idx => idx !== index) // Entfernen
                                        : [...question.answerIndex, index] // Hinzufügen
                                }
                                : question
                        )
                    );
                }

                return (
                    <View className={`w-full rounded-[10px] p-2 ${questions[selectedQuestion-1].answerIndex.includes(index)? "bg-green-900" : "bg-red-900"}`}>
                        <View className='flex-row justify-between'>
                        <View className='flex-row items-center'>
                            { questions[selectedQuestion-1].answerIndex.includes(index)?
                                <Text className='text-green-300 font-bold mr-2'>{texts[selectedLanguage].correctAnswer}</Text>
                                :
                                <Text className='text-red-300 font-bold mr-2'>{texts[selectedLanguage].wrongAnswer}</Text>
                            }
                            <ToggleSwitch isOn={questions[selectedQuestion-1].answerIndex.includes(index)} onToggle={()=> {{
                                if (!isOn){
                                    toggleIndex(index)
                                } 
                                setIsOn(!isOn);
                                }}}/>
                        </View>
                        <View>
                            {
                                questions[selectedQuestion-1].answerIndex.includes(index) ?
                                null:
                                <TouchableOpacity onPress={() => {
                                    setQuestions(prevQuestions => 
                                        prevQuestions.map((question, i) =>
                                            i === selectedQuestion - 1
                                                ? { ...question, answers: question.answers.filter((answer, j) => j !== index) }
                                                : question
                                        )
                                    )}}>
                                    <Icon name="times"  size={20} color="white"/>
                                </TouchableOpacity> 
                            }
                        </View>
                        </View>
                        <TouchableOpacity onPress={()=> {
                            if (questionActive){
                                setQuestionActive(false)
                            }
                            setAnswerActive(index)
                        }}>
                            {   answerActive == index ?
                                <FinalTextInput
                                handleChangeText={handleChange}
                                onBlur={() => {
                                    if (newText !== questions[selectedQuestion - 1]?.answers[index]) {
                                        saveChange();
                                    }
                                    setAnswerActive(null)
                                }}
                                value={newText}
                                placeHolder={texts[selectedLanguage].answer}
                                />
                                
                                :
                                <Text className='text-gray-300 font-bold m-2 '>{questions[selectedQuestion-1].answers[index]}</Text>

                            }
                        </TouchableOpacity>
                    </View>
                )
            }
            return (
                <View className='items-center justify-center w-full'>
                    {
                        questions[selectedQuestion-1].answers.map((answer,index)=>{
                            return (
                                <View key={index} className='w-full m-1'>
                                    <RenderAnswer index={index}/>
                                    
                                </View>
                            )
                        })
                    }  
                    <View className='p-1 w-full  justify-between items-center flex-row'>
                        <TouchableOpacity onPress={() => addAnswer()} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] '
                            style={{
                                width: isVertical ?  100 : 170,
                            }}
                            >
                            <Icon name="plus" size={10} color="white"/>
                            { !isVertical ? 
                            <Text className='text-[12px] ml-2 text-gray-300 font-semibold '>
                                {texts[selectedLanguage].addAnswer}
                            </Text>
                            :
                            <Text className='text-[12px] ml-2 text-gray-300 font-semibold '>
                                {texts[selectedLanguage].answer}
                            </Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> setModalVisible(!modalVisible)} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                            
                            <Text className='text-gray-400 text-[12px] font-semibold'>{
                            selectedModule.sessions.map(i => JSON.parse(i) ).filter(i => i.id == questions[selectedQuestion -1].sessionID)[0]?.title || texts[selectedLanguage].selectSession
                            }</Text>
                            
                        </TouchableOpacity>
                    </View>  

                </View>
            )
        }
        const [modalVisible, setModalVisible] = useState(false)
        async function changeSession(session){
            setQuestions(prevQuestions =>
                prevQuestions.map((question, i) =>
                    i === selectedQuestion - 1 ? { ...question, sessionID: session } : question
                )
            );
        }
  return (
    <ScrollView className='w-full '>
        <ModalSelectSession changeSession={changeSession} modalVisible= {modalVisible} setModalVisible={setModalVisible} selectedQuestion={questions[selectedQuestion-1]} selectedModule={selectedModule}/>
        <EditQuestion/>
            <View className='border-t-[1px] border-gray-500 w-full my-2'/>
        <EditAnswers/>
    </ScrollView>
  )
}

export default EditeOldQuestion