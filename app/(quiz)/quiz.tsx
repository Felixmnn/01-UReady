import { Image, Platform, SafeAreaView, StatusBar, Text, View } from 'react-native'
import React, { use, useEffect, useRef, useState, useTransition } from 'react'
import { router,useLocalSearchParams } from "expo-router"
import { useWindowDimensions } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import QuizNavigation from '@/components/(quiz)/quizNavigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Navigation from '@/components/(quiz)/navigation';
import Quiz from '@/components/(quiz)/quiz';
import {  randomizeArray } from '@/functions/(quiz)/helper';
import { question } from '@/types/appwriteTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizResult from '@/components/(quiz)/quizResult';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/(general)/customButton';
import ExplanationSheet from '@/components/(quiz)/explanationSheet';
import { CustomBottomSheetRef } from '@/components/(bibliothek)/(bottomSheets)/customBottomSheet';
import { repairQuestionList } from '@/functions/(entdecken)/transformData';
import { getModuleFromMMKV, getQuestionsFromMMKV } from '@/lib/mmkvFunctions';
import { ImageBackground } from 'react-native';
import { loadAproved } from '@/lib/appwriteDaten';

type QuestionItem = {
    id: string | null;
    status: "OK" | "GOOD" | "GREAT" | "BAD" | null;
}

const isWeb = Platform.OS === 'web';

let InterstitialAd: any, AdEventType: any, TestIds: any;
if (!isWeb) {
  const googleMobileAds = require('react-native-google-mobile-ads');
  InterstitialAd = googleMobileAds.InterstitialAd;
  AdEventType = googleMobileAds.AdEventType;
  TestIds = googleMobileAds.TestIds;
}

const [ aproved, setAproved ] = React.useState(null);



const adUnitId = !isWeb && __DEV__ ? TestIds.INTERSTITIAL : !isWeb ? TestIds.INTERSTITIAL : null;
const interstitial = !isWeb && adUnitId ? InterstitialAd.createForAdRequest(adUnitId) : null;

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


    

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (isWeb || !interstitial) return;

      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoaded(true);
      });
  
      const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
        if (Platform.OS === 'ios') {
          // Prevent the close button from being unreachable by hiding the status bar on iOS
          StatusBar.setHidden(true);
        }
      });
  
      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
      });
  
      // Start loading the interstitial straight away
      interstitial.load();
  
      // Unsubscribe from events on unmount
      return () => {
        unsubscribeLoaded();
        unsubscribeOpened();
        unsubscribeClosed();
      };
    }, []);







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
        const module = getModuleFromMMKV(moduleID as string);
        if (!module) {
            router.replace("/bibliothek");
            return;
        }
        const repaired_question_list = repairQuestionList(module?.questionList).map(q => JSON.stringify(q));
        let questionsRaw = [];
        // Step 1: The Questions get Filtered
        const q = getQuestionsFromMMKV(moduleID as string);
        if (sessionID === "ALL" && module) {
            questionsRaw.push(...q)
        } else {
           
           let res = q.filter((q) => q.sessionID === sessionID);
           const repaired_question_list = repairQuestionList(module?.questionList).map(q => JSON.stringify(q));
           res = res.filter((q) => repaired_question_list.some((mq:string) => {
             try {
               return JSON.parse(mq).id === q.$id;
             } catch (e) {
                console.log("Error parsing question ID from module questionList:", mq);
               return false;
             }
           }))
           questionsRaw.push(...res)
        }
        let questions: question[] = Array.isArray(questionsRaw)
            ? questionsRaw.map(q => q as unknown as question)
            : [];
        //Step 2: The Question Answers get shuffled
        questions = questions.map((question) => {
            const answersWithIndex = question.answers.map((answer, index) => ({ answer, index }));
            const randomizedAnswers = answersWithIndex.sort(() => Math.random() - 0.5);
            const newAnswers = randomizedAnswers.map(item => item.answer);
            const newAnswerIndex = randomizedAnswers
                .filter(item => question.answerIndex.includes(item.index))
                .map(item => randomizedAnswers.indexOf(item));
            return {
                ...question,
                answers: newAnswers,
                answerIndex: newAnswerIndex,
            };
        })
        //Step 3: The Question List gets loaded
        let questionList = module?.questionList.map((q:string) => {
          try {
            return JSON.parse(q);
          } catch (e) {
            return { id: null, status: null };
          }
        })
        //Step 4: Depending on the Quiz Mode more filters get Applied
        if (quizType !== "infinite"){
            //Step 4.1: The Questions get Shuffled
            let randomized = randomizeArray(questions ?? [])
            
            //Step 4.2: Depending on the User Choice the Question Array get sliced
            const amount = questionAmount ? parseInt(Array.isArray(questionAmount) ? questionAmount[0] : questionAmount) : 10;
            //Step 4.3: Determination if the answersAmount is 1
            if (questionType && questionType == "single"){
                randomized = randomized.filter((q) => q.answerIndex.length <= 2)
            }
            randomized = randomized.slice(0, amount);
            //This ensures we can later use the options newQuestions/tryAgain
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
        if (status === "BAD" || status === "OK") setAnsweredWrong([...answeredWrong, questionsForQuiz[0].question ? questionsForQuiz[0].question : ""]);
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

type Result = "GOOD" | "OK" | "BAD";

function correctAnswers({
  questionsParsed,
  selectedQuestion,
  selectedAnswers,
}: {
  questionsParsed: question[];
  selectedQuestion: number;
  selectedAnswers: any[];
}): Result {
  // Korrekte Antworten parsen (wie vorher)
  const correctAnswerObjects: Answer[] =
    questionsParsed[selectedQuestion].answerIndex.map((index: number) =>
      toAnswer(questionsParsed[selectedQuestion].answers[index])
    );

  // Ausgewählte Antworten normalisieren
  const selectedAnswerObjects: Answer[] = selectedAnswers.map(toAnswer);

  // Falls es überhaupt keine korrekten Antworten gäbe, wertet das als BAD
  const totalCorrect = correctAnswerObjects.length;
  if (totalCorrect === 0) return "BAD";


  const key = (a: Answer) => a.title;

  const correctSet = new Set(correctAnswerObjects.map(key));

  const matchedSet = new Set<string>();
  for (const sel of selectedAnswerObjects) {
    const k = key(sel);
    if (correctSet.has(k)) matchedSet.add(k);
  }

  const matches = matchedSet.size;

  // Strenge GOOD-Bedingung: alle richtigen getroffen und keine Extras ausgewählt
  const selectedCount = selectedAnswerObjects.length;
  if (matches === totalCorrect && selectedCount === totalCorrect) {
    return "GOOD";
  }

  // OK: mehr als die Hälfte der korrekten Antworten getroffen
  if (matches >= totalCorrect / 2) {
    return "OK";
  }

  // Sonst BAD
  return "BAD";
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
        <Text>
            {
                JSON.stringify(questionList)
            }{
            JSON.stringify(questions)
            }
        </Text>
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
                showInterstitial={interstitial}
                intestialIsLoaded={loaded}
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