import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const SliderQuestion = ({
  question = "",
  scaleMin = 0,
  scaleMax = 100,
  scaleLabels = ["Low", "Medium", "High"],
  step = 1,
  unit = "",
  defaultValue = 50,
  userAnswers = {},
  setUserAnswers = () => {},
  questionId = "",
}) => {
  const [value, setValue] = useState(userAnswers[questionId] || defaultValue);

  const handleChange = (val) => {
    setValue(val);
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  return (
    <View className="flex-1 p-4" style={{ maxHeight: 600 }}>
      <Text className="text-lg font-bold mb-4 text-gray-100">{question}</Text>

      <View className="flex-row items-center mb-2">
        <Text className="text-gray-200 mr-2" style={{ width: 40 }}>
          {scaleMin} {unit}
        </Text>
        <Slider
          style={{ flex: 1 }}
          minimumValue={scaleMin}
          maximumValue={scaleMax}
          step={step}
          value={value}
          minimumTrackTintColor="#3B82F6" // blue-500
          maximumTrackTintColor="#9CA3AF" // gray-400
          thumbTintColor="#3B82F6"
          onValueChange={handleChange}
        />
        <Text className="text-gray-200 ml-2" style={{ width: 40, textAlign: 'right' }}>
          {scaleMax} {unit}
        </Text>
      </View>

      <View className="flex-row justify-between mb-1 px-1">
        {scaleLabels.map((label, index) => (
          <Text
            key={index}
            style={{
              color: "#9CA3AF",
              fontSize: 12,
              textAlign: 'center',
              flex: 1,
            }}
          >
            {label}
          </Text>
        ))}
      </View>

      <Text className="text-sm text-center text-gray-400 mt-2">
        Selected: {value} {unit}
      </Text>
    </View>
  );
};

export default SliderQuestion;
