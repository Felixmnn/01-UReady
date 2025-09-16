import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

 /**
   * Component wich tells the user user that something went wrong
   */
  const ErrorModal = ({isError, setIsError, errorMessage}:{
    isError: boolean,
    setIsError: (value: boolean) => void,
    errorMessage: string | null,
  }
  ) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isError}
            onRequestClose={() => {
              setIsError(!isError);
            }}
        >
            <TouchableOpacity className='flex-1 justify-start pt-5 items-center' onPress={()=> setIsError(false)}>
                <View className='red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700'>
                    <Text className='text-white'>{errorMessage}</Text>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default ErrorModal