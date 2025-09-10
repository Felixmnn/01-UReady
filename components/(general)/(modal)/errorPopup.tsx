import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const ErrorPopup = ({
    isError=false, 
    setIsError, 
    errorMessage="Error Ocurred"}:{
    isError: boolean,
    setIsError: React.Dispatch<React.SetStateAction<boolean>>,
    errorMessage: string
    }) => {
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isError}
        onRequestClose={() => {
            setIsError(!isError);
        }}
    >
        <TouchableOpacity className='flex-1 justify-start pt-5 items-center ' onPress={()=> setIsError(false)}>
            <View className='red border-red-600 border-[1px] rounded-[10px] p-5 m-2 bg-red-700 min-w-[200px] items-center justify-center shadow-lg'>
                <Text className='text-white text-center'>{errorMessage}</Text>
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default ErrorPopup