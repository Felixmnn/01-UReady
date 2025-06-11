import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'

const ChoiceQuestion = ({
  multiselect = false,
  question = "",
  answers = [],
  randomizeAnswers = false,
  maxSelection = 1,
  minSelection = 1,
  userAnswers = {},
  setUserAnswers = () => {},
  questionId = "",
  texts 
}) => {
  const [selected, setSelected] = useState(userAnswers[questionId] || [])

  const toggleSelection = (answer) => {
    let newSelection = []

    if (multiselect) {
      if (selected.includes(answer)) {
        newSelection = selected.filter(a => a !== answer)
      } else if (selected.length < maxSelection) {
        newSelection = [...selected, answer]
      } else {
        newSelection = selected // keine Änderung
      }
    } else {
      newSelection = [answer]
    }

    setSelected(newSelection)

    // Direkt speichern:
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: newSelection
    }))
  }

  

  return (
    <View className='flex-1 p-4' style={{ maxHeight: 600 }}>
      <Text className='text-lg font-bold mb-2 text-gray-100'>{question}</Text>

      <View className=''>
        {answers.map((answer, index) => {
          const isSelected = selected.includes(answer)
          return (
            <Pressable
              key={index}
              onPress={() => toggleSelection(answer)}
              className={`p-2 m-1 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <Text className={`${isSelected ? 'text-white' : 'text-black'}`}>{answer}</Text>
            </Pressable>
          )
        })}
      </View>

      <Text className='text-sm text-gray-500 mt-2'>
        {multiselect
          ? `${texts.choseUpTo}${maxSelection}${texts.answers}`
          : texts.choseOne}
      </Text>
    </View>
  )
}

export default ChoiceQuestion
