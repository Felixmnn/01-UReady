import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const ModalQuiz = ({isVisible, setIsVisible, onComplete}) => {
  return (
    <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
            <View className="bg-gray-800 rounded-lg p-4 w-80">
              <Text className="text-lg font-bold mb-4 text-gray-200">Watch Video</Text>
              <Text className="text-white  mb-4">
                Participate in a Quiz
              </Text>
              <TouchableOpacity
                className="bg-blue-500 rounded-lg p-2 items-center"
                onPress={() => {
                  // Handle video play
                }}
              >
                <Text className="text-white font-semibold">Watch Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 bg-gray-300 rounded-lg p-2 items-center"
                onPress={() => setIsVisible(false)}
              >
                <Text className="text-gray-800 font-semibold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
    </Modal>
  )
}

export default ModalQuiz