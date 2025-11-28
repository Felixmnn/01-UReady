import { View, Text, TouchableOpacity, TextInput, Image, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome5";
import ToggleSwitch from "@/components/(general)/toggleSwich";
import { addQUestion, updateDocument } from "@/lib/appwriteEdit";
import { module, question } from "@/types/appwriteTypes";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/(general)/customButton";
import KaTeXExample from "@/components/(home)/katext";
import ContentInput from "./newQuestionContentInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import Offline from "@/components/(general)/offline";

const ChangeQuestions = ({
  question,
  questions,
  setQuestions,
  module,
  setModule,
  selectedSession,
  isVisibleEditQuestion,
  setIsVisibleEditQuestion,
}: {
  question: question;
  questions: question[];
  setQuestions: React.Dispatch<React.SetStateAction<question[]>>;
  module: module;
  setModule: React.Dispatch<React.SetStateAction<module>>;
  selectedSession: { id: string; title: string };
  isVisibleEditQuestion: { state: boolean; status: "ADD" | "EDIT" };
  setIsVisibleEditQuestion: React.Dispatch<
    React.SetStateAction<{ state: boolean; status: "ADD" | "EDIT" }>
  >;
}) => {
  const { t } = useTranslation();
  const { isOffline } = useGlobalContext();
  const [questionToEdit, setQuestionToEdit] = useState({
    ...question,
    answers: question.answers.map((a) => {
      try {
        const parsed = JSON.parse(a);
        if (parsed.title !== undefined) {
          return parsed;
        }
      } catch (error) {}
      return {
        title: a,
        latex: null,
        image: null,
      };
    }),
  });

  useEffect(() => {
  setQuestionToEdit({
    ...question,
    answers: question.answers.map((a) => {
      try {
        const parsed = JSON.parse(a);
        if (parsed.title !== undefined) {
          return parsed;
        }
      } catch (error) {}
      return {
        title: a,
        latex: null,
        image: null,
      };
    }),
  });
}, [question]);

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [ moreOptionsVisible, setMoreOptionsVisible ] = useState(false);

  const snapPoints = ["40%", "60%", "90%"];

  function validateNewQuestion() {
    if (questionToEdit.question === "") {
      alert("Bitte eine Frage eingeben.");
      return false;
    }
    if (questionToEdit.answers.length === 0) {
      alert("Bitte mindestens eine Antwort hinzufügen.");
      return false;
    }
    const hasCorrectAnswer = questionToEdit.answerIndex.length > 0;
    if (!hasCorrectAnswer) {
      alert("Bitte mindestens eine Antwort als richtig markieren.");
      return false;
    }
    return true;
  }
  useEffect(() => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  }, [isVisibleEditQuestion]);


  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => {
        setIsOpen(false);
      }}
      backgroundStyle={{ backgroundColor: "#1F2937" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          backgroundColor: "#111418ff",
          paddingBottom: 40,
        }}
        style={{ backgroundColor: "#111418ff" }}
        className={"bg-gray-900 "}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 h-full items-center justify-center p-4">
          <View className="flex-row items-center justify-between w-full mb-4">
            <CustomButton
              containerStyles="w-full bg-blue-500 rounded-full px-3 py-1"
              title={t("editQuestion.save")}
              handlePress={async () => {
                if (validateNewQuestion()) {
                  //Modul Conifg
                  //Question Locally
                  //Question In Database
                  if (questionToEdit?.$id === undefined) {
                    const res = await addQUestion({
                      ...questionToEdit,
                      answers: questionToEdit.answers.map((a) =>
                        JSON.stringify(a)
                      ),
                      subjectID: module.$id !== undefined ? module.$id : null,
                      sessionID: selectedSession.id,
                    });
                    if (res && typeof res === "object" && "$id" in res) {
                      console.log("👩‍🚒👩‍🚒👩‍🚒👩‍🚒")
                      console.log("Questions ", questions)
                      const newQuestions = [...questions, res as unknown as question];
                      setQuestions(newQuestions);
                    }
                    setModule({
                      ...module,
                      questionList: [
                        ...module.questionList,
                        JSON.stringify({id:res && res.$id ? res.$id : "",status:null})
                      ],
                    });
                    
                    setQuestionToEdit({
                      $id: undefined,
                      question: "",
                      questionUrl: "",
                      questionLatex: "",
                      questionSVG: "",
                      answers: [],
                      answerIndex: [],
                      public: false,
                      aiGenerated: false,
                      status: "",
                      tags: [],
                      sessionID: selectedSession.id,
                      subjectID: module.$id !== undefined ? module.$id : null,
                      explaination: "",
                      hint: null,
                    });
                    
                  } else {
                    const res = await updateDocument({
                      ...questionToEdit,
                      answers: questionToEdit.answers.map((a) =>
                        JSON.stringify(a)
                      ),
                    });
                    const updatedQuestions = questions.map((q) => {
                      if (q.$id === questionToEdit.$id) {
                        return {
                          ...questionToEdit,
                          answers: questionToEdit.answers.map((a) =>
                            JSON.stringify(a)
                          ),
                          question: questionToEdit.question,
                          questionUrl: questionToEdit.questionUrl,
                          questionLatex: questionToEdit.questionLatex,
                        };
                      }
                      return q;
                    });
                    const newQuestions = [...questions,res as unknown as question];
                    setQuestions(updatedQuestions);
                  
                  }

                  setIsVisibleEditQuestion({
                    state: false,
                    status: isVisibleEditQuestion.status,
                  });
                }
              }}
              />
          </View>
          <View className="w-full mb-4">
            <Text className="text-white text-[17px] font-semibold">
              {t("editQuestion.editQuestion")}
            </Text>
            <ContentInput
              typeOfQuestion={true}
              title={questionToEdit.question}
              dataTmp={
                questionToEdit.questionLatex == null ||
                questionToEdit.questionLatex.length == 0
                  ? questionToEdit.questionUrl == null ||
                    questionToEdit.questionUrl.length == 0
                    ? "text"
                    : "image"
                  : "latex"
              }
              latexTmp={questionToEdit.questionLatex ?? ""}
              imageTmp={questionToEdit.questionUrl ?? ""}
              correctAnswerTmp={false}
              questionToEdit={questionToEdit}
              setQuestionToEdit={setQuestionToEdit}
            />
          </View>
          <View className="w-full h-[2px] bg-gray-900" />
          <View className="w-full mb-4">
            <Text className="text-white text-[16px] font-semibold mb-2">
              {t("editQuestion.answers")}
            </Text>
            {questionToEdit.answers.map((q, index) => (
              <ContentInput
                key={index}
                title={q.title}
                dataTmp={
                  q.latex == null || q.latex.length == 0
                    ? q.image == null || q.image.length == 0
                      ? "text"
                      : "image"
                    : "latex"
                }
                latexTmp={q.latex}
                imageTmp={q.image}
                correctAnswerTmp={questionToEdit.answerIndex.includes(index)}
                questionToEdit={questionToEdit}
                setQuestionToEdit={setQuestionToEdit}
                typeOfQuestion={false}
                itemIndex={index}
              />
            ))}
            <TouchableOpacity
              onPress={() => {
                const newAnswer = {
                  title: "",
                  latex: "",
                  image: "",
                };
                setQuestionToEdit({
                  ...questionToEdit,
                  answers:
                    questionToEdit.answers.length > 0
                      ? [...questionToEdit.answers, newAnswer]
                      : [newAnswer],
                });
              }}
              className="w-full bg-gray-800 rounded-lg p-2 items-center mt-2"
            >
              <Text className="text-white text-[15px] font-semibold">
                {t("editQuestion.addNewAnswer")}
              </Text>
            </TouchableOpacity>
            { moreOptionsVisible &&
            <View className="p-2">
              <Text className="text-white text-[14px] mt-2">
                {t("editQuestion.headerExplanation")}
              </Text>
              <TextInput
                className="w-full text-white bg-gray-900 rounded-lg p-2 mt-2 border-blue-500 border-[1px] ml-2"
                placeholder={t("editQuestion.enterAExplanaition")}
                value={questionToEdit.explaination ?? ""}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                style={{ minHeight: 40, maxHeight: 40, textAlignVertical: "top" }}
                onChangeText={(text) => setQuestionToEdit({ ...questionToEdit, explaination: text })}
              />
              <Text className="text-white text-[14px] mt-2">
                {t("editQuestion.headerHint")}
              </Text>
              <TextInput  
                className="w-full text-white bg-gray-900 rounded-lg p-2 mt-2 border-blue-500 border-[1px] ml-2"
                placeholder={t("editQuestion.enterAHint")}
                value={questionToEdit.hint ?? ""}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                style={{ minHeight: 40, maxHeight: 40, textAlignVertical: "top" }}
                onChangeText={(text) => setQuestionToEdit({ ...questionToEdit, hint: text })}
              />
            </View>
            }
            <TouchableOpacity
              onPress={() => setMoreOptionsVisible(!moreOptionsVisible)}
              className="w-full rounded-lg p-2 items-center mt-2"
            >
              <Text className="text-white text-[12px] font-semibold">
                { moreOptionsVisible ? t("editQuestion.showLessOptions") : t("editQuestion.showMoreOptions") }
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ChangeQuestions;
