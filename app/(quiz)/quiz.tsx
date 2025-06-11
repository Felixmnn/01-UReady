import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { router,useLocalSearchParams } from "expo-router"
import { updateDocument, updateModule} from "../../lib/appwriteEdit"
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import SmileyStatus from '@/components/(bibliothek)/(components)/smileyStatus';
import { loadModule } from '@/lib/appwriteDaten';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import  languages  from '@/assets/exapleData/languageTabs.json';


const quiz = () => {
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.quiz;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
    const {width} = useWindowDimensions();
    const isVertical = width > 700;
    /**
     * In case the user is not logged in, redirect to the login page
     */
     useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); 
        }
      }, [user, isLoggedIn, isLoading]);

    const {questions, moduleID} = useLocalSearchParams()
    /**
     * This is the state that holds the questions wich get passed through the params
     */
    const [ questionsParsed, setQuestionParsed] = useState(JSON.parse(questions))
    const [ questionList, setQuestionList] = useState([])
    const [ module, setModule] = useState(null)

    /**
     * This is the function that loads the questionList wich contains the status of the questions
     */
    useEffect(() => {
        if (!moduleID) return;

        async function fetchData() {
            const data = await loadModule(moduleID);
            setModule(data);

            const parsedList = data.questionList
                .map(question => JSON.parse(question))
                .filter(parsedQuestion =>
                    questionsParsed.some(q => q.$id === parsedQuestion.id)
                );

            setQuestionList(parsedList);
        }

        fetchData();
    }, [moduleID]);

    /**
     * When a question state is change the questionList is updated and so is the Module
     * 
     */
    useEffect(() => {
        async function updateModuleHere() {
        if (module) {
            const parsedList = module.questionList.map(question => JSON.parse(question))
            const updatedList = parsedList.map((question) => {
                const questionInList = questionList.find(q => q.id === question.id);
                if (questionInList) {
                    return {
                        ...question,
                        status: questionInList.status
                    };
                } else {
                    return question;
                }
            });
            const updatedModule = {
                ...module,
                questionList: updatedList.map(question => JSON.stringify(question))
            };
            const res = await updateModuleQuestionList(updatedModule.$id,updatedModule. questionList);
        }
        }
        updateModuleHere();
    }, [questionList]);


    /**
     * This is the function that calculates the percentage of the colors in the header status bar
     */
    const questionSegmentation = () => {
        let bad = 0
        let ok = 0
        let good = 0
        let great = 0
        for (let i = 0; i < questionList.length; i++) {
            if (questionList[i].status == "BAD") {
                bad++
            } else if (questionList[i].status == "OK") {
                ok++
            } else if (questionList[i].status == "GOOD") {
                good++
            } else if (questionList[i].status == "GREAT") {
                great++
            }
        }
        bad = Math.round((bad / questionList.length) * 100);
        ok = Math.round((ok / questionList.length) * 100);
        good = Math.round((good / questionList.length) * 100);
        great = Math.round((great / questionList.length) * 100);
        return [bad,ok,good,great]
    } 

    /**
     * I Guess this exists in case the user comes from a diffrent page than libary wich should not be the case
     */
    async function tryBack() {
        try {
            router.back()
            router.push("bibliothek")
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * This is the header of the quiz page containing the status bar and the title
     */
    const Header = () => {
        return (
            <View className='bg-gray-900 items-center justify-between p-4 rounded-t-[10px]'>
                <View className='flex-row items-center justify-between w-full'>
                <View className='flex-row items-center'>
                    <TouchableOpacity onPress={()=> tryBack()}>
                        <Icon name="arrow-left" size={20} color="white"/>
                    </TouchableOpacity>
                    </View>
                <View className={`flex-row items-center justify-center rounded-full border-gray-600 border-[1px] py-2 px-3 ${isVertical ? "" : "h-[35px] w-[35px]"} `}>
                    <TouchableOpacity className='items-center justify-center'>
                        <Icon name="cog" size={10} color="white"/>
                    </TouchableOpacity>
                    {

                    isVertical ? 
                    <Text className='text-gray-200 ml-2 text-[12px]'>
                        {texts[selectedLanguage].setting}
                    </Text>
                    : null
                    }
                </View>
                </View>
                <View className='rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row'>
                    <View style={{ width: `${questionSegmentation()[0]}%` }} className="h-[5px] bg-red-700 rounded-l-full" />
                    <View style={{ width: `${questionSegmentation()[1]}%` }} className="h-[5px] bg-yellow-500" />
                    <View style={{ width: `${questionSegmentation()[2]}%` }} className="h-[5px] bg-green-500" />
                    <View style={{ width: `${questionSegmentation()[3]}%` }} className="h-[5px] bg-blue-500 rounded-r-full" />
                </View>
            </View>
        )
    }
    const [selectedQuestion, setSelectedQuestion] = useState(0)

    const Quiz = () => {
        const [selectedAnswers, setSelectedAnswers] = useState([])
        const [showAnsers , setShowAnswers] = useState(false)
        async function changeVisibility () {
            setShowAnswers(true)
        }

        function correctAnswers() {
            const correctAnswers = questionsParsed[selectedQuestion].answers.filter((answer,index) => questionsParsed[selectedQuestion].answerIndex.includes(index))
            correctAnswers.sort() 
            selectedAnswers.sort()      
            if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) {
                return true
            } else { 
                return false
            }
        }
        console.log("Question List", questionList)
        async function nextQuestion (status, change){
            setShowAnswers(false)
            
            const indexOfQuestion = questionList.findIndex((question) => question.id === questionsParsed[selectedQuestion].$id)
            setQuestionList(prevState => {
                const updatedList = [...prevState];
                updatedList[indexOfQuestion] = {
                    ...updatedList[indexOfQuestion],
                    status: (questionsParsed[selectedQuestion].status == "GOOD" || questionsParsed[selectedQuestion].status ==  "GREAT" )  
                    && status == "GOOD" ? "GREAT" : status
                };

                return updatedList;
            })
            /*
            setQuestionParsed(prevState =>
                prevState.map((q, index) =>
                    index === selectedQuestion ? { ...q, status: (questionsParsed[selectedQuestion].status == "GOOD" || questionsParsed[selectedQuestion].status == 
                        "GREAT" )  && status == "GOOD" ? "GREAT" : status } : q
                )
            );
            
            */
            const updatedItem = {
                ...questionsParsed[selectedQuestion],
                status: questionsParsed[selectedQuestion].status == "GOOD" && status == "GOOD" ? "GREAT" : status, 
            };
            
            await updateDocument(updatedItem)
            if (change == 1){
                if (selectedQuestion + 1  >=  questionsParsed.length){
                    setSelectedQuestion(0)
                    
                } else {
                    setSelectedQuestion(selectedQuestion + 1 )
                }
            } else {
                if (selectedQuestion == 0){
                    setSelectedQuestion(questionsParsed.length -1)
                } else {
                    setSelectedQuestion(selectedQuestion - 1)
                }
            }
                
        }

        return (
            <View className='flex-1 justify-end'>
                <View className='flex-1 rounded-[10px] bg-gray-900 border-gray-600 border-[1px] m-4'>	
                    <View className='w-full justify-between flex-row items-center p-4 '>
                        <View className='flex-row items-center'>
                        {questionsParsed[selectedQuestion].status !== null ? <SmileyStatus status={questionsParsed[selectedQuestion].status}/> : null}
                        
                        </View>
                        <View className='flex-row items-center'>
                            {questionsParsed[selectedQuestion].aiGenerated ? <Image 
                                                                source={require('../../assets/bot.png')}
                                                                tintColor={"#fff"}
 
                                                                style={{
                                                                  height: 20, 
                                                                  width: 20, 
                                                                }} 
                                                              /> : null}
                            <TouchableOpacity className='items-center justify-center ml-2'>
                                <Icon name="ellipsis-v" size={15} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <RenderQuestion showAnsers={showAnsers} question={questionsParsed[selectedQuestion]} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
                    <View className='flex-row items-center justify-center p-2'>
                        
                        {
                            showAnsers ? (

                                <View className='flex-row justify-between items-center w-full px-3'>
                                    <TouchableOpacity onPress={()=> nextQuestion(correctAnswers() ? "GOOD" : "BAD",0)} className='h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-800 border-gray-600 border-[1px]'>
                                        <Icon name="chevron-left" size={20} color={"white"}/>
                                    </TouchableOpacity>
                                    <View>
                                    {
                                        correctAnswers() ? (
                                            <Text className='text-green-500'>{texts[selectedLanguage].right}</Text>
                                        ): 
                                        (
                                            <Text className='text-red-500'>{texts[selectedLanguage].wrong}</Text>
                                        )
                                    }
                                </View>
                                    <TouchableOpacity onPress={()=> nextQuestion(correctAnswers() ? "GOOD" : "BAD",1)} className='h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-800 border-gray-600 border-[1px]'>
                                    <Icon name="chevron-right" size={20} color={"white"}/>
                                    </TouchableOpacity>
                                </View>

                                
                            ) : (
                                <View className='flex-row justify-between items-center w-full px-3'>
                                    <TouchableOpacity onPress={()=> nextQuestion("OK",0)} className='h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-800 border-gray-600 border-[1px]'>
                                        <Icon name="chevron-left" size={20} color={"white"}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> { changeVisibility()}} className='items-center justify-center p-2 bg-blue-900 rounded-[10px]'>
                                        <Text className='text-white'>{texts[selectedLanguage].validate}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> nextQuestion("OK",1)} className='h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-800 border-gray-600 border-[1px]'>
                                    <Icon name="chevron-right" size={20} color={"white"}/>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                       
                    </View>
                </View>
            </View>
        )
    }

    const RenderQuestion = ({question,selectedAnswers, setSelectedAnswers, showAnsers }) => {
        
        function selectAnswer(answer) {
            if (selectedAnswers.includes(answer)) {
                setSelectedAnswers(selectedAnswers.filter((item) => item !== answer))
            } else {
                setSelectedAnswers([...selectedAnswers, answer])
            }
        }

        return (
            <View className='flex-1'>
                <Text className='text-white p-4 text-xl font-bold'>{question.question}</Text>
                <View className={`flex-1  p-4 ${isVertical ? "flex-row" : "flex-col"} `}>
                    {
                        question.answers.map((answer,index) => {
                            return (
                                <TouchableOpacity key={index} disabled={showAnsers} onPress={()=> selectAnswer(answer) } className={`flex-row justify-between items-center flex-1 border-[1px] p-2 rounded-[10px] m-1 ${showAnsers ? (question.answerIndex.includes(index) ? "bg-green-900 border-green-600" : "bg-red-900 border-red-600") :selectedAnswers.includes(answer) ? "bg-blue-900 border-blue-600" : "bg-gray-800 border-gray-600"}`}>
                                    <Text className='text-white'>{answer}</Text>
                                    {
                                        showAnsers && selectedAnswers.includes(answer) ?
                                        (
                                            question.answerIndex.includes(index) ? <Icon name="check" size={15} color="green"/> : <Icon name="times" size={15} color="red"/>  
                                        )
                                        
                                        : null 
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                 </View>
        )
    }

  return (
    <SafeAreaView className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>
        <Header/>
        <Quiz />
      </View>
    </SafeAreaView>
  )
}

export default quiz