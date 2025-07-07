import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { ScrollView } from 'react-native-gesture-handler';

const StartQuizBottomSheet = () => {
    const sheetRef = useRef<BottomSheet>(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["20%","60%","90%"];
    const [isVisibleAiModule, setIsVisibleAiModule] = useState(true);
    const options = [
        "Multiple Choice",
        "Single Choice",
        "Question & Answer",
        
    ]
   return (
    <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
          index={1} // <- Das öffnet das Sheet bei SnapPoint "60%" (Index 1)

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
        <View className='w-full items-start justify-start'>
            <Text className='text-white text-[20px] font-bold'>
                Starte dein Quiz
            </Text>
        </View>
        <Text className='text-white text-[16px] font-semibold m-2'>
            Modus
        </Text>
        <ScrollView className='w-full ' horizontal={true} showsHorizontalScrollIndicator={false}>
            {
                options.map((item, index) => {
                    return (
                        <View key={index} 
                        style={{
                            height: 40
                        }}
                        className='bg-blue-800 border-[2px] border-blue-600 items-center justify-center rounded-lg p-2 m-1'>
                            <Text className='text-white text-[14px] font-semibold'>
                                {item}
                            </Text>
                        </View>
                    )
                })
            }

        </ScrollView>
       
      </BottomSheetView>
    </BottomSheet>
  )
}

export default StartQuizBottomSheet