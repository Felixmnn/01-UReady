import { View, Text,ScrollView } from 'react-native'
import React from 'react'
import { useWindowDimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { addQUestion, updateDocument } from '@/lib/appwriteEdit';
import Header from './(createQuestion)/header';
import Questions from './(createQuestion)/questions';
import EditQuestions from './(createQuestion)/editQuestions';
import ModalIncompleat from './(createQuestion)/modalIncompleat';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getAllQuestions, getAllQuestionsByIds } from '@/lib/appwriteQuerys';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';

const CreateQuestion = ({setSelected2,module, selectedModule}) => {
    
    const {user} = useGlobalContext();

    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.editQuestions;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
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
        "public": false,
        sessionID:null,
        aiGenerated: false,
        subjectID: module.documents[selectedModule].$id,
        status:null
    })
    useEffect(() => { 
        async function fetchQuestions() {
            if (module == null) return;
            const allIds = module.documents[selectedModule].questionList.map((i) => JSON.parse(i).id);
            const allQuestions = await getAllQuestionsByIds(allIds)
            setQuestions(allQuestions ? allQuestions : [])
            /*
            const questions = await getAllQuestions(module.documents[selectedModule].$id)
            if (questions) {
                const questionArray = questions.documents
                const filteredQuestions = questionArray.filter((question) => question.subjectID == module.documents[selectedModule].$id);
                setQuestions(filteredQuestions.reverse())  
            }  
                */
        }
        fetchQuestions()
        
        setLoading(false)
    }, [module])
        
    useEffect(()=> {
            async function push(){
                if (questions[selectedQuestion-1]){
                    await updateDocument(questions[selectedQuestion-1])
                }
            }
            push()
            setUngespeichert(false)
    },[questions, setQuestions])
        
    const [questionActive, setQuestionActive] = useState(false)
    const [answerActive, setAnswerActive] = useState(null)
    const [reqModalVisible, setReqModalVisible] = useState(false)
    const [missingRequirements, setMissingRequirements] = useState([]);

    async function checkNewQuestion() {
        setMissingRequirements([]);  
        let missing = []; 
    
        if (newQuestion.question.length < 1) {
            missing.push(`-${texts[selectedLanguage].errorNoEmptyQuestion}`);
        }
        if (newQuestion.answers.length < 1) {
            missing.push(`-${texts[selectedLanguage].errorAtLeastOneAnswer}`);
        }
        if (newQuestion.answerIndex.length < 1) {
            missing.push(`-${texts[selectedLanguage].errorOneCorrectAnswer}`);
        }
        if (newQuestion.sessionID == null) {
            missing.push(`-${texts[selectedLanguage].errorMissingSession}`);
        }
    
        setMissingRequirements(missing);
    
        if (missing.length > 0) {
            setReqModalVisible(true);
        } else {
            const response = await addQUestion(newQuestion)
            const resParsed = JSON.stringify({
                id: response.$id,
                status:null
            })
            const mergedQuestions = module.questionList.length > 0 ? [...module.questionList, resParsed] : [resParsed];
            const res = await updateModuleQuestionList(module.$id, mergedQuestions);
            setQuestions([newQuestion, ...questions])
            setNewQuestion({
                question: "",
                answers: [],
                answerIndex: [],
                tags: [],
                "public": false,
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
            questions.length > 0 || loading == false ?
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
            <Text className='text-white'>...</Text>
        }
    </View>
  )
}

export default CreateQuestion