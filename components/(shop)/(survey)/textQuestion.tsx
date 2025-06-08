import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

const TextQuestion = ({
  question = "",
  placeholder = "Type your answer here...",
  maxLength = 500,
  minLength = 1,
  required = false,
  validationRegex = null,
  userAnswers = {},
  setUserAnswers = () => {},
  questionId = "",
}) => {
  const [input, setInput] = useState(userAnswers[questionId] || "")
  const [error, setError] = useState(null)

  const handleInputChange = (text) => {
    setInput(text)

    // Sofortige Validierung
    if (required && text.length < minLength) {
      setError(`Answer must be at least ${minLength} characters.`)
    } else if (validationRegex && !new RegExp(validationRegex).test(text)) {
      setError("Answer must match required format.")
    } else {
      setError(null)
    }

    // Direkt speichern
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: text
    }))
  }

  return (
    <View className='flex-1 p-4' style={{ maxHeight: 600 }}>
      <Text className='text-lg font-bold mb-2 text-gray-100'>{question}</Text>
      <View className='bg-gray-200 p-2 rounded-lg'>
        <TextInput
          placeholder={placeholder}
          value={input}
          onChangeText={handleInputChange}
          maxLength={maxLength}
          className='text-gray-800'
          multiline
        />
      </View>
      {error && (
        <Text className='text-sm text-red-500 mt-2'>{error}</Text>
      )}
    </View>
  )
}

export default TextQuestion
