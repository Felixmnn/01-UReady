import { View, Text, Pressable, TextInput } from 'react-native'
import React from 'react'
import CustomBottomSheet from './customBottomSheet'
import CustomButton from '@/components/(general)/customButton'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

const StartQuizSheet = ({
  sheetRef,
  moduleID,
  sessionID,
  maxQuestions
}:{
  sheetRef: React.RefObject<any>,
  moduleID: string,
  sessionID: string,
  maxQuestions: number
}) => {
  const [quizType, setQuizType] = React.useState<"infinite" | "limitedFixed" | "limitedAllCorrect" | "limitedTime" | "normal">("infinite");
  const [questionType, setQuestionType] = React.useState<"single" | "multiple" | "questionAnswer">("single");
  const [questionAmount, setQuestionAmount] = React.useState<number>(Math.min(10, maxQuestions));
  const [timeLimit, setTimeLimit] = React.useState<number | null>(null); // in seconds
  const { t } = useTranslation();
  return (
    <CustomBottomSheet ref={sheetRef}>
      <View className="p-2 bg-gray-900 min-h-[400px] rounded-2xl">
        
        {/* Header */}
        <Text className="text-white text-xl font-bold mb-4 text-center">
          {t("bibliothek.quizSettings")}
        </Text>

        {/* Quiz Type */}
        <Text className="text-gray-300 mb-2">{ t("bibliothek.quizType")
          }</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {["infinite" , "limitedFixed" , "limitedAllCorrect" , "limitedTime" , "normal"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setQuizType(type as any)}
              className={`px-3 py-2 rounded-xl ${
                quizType === type ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <Text className="text-white capitalize">{type}</Text>
            </Pressable>
          ))}
        </View>

        {/* Question Type */}
        <Text className="text-gray-300 mb-2">{t("bibliothek.questionType")}
        </Text>
        <View className="flex-row gap-2 mb-4">
          {["single","multiple","questionAnswer"].map((type) => (
            <Pressable
              key={type}
              onPress={() => setQuestionType(type as any)}
              className={`flex-1 items-center py-2 rounded-xl ${
                questionType === type ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <Text className="text-white capitalize">{type}</Text>
            </Pressable>
          ))}
        </View>

        {/* Question Amount */}
        <Text className="text-gray-300 mb-2">{t("bibliothek.numQuestions")}

        </Text>
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => setQuestionAmount((prev) => Math.max(1, prev - 1))}
            className="px-3 py-2 bg-gray-800 rounded-xl"
          >
            <Text className="text-white">-</Text>
          </Pressable>
          <Text className="text-white text-lg">{questionAmount}</Text>
          <Pressable
            onPress={() => setQuestionAmount((prev) => Math.min(maxQuestions, prev + 1))}
            className="px-3 py-2 bg-gray-800 rounded-xl"
          >
            <Text className="text-white">+</Text>
          </Pressable>
        </View>

        {/* Time Limit */}
        <Text className="text-gray-300 mb-2"> {t("bibliothek.timeLimit")}
          
        </Text>
        <TextInput
          value={timeLimit?.toString() ?? ""}
          onChangeText={(txt) => setTimeLimit(txt ? parseInt(txt) : null)}
          placeholder="Kein Limit"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          className="bg-gray-800 text-white px-3 py-2 rounded-xl mb-6"
        />

        {/* Start Button */}
        <CustomButton
          title='Quiz starten'
          handlePress={() => router.push({
            pathname:"/quiz",
            params: {
              sessionID: sessionID,
              quizType : quizType,
              questionType : questionType,
              questionAmount : questionAmount,
              timeLimit : timeLimit,
              moduleID: moduleID
            }
          })}
          containerStyles='bg-blue-700 rounded-2xl py-3 rounded-xl border-blue-700'
        />
      </View>
    </CustomBottomSheet>
  )
}

export default StartQuizSheet
