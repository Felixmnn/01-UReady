import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import CustomBottomSheet from './customBottomSheet'
import CustomButton from '@/components/(general)/customButton'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { question } from '@/types/appwriteTypes'

const StartQuizSheet = ({
  sheetRef,
  moduleID,
  sessionID,
  maxQuestions,
  questions,
  questionList
}:{
  sheetRef: React.RefObject<any>,
  moduleID: string,
  sessionID: string,
  maxQuestions: number,
  questions: question[],
  questionList: {id: string; status: string}[]
}) => {
  
  //Changes Here
  const [questionStates, setQuestionStates] = React.useState<("BAD" | "OK" | "GOOD" | "GREAT" | "NONE")[]>(["BAD" , "OK" , "GOOD" , "GREAT", "NONE"]);

  const [quizType, setQuizType] = React.useState<"infinite" | "limitedFixed" | "limitedAllCorrect" | "limitedTime" | "textInput">("infinite");
  const [ explainationVisible, setExplanationVisible ] = React.useState(false); 
  const [questionType, setQuestionType] = React.useState<"single" | "multiple" | "questionAnswer">("multiple");
  const [questionAmount, setQuestionAmount] = React.useState<number>(1);
  const [timeLimit, setTimeLimit] = React.useState<number | null>(60); // in seconds
  const { t } = useTranslation();

  function getStatusOfQuestion (questionID: string) {
    const qStatus = questionList.find(ql => ql.id === questionID)?.status;
    return qStatus == null || qStatus === undefined ? "NONE" : qStatus
  }

  //Changes Here
  function calculateMaximumQuestionAmount () {
    let amount = maxQuestions
    let filteredQuestions = questions
    if (sessionID !== "ALL") {
      if (questionType == "single") {
        filteredQuestions = questions.filter(q => q.sessionID === sessionID && q.answerIndex.length === 1)
      } else {
      filteredQuestions = questions.filter(q => q.sessionID === sessionID)
      }
    } else {
      if (questionType == "single") {
        filteredQuestions = questions.filter(q => q.answerIndex.length === 1) 
      }
    }
    filteredQuestions = filteredQuestions.filter(q => {
      const status = getStatusOfQuestion(q.$id ? q.$id : "")
      return questionStates.includes(status as any)
    })

    amount = filteredQuestions.length

    
    return amount
  }
  return (
    <CustomBottomSheet ref={sheetRef}>
      <View className="p-2 bg-gray-900 min-h-[400px] rounded-2xl">
        
        {/* Header */}
        <Text className="text-white text-xl font-bold mb-4 text-center">
          {t("bibliothek.quizSettings")}
        </Text>

        {/* Quiz Type */}
        <View className='flex-row justify-between items-center'>
          <Text className="text-gray-300 mb-2">{t("bibliothek.quizType")}</Text>
          <TouchableOpacity  className="p-1" onPress={() => setExplanationVisible(!explainationVisible)}>
            <Icon name="question-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {["infinite" , "limitedFixed" , "limitedAllCorrect" , "limitedTime" , "textInput"].map((type) => (
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
          <Text className="text-gray-300 mb-2">{t("bibliothek.questionType")}</Text>
          
        <View className="flex-row gap-2 mb-4">
          {["single","multiple"].map((type) => (
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

        <View>
          <Text className='text-gray-300 mb-2'>
            {t("bibliothek.filterByStatus")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {[
              ["BAD", "frown","bg-red-700"],
              ["OK", "meh","bg-yellow-500"],
              ["GOOD", "smile","bg-green-500"],
              ["GREAT", "grin","bg-blue-500"],
              ["NONE", "ban","bg-gray-500"],
            ].map(([status, icon, color]) => (
              <TouchableOpacity
                key={status}
                onPress={() => {
                  if (questionStates.includes(status as any)) {
                    setQuestionStates(prev => prev.filter(s => s !== status))
                  } else {
                    setQuestionStates(prev => [...prev, status as any])
                  } 
                }}

                className={` ${color} ${questionStates.includes(status as any)? "" : "opacity-30"}  px-2 py-2 rounded-xl flex-row items-center rounded-full items-center justify-center`}
                >

                  <View className={`${color} h-[25px] w-[25px] rounded-full items-center justify-center`}>
                    <Icon name={icon as string} size={16} color="white" />
                  </View>
              </TouchableOpacity>
            
            ))}
        </View>
        </View>

        {/* Question Amount */}
        { quizType !== "infinite" &&
        <View>
          <Text className="text-gray-300 mb-2">{t("bibliothek.numQuestions")}</Text>
          <View className="flex-row items-center justify-between mb-4">
            <Pressable
              onPress={() => setQuestionAmount((prev) => Math.max(1, prev - 1))}
              className="px-3 py-2 bg-gray-800 rounded-xl"
            >
              <Text className="text-white">-</Text>
            </Pressable>
            <Text className="text-white text-lg">{questionAmount}</Text>
            <Pressable
              onPress={() => setQuestionAmount((prev) => Math.min(calculateMaximumQuestionAmount(), prev + 1))}
              className="px-3 py-2 bg-gray-800 rounded-xl"
            >
              <Text className="text-white">+</Text>
            </Pressable>
          </View>
        </View>
        }

        {/* Time Limit */}
        { quizType === "limitedTime" &&
        <View>
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
        </View>
        }

        {/* Start Button */}
        <CustomButton
          title={
            calculateMaximumQuestionAmount() === 0  ?
            t("bibliothek.notEnoughQuestionsToStart") :
            (quizType !== "infinite" && (questionAmount < 1 || questionAmount > maxQuestions)) ?
            t("bibliothek.minMaxQuestions", { min: 1, max: maxQuestions }) :
            (quizType === "limitedTime" && (timeLimit === null || timeLimit < 5)) ?
            t("bibliothek.minTimeLimit", { min: 5 }) :
            t("bibliothek.startQuiz")
          }
          handlePress={() => router.push({
            pathname:"/quiz",
            params: {
              sessionID: sessionID,
              quizType : quizType, 
              questionType : questionType,
              questionAmount : questionAmount,
              timeLimit : timeLimit,
              moduleID: moduleID,
              status: JSON.stringify(questionStates),
            }
          })}
          disabled={(quizType !== "infinite" && (questionAmount < 1 || questionAmount > maxQuestions)) ||
          (quizType === "limitedTime" && (timeLimit === null || timeLimit < 5)) ||
          calculateMaximumQuestionAmount() === 0
           }
          containerStyles='bg-blue-700 rounded-2xl rounded-xl border-blue-700'
          textStyles='text-center'
        />
        {/* Quiz Type Explanation */}
        { explainationVisible &&
        <View className='flex-row justify-start items-center mt-4 px-2'>
          <Icon name="info-circle" size={16} color="#9CA3AF" />
          { quizType === "infinite" && <Text className="text-gray-300 mt-4 ml-2">{t("bibliothek.infiniteExplanation")}</Text>}
          { quizType === "limitedFixed" && <Text className="text-gray-300 mt-4 ml-2">{t("bibliothek.limitedFixedExplanation")}</Text>}
          { quizType === "limitedAllCorrect" && <Text className="text-gray-300 mt-4 ml-2">{t("bibliothek.limitedAllCorrectExplanation")}</Text>}
          { quizType === "limitedTime" && <Text className="text-gray-300 mt-4 ml-2">{t("bibliothek.limitedTimeExplanation")}</Text>}
          { quizType === "textInput" && <Text className="text-gray-300 mt-4 ml-2">{t("bibliothek.textInputExplanation")}</Text>}
        </View>
        }
      </View>
    </CustomBottomSheet>
  )
}

export default StartQuizSheet
