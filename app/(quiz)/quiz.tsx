import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { router,useLocalSearchParams } from "expo-router"
import Index from '..';
import {testAppwrite, updateDocument} from "../../lib/appwriteEdit"
import ModalDataUpload from '@/components/(home)/modalDataUpload';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';

const quiz = () => {
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    
    const {questions} = useLocalSearchParams()
    const [questionsParsed, setQuestionParsed] = useState(JSON.parse(questions))
    const {width} = useWindowDimensions();
    const isVertical = width > 700;
    

     useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); // oder "/sign-in"
        }
      }, [user, isLoggedIn, isLoading]);
    

    const questionSegmentation = () => {
        let bad = 0
        let ok = 0
        let good = 0
        let great = 0
        for (let i = 0; i < questionsParsed.length; i++) {
            if (questionsParsed[i].status == "BAD") {
                bad++
            } else if (questionsParsed[i].status == "OK") {
                ok++
            } else if (questionsParsed[i].status == "GOOD") {
                good++
            } else if (questionsParsed[i].status == "GREAT") {
                great++
            }
        }
        console.log(bad,ok,good,great,questionsParsed.length)
        bad = Math.round((bad / questionsParsed.length) * 100);
        ok = Math.round((ok / questionsParsed.length) * 100);
        good = Math.round((good / questionsParsed.length) * 100);
        great = Math.round((great / questionsParsed.length) * 100);
        console.log(bad,ok,good,great)
        return [bad,ok,good,great]
    } 

    async function tryBack() {
        try {
            await router.back()
            router.push("bibliothek")
        } catch (error) {
            console.log(error)
        }
    }

    const Header = () => {
        return (
            <View className='bg-gray-900 items-center justify-between p-4 rounded-t-[10px]'>
                <View className='flex-row items-center justify-between w-full'>
                <View className='flex-row items-center'>
                    <TouchableOpacity onPress={()=> tryBack()}>
                        <Icon name="arrow-left" size={20} color="white"/>
                    </TouchableOpacity>
                    <Text className='font-semibold text-xl ml-2 text-white'>Algorythmen</Text>
                </View>
                <View className={`flex-row items-center justify-center rounded-full border-gray-600 border-[1px] py-2 px-3 ${isVertical ? "" : "h-[35px] w-[35px]"} `}>
                    <TouchableOpacity className='items-center justify-center'>
                        <Icon name="cog" size={10} color="white"/>
                    </TouchableOpacity>
                    {

                    isVertical ? 
                    <Text className='text-gray-200 ml-2 text-[12px]'>
                        Einstellungen
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
    const Status = ({status}) => {
        let color = "blue"
        let bgColor = "bg-blue-500"
        let smiley = "grin"
        if (status == "BAD") {
            color = "red"
            bgColor = "bg-red-700"
            smiley = "frown"
        } else if (status == "OK") {
            color = "yellow"
            bgColor = "bg-yellow-500"
            smiley = "meh"
        } else if (status == "GOOD") {
            color = "green"
            bgColor = "bg-green-500"
            smiley = "smile"
        }else {
            color = "blue"
            bgColor = "bg-blue-500"
            smiley = "grin"
        }
        return (
            <View className={`items-center justify-center rounded-full h-[20px] w-[20px] pt-[1px] ${bgColor}`}>
                <Icon name={smiley} size={15} color={color}/>
            </View>
        )
    }
    const Quiz = () => {
        const navOptions = [
            {title: "Schlecht", bg: "bg-red-900", icon: "frown", iconColor: "red", status:"BAD"},
            {title: "Ok", bg: "bg-yellow-900", icon: "meh", iconColor: "yellow", status:"OK"},
            {title: "Gut", bg: "bg-green-900", icon: "smile", iconColor: "green", status:"GOOD"},
            {title: "Sehr Gut", bg: "bg-blue-900", icon: "grin", iconColor:"blue", status:"GREAT"}
        ]
        const [selectedAnswers, setSelectedAnswers] = useState([])
        const [showAnsers , setShowAnswers] = useState(false)
        
        async function changeVisibility () {
            setShowAnswers(true)

        }

        function correctAnswers() {
            const correctAnswers = questionsParsed[selectedQuestion].answers.filter((answer,index) => questionsParsed[selectedQuestion].answerIndex.includes(index))
            correctAnswers.sort() 
            selectedAnswers.sort()      
            console.log(correctAnswers,selectedAnswers)
            if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) {
                console.log("Correct")
                return true
            } else { 
                return false
            }
        }
        async function nextQuestion (status, change){
            console.log("Übergbe den Status", status)
            setShowAnswers(false)
            
                
            setQuestionParsed(prevState =>
                prevState.map((q, index) =>
                    index === selectedQuestion ? { ...q, status: (questionsParsed[selectedQuestion].status == "GOOD" || questionsParsed[selectedQuestion].status == 
                        "GREAT" )  && status == "GOOD" ? "GREAT" : status } : q
                )
            );
            
            console.log("Der Status ist", questionsParsed[selectedQuestion].status)
            console.log("Der neu Status soll sein Status ist", status)
            const updatedItem = {
                ...questionsParsed[selectedQuestion],
                status: questionsParsed[selectedQuestion].status == "GOOD" && status == "GOOD" ? "GREAT" : status, // Status aktualisieren
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
            console.log(selectedQuestion)
        }

        return (
            <View className='flex-1 justify-end'>
                <View className='flex-1 rounded-[10px] bg-gray-900 border-gray-600 border-[1px] m-4'>	
                    <View className='w-full justify-between flex-row items-center p-4 '>
                        <View className='flex-row items-center'>
                        {questionsParsed[selectedQuestion].status !== null ? <Status status={questionsParsed[selectedQuestion].status}/> : null}
                        <TouchableOpacity className='bg-gray-900 rounded-[5px] items-center justify-cneter border-gray-600 border-[1px] ml-2'>
                            
                            <Text className="m-1 text-gray-300 text-[10px] px-1">+ Tags hinzufügen</Text>
                        </TouchableOpacity>
                        </View>
                        <View className='flex-row items-center'>
                            {questionsParsed[selectedQuestion].aiGenerated ? <Image 
                                                                source={require('../../assets/bot.png')} 
                                                                style={{
                                                                  height: 20, 
                                                                  width: 20, 
                                                                  tintColor: "#fff" 
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
                                            <Text className='text-green-500'>Richtig</Text>
                                        ): 
                                        (
                                            <Text className='text-red-500'>Falsch</Text>
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
                                        <Text className='text-white'>Prüfen</Text>
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
                                <TouchableOpacity disabled={showAnsers} onPress={()=> selectAnswer(answer) } className={`flex-row justify-between items-center flex-1 border-[1px] p-2 rounded-[10px] m-1 ${showAnsers ? (question.answerIndex.includes(index) ? "bg-green-900 border-green-600" : "bg-red-900 border-red-600") :selectedAnswers.includes(answer) ? "bg-blue-900 border-blue-600" : "bg-gray-800 border-gray-600"}`}>
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

    const [isVisibleDataUpload,setIsVisibleDataUpload] = useState(false)
  return (
    <SafeAreaView className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>
        <Header/>
        <Quiz />
        <ModalDataUpload isVisible={isVisibleDataUpload} setIsVisible={setIsVisibleDataUpload}/>

      </View>
    </SafeAreaView>
  )
}

export default quiz