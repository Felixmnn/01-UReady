import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const QuizNavigation = ({
    explaination="Die Begründung für die Antwort...",
    answeredCorrectly=true,
    setShowAnswer=()=>{},
    showAnswer=false,
    onContinue=()=>{},
    sheetRef,
    nextQuestion,
    correctAnswers,
    setShowSolution=()=>{},


}) => {
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
                        Erklärung
                    </Text>
                    <TouchableOpacity onPress={()=> {nextQuestion(correctAnswers() ? "GOOD" : "BAD",1); setShowSolution(false)}} className='items-center justify-center p-2 bg-blue-900 rounded-[10px]'>
                        <Text className='text-white text-[15px] font-semibold'>
                            Weiter
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