import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { use } from "react";
import SmileyStatus from "../(bibliothek)/(components)/smileyStatus";
import Question from "./question";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import CustomButton from "../(general)/customButton";

const Quiz = ({
  questions,
  selectedAnswers,
  setSelectedAnswers,

  showAnsers,
  width,
  changeVisibility,
  nextQuestion,
  correctAnswers,
  setShowSolution,
  sheetRef,
  quizType,
  questionList,
  showHint,
  showExplanation
}: {
  questions: any[];
  selectedAnswers: string[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  showAnsers: boolean;
  width: number;
  changeVisibility: () => void;
  nextQuestion: (status: "GOOD" | "BAD", step: number) => void;
  selectedLanguage: string;
  correctAnswers: () => boolean;
  setShowSolution: React.Dispatch<React.SetStateAction<boolean>>;
  sheetRef: React.RefObject<any>;
  quizType: "single" | "multiple" | "questionAnswer";
  questionList: { id: string; status: string | null }[];  
  showHint: () => void;
  showExplanation: () => void;
}) => {
  const { t } = useTranslation();
  function getSmileyStatus(questionID: string) {
    const question = questions.find((q) => q.$id === questionID);
    return question ? question.status : null;
  }

  const statusIndex = questionList.findIndex((q) => q.id === questions[0].$id);
  const status = questionList[statusIndex]?.status || null; 
  return (
    <View className="flex-1 justify-end">
      <View className="flex-1 rounded-[10px] bg-gray-900 border-gray-600 border-[1px] m-4">
        <View className="w-full justify-between flex-row items-center p-4 ">
          <View className="flex-row items-center">
            {status !== null ? (
              <SmileyStatus
                        status={
                          status as "BAD" | "OK" | "GOOD" | "GREAT" | null
                        }
                      />
            ) : null}
          </View>
          <View className="flex-row items-center">
            {questions[0].aiGenerated ? (
              <Image
                source={require("../../assets/bot.png")}
                tintColor={"#fff"}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            ) : null}
          </View>
        </View>
        <Question
          question={questions[0]}
          selectedAnswers={selectedAnswers}
          setSelectedAnswers={setSelectedAnswers}
          showAnsers={showAnsers}
          width={width}
          quizType={
            quizType == "single" && questions[0].answers.length > 1
              ? "multiple"
              : quizType
          }
        />

        <View className="flex-row items-center justify-center">
          {showAnsers ? (
            <View
              className={`${true ? "justify-start" : "justify-between flex-row"}  items-center w-full bg-gray-800 p-4 rounded-b-[10px] `}
            >
              <View className="w-full justify-start">
                {quizType == "questionAnswer" ? null : correctAnswers() ? (
                  <View className="flex-row items-center gap-2">
                    <Icon name="check-circle" size={20} color={"green"} />
                    <Text className="text-green-500">{t("quiz.right")}</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Icon name="times-circle" size={20} color={"#ff0a14"} />
                    <Text
                      className="text-red-500 font-bold text-[16px]"
                      style={{
                        color: "#ff0a14",
                      }}
                    >
                      {t("quiz.wrong")}
                    </Text>
                  </View>
                )}
              </View>
              <View
                className={`${true ? "w-full mt-2" : ""} justify-start items-center gap-2`}
              >
                {questions[0].explaination?.length > 1 && (
                  <CustomButton
                    title={t("quiz.showExplanation")}
                    handlePress={showExplanation}
                    containerStyles="w-full mr-2 bg-blue-700 rounded-lg"
                  />
                )}
                {quizType != "questionAnswer" ? (
                  <CustomButton
                    title={t("quiz.next")}
                    handlePress={() => {
                      nextQuestion(correctAnswers() ? "GOOD" : "BAD", 1);
                      setSelectedAnswers([]);
                    }}
                    containerStyles="w-full bg-blue-700 rounded-lg"
                  />
                ) : (
                  <View className="w-full flex-row items-center justify-center">
                    {["BAD", "GOOD"].map((status, index) => (
                      <TouchableOpacity
                        key={index}
                        className="flex-1 mx-2 flex-row items-center justify-center"
                        style={{
                          backgroundColor:
                            status == "GOOD" ? "green" : "#ff0a14",
                          padding: 10,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          nextQuestion(status as "GOOD" | "BAD", index + 1);
                          setSelectedAnswers([]);
                        }}
                      >
                        <Text className="text-white font-bold text-[16px] mr-2">
                          {status == "GOOD" ? "Gewusst" : "Nicht gewusst"}
                        </Text>
                        <Icon
                          name={status == "GOOD" ? "thumbs-up" : "thumbs-down"}
                          size={20}
                          color="white"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="w-full p-2 flex-row items-center justify-center ">
              <CustomButton
                title={
                  quizType == "questionAnswer"
                    ? "Antwort anzeigen"
                    : t("quiz.checkAnswer")
                }
                handlePress={changeVisibility}
                containerStyles="flex-1 bg-blue-700 rounded-lg"
              />
              { questions[0].hint?.length > 1 && !showAnsers && (
              <TouchableOpacity className="bg-yellow-500 ml-2 p-2 rounded-lg"
              style={{
                height: 38, 
                width: 38,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={showHint}>
                <Icon name="lightbulb" size={20} color="yellow" />
              </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Quiz;
