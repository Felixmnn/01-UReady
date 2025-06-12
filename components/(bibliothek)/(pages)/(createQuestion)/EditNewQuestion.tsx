import { View, Text,TouchableOpacity, TextInput, FlatList, useWindowDimensions, ScrollView, Modal } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import ToggleSwitch from '@/components/(general)/toggleSwich'
import Icon from 'react-native-vector-icons/FontAwesome5'
import FinalTextInput from '@/components/(general)/finalTextInput'
import ModalSelectSession from './modalSelectSession'
import { addQUestion } from '@/lib/appwriteEdit'
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider'
import  RenderNewAnswers  from './(sharedComponents)/renderAnswers'
import { SafeAreaView } from 'react-native-safe-area-context'

const EditNewQuestion = ({newQuestion, setNewQuestion, answerActive, setAnswerActive, questionActive,setQuestionActive, selectedModule, questions, setQuestions,subjectID }) => {
     
    
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.editQuestions;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])

    const [text, setText] = useState(newQuestion.question)
     const [selectedAnswer, setSelectedAnswer] = useState(null)
     const {width} = useWindowDimensions()
     const isVertical = width < 700;
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

      const ErrorModal = ({isError, setIsError, success=false, successMessage=null}) => {
           return (
               <Modal
                   animationType="slide"
                   transparent={true}
                   visible={isError || success}
                   onRequestClose={() => {
                     setIsError(!isError);
                   }}
               >
                   <TouchableOpacity className='flex-1 justify-start pt-5 items-center' onPress={()=> {setIsError(false); setSuccess(false)} }
                     >
                       <View className={` border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700
                         ${success ? 'bg-green-900' : 'bg-red-900'}`}
                         style={{
                             borderColor: success ? 'green' : '#ff4d4d',
                         }}
                       >
                           <Text className='text-white font-bold'>{successMessage ? successMessage : errorMessage}</Text>
                       </View>
                   </TouchableOpacity>
               </Modal>
           )
       }
        
        function toggleIndex(index) {
            setNewQuestion(prevState => ({
                ...prevState,
                answerIndex: prevState.answerIndex.includes(index)
                    ? prevState.answerIndex.filter(idx => idx !== index) // Entfernt den Index
                    : [...prevState.answerIndex, index] // Fügt den Index hinzu
            }));
        }  
      

    async function saveQuestion() {
        if (newQuestion.question.length < 1) {
            setIsError(true);
            setErrorMessage("A Question needs a question");
            return;
        } else if (newQuestion.answers.length < 1) {
            setIsError(true);
            setErrorMessage("A Question needs at least one answer");
            return;
        } else if (newQuestion.answerIndex.length < 1) {
            setIsError(true);
            setErrorMessage("A Question needs at least one correct answer");
            return;
        } else if (!newQuestion.sessionID) {
            setIsError(true);
            setErrorMessage("You need to select a session for the question");
            return;
        } 
        
        addQUestion({...newQuestion, 
                        sessionID: JSON.parse(newQuestion.sessionID).id,
                        subjectID: subjectID,
                    })
        setQuestions(prevState => [newQuestion, ...prevState])

        setSuccess(true);
        setSuccessMessage("Question saved successfully!");

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
    }


            const [modalVisible, setModalVisible] = useState(false)
            function changeSession(sessionID) {
                setNewQuestion(prevState => ({
                    ...prevState,
                    sessionID: sessionID
                }));
            }
  return (
    <View className='flex-1 '>
    <ScrollView className='flex-1 '
    

  >
                <ErrorModal isError={isError} setIsError={setIsError} success={success} successMessage={successMessage} />

        <ModalSelectSession changeSession={changeSession} modalVisible= {modalVisible} setModalVisible={setModalVisible} selectedQuestion={newQuestion} selectedModule={selectedModule}/>

                            { 
                                questionActive ?
                                <TouchableOpacity className={`w-full  p-4  justify-center`}>
                                    <Text className='text-[15px] font-bold text-gray-400'>{texts[selectedLanguage].addAnswer}</Text>
                                    <View className='flex-row items-center'>
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
                                        placeHolder={texts[selectedLanguage].question}
                                        />
                                    <TouchableOpacity className='p-2 rounded-[10px]' onPress={() => {
                                        setQuestionActive(false)
                                    }}>
                                        <Icon name="check" size={20} color="white" onPress={()=> setQuestionActive(false)} />
                                    </TouchableOpacity>
                                    </View>
                                    
                                    
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=> {setQuestionActive(true);setAnswerActive(false)}} className='flex-1 flex-row items-center justify-center w-full px-2 py-1  '>
                                    {
                                        newQuestion.question.length > 0 ?
                                        <TouchableOpacity onPress={()=>{setQuestionActive(true)}} className='w-full'>
                                            <Text className='text-[15px] font-bold text-gray-400'>{texts[selectedLanguage].question}</Text>
                                            <Text className='text-gray-300 font-bold m-2'>{newQuestion.question}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View className='w-full flex-row items-center justify-center border-[1px] border-gray-500 rounded-full px-2 py-1 m-2'>
                                            <Icon name="plus" size={15} color="white"/>
                                            <Text className='text-white font-bold m-1 '>{texts[selectedLanguage].addQuestion}</Text>
                                        </View>
                                    }
                                    
                                </TouchableOpacity>
                            }
                            <View className='flex-1 border-t-[1px] border-gray-500 w-full my-2'/>
                            {
                                newQuestion.answers.length > 0 ?
                                <View className='w-full flex-1  items-center justify-center '
                                    
                                
                                >
                                    <View style={{ width: '100%' }}>
                                        {newQuestion.answers.map((item, index) => 
                                        (
                                                <RenderNewAnswers
                                                    key={index}
                                                    index={index} 
                                                    newQuestion={newQuestion} 
                                                    selectedAnswer={selectedAnswer} 
                                                    setNewQuestion={setNewQuestion} 
                                                    toggleIndex={toggleIndex}  
                                                    texts={texts} 
                                                    selectedLanguage={selectedLanguage}
                                                    setSelectedAnswer={setSelectedAnswer}
                                                    content={item}
                                                />
                                        ))}
                                    </View>
                                </View>
                                :
                                null
                            }
                            

                            <View className='flex-1 p-1 mt-10 w-full  justify-center items-center flex-row'>
                                <TouchableOpacity onPress={()=> {
                                    setNewQuestion(prevState => ({
                                                    ...prevState,
                                                    answers: [...prevState.answers, texts[selectedLanguage].newAnswer] // Neue Antwort hinzufügen
                                                }));
                                                selectedAnswer == null || !(newQuestion.answers.length > 0)  ? setSelectedAnswer(0) : setSelectedAnswer(selectedAnswer + 1 );
                                        }} className='w-full flex-row items-center justify-center px-2 py-1 rounded-full border-gray-500 border-[1px] m-2 '

                                        >
                                            <Icon name="plus" size={15} color="white"/>
                                            { !isVertical ? 
                                                                <Text className='text-white font-bold m-1 '>
                                                                    {texts[selectedLanguage].addAnswer}
                                                                </Text>
                                                                :
                                                                <Text className='text-white font-bold m-1 '>
                                                                    {texts[selectedLanguage].addAnswer}
                                                                </Text>
                                                                }
                                </TouchableOpacity>
                                
                            </View> 
                            <View className='flex-row items-center justify-between w-full px-2 py-1'>
                                <TouchableOpacity onPress={()=> setModalVisible(!modalVisible)} className='flex-row items-center justify-center px-1 py-1 rounded-full border-gray-500 border-[1px] w-[170px]'>
                                        
                                        <Text className='text-gray-400 text-[12px] font-semibold'>{newQuestion.sessionID != null ? JSON.parse(newQuestion.sessionID).title.length > 15 ? JSON.parse(newQuestion.sessionID).title.substring(0, 15) + "..." : JSON.parse(newQuestion.sessionID).title : texts[selectedLanguage].selectASession}</Text>
                                        
                                </TouchableOpacity>
                                <TouchableOpacity className='p-2 bg-blue-500 rounded-full' onPress={()=> saveQuestion()}>
                                    <Text className='text-white text-[12px] font-semibold'>{texts[selectedLanguage].saveQuestion}</Text>
                                </TouchableOpacity>
                            </View> 
                        </ScrollView>
                        </View>
  )
}

export default EditNewQuestion