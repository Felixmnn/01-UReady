import { View, Text, Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import Video from "react-native-video";


const ModalVideoAdd = ({isVisible= false, setIsVisible=(item)=> {}, onComplete=()=> {}}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
        <View className="bg-gray-800 rounded-lg p-4 w-11/12 items-center justify-center">
         
          <TouchableOpacity
            className='bg-green-500 rounded-lg p-4 w-full items-center justify-center'
            onPress={() => {
              setIsVisible(false);
              onComplete();
            }}
          >
            <Text className="text-white text-lg font-bold mb-4">Claim Reward</Text>
          </TouchableOpacity>
          </View>
      </View>
    </Modal>
  )
}

export default ModalVideoAdd