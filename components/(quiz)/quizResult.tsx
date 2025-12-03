import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import CustomButton from "../(general)/customButton";
import { useTranslation } from "react-i18next";
import RobotWihtMessage from "../(tutorials)/robotMessage";
import BotCenter from "../(signUp)/botCenter";
import { useGlobalContext } from "@/context/GlobalProvider";

// Memoized BotCenter component
const MemoizedBotCenter = React.memo(BotCenter);

const QuizResult = ({
  showInterstitial,
  intestialIsLoaded,
  answeredCorrectly,
  answeredWrong,
  tryAgain,
  tryAgainNewQuestions,
  done,
}: {
  showInterstitial: any;
  intestialIsLoaded: boolean;
  answeredCorrectly: string[];
  answeredWrong: string[];
  tryAgain?: () => void;
  tryAgainNewQuestions?: () => void;
  done?: () => void;
}) => {
  const { t } = useTranslation();
  const { subscriptionStatus } = useGlobalContext();
  type DisplayMode = "hidden" | "wrong_shown" | "right_shown";
  const [displayMode, setDisplayMode] = useState<DisplayMode>("hidden");

  // Memoize the results to avoid unnecessary re-renders
  const Results = React.useMemo(() => {
    return (
      <View className="bg-gray-800 rounded-2xl p-2 mt-2">
        <Text className=" text-white font-bold text-[15px] ml-2 ">
          Ergebnisse
        </Text>
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className={`px-4 py-2 rounded-t-2xl ${
              displayMode === "wrong_shown" ? "bg-red-900" : "bg-gray-800"
            }`}
            onPress={() => setDisplayMode("wrong_shown")}
          >
            <Text className="text-white font-semibold">
              Falsche Antworten: {answeredWrong.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-t-2xl ${
              displayMode === "right_shown" ? "bg-green-700" : "bg-gray-800"
            }`}
            onPress={() => setDisplayMode("right_shown")}
          >
            <Text className="text-white font-semibold">
              Richtige Antworten: {answeredCorrectly.length}
            </Text>
          </TouchableOpacity>
        </View>
        {displayMode === "wrong_shown" && (
          <View className="bg-red-900 rounded-b-2xl rounded-tr-2xl">
            {answeredWrong.map((q, i) => (
              <Text
                key={i}
                className="text-gray-300 ml-1 bg-red-900 p-1"
                style={{
                  borderBottomLeftRadius:
                    i === answeredWrong.length - 1 ? 10 : 0,
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
        )}
        {displayMode === "right_shown" && (
          <View className="bg-green-700 rounded-b-2xl rounded-tl-2xl p-2">
            {answeredCorrectly.map((q, i) => (
              <Text
                key={i}
                className="text-gray-300 ml-1 bg-green-700 p-1"
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
        )}
      </View>
    );
  }, [displayMode, answeredCorrectly, answeredWrong]);

  return (
    <View className="flex-1 bg-gray-900 p-2">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Übersicht */}
        <View className="p-4">
          {answeredCorrectly.length === 0 ? (
            <MemoizedBotCenter
              message={t("quizResult.tryAgain")}
              imageSource="Frage"
            />
          ) : answeredCorrectly.length /
              (answeredWrong.length + answeredCorrectly.length) >
            0.8 ? (
            <MemoizedBotCenter
              message={t("quizResult.excellent")}
              imageSource="Done"
            />
          ) : answeredCorrectly.length /
              (answeredWrong.length + answeredCorrectly.length) >
            0.6 ? (
            <MemoizedBotCenter
              message={t("quizResult.goodJob")}
              imageSource="Done"
            />
          ) : answeredCorrectly.length /
              (answeredWrong.length + answeredCorrectly.length) >
            0.4 ? (
            <MemoizedBotCenter
              message={t("quizResult.notBad")}
              imageSource="Frage"
            />
          ) : (
            <MemoizedBotCenter
              message={t("quizResult.tryAgain")}
              imageSource="Frage"
            />
          )}
        </View>
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl flex-1 items-center justify-center mr-1 h-[100px]"
            onPress={() => {
              if (tryAgainNewQuestions) tryAgainNewQuestions();
            }}
          >
            <Text className="text-white font-bold text-[15px] ">
              {t("quizResult.newAttempt")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl flex-1 items-center justify-center ml-1 h-[100px]"
            onPress={() => {
              if (tryAgain) tryAgain();
            }}
          >
            <Text className=" text-white font-bold text-[15px] ">
              {t("quizResult.otherQuestions")}
            </Text>
          </TouchableOpacity>
        </View>
        {Results}
        <TouchableOpacity
          className="bg-gray-800 rounded-2xl w-full items-center justify-center mr-1 h-[50px] mt-2"
          onPress={() => {
            if (showInterstitial && intestialIsLoaded && subscriptionStatus?.status !== "active") {
              showInterstitial.show();
            }
            if (done) done();
          }}
        >
          <Text className=" text-white font-bold text-[15px] ">
            {t("quizResult.finishQuiz")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default QuizResult;

/*
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
*/
