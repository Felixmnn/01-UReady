import { SafeAreaView, Text, View} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router,useLocalSearchParams } from "expo-router"
import { removeQuestion, updateDocument, updateModule} from "../../lib/appwriteEdit"
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadModule } from '@/lib/appwriteDaten';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import QuizNavigation from '@/components/(quiz)/quizNavigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Navigation from '@/components/(quiz)/navigation';
import Quiz from '@/components/(quiz)/quiz';
import { maybeParseJSON, randomizeArray } from '@/functions/(quiz)/helper';
import { getAllQuestionsBySessionId } from '@/lib/appwriteQuerys';
import { question } from '@/types/appwriteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import QuizResult from '@/components/(quiz)/quizResult';

type QuestionItem = {
    id: string,
    status: string
}


const quiz = () => {
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    

    const {
        sessionID,
        moduleID,
        quizType,
        questionType,
        questionAmount,
        timeLimit,
    } = useLocalSearchParams()

    console.log("Quiz params:", {
        sessionID,
        moduleID,
        quizType,
        questionType,
        questionAmount,
        timeLimit,
    })
    // Unwichtig, nur für responsive Design
    const {width} = useWindowDimensions();
    const isVertical = width > 700;
    const sheetRef = useRef<BottomSheet>(null);
    //This ensures that a user can only access this page when logged in
     useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); 
        }
      }, [user, isLoggedIn, isLoading]);

    const [ questions, setQuestions] = useState<question[]>([]); 
    const [ questionsForQuiz, setQuestionsForQuiz] = useState<question[]>([]);
    const [ questionList, setQuestionList] = useState<QuestionItem[]>([]);
    const [ questionListOriginal, setQuestionListOriginal] = useState<QuestionItem[]>([]);
    const [deatilsVisible, setDetailsVisible] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [showAnsers , setShowAnswers] = useState(false)
        const [ showSoloution, setShowSolution] = useState(false)


    async function initializeQuiz( {
        setQuestions,
        setQuestionList,
        sessionID,
        moduleID
    }:{
        setQuestions: React.Dispatch<React.SetStateAction<question[]>>,
        setQuestionList: React.Dispatch<React.SetStateAction<QuestionItem[]>>,
        sessionID?: string ,
        moduleID?: string ,
    }){
        if (!sessionID || !moduleID) router.replace("/bibliothek");
        const questionsRaw = await getAllQuestionsBySessionId(sessionID)
        const questions: question[] = Array.isArray(questionsRaw)
            ? questionsRaw.map(q => q as unknown as question)
            : [];
        const module = await loadModule(moduleID)
        const questionList = module?.questionList.map((q:any) => JSON.parse(q))
        if (quizType == "limited" || quizType == "limitedTimed"){
            let randomized = randomizeArray(questions ?? [])
            
            const amount = questionAmount ? parseInt(Array.isArray(questionAmount) ? questionAmount[0] : questionAmount) : 10;
            if (questionType && questionType == "single"){
                randomized = randomized.filter((q) => q.answerIndex.length <= 2)
            }
            randomized = randomized.slice(0, amount);
            setQuestionsForQuiz(randomized);
            setQuestions(randomized);
            setQuestionList(questionList ? questionList : [])
            setQuestionListOriginal(questionList ? questionList : [])
    } else {
        setQuestions(questions ? questions : []);
        setQuestionsForQuiz(questions ? randomizeArray(questions) : []);
        setQuestionList(questionList ? questionList : [])
        setQuestionListOriginal(questionList ? questionList : [])
    }
    }

    useEffect(() => {
        initializeQuiz({
            setQuestions,
            setQuestionList,
            sessionID: Array.isArray(sessionID) ? sessionID[0] : sessionID,
            moduleID: Array.isArray(moduleID) ? moduleID[0] : moduleID
        })
    }, [])


    async function saveQuestionStatus(
        id: string,
        newStatus: string,
        questionList: QuestionItem[],
        setQuestionList: React.Dispatch<React.SetStateAction<QuestionItem[]>>,
        moduleID: string
        ) {
        const res = await AsyncStorage.getItem(`unsyncedModuleList${moduleID}`);
        let tempQuestionList = [...questionList];

        if (res) {
        const parsedList = JSON.parse(res) as QuestionItem[];

        const parsedMap = new Map(parsedList.map(q => [q.id, q.status]));

        tempQuestionList = questionList.map(q => ({
            ...q,
            status: parsedMap.get(q.id) ?? q.status,
        }));

        parsedList.forEach(q => {
            if (!tempQuestionList.some(item => item.id === q.id)) {
            tempQuestionList.push(q);
            }
        });
        }

        const indexOfQuestion = tempQuestionList.findIndex(q => q.id === id);

        if (indexOfQuestion === -1) {
            tempQuestionList.push({ id, status: newStatus });
        } else {
            tempQuestionList[indexOfQuestion] = {
            ...tempQuestionList[indexOfQuestion],
            status: newStatus
            };
        }

        setQuestionList(tempQuestionList);

        const success = await updateModuleQuestionList(
            moduleID ? moduleID.toString() : "",
            tempQuestionList
        );

        if (!success) {
            await AsyncStorage.setItem(
            `unsyncedModuleList${moduleID}`,
            JSON.stringify(tempQuestionList)
            );
        } else {
            await AsyncStorage.removeItem(`unsyncedModuleList${moduleID}`);
        }
    }

    async function syncUnsyncedData(moduleID: string, questionList: QuestionItem[]) {
        const res = await AsyncStorage.getItem(`unsyncedModuleList${moduleID}`);
        if (res) {
            const parsedList = JSON.parse(res) as QuestionItem[];
            const mergedList = [...questionList];
            parsedList.forEach(q => {
                const index = mergedList.findIndex(item => item.id === q.id);
                if (index === -1) {
                    mergedList.push(q);
                }
                else {
                    mergedList[index] = {
                        ...mergedList[index],
                        status: q.status
                    };
                }
            });
            const success = await updateModuleQuestionList(moduleID, mergedList);
            if (success) {
                await AsyncStorage.removeItem(`unsyncedModuleList${moduleID}`);
                setQuestionList(mergedList);
            }
        }
    }

    /*Possible Cases after Question is answered
    //Anname die Fragen sind in Order also ist der index immer 0
    1. Infinity Mode
        - Question is answered correctly: Frage ans Ende der Liste
        - Question is answered wrong: Frage in die Mitte der Liste und an das Ende der Liste
    2. Limited Questions Fixed - also feste anzahl und man will prüfen wie viele richtig
        - Einfach nur nächste Frage
    3. Limited Questions until all correct - also feste anzahl an Fragen 
        - Question is aswered correctly: Frage wird entfernt, Antworten werden geshuffelt
        - Question is answered wrong: Frage ans Ende der Liste
    4. Timed Mode - Feste anzahl an Fragen die in einer Zeit beantwortet werden müssen
        - Wie in 2.
    */
   const [answeredCorrectly, setAnsweredCorrectly] = useState<string[]>([]);
   const [answeredWrong, setAnsweredWrong] = useState<string[]>([]);

    async function nextQuestion({
        status,
        questionsForQuiz,
        setQuestionsForQuiz, 
        quizType
    }:{
        status: "GOOD" | "BAD" | "OK" | "GREAT",
        questionsForQuiz: question[],
        setQuestionsForQuiz: React.Dispatch<React.SetStateAction<question[]>>,

        quizType: "infinity" | "limitedFixed" | "limitedAllCorrect" | "timed"
    }){
        if (status === "GOOD" || status === "GREAT") setAnsweredCorrectly([...answeredCorrectly, questionsForQuiz[0].question ? questionsForQuiz[0].question : ""]);
        if (status === "BAD") setAnsweredWrong([...answeredWrong, questionsForQuiz[0].question ? questionsForQuiz[0].question : ""]);
        if (quizType === "infinity"){
            if (status === "GOOD" || status === "GREAT"){
                const rotated = [...questionsForQuiz.slice(1), questionsForQuiz[0]];
                setQuestionsForQuiz(rotated);
            } else {
                const middleIndex = Math.floor(questionsForQuiz.length / 2);
                const rotated = [...questionsForQuiz.slice(1, middleIndex + 1), questionsForQuiz[0], ...questionsForQuiz.slice(middleIndex + 1)];
                setQuestionsForQuiz(rotated);
            }
        } else if (quizType === "limitedFixed" || quizType === "timed"){
            setQuestionsForQuiz(questionsForQuiz.slice(1));

        } else if (quizType === "limitedAllCorrect"){
            if (status === "GOOD" || status === "GREAT"){
                const newList = questionsForQuiz.slice(1);
                setQuestionsForQuiz(newList);
            } else {
                const rotated = [...questionsForQuiz.slice(1), questionsForQuiz[0]];
                setQuestionsForQuiz(rotated);
            }
    } }

    async function removeQuestionCompleately(){
        const id = questionsForQuiz[0].$id;
        await removeQuestion(id)
        setQuestions(questions.filter(q => q.$id !== id));
        setQuestionsForQuiz(questionsForQuiz.filter(q => q.$id !== id));
        setQuestionList(questionList.filter(q => q.id !== id));
        setQuestionListOriginal(questionListOriginal.filter(q => q.id !== id));
    }


    const gotToNextQuestion = async (status: "GOOD" | "BAD" | "OK" | "GREAT") => {
        if (!questionsForQuiz[0].$id ) return;
        await saveQuestionStatus(
            questionsForQuiz[0].$id,
            status,
            questionList,
            setQuestionList,
            moduleID ? (Array.isArray(moduleID) ? moduleID[0] : moduleID) : ""
        );
        setShowAnswers(false);
        setShowSolution(false);
        setSelectedAnswers([]);
        await nextQuestion({
            status,
            questionsForQuiz,
            setQuestionsForQuiz,
            quizType: quizType === "infinity" || quizType === "limitedFixed" || quizType === "limitedAllCorrect" || quizType === "timed" ? (Array.isArray(quizType) ? quizType[0] : quizType) : "limitedFixed"
        })
   }

    function correctAnswers({
        questionsParsed, 
        selectedQuestion, 
        selectedAnswers,
    }:{
        questionsParsed: any[],
        selectedQuestion: number,
        selectedAnswers: string[],
    }) {
        let correctAnswer = questionsParsed[0].answerIndex.map(
        (index:number) => questionsParsed[0].answers[index]
        )

        correctAnswer = correctAnswer.map((answer: string | {text: string, latex: string, image: string}) => {
        if (typeof answer === "string") {
            return {
            text: answer,
            latex: "",
            image: ""
            }
        } else {
            return answer;
        }
        })
        
        
        interface Answer {
            title: string;
            latex: string;
            image: string;
        }

        const correctAnswersAsString = correctAnswer.map((answer: any) => JSON.stringify(answer));
        const correctAnswersInOrder = correctAnswersAsString.sort();

        const selectedAnswersInOrder = selectedAnswers.sort();
       

        if (correctAnswersInOrder.length !== selectedAnswersInOrder.length) return false;
        for (let i = 0; i < correctAnswersInOrder.length; i++) {
            if (correctAnswersInOrder[i] !== selectedAnswersInOrder[i]) {
                return false;
            }
        }
        return true;
    }
    const [ startTime, setStartTime] = useState(Date.now());
    function tryAgain(){
        setQuestionsForQuiz(questions);
        setQuestionList(questionListOriginal);
        setAnsweredCorrectly([]);
        setAnsweredWrong([]);
        setSelectedAnswers([]);
        setShowAnswers(false);  
        setShowSolution(false); 
        setSelectedQuestion(0);
        setStartTime(Date.now());
    }
    function tryAgainNewQuestions(){
        initializeQuiz({
            setQuestions,
            setQuestionList,
            sessionID: Array.isArray(sessionID) ? sessionID[0] : sessionID,
            moduleID: Array.isArray(moduleID) ? moduleID[0] : moduleID
        })
        setAnsweredCorrectly([]);
        setAnsweredWrong([]);
        setSelectedAnswers([]);
        setShowAnswers(false);  
        setShowSolution(false); 
        setSelectedQuestion(0);
        setStartTime(Date.now());
    }
        



  return (
    <SafeAreaView className='flex-1 pt-5 bg-gray-900' >
    <View className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>

        <Navigation
            deatilsVisible={deatilsVisible}
            removeQuestion={removeQuestionCompleately}
            questionsParsed={questionList.filter((q) => questionsForQuiz.some(qq => qq.$id === q.id))}
            setDetailsVisible={setDetailsVisible}
            percent={
                100 - Math.ceil(questionsForQuiz.length / questions.length * 100)
            }
            type={quizType === "infinite" || quizType === "limitedFixed" || quizType === "limitedAllCorrect" || quizType === "timed" ? (Array.isArray(quizType) ? quizType[0] : quizType) : "limitedFixed"}
            timeLimit={ timeLimit ? (Array.isArray(timeLimit) ? parseInt(timeLimit[0]) : parseInt(timeLimit)) : 0}
            startTime={ startTime}
            setQuestionsForQuiz={()=> setQuestionsForQuiz([])}
            
        
        />
        {/*
        <Text className="text-white text-center text-xl font-bold my-2">
            {questionsForQuiz.length} | 
            {questionList.filter((q) => questionsForQuiz.some(qq => qq.$id === q.id)).filter((q) => q.status === "GOOD" || q.status === "GREAT").length} Richtig
                - {questionList.filter((q) => questionsForQuiz.some(qq => qq.$id === q.id)).filter((q) => q.status === "BAD").length} Falsch

        </Text>
        */}
        { questionsForQuiz.length > 0 &&
        <Quiz

            questions={questionsForQuiz}
            nextQuestion={gotToNextQuestion}

            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            showAnsers={showAnsers}
            width={width}
            changeVisibility={() => setShowAnswers(true)}
            correctAnswers={() => correctAnswers({
                questionsParsed: questionsForQuiz,
                selectedQuestion,
                selectedAnswers,
            })}
            setShowSolution={() => setShowSolution(false)}
            sheetRef={sheetRef}
            quizType={quizType === "single" || quizType === "multiple" || quizType === "questionAnswer" ? (Array.isArray(quizType) ? quizType[0] : quizType) : "single"}
            selectedLanguage={"de"} // or use a variable if you have one
        />
        }

        {showSoloution &&
            <QuizNavigation
                showAnswer={showSoloution}
                explaination={questions.length > 0 ? questions[0].explaination : ""}
                sheetRef={sheetRef}
                
            />
        }

        {(questionsForQuiz.length == 0 && questions.length > 0) &&
            <QuizResult
                answeredCorrectly={answeredCorrectly}   
                answeredWrong={answeredWrong}
                done={() => router.back()}
                tryAgain={tryAgain}
                tryAgainNewQuestions={tryAgainNewQuestions}
            />
        }
            
        
      </View>
    </View>
    </SafeAreaView> 
  )
}

export default quiz