import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const ModalQuiz = ({isVisible, setIsVisible, onComplete}) => {

  const exampleSurvey = {
    title: "Survey Example",  //Title
    questions: [              // Array of IDs
      "ID1",
      "ID2",
      "ID3",
      "ID4",
      "ID5",
    ],
    reward: [
      { type: "coins", amount: 100 }, // Object
      { type: "points", amount: 50 }, // Object
    ],          
    $id: "survey123",           // ID
    targetGroup : "all",        // ENUM
    maxResondants: 100,         // Number
    participations: 0,          // Number
    isActive: true,            // Boolean
    startDate: new Date().toISOString(), // ISO String
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // ISO String, 7 days from now
    isRepeatable: false, // Boolean
    isAnonymous: true, // Boolean
    tags: ["example", "survey"], // Array of Strings
      }
    
    const exampleQuestions = [
      {
        id : "ID1",
        imageUrl: "https://example.com/image.jpg", // String
        videoUrl: "https://example.com/video.mp4", // String
        audioUrl: "https://example.com/audio.mp3", // String
        type : "single-choice", // ENUM - "single-choice", "multiple-choice", "user-input", "rating", "slider", "yes-no", "number-input"
        question: "What is your favorite color?",
        answers: [ "Red", "Blue", "Green", "Yellow" ], // Array of Strings
        randomizeAnswers: true, // Boolean
        maxSelection: 1, // Number
        minSelection: 1, // Number
        placeHolder: "Select your favorite color", // String
        textinputMaxLength: 50, // Number
        textinputMinLength: 1, // Number
        validationRegex: "^[a-zA-Z]+$", // String
        scaleMin: 1, // Number
        scaleMax: 5, // Number
        scaleLabels: ["Very Bad", "Bad", "Neutral", "Good", "Very Good"], // Array of Strings
        step: 1, // Number
        unit: "cm", // String
        minValue: 0, // Number
        maxValue: 100, // Number
        skipIf: null, // String or null
        showIf: null, // String or  
      }
    ]

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
                <Text className="text-white font-semibold">Participate</Text>
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