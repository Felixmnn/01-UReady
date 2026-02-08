import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
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
      <View className="bg-gray-800 rounded-2xl p-3 mt-2">
        <Text className="text-white font-bold text-[16px] ml-1">{t("quizResult.resultsTitle")}</Text>
        <View className="flex-row justify-between mt-3">
          <TouchableOpacity
            activeOpacity={0.85}
            className={`flex-1 mr-1 px-4 py-3 rounded-t-2xl flex-row items-center justify-center ${
              displayMode === "wrong_shown" ? "bg-red-900" : "bg-gray-800"
            }`}
            onPress={() => setDisplayMode("wrong_shown")}
          >
            <Icon
              name="close-circle"
              size={20}
              color={displayMode === "wrong_shown" ? "#fecaca" : "#e5e7eb"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold">
              {t("quizResult.wrongAnswers")} {answeredWrong.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className={`flex-1 ml-1 px-4 py-3 rounded-t-2xl flex-row items-center justify-center ${
              displayMode === "right_shown" ? "bg-green-700" : "bg-gray-800"
            }`}
            onPress={() => setDisplayMode("right_shown")}
          >
            <Icon
              name="check-circle"
              size={20}
              color={displayMode === "right_shown" ? "#bbf7d0" : "#e5e7eb"}
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold">
              {t("quizResult.rightAnswers")} {answeredCorrectly.length}
            </Text>
          </TouchableOpacity>
        </View>
        {displayMode === "wrong_shown" && (
          <View className="bg-red-900 rounded-b-2xl rounded-tr-2xl">
            {answeredWrong.map((q, i) => (
              <View
                key={i}
                className="flex-row items-center bg-red-900 p-2"
                style={{
                  borderBottomLeftRadius:
                    i === answeredWrong.length - 1 ? 12 : 0,
                  borderBottomRightRadius:
                    i === answeredWrong.length - 1 ? 12 : 0,
                  borderTopLeftRadius: i === 0 ? 12 : 0,
                  borderTopRightRadius: i === 0 ? 12 : 0,
                }}
              >
                <Icon
                  name="close-circle"
                  size={18}
                  color="#fecaca"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-red-100 flex-1">{q}</Text>
              </View>
            ))}
          </View>
        )}
        {displayMode === "right_shown" && (
          <View className="bg-green-700 rounded-b-2xl rounded-tl-2xl p-1">
            {answeredCorrectly.map((q, i) => (
              <View
                key={i}
                className="flex-row items-center bg-green-700 p-2"
                style={{
                  borderBottomLeftRadius:
                    i === answeredCorrectly.length - 1 ||
                    answeredCorrectly.length == 1
                      ? 12
                      : 0,
                  borderBottomRightRadius:
                    i === answeredCorrectly.length - 1 ||
                    answeredCorrectly.length == 1
                      ? 12
                      : 0,
                  borderTopLeftRadius: i === 0 ? 12 : 0,
                  borderTopRightRadius: i === 0 ? 12 : 0,
                }}
              >
                <Icon
                  name="check-circle"
                  size={18}
                  color="#bbf7d0"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-green-100 flex-1">{q}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }, [displayMode, answeredCorrectly, answeredWrong]);

  return (
    <View className="flex-1 bg-gray-900 p-2">
      {/* Example Gradient */}
   <Image
        source={require("../../assets/Done.gif")}
        style={{
          height: 1,
          width: 1,
        }}/>
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
            activeOpacity={0.85}
            className="bg-gray-800 rounded-2xl flex-1 items-center justify-center mr-1 h-[110px] border border-gray-700"
            onPress={() => {
              if (tryAgain) tryAgain()
              
            }}
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Icon name="refresh" size={28} color="#ffffff" style={{ marginBottom: 6 }} />
            <Text className="text-white font-bold text-[15px]">
              {t("quizResult.newAttempt")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-gray-800 rounded-2xl flex-1 items-center justify-center ml-1 h-[110px] border border-gray-700"
            onPress={() => {
              if (tryAgain) tryAgain();
            }}
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Icon name="shuffle-variant" size={28} color="#ffffff" style={{ marginBottom: 6 }} />
            <Text className="text-white font-bold text-[15px]">
              {t("quizResult.otherQuestions")}
            </Text>
          </TouchableOpacity>
        </View>
        {Results}
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-gray-800 rounded-2xl w-full items-center justify-center mr-1 h-[56px] mt-2 border border-gray-700"
          onPress={() => {
            const expiry = subscriptionStatus?.expiry;
            const now = new Date();
            const isActive =
              !!expiry &&
              new Date(expiry) > now &&
              subscriptionStatus?.status === "active";
            if (showInterstitial && intestialIsLoaded && !isActive) {
              showInterstitial.show();
            }
            if (done) done();
          }}
          style={{
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <View className="flex-row items-center">
            <Icon name="check-decagram" size={22} color="#ffffff" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-[15px]">
              {t("quizResult.finishQuiz")}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default QuizResult;
