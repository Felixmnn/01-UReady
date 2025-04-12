import { View, Text, TouchableOpacity, FlatList,TextInput,ScrollView } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { loadQuestions } from '@/lib/appwriteDaten';
import ToggleSwitch from '@/components/(general)/toggleSwich';
import { setNativeProps } from 'react-native-reanimated';
import { addQUestion, updateDocument } from '@/lib/appwriteEdit';
import { tags } from 'react-native-svg/lib/typescript/xmlTags';
import Header from './(createQuestion)/header';
import Questions from './(createQuestion)/questions';
import EditQuestions from './(createQuestion)/editQuestions';
import ModalAddTags from './(createQuestion)/modalAddTags';
import ModalIncompleat from './(createQuestion)/modalIncompleat';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllQuestions } from '@/lib/appwriteQuerys';

const CreateQuestion = ({setSelected2,module, selectedModule}) => {
    const {user} = useGlobalContext();
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
        tags: [],
        public: false,
        sessionID:null,
        aiGenerated: false,
        subjectID: module.documents[selectedModule].$id,
        status:null
    })
    useEffect(() => { 
        async function fetchQuestions() {
            if (module == null) return;
            console.log("Fetch Questions")
            const questions = await getAllQuestions(module.documents[selectedModule].$id)
            console.log("Questions", questions)
            if (questions) {
                const questionArray = questions.documents
                console.log("Question Array", questionArray)
                const filteredQuestions = questionArray.filter((question) => question.subjectID == module.documents[selectedModule].$id);
                console.log("Filtered Questions", filteredQuestions)
                setQuestions(filteredQuestions.reverse())  
            }  
        }
        fetchQuestions()
        setLoading(false)
    }, [module])
        
    useEffect(()=> {
            console.log("Changes where made")
            async function push(){
            await updateDocument(questions[selectedQuestion-1])
            }
            push()
            setUngespeichert(false)
    },[questions, setQuestions])
        
    const [questionActive, setQuestionActive] = useState(false)
    const [answerActive, setAnswerActive] = useState(null)
    const [reqModalVisible, setReqModalVisible] = useState(false)
    const [missingRequirements, setMissingRequirements] = useState([]);

    async function checkNewQuestion() {
        console.log("Check New Question", newQuestion);
        setMissingRequirements([]);  
        let missing = []; 
    
        if (newQuestion.question.length < 1) {
            missing.push("-Die Frage darf nicht leer sein");
        }
        if (newQuestion.answers.length < 1) {
            missing.push("-Es muss mindestens eine Antwort geben");
        }
        if (newQuestion.answerIndex.length < 1) {
            missing.push("-Es muss mindestens eine richtige Antwort geben");
        }
        if (newQuestion.sessionID == null) {
            missing.push("-Es muss eine Session ausgewählt werden");
        }
    
        setMissingRequirements(missing);
    
        if (missing.length > 0) {
            setReqModalVisible(true);
        } else {
            await addQUestion(newQuestion)
            setQuestions([newQuestion, ...questions])
            setNewQuestion({
                question: "",
                answers: [],
                answerIndex: [],
                tags: [],
                public: false,
                sessionID:null,
                aiGenerated: false,
                subjectID: module.documents[selectedModule].$id,
                status:null
            })
        }
    }
        
  return (
    <View className='flex-1 items-center '>
        <ModalIncompleat modalVisible={reqModalVisible} setModalVisible={setReqModalVisible} missingRequirements={missingRequirements}/>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
        {
            questions.length > 0 ?
            <View className='h-full w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                <Header setSelected={()=> setSelected2("SingleModule")} ungespeichert={ungespeichert} moduleName={module.documents[selectedModule].name}/>
               
                {
                    isVertical ? 
                    <View className='w-full flex-row'>
                        <Questions   
                            screenHeight={height} 
                            questions={questions} 
                            setSelectedQuestion={setSelectedQuestion} 
                            selectedQuestion={selectedQuestion}
                            newQuestion={newQuestion}
                            checkNewQuestion={checkNewQuestion}
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
                    :
                    <View className='flex-1   justify-between'>
                        <ScrollView>
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
                        </ScrollView>
                        <Questions   
                            screenHeight={height} 
                            questions={questions} 
                            setSelectedQuestion={setSelectedQuestion} 
                            selectedQuestion={selectedQuestion}
                            newQuestion={newQuestion}
                            checkNewQuestion={checkNewQuestion}
                            />
                    </View>
                }

            </View>
        :
            <Text className='text-white'>Stelle dir einen Skeleton view vor</Text>
        }
    </View>
  )
}

export default CreateQuestion