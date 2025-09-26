import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { tryBack } from "@/functions/(quiz)/helper";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Navigation = ({
  quizType,
  timeLimit,
  startTime,
  questionStates,
  amountOfAnsweredQuestions,
  totalAmountOfQuestions,
  remainingPercent,
  setRemainingPercent,
  setPercent  
}: {
  quizType: "infinite" | "limitedFixed" | "limitedAllCorrect" | "limitedTime" ;
  timeLimit?: number;
  startTime?: string;
  questionStates: { status: "BAD" | "OK" | "GOOD" | "GREAT" , id: string }[];
  amountOfAnsweredQuestions: number;
  totalAmountOfQuestions: number;
  remainingPercent: number;
  setRemainingPercent: React.Dispatch<React.SetStateAction<number>>;
  setPercent: React.Dispatch<React.SetStateAction<number>>;

}) => {
  const { t } = useTranslation();
  //Function that returns the percentage of each status
  const questionSegmentation = ({ questionList }: { questionList: any[] }) => {
    let bad = 0;
    let ok = 0;
    let good = 0;
    let great = 0;
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].status == "BAD") {
        bad++;
      } else if (questionList[i].status == "OK") {
        ok++;
      } else if (questionList[i].status == "GOOD") {
        good++;
      } else if (questionList[i].status == "GREAT") {
        great++;
      }
    }
    bad = Math.round((bad / questionList.length) * 100);
    ok = Math.round((ok / questionList.length) * 100);
    good = Math.round((good / questionList.length) * 100);
    great = Math.round((great / questionList.length) * 100);

    return [bad, ok, good, great];
  };

  useEffect(() => {
    if (quizType !== "limitedTime") return;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const safeTimeLimit = timeLimit ?? 0;
      const remaining = Math.max(0, safeTimeLimit - elapsed);
      const progress =
        safeTimeLimit > 0 ? (remaining / safeTimeLimit) * 100 : 0;
      setPercent(progress);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 100); // alle 100ms updaten

    // Cleanup bei Unmount, verhindert Memory Leaks
    return () => clearInterval(interval);
  }, [timeLimit, startTime]);


  const done = 
    (quizType == "limitedTime" && remainingPercent <= 0) || 
    (quizType == "limitedTime" &&  amountOfAnsweredQuestions ==  0) ||
    ( quizType == "limitedFixed" && amountOfAnsweredQuestions == 0) ||
    ( quizType == "limitedAllCorrect" && questionStates.every(q => q.status === "GREAT" || q.status === "GOOD"))

  return (
    <View className="bg-gray-900 items-center justify-between p-4 rounded-t-[10px]">
      <View className="flex-row items-center justify-between w-full">

        <View className="flex-row items-center justify-between w-full">
          <TouchableOpacity className="items-center justify-center" onPress={() => tryBack(router)}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          {
            !done && (quizType == "limitedFixed" || quizType == "limitedAllCorrect") && (
              <Text className="text-white font-bold">
                {amountOfAnsweredQuestions}/{totalAmountOfQuestions} {t("quiz.remaining")}
              </Text>            
            )
          }
          <View/>
          </View>
      </View>


      {
      done ? (
        <Text className="text-2xl font-bold text-gray-300 text-center">
          {t("quiz.results")}
        </Text>
      ) : quizType == "infinite" ? (

        <View className="rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionStates })[0]}%`,
            }}
            className="h-[5px] bg-red-700 rounded-l-full"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionStates })[1]}%`,
            }}
            className="h-[5px] bg-yellow-500"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionStates })[2]}%`,
            }}
            className="h-[5px] bg-green-500"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionStates })[3]}%`,
            }}
            className="h-[5px] bg-blue-500 rounded-r-full"
          />
        </View>

        ) : quizType == "limitedTime" ? (
          <View className="rounded-full justify-start h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
            <View
                key={remainingPercent}
                style={{ width: `${remainingPercent}%` }} // <-- Das ist entscheidend!
                className="h-[5px] bg-blue-500 rounded-full"
            />
          </View>
      ) : (
        <View className="rounded-full justify-start h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
          <View
          key={amountOfAnsweredQuestions}
style={{ width: `${100 - Math.floor((amountOfAnsweredQuestions/totalAmountOfQuestions)*100)}%` }}            className="h-[5px] bg-blue-500 rounded-full"
          />
         
        </View>
      )  
    }
    </View>
  );
};

export default Navigation;
