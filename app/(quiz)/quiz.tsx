import { View} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router,useLocalSearchParams } from "expo-router"
import { removeQuestion, updateDocument, updateModule} from "../../lib/appwriteEdit"
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadModule } from '@/lib/appwriteDaten';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import  languages  from '@/assets/exapleData/languageTabs.json';
import QuizNavigation from '@/components/(quiz)/quizNavigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Navigation from '@/components/(quiz)/navigation';
import Quiz from '@/components/(quiz)/quiz';
import { maybeParseJSON, randomizeArray } from '@/functions/(quiz)/helper';


const quiz = () => {
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    const {questions, moduleID} = useLocalSearchParams()


    
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


    //Helper functions that do not need more attention
    /**
     * This is the state that holds the questions wich get passed through the params
     */
    const [ questionsParsed, setQuestionParsed] = useState(
        randomizeArray(JSON.parse(Array.isArray(questions) ? questions[0] : questions))
    );
    const [ showSoloution, setShowSolution] = useState(false)
    const [ questionList, setQuestionList] = useState<any[]>([])
    const [ module, setModule] = useState<any | undefined | null>(null)

    /**
     * This is the function that loads the questionList wich contains the status of the questions
     */
    useEffect(() => {
        if (!moduleID) return;
        async function fetchData() {
            const data = await loadModule(moduleID);
            if (!data) return;
            setModule(data);

            const filteredQuestions = data.questionList.filter((question:any) => {
            return questionsParsed.some(q => q.$id === JSON.parse(question).id);
            });
            setQuestionList(filteredQuestions.map((question:any) => JSON.parse(question)));
           
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
            const parsedList = module.questionList.map((question:any) => JSON.parse(question))
            const updatedList = parsedList.map((question:any) => {
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
                questionList: updatedList.map((question:any) => JSON.stringify(question))
            };
            const res = await updateModuleQuestionList(updatedModule.$id,updatedModule. questionList);
        }
        }
        updateModuleHere();
    }, [questionList]);




    

    /**
     * This is the header of the quiz page containing the status bar and the title
     */
    const [deatilsVisible, setDetailsVisible] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [showAnsers , setShowAnswers] = useState(false)
    
  
    //Function that checks if the selected answers are correct 
    function correctAnswers({
        questionsParsed, 
        selectedQuestion, 
        selectedAnswers,
    }:{
        questionsParsed: any[],
        selectedQuestion: number,
        selectedAnswers: string[],
    }) {
           const correctAnswers = questionsParsed[selectedQuestion].answers.filter((answer:string,index:number) => questionsParsed[selectedQuestion].answerIndex.includes(index))
           const correctAnswersToString = correctAnswers.map((answer:string) => {
            try {
                const pAnswer = JSON.parse(answer);
                return JSON.stringify(pAnswer);
            } 
            catch (e) {
                return JSON.stringify({   
                    title: answer,
                    latex: "",
                    image: ""
                });   
            }
           });
           const selectedAnswersToString = selectedAnswers.map(answer => typeof answer == "string" ? answer :JSON.stringify(maybeParseJSON(answer)));
            if (selectedAnswersToString.length !== correctAnswersToString.length) {
                return false; 
            }
            for (let i = 0; i < correctAnswersToString.length; i++) {
                if (!selectedAnswersToString.includes(correctAnswersToString[i])) {
                    return false; // Eine Antwort stimmt nicht überein
                }
            }
           
            return true; // Alle Antworten stimmen überein
    
             
    }

    



    
   

  return (
    <SafeAreaView className={`flex-1 items-center justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d] ${isVertical ? "p-3" : ""}`}>
      <View className={`flex-1  w-full bg-[#0c111d]  ${isVertical ? "rounded-[10px] border-[1px] border-gray-600" : ""}`}>
        <Navigation
            deatilsVisible={deatilsVisible}
            removeQuestion={removeQuestion}
            questionsParsed={questionsParsed}
            selectedQuestion={selectedQuestion}
            setQuestionList={setQuestionList}
            setQuestionParsed={setQuestionParsed}
            setSelectedQuestion={setSelectedQuestion}
            setDetailsVisible={setDetailsVisible}
        />
        <Quiz
            questionsParsed={questionsParsed}
            selectedQuestion={selectedQuestion}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            showAnsers={showAnsers}
            width={width}
            changeVisibility={() => setShowAnswers(true)}
            correctAnswers={() => correctAnswers({
                questionsParsed,
                selectedQuestion,
                selectedAnswers,
            })}
            setShowSolution={() => setShowSolution(false)}
            sheetRef={sheetRef}
            nextQuestion={() => setSelectedQuestion((prev) => Math.min(prev + 1, questionsParsed.length - 1))}
        />
        {showSoloution &&
            <QuizNavigation
                showAnswer={showSoloution}
                explaination={questionsParsed[selectedQuestion].explaination}
                setShowSolution={() => setShowSolution(false)}
                questionList={questionList}
                setQuestionList={setQuestionList}
                setQuestionParsed={setQuestionParsed}
                setSelectedQuestion={setSelectedQuestion}
                updateDocument={updateDocument}
                setShowAnswers={setShowAnswers}
                sheetRef={sheetRef}
                correctAnswers={() => correctAnswers({
                    questionsParsed,
                    selectedQuestion,
                    selectedAnswers,
                })}
            />
        }
      </View>
    </SafeAreaView>
  )
}

export default quiz