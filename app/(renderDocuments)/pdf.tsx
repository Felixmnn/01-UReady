import { View, Text, TouchableOpacity } from 'react-native'
import React,{ useCallback, useRef, useState } from 'react'
import BottomSheet, { BottomSheetView} from '@gorhom/bottom-sheet'


const pdf = () => {

    const sheetRef = useRef<BottomSheet>(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["90%"];



  return (
    <View className='flex-1 justify-center items-center bg-red-500'>
        <TouchableOpacity
            onPress={() => {
                sheetRef.current?.snapToIndex(0);
                setIsOpen(true);
            }}
        >
            <Text className='text-white text-lg' >Open PDF Viewer</Text>
        </TouchableOpacity>
        <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setIsOpen(false)}
              backgroundStyle={{ backgroundColor: '#0c111e' }} // hier Farbe anpassen

        >
            <BottomSheetView className='flex-1 items-center justify-center bg-black'
                style={{ flex: 1, backgroundColor: '#0c111e' }}
            >
                <Text className='text-white text-lg'>PDF Viewer</Text>
            </BottomSheetView>
        </BottomSheet>
    </View>
  )
}

export default pdf