import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { router } from "expo-router";
import { updateModuleQuestionList } from "@/lib/appwriteUpdate";
import { removeQuestionFromMMKV } from "@/lib/mmkvFunctions";
import { returnNewUserUsage } from "@/functions/addLastSessionModule";
import { module, question, UserUsage } from "@/types/appwriteTypes";
import { Session } from "@/types/moduleTypes";
import SmileyStatus from "../../(components)/smileyStatus";

type ParsedQuestion = {
  id?: string;
  status?: string;
  [key: string]: any;
};

type QuestionListSectionProps = {
  t: (key: string) => string;
  moduleSessions: Session[];
  selected: number;
  questions: question[];
  setIsVisibleNewQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  module: module;
  selectedS: string;
  selectedSession: Session | null;
  userUsage: UserUsage;
  setUserUsage: React.Dispatch<React.SetStateAction<any>>;
  setIsVisibleEditQuestion: React.Dispatch<React.SetStateAction<{ state: boolean; status: "ADD" | "EDIT" }>>;
  deleteDocument: (id: string, type?: "question" | "note" | "document") => Promise<void>;
  optionsVisible: string[];
  handleOptionsVisibility: (id?: string) => void;
  setQuestionToEdit: React.Dispatch<React.SetStateAction<any>>;
  setQuestions: React.Dispatch<React.SetStateAction<question[]>>;
  setModule: React.Dispatch<React.SetStateAction<module>>;
};

const CounterText = ({ title, count }: { title: string; count: number }) => {
  return (
    <View className="flex-row justify-start items-center ">
      <Text className="text-white my-2">{title}</Text>
      <Text className="ml-1 text-white text-[12px] px-1 rounded-[5px] bg-gray-700">{count}</Text>
    </View>
  );
};

const AddData = ({
  title,
  subTitle,
  button,
  handlePress,
}: {
  title: string;
  subTitle: string;
  button: string;
  handlePress?: () => void;
}) => {
  return (
    <View className="flex-row p-2 bg-gray-800 rounded-[10px] items-start justify-start border-[1px] border-gray-500 border-dashed">
      <View className="items-center justify-center p-2">
        <Icon name="file" size={25} color="white" />
      </View>
      <View className="ml-2">
        <Text className="text-white">{title}</Text>
        <Text className="text-gray-300 text-[12px]">{subTitle}</Text>
        <TouchableOpacity
          onPress={handlePress}
          className="rounded-full p-2 bg-gray-800 flex-row items-center justify-center border-[1px] border-gray-600 mt-2"
        >
          <Icon name="plus" size={15} color="white" />
          <Text className="ml-2 text-gray-300 text-[12px]">{button}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function calculateQuestionProgress(questionList: string[]): number {
  if (!Array.isArray(questionList) || questionList.length === 0) {
    return 0;
  }

  const parsedQuestions = questionList.map((q) => {
    try {
      return typeof q === "string" ? JSON.parse(q) : q;
    } catch {
      return null;
    }
  });

  const completedQuestions = parsedQuestions.filter(
    (q) => q && q.status && ["BAD", "OK", "GOOD", "GREAT"].includes(q.status)
  );

  const progress = (completedQuestions.length / questionList.length) * 100;
  return Math.round(progress);
}

const QuestionListSection = ({
  t,
  moduleSessions,
  selected,
  questions,
  setIsVisibleNewQuestion,
  module,
  selectedS,
  selectedSession,
  userUsage,
  setUserUsage,
  setIsVisibleEditQuestion,
  deleteDocument,
  optionsVisible,
  handleOptionsVisibility,
  setQuestionToEdit,
  setQuestions,
  setModule,
}: QuestionListSectionProps) => {
  const getSmileyStatus = (id: string) => {
    const parsed = module.questionList.map((i) => {
      try {
        if (typeof i == "string") return JSON.parse(i) as ParsedQuestion;
        return i;
      } catch {
        return { id: undefined, status: null };
      }
    });
    const found = parsed.find((q) => q?.id === id);
    return found?.status ?? null;
  };

  return (
    <View
      className="w-full "
      style={{
        maxHeight: questions.length > 0 ? 250 : 120,
        minHeight: moduleSessions[selected]?.tags?.includes("JOB-PENDING") ? 180 : null,
      }}
    >
      <CounterText title={t("data.questio")} count={questions.length} />
      {questions ? (
        <FlatList
          data={questions}
          keyExtractor={(item, index) => `${item.$id}-${index}`}
          ListHeaderComponent={() => {
            return (
              <View className="h-full p-1  ">
                {moduleSessions[selected]?.tags?.includes("JOB-PENDING") ? (
                  <View
                    className="flex-1  items-center justify-center p-2 bg-gray-800 rounded-[10px] border-[1px] border-gray-500 border-dashed"
                    style={{ height: 150, width: 150 }}
                  >
                    <Image
                      source={require("../../../../assets/bot.png")}
                      tintColor={"#fff"}
                      style={{ height: 50, width: 50 }}
                    />
                    <Text className="text-white text-center">{t("data.pendingAI")}</Text>
                  </View>
                ) : null}
              </View>
            );
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={async () => {
                  const newUserUsager = returnNewUserUsage(userUsage, {
                    sessionID: selectedS,
                    quizType: "infinite",
                    questionType: "multiple",
                    questionAmount: null,
                    timeLimit: null,
                    moduleID: module.$id ? module.$id : "",
                    name: selectedSession ? selectedSession.title : "Session",
                    percent: calculateQuestionProgress(module.questionList),
                    color: selectedSession ? selectedSession.color : "blue",
                    icon: selectedSession ? selectedSession.iconName : "question",
                    questions: questions.length,
                  });
                  setUserUsage(newUserUsager);
                  router.push({
                    pathname: "/quiz",
                    params: {
                      sessionID: selectedS,
                      quizType: "infinite",
                      questionType: "multiple",
                      questionAmount: null,
                      timeLimit: null,
                      moduleID: module.$id,
                      status: JSON.stringify(["BAD", "OK", "GOOD", "GREAT", "NONE"]),
                    },
                  });
                }}
                className="p-4 w-[180px] m-1 justify-between items-center p-4 border-[1px] border-gray-600 rounded-[10px] bg-gray-800"
              >
                <View className="w-full justify-between flex-row items-center ">
                  {["BAD", "OK", "GOOD", "GREAT"].includes(getSmileyStatus(item.$id!) as string) ? (
                    <SmileyStatus
                      status={
                        ["BAD", "OK", "GOOD", "GREAT"].includes(getSmileyStatus(item.$id!) as string)
                          ? (getSmileyStatus(item.$id!) as "BAD" | "OK" | "GOOD" | "GREAT")
                          : null
                      }
                    />
                  ) : null}

                  <Image
                    source={require("../../../../assets/bot.png")}
                    tintColor={"#fff"}
                    style={{ height: 20, width: 20 }}
                  />
                </View>
                <Text className="text-white">
                  {item.question.length > 90 ? item.question.slice(0, 90) + "..." : item.question}{" "}
                </Text>
                <View className="border-b-[1px] border-gray-600 my-4 w-full" />
                <View className="w-full flex-row justify-between items-center">
                  {optionsVisible.includes(item.$id ?? "") ? (
                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        className="p-2 items-center justify-center"
                        onPress={async () => {
                          setIsVisibleEditQuestion({
                            state: false,
                            status: "EDIT",
                          });

                          removeQuestionFromMMKV(item.$id!, module.$id!);
                          if (!module.copy) {
                            if (item.$id) {
                              await deleteDocument(item.$id, "question");
                              handleOptionsVisibility(item.$id);
                            }
                          } else {
                            const updatedList = module.questionList.filter((q) => JSON.parse(q).id !== item.$id);

                            if (!module.$id) {
                              return;
                            }

                            await updateModuleQuestionList(module.$id, updatedList);

                            setQuestions(questions.filter((q) => q.$id !== item.$id));

                            setModule({
                              ...module,
                              questionList: updatedList,
                            });
                          }
                        }}
                      >
                        <Icon name="trash" size={15} color="red" />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View className={` items-end pr-2 ${optionsVisible.includes(item.$id ?? "") ? "w-[50%]" : "w-full"}`}>
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => {
                        handleOptionsVisibility(item.$id);
                        if (item.subjectID == module.$id) {
                          setQuestionToEdit(item);
                          setIsVisibleEditQuestion({
                            state: true,
                            status: "EDIT",
                          });
                        }
                      }}
                    >
                      <Icon name="ellipsis-h" size={15} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          horizontal={true}
        />
      ) : null}
      {questions.length == 0 && !moduleSessions[selected]?.tags?.includes("JOB-PENDING") ? (
        <AddData
          title={t("data.questioH")}
          subTitle={t("data.questioSH")}
          button={t("data.questioBtn")}
          handlePress={() => setIsVisibleNewQuestion(true)}
        />
      ) : null}
    </View>
  );
};

export default QuestionListSection;
