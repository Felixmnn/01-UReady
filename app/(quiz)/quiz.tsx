import { Image, SafeAreaView, Text, View} from 'react-native'
import React, { use, useEffect, useRef, useState, useTransition } from 'react'
import { router,useLocalSearchParams } from "expo-router"
import { removeQuestion} from "../../lib/appwriteEdit"
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadModule } from '@/lib/appwriteDaten';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import QuizNavigation from '@/components/(quiz)/quizNavigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Navigation from '@/components/(quiz)/navigation';
import Quiz from '@/components/(quiz)/quiz';
import {  randomizeArray } from '@/functions/(quiz)/helper';
import { getAllQuestionsByIds, getAllQuestionsBySessionId } from '@/lib/appwriteQuerys';
import { question } from '@/types/appwriteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizResult from '@/components/(quiz)/quizResult';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/(general)/customButton';
import ExplanationSheet from '@/components/(quiz)/explanationSheet';
import { CustomBottomSheetRef } from '@/components/(bibliothek)/(bottomSheets)/customBottomSheet';

type QuestionItem = {
    id: string,
    status: string
}



const quiz = () => {
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    const [loading, setLoading] = useState(true);

    const {
        sessionID,
        moduleID,
        quizType,
        questionType,
        questionAmount,
        timeLimit,
    } = useLocalSearchParams()

    
    // Unwichtig, nur für responsive Design
    const {width} = useWindowDimensions();
    const isVertical = width > 700;
    const sheetRef = useRef<BottomSheet>(null);
    const sheetRefExplanation = useRef<CustomBottomSheetRef>(null);

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
        const module = await loadModule(moduleID)
        let questionsRaw = [];
        if (sessionID === "ALL" && module) {
            const q = await getAllQuestionsByIds(module.questionList.map((q:string) => {
              try {
                return JSON.parse(q).id;
              } catch (e) {
                return null;
              }
            }).filter(Boolean))
            questionsRaw.push(...q)
        } else {
           let res = (await getAllQuestionsBySessionId(sessionID)) ?? []
           res = res.filter((q) => module?.questionList.some((mq:string) => {
             try {
               return JSON.parse(mq).id === q.$id;
             } catch (e) {
               return false;
             }
           }))
           questionsRaw.push(...res)
        }
        const questions: question[] = Array.isArray(questionsRaw)
            ? questionsRaw.map(q => q as unknown as question)
            : [];
        const questionList = module?.questionList.map((q:string) => {
          try {
            return JSON.parse(q);
          } catch (e) {
            return { id: null, status: null };
          }
        })
        if (quizType !== "infinite"){
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
        setLoading(false);
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
        let finalStatus = newStatus;
        if (indexOfQuestion !== -1) {
          const prevStatus = tempQuestionList[indexOfQuestion].status;
          if (prevStatus === "GOOD" && newStatus === "GOOD" || prevStatus === "GREAT" && newStatus === "GREAT") {
            finalStatus = "GREAT";
          }
        }
        if (indexOfQuestion === -1) {
            tempQuestionList.push({ id, status: finalStatus });
        } else {
            tempQuestionList[indexOfQuestion] = {
            ...tempQuestionList[indexOfQuestion],
            status: finalStatus
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

    useEffect(() => {
        if (!moduleID) return;
        syncUnsyncedData(Array.isArray(moduleID) ? moduleID[0] : moduleID, questionList);
    }, [moduleID]);

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

 
interface Answer {
  title: string;
  latex: string;
  image: string;
}
const [typeHint, setTypeHint] = useState(false)
const [explainationContent, setExplainationContent] = useState("")

function toAnswer(answer: any): Answer {
  if (typeof answer === "string") {
    try {
      return JSON.parse(answer);
    } catch {
      return { title: answer, latex: "", image: "" };
    }
  }
  return answer;
}

function answersAreEqual(a: Answer, b: Answer) {
  return a.title === b.title && a.latex === b.latex && a.image === b.image;
}

function correctAnswers({
  questionsParsed,
  selectedQuestion,
  selectedAnswers,
}: {
  questionsParsed: question[];
  selectedQuestion: number;
  selectedAnswers: any[];
}) {
  // Korrekte Antworten parsen
  const correctAnswerObjects: Answer[] =
    questionsParsed[selectedQuestion].answerIndex.map((index: number) =>
      toAnswer(questionsParsed[selectedQuestion].answers[index])
    );

  // Auch ausgewählte Antworten normalisieren
  const selectedAnswerObjects: Answer[] = selectedAnswers.map(toAnswer);

  if (correctAnswerObjects.length !== selectedAnswerObjects.length) return false;

  // Sortieren nach Titel
  const sortByTitle = (arr: Answer[]) =>
    arr.slice().sort((a, b) => a.title.localeCompare(b.title));

  const correctSorted = sortByTitle(correctAnswerObjects);
  const selectedSorted = sortByTitle(selectedAnswerObjects);

  for (let i = 0; i < correctSorted.length; i++) {
    if (!answersAreEqual(correctSorted[i], selectedSorted[i])) {
      return false;
    }
  }
  return true;
}


const {t} = useTranslation()
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
        const [remainingPercent, setPercent] = React.useState(100);
    
  if ( !loading && questions.length == 0 ) return (
    <SafeAreaView className='flex-1 pt-5 bg-gray-900 items-center justify-center' >
        <Text className="text-white text-center text-[15px] font-bold my-2 p-4">
            {
                t("quiz.sorry")
            }
        </Text>
        <Image 
        source={require("../../assets/Uncertain.gif")}
        style={{
            width: 200,
            height: 200,
            resizeMode: "contain"
        }} />
        <CustomButton
            title={t("editNote.back")}
            handlePress={() => router.back()}
            containerStyles='mt-5 w-full max-w-[200px] px-10 bg-blue-600 rounded-full'
        />
    </SafeAreaView>
  )

  return (
    <SafeAreaView className='flex-1 pt-5 bg-gray-900' >
    <View className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>

        <Navigation
            quizType={ (Array.isArray(quizType) ? quizType[0] : quizType) }
            timeLimit={timeLimit ? (Array.isArray(timeLimit) ? parseInt(timeLimit[0]) : parseInt(timeLimit)) : undefined}
            startTime={startTime}
            questionStates={
                questionList.filter((q) => questions.some(qq => qq.$id === q.id))
            }
            totalAmountOfQuestions={questions.length}
            amountOfAnsweredQuestions={questionsForQuiz.length}
            remainingPercent={remainingPercent}
            setRemainingPercent={setPercent}
            setPercent={setPercent}
            
            
        
        />
        {/*
        <Text className="text-white text-center text-xl font-bold my-2">
            {questionsForQuiz.length} | 
            {questionList.filter((q) => questionsForQuiz.some(qq => qq.$id === q.id)).filter((q) => q.status === "GOOD" || q.status === "GREAT").length} Richtig
                - {questionList.filter((q) => questionsForQuiz.some(qq => qq.$id === q.id)).filter((q) => q.status === "BAD").length} Falsch

        </Text>
        */}
        { questionsForQuiz.length > 0 &&
            !(remainingPercent <= 0 && quizType == "limitedTime")
        
        &&
        <Quiz
            questionList={questionList}
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
            setShowSolution={() => setShowSolution(true)}
            sheetRef={sheetRef}
            quizType={quizType === "single" || quizType === "multiple" || quizType === "questionAnswer" ? (Array.isArray(quizType) ? quizType[0] : quizType) : "single"}
            selectedLanguage={"de"} // or use a variable if you have one
            showHint={() => {
                sheetRefExplanation.current?.openSheet(0)
                setTypeHint(true)
                setExplainationContent(questionsForQuiz[0].hint ? questionsForQuiz[0].hint : "")
            }}
            showExplanation={() => {
                sheetRefExplanation.current?.openSheet(0)
                setTypeHint(false)
                setExplainationContent(questionsForQuiz[0].explaination ? questionsForQuiz[0].explaination : "")
            }}
        />
        }


        {showSoloution || 
         remainingPercent <= 0
        &&
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

        <ExplanationSheet
            sheetRef={sheetRefExplanation}
            explaination={explainationContent}
            typeHint={typeHint} 
            />
        <View>
           
        </View>
            
        
      </View>
      
    </View>
    </SafeAreaView> 
  )
}

export default quiz