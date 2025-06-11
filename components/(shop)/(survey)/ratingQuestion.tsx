import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RatingQuestion = ({
  question = '',
  maxRating = 5,
  minRating = 1,
  scaleLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  defaultRating = 3,
  unit = '',
  userAnswers = {},
  setUserAnswers = () => {},
  questionId = '',
  texts
}) => {
  const [rating, setRating] = useState(userAnswers[questionId] || defaultRating);

  const handleRating = (value) => {
    setRating(value);

    // Direkt speichern in userAnswers
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  return (
    <View className="flex-1 p-4" style={{ maxHeight: 600 }}>
      <Text className="text-lg font-bold mb-4 text-gray-100">{question}</Text>

      <View className="flex-row items-center justify-center">
        {[...Array(maxRating)].map((_, index) => {
          const value = index + 1;
          return (
            <TouchableOpacity key={index} onPress={() => handleRating(value)}>
              <Text
                style={{
                  fontSize: 32,
                  marginHorizontal: 4,
                  color: value <= rating ? '#FBBF24' : '#4B5563', // yellow-400 / gray-600
                }}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {scaleLabels.length === maxRating && (
        <View className="flex-row justify-center mt-2">
          {scaleLabels.map((label, index) => (
            <Text
              key={index}
              style={{
                width: 40,
                fontSize: 10,
                color: '#9CA3AF', // gray-400
                textAlign: 'center',
              }}
            >
              {label}
            </Text>
          ))}
        </View>
      )}

      <Text className="text-sm text-gray-500 mt-4 text-center">
        {texts.selected}: {rating} {unit}
      </Text>
    </View>
  );
};

export default RatingQuestion;
