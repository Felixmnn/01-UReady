import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { tryBack } from "@/functions/(quiz)/helper";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Navigation = ({
  deatilsVisible,
  removeQuestion,
  questionsParsed,
  setDetailsVisible,
  percent,
  type,
  timeLimit,
  startTime,
  setQuestionsForQuiz,
}: {
  deatilsVisible: boolean;
  removeQuestion: () => Promise<void>;
  questionsParsed: any[];
  setDetailsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  percent: number;
  type:
    | "infinite"
    | "limitedFixed"
    | "limitedAllCorrect"
    | "limitedTime"
    | "normal";
  timeLimit?: number;
  startTime?: number;
  setQuestionsForQuiz: () => void;
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

  const [remainingPercent, setPercent] = React.useState(100);
  useEffect(() => {
    if (!timeLimit && (type == "limitedFixed" || type == "limitedAllCorrect"))
      return;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const safeTimeLimit = timeLimit ?? 0;
      const remaining = Math.max(0, safeTimeLimit - elapsed);
      const progress =
        safeTimeLimit > 0 ? (remaining / safeTimeLimit) * 100 : 0;
      console.log("Remaining Time:", remaining, "seconds");
      setPercent(progress);

      if (remaining <= 0) {
        clearInterval(interval);
        setQuestionsForQuiz();

        console.log("Zeit abgelaufen");
      }
    }, 100); // alle 100ms updaten

    // Cleanup bei Unmount, verhindert Memory Leaks
    return () => clearInterval(interval);
  }, [timeLimit, startTime]);

  return (
    <View className="bg-gray-900 items-center justify-between p-4 rounded-t-[10px]">
      <View className="flex-row items-center justify-between w-full">
        <View className="flex-row items-center justify-between w-full">
          <TouchableOpacity onPress={() => tryBack(router)}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          {percent == 100 && type != "infinite" ? (
            <View />
          ) : deatilsVisible ? (
            <View className="flex-row items-center gap-2">
              <TouchableOpacity>
                <Icon
                  name="trash-alt"
                  size={15}
                  color="white"
                  onPress={async () => {
                    removeQuestion();
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDetailsVisible(!deatilsVisible)}
              >
                <Icon name="ellipsis-v" size={15} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setDetailsVisible(!deatilsVisible)}
            >
              <Icon name="ellipsis-v" size={15} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {(type == "limitedFixed" || type == "limitedAllCorrect") &&
      remainingPercent > 0 &&
      percent < 100 ? (
        <View className="rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
          <View
            key={remainingPercent}
            style={{ width: `${remainingPercent}%` }} // <-- Das ist entscheidend!
            className="h-[5px] bg-blue-500 rounded-full"
          />
        </View>
      ) : type == "infinite" ? (
        <View className="rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionsParsed })[0]}%`,
            }}
            className="h-[5px] bg-red-700 rounded-l-full"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionsParsed })[1]}%`,
            }}
            className="h-[5px] bg-yellow-500"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionsParsed })[2]}%`,
            }}
            className="h-[5px] bg-green-500"
          />
          <View
            style={{
              width: `${questionSegmentation({ questionList: questionsParsed })[3]}%`,
            }}
            className="h-[5px] bg-blue-500 rounded-r-full"
          />
        </View>
      ) : percent < 100 && type !== "limitedFixed" ? (
        <View className="rounded-full h-[5px] w-full bg-gray-700 mt-4 mb-2 flex-row">
          <View
            style={{ width: `${percent}%` }}
            className="h-[5px] bg-blue-500 rounded-full"
          />
        </View>
      ) : (
        <Text className="text-2xl font-bold text-gray-300 text-center">
          {t("quiz.results")}
        </Text>
      )}
    </View>
  );
};

export default Navigation;
