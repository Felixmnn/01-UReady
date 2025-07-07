import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { router,useLocalSearchParams } from "expo-router"
import { removeQuestion, updateDocument, updateModule} from "../../lib/appwriteEdit"
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import SmileyStatus from '@/components/(bibliothek)/(components)/smileyStatus';
import { loadModule } from '@/lib/appwriteDaten';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { parse } from '@babel/core';
import { BlockMath } from 'react-katex';
import QuizNavigation from '@/components/(quiz)/quizNavigation';
import BottomSheet from '@gorhom/bottom-sheet';


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
    const {width, height} = useWindowDimensions();
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

    function randomizeArray(array) {
        const shuffled = [...array]; // Kopie der Liste
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        console.log("Shuffled Array:", shuffled[0]);
        return shuffled;
    }
    

    /**
     * This is the state that holds the questions wich get passed through the params
     */

    const [ questionsParsed, setQuestionParsed] = useState(randomizeArray(JSON.parse(questions)))
    console.log("Parsed Questions:", questionsParsed[0]);
    const [ showSoloution, setShowSolution] = useState(false)
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

            const filteredQuestions = data.questionList.filter(question => {
            return questionsParsed.some(q => q.$id === JSON.parse(question).id);
            });
            setQuestionList(filteredQuestions.map(question => JSON.parse(question)));
           
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
            if (__DEV__) {
                console.log(error)
            }
        }
    }

    /**
     * This is the header of the quiz page containing the status bar and the title
     */
    const [deatilsVisible, setDetailsVisible] = useState(false)
    const Header = () => {
        return (
            <View className='bg-gray-900 items-center justify-between p-4 rounded-t-[10px]'>
                <View className='flex-row items-center justify-between w-full'>
                <View className='flex-row items-center justify-between w-full'>
                    <TouchableOpacity onPress={()=> tryBack()}>
                        <Icon name="arrow-left" size={20} color="white"/>
                    </TouchableOpacity>
                    {
                        deatilsVisible ? 
                        <View className="flex-row items-center gap-2">
                            <TouchableOpacity>
                                <Icon name="trash-alt" size={15} color="white" onPress={async ()=> {
                                    await removeQuestion(questionsParsed[selectedQuestion].$id)
                                    setQuestionList(prev => prev.filter((item, index) => index !== selectedQuestion));
                                    setQuestionParsed(prev => prev.filter((item, index) => index !== selectedQuestion));
                                    if (selectedQuestion > 0) {
                                        setSelectedQuestion(selectedQuestion - 1);
                                    } else if (questionsParsed.length > 1) {
                                        setSelectedQuestion(0);
                                    }

                                }}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=> setDetailsVisible(!deatilsVisible)}>
                                <Icon name="ellipsis-v" size={15} color="white"/>   
                            </TouchableOpacity>

                        </View>
                        :
                        <TouchableOpacity onPress={()=> setDetailsVisible(!deatilsVisible)}>
                            <Icon name="ellipsis-v" size={15} color="white"/>
                        </TouchableOpacity>
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



    const [selectedAnswers, setSelectedAnswers] = useState([])
        const [showAnsers , setShowAnswers] = useState(false)
        async function changeVisibility () {
            setShowAnswers(true)
        }

    function correctAnswers() {
            const correctAnswers = questionsParsed[selectedQuestion].answers.filter((answer,index) => questionsParsed[selectedQuestion].answerIndex.includes(index))
           


            if (correctAnswers.length !== selectedAnswers.length) {
                return false; // Anzahl der Antworten stimmt nicht überein
            }
            for (let i = 0; i < correctAnswers.length; i++) {
                if (!selectedAnswers.some(item => correctAnswers[i].title === item.title && correctAnswers[i].latex === item.latex && correctAnswers[i].image === item.image)) {
                    return false; // Eine Antwort stimmt nicht überein
                }
            }
    
             
            if (JSON.stringify(correctAnswers) === JSON.stringify(selectedAnswers)) {
                return true
            } else { 
                return false
            }
        }

        async function nextQuestion(status, change) {
    setShowAnswers(false);

    const currentQuestionId = questionsParsed[selectedQuestion].$id;
    const currentStatus = questionList.find(q => q.id === currentQuestionId)?.status || null;

    // Neue Statuslogik
    let newStatus = status;
    if ((currentStatus === "GOOD" || currentStatus === "GREAT") && status === "GOOD") {
        newStatus = "GREAT";
    }

    const indexOfQuestion = questionList.findIndex(q => q.id === currentQuestionId);

    if (indexOfQuestion === -1) {
        setQuestionList(prev => [
            ...prev,
            {
                id: currentQuestionId,
                status: newStatus,
            }
        ]);
    } else {
        setQuestionList(prev => {
            const updated = [...prev];
            updated[indexOfQuestion] = {
                ...updated[indexOfQuestion],
                status: newStatus,
            };
            return updated;
        });
    }

    // Update parsed list (falls benötigt)
    setQuestionParsed(prev =>
        prev.map((q, i) =>
            i === selectedQuestion ? { ...q, status: newStatus } : q
        )
    );

    // Persistiere Änderung im Backend
    await updateDocument({
        ...questionsParsed[selectedQuestion],
        status: newStatus
    });

    // Frage wechseln
    if (change === 1) {
        setSelectedQuestion((selectedQuestion + 1) % questionsParsed.length);
    } else {
        setSelectedQuestion(
            selectedQuestion === 0 ? questionsParsed.length - 1 : selectedQuestion - 1
        );
    }
}
    const Quiz = () => {
        

        
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
                            
                        </View>
                    </View>
                    <RenderQuestion showAnsers={showAnsers} question={questionsParsed[selectedQuestion]} selectedAnswers={selectedAnswers} setSelectedAnswers={setSelectedAnswers} />
                    
                    <View className='flex-row items-center justify-center'>
                        
                        {
                            showAnsers ? (

                                <View className='flex-row justify-between items-center w-full bg-gray-800 p-4 rounded-b-[10px] '>
                                <View>
                                    {
                                        correctAnswers() ? (
                                            <View
                                                className='flex-row items-center gap-2'
                                            >
                                                <Icon name="check-circle" size={20} color={"green"} />
                                                <Text className='text-green-500'>{texts[selectedLanguage].right}</Text>
                                            </View>
                                        ): 
                                        (   
                                            <View
                                                className='flex-row items-center gap-2'
                                            >
                                                <Icon name="times-circle" size={20} color={"#ff0a14"} />
                                            <Text className='text-red-500 font-bold text-[16px]'
                                                style={{
                                                    color: "#ff0a14"
                                                }}
                                            >Leider Falsch</Text>
                                            </View>
                                        )
                                    }
                                </View>
                                <View className='flex-row items-center gap-2'>
                                    {

                                    questionsParsed[selectedQuestion].explaination?.length > 0  ?
                                    <TouchableOpacity className='items-center justify-center p-2 bg-gray-700 rounded-[10px] mr-2' onPress={()=> {setShowSolution(true); sheetRef.current?.snapToIndex(0)}}>
                                        <Text className='text-gray-300 text-[15px] font-semibold'>
                                            Erklärung anzeigen
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    null}
                                    <TouchableOpacity className='items-center justify-center p-2 bg-blue-900 rounded-[10px]' onPress={()=> {
                                        nextQuestion(correctAnswers() ? "GOOD" : "BAD",1)
                                        setSelectedAnswers([]);
                                        }}>
                                        <Text className='text-white text-[15px] font-semibold'>
                                            Weiter
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                </View>
                            ) : (
                                <View className='w-full justify-center items-center w-full px-3 py-2'>
                                    <TouchableOpacity onPress={()=> { changeVisibility()}} className='items-center w-full max-w-[200px] justify-center p-2 bg-blue-900 rounded-[10px]'>
                                        <Text className='text-white text-[15px] font-semibold'>Antwort Prüfen</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                       
                    </View>
                </View>
            </View>
        )
    }
    function maybeParseJSON(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return {
                title: value,
                latex: "",
                image: ""
            }; 
        }
    }
    const numColumns =  width > 900 ? 2 : 1;
    const RenderQuestion = ({question,selectedAnswers, setSelectedAnswers, showAnsers }) => {
        
        function selectAnswer(answer) {
            if (selectedAnswers.includes(answer)) {
                setSelectedAnswers(selectedAnswers.filter((item) => item !== answer))
            } else {
                setSelectedAnswers([...selectedAnswers, answer])
            }
        }

        return (
            <ScrollView className='flex-1'>
                <Text className='text-white text-center px-4 px-2 text-xl font-bold mb-2'>{question.question}</Text>
                {
                    question.questionLatex?.length > 0 ?
                    <View className=' w-full  items-center rounded-lg  overflow-hidden '>
                        <BlockMath
                                math={question.questionLatex}
                                    className="text-white"
                                
                                style={{ color:"white", text:"white", fontSize: 20 }}
                        />
                    </View>
                    : question.questionUrl?.length > 0  ?
                    <View className='w-full   rounded-lg overflow-hidden min-h-10 p-2 items-center px-4'>
                        <Image
                            source={{ uri: question.questionUrl }}
                            style={{
                                width: 200,             // feste Breite
                                aspectRatio: 1.5,       // Breite / Höhe → z.B. 3:2
                                borderRadius: 10,
                                resizeMode: 'contain',
                            }}
                            resizeMode="cover"
                            
                        />
                        
                    </View>
                    : null
                }
                <View className='flex-1  px-2 '>
                <View className="flex flex-row flex-wrap justify-center">
                    {
                        
                    question.answers.map((item, index) => {
                        const parsedItem = maybeParseJSON(item);
                        const dataType = parsedItem.latex?.length > 0
                        ? "latex"
                        : parsedItem.image?.length > 0
                        ? "image"
                        : "text";

                        const isCorrect = question.answerIndex.includes(index);
                        const isSelected = selectedAnswers.includes(JSON.stringify(parsedItem));

                        return (
                        <TouchableOpacity
                            key={index}
                            disabled={showAnsers}
                            onPress={() => selectAnswer(JSON.stringify(parsedItem))}
                            className={`${width > 900 ? "w-[48%] mr-2 mt-2" : "w-full"} items-center justify-center border-[1px] p-2 rounded-[10px] mb-2 
                            ${showAnsers
                                ? isCorrect
                                ? "bg-green-900 border-green-600"
                                : "bg-red-900 border-red-600"
                                : isSelected
                                ? "bg-blue-900 border-blue-600"
                                : "bg-gray-800 border-gray-600"
                            }`}
                            style={{
                                maxHeight: 150
                            }}
                        >
                            <View className="flex-1 items-center justify-center">
                            {dataType === "latex" ? (
                                <View className="w-full rounded-lg overflow-hidden">
                                <BlockMath
                                    math={parsedItem.latex}
                                    className="text-white"
                                    style={{ color: "white", fontSize: 20 }}
                                />
                                </View>
                            ) : dataType === "image" ? (
                                <View className="w-full rounded-lg overflow-hidden min-h-10 items-center">
                                <Image
                                    source={{ uri: parsedItem.image }}
                                    style={{
                                    width: 200,
                                    aspectRatio: 1.5,
                                    borderRadius: 10,
                                    }}
                                    resizeMode="cover"
                                />
                                </View>
                            ) : (
                                <Text className="text-white text-center font-bold text-[18px]">
                                {parsedItem.title}
                                </Text>
                            )}

                            {showAnsers && isSelected && (
                                isCorrect ? (
                                <Icon name="check" size={15} color="green" />
                                ) : (
                                <Icon name="times" size={15} color="red" />
                                )
                            )}
                            </View>
                        </TouchableOpacity>
                        );
                    })}
                    </View>
                </View>
                
                 </ScrollView>
        )
    }
    const sheetRef = useRef<BottomSheet>(null);

  return (
    <SafeAreaView className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>
        <Header/>
        <Quiz />
        {
            showSoloution ? 
                <QuizNavigation
                    showAnswer={showSoloution}
                    sheetRef={sheetRef}
                    explaination={questionsParsed[selectedQuestion].explaination}
                    nextQuestion={nextQuestion}
                    correctAnswers={correctAnswers}
                    setShowSolution={setShowSolution}

                />
            : null
        }
      </View>
    </SafeAreaView>
  )
}

export default quiz