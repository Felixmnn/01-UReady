import { View, Text, TextInput } from 'react-native';
import React, { useState } from 'react';

const NumericQuestion = ({
  question = "",
  placeholder = "Enter a number",
  maxLength = 10,
  step = 1,
  unit = "",
  minValue = 0,
  maxValue = 100,
  userAnswers = {},
  setUserAnswers = () => {},
  questionId = "",
  texts
}) => {
  const [inputValue, setInputValue] = useState(
    userAnswers[questionId]?.toString() ?? ""
  );
  const [error, setError] = useState(null);

  const handleChange = (text) => {
    setInputValue(text);

    if (text === "") {
      setError(null);
      return;
    }

    const numeric = parseFloat(text);

    if (isNaN(numeric)) {
      setError(texts.pleaseEnterValidNumber);
      return;
    }

    if (numeric < minValue || numeric > maxValue) {
      setError(`${texts.numberMustBeBetween} ${minValue}${texts.and}${maxValue}${texts.be}`);
      return;
    }

    setError(null);

    // Antwort speichern
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: numeric,
    }));
  };

  return (
    <View className="flex-1 p-4" style={{ maxHeight: 600 }}>
      <Text className="text-lg font-bold mb-2 text-gray-100">{question}</Text>
      <View className="bg-gray-200 p-2 rounded-lg">
        <TextInput
          placeholder={placeholder}
          maxLength={maxLength}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={handleChange}
          className="text-gray-800"
          style={{
            borderColor: error ? 'red' : 'gray',
            borderWidth: 1,
            padding: 8,
            borderRadius: 4,
            color: '#111827',
          }}
        />
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-2">{error}</Text>
      )}
      <Text className="text-sm text-gray-500 mt-2">
        {texts.step}: {step} {unit}, {texts.range}: {minValue} - {maxValue} {unit}
      </Text>
    </View>
  );
};

export default NumericQuestion;
