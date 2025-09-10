import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { nextQuestion } from '@/functions/(quiz)/nextQuestion';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTranslation } from 'react-i18next';

const QuizNavigation = ({
    explaination="Die Begründung für die Antwort...",    
    showAnswer=false,
    sheetRef,
    correctAnswers,
    questionList,
    setQuestionList,
    setQuestionParsed,
    setSelectedQuestion,
    updateDocument,
    setShowAnswers,
    setShowSolution


}:{
    explaination: string,
    showAnswer: boolean,
    sheetRef: React.RefObject<BottomSheetMethods | null>;
    correctAnswers: ()=> boolean,
    questionList: any[],    
    setQuestionList: React.Dispatch<React.SetStateAction<any[]>>,
    setQuestionParsed: React.Dispatch<React.SetStateAction<any[]>>,
    setSelectedQuestion: React.Dispatch<React.SetStateAction<number>>,
    updateDocument: (data: any) => Promise<any>,
    setShowAnswers: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSolution: React.Dispatch<React.SetStateAction<boolean>>,


}) => {
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["20%","60%","90%"];
    const [isVisibleAiModule, setIsVisibleAiModule] = useState(true);
    useEffect(() => {
        if (showAnswer) {
            setIsOpen(true);
            sheetRef.current?.snapToIndex(0);
        }
        else {
            setIsOpen(false);
        }
    }, [showAnswer]);

  return (
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            index={0} // <- Das öffnet das Sheet bei SnapPoint "60%" (Index 1)

            enablePanDownToClose={true}
            onClose={() => {setIsOpen(false)}}
            backgroundStyle={{ backgroundColor: '#1F2937',
            
            }} 
            >
        <BottomSheetView
            style={{
            flex: 1,
            padding: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            }}
        >
            <View className=' rounded-[10px] mb-4'>
                <View className='flex-row items-center justify-between'>
                    <Text className='text-white text-[18px] font-bold'>
                        {t("quizNavigation.explanation")}
                    </Text>
                    <TouchableOpacity onPress={()=> {nextQuestion(
                        {
                            status: correctAnswers() ? "GOOD" : "BAD",
                            change: 1,
                            questionsParsed: [],
                            selectedQuestion: 0,
                            questionList: questionList,
                            setQuestionList: setQuestionList,
                            setQuestionParsed: setQuestionParsed,
                            setSelectedQuestion: setSelectedQuestion,
                            setShowAnswers: setShowAnswers,
                            updateDocument: updateDocument
                        }                                              
                    ); setShowSolution(false)}} className='items-center justify-center p-2 bg-blue-900 rounded-[10px]'>
                        <Text className='text-white text-[15px] font-semibold'>
                            {t("quizNavigation.next")}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className='mt-2'>
                    <Text className='text-gray-300 text-[15px]'>
                        {explaination}
                    </Text>
                </View>
            </View>
            </BottomSheetView>
        </BottomSheet>
  )
}

export default QuizNavigation