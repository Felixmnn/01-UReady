import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import CustomButton from "../(general)/customButton";
import { useTranslation } from "react-i18next";

const QuizResult = ({
  answeredCorrectly,
  answeredWrong,
  tryAgain,
  tryAgainNewQuestions,
  done,
}: {
  answeredCorrectly: string[];
  answeredWrong: string[];
  tryAgain?: () => void;
  tryAgainNewQuestions?: () => void;
  done?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-gray-900 p-2">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Übersicht */}
        <View className="bg-gray-800 rounded-2xl p-2 mb-2 shadow">
          <Text className="text-lg text-white font-semibold mb-2">
            {t("quiz.answeredCorrectly")} {answeredCorrectly.length}
          </Text>
          {answeredCorrectly.map((q, i) => (
            <Text
              key={i}
              className="text-gray-300 ml-1 bg-green-900 p-1"
              style={{
                borderBottomLeftRadius:
                  i === answeredCorrectly.length - 1 ||
                  answeredCorrectly.length == 1
                    ? 10
                    : 0,
                borderBottomRightRadius:
                  i === answeredCorrectly.length - 1 ||
                  answeredCorrectly.length == 1
                    ? 10
                    : 0,
                borderTopLeftRadius: i === 0 ? 10 : 0,
                borderTopRightRadius: i === 0 ? 10 : 0,
              }}
            >
              • {q}
            </Text>
          ))}
        </View>

        <View className="bg-gray-800 rounded-2xl p-2 mb-2 shadow">
          <Text className="text-lg text-white font-semibold mb-2">
            {t("quiz.answeredWrong")} {answeredWrong.length}
          </Text>
          {answeredWrong.map((q, i) => (
            <Text
              key={i}
              className="text-gray-300 ml-1 bg-red-900 p-1"
              style={{
                borderBottomLeftRadius: i === answeredWrong.length - 1 ? 10 : 0,
                borderBottomRightRadius:
                  i === answeredWrong.length - 1 ? 10 : 0,
                borderTopLeftRadius: i === 0 ? 10 : 0,
                borderTopRightRadius: i === 0 ? 10 : 0,
              }}
            >
              • {q}
            </Text>
          ))}
        </View>

        <CustomButton
          title={t("quiz.againNewQuestions")}
          handlePress={() => {
            if (tryAgainNewQuestions) tryAgainNewQuestions();
          }}
          containerStyles="w-full bg-gray-800 rounded-lg mb-2 border-[1px] border-gray-800"
        />
        <CustomButton
          title={t("quiz.againSameQuestions")}
          handlePress={() => {
            if (tryAgain) tryAgain();
          }}
          containerStyles="w-full bg-gray-800 rounded-lg mb-2 border-[1px] border-gray-800"
        />
        <CustomButton
          title={t("quiz.finishQuiz")}
          handlePress={() => {
            if (done) done();
          }}
          containerStyles="w-full bg-gray-800 rounded-lg mb-2 border-[1px] border-gray-800"
        />
      </ScrollView>
    </View>
  );
};

export default QuizResult;
