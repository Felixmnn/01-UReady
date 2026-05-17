import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { addQUestion, updateDocument } from "@/lib/appwriteEdit";
import { module, question } from "@/types/appwriteTypes";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/(general)/customButton";
import ContentInput from "./newQuestionContentInput";
import { useGlobalContext } from "@/context/GlobalProvider";
import { updateQuestionInMMKV } from "@/lib/mmkvFunctions";
import Icon from "react-native-vector-icons/FontAwesome5";

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
  const [revision, setRevision] = useState(0);

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
    setRevision((r) => r + 1);

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

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(question.questionUrl);
  useEffect(() => {
    setSelectedImageUri(question.questionUrl);
  }, [question.questionUrl]);

  
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
            
          </View>
          <View className="w-full mb-4">
            <Text className="text-white text-[17px] font-semibold">
              {t("editQuestion.editQuestion")}
            </Text>
            <ContentInput
              key={`q-${revision}`}
              selectedImageUri={selectedImageUri}
              setSelectedImageUri={setSelectedImageUri}
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
           
            {
              questionToEdit.answers.map((q, index) => {
                let objectOutput 
                if (typeof q == "string") {
                  try {
                     objectOutput = JSON.parse(q)
                  } catch (e)  {
                    objectOutput = {
                      latex : "",
                      text : "",
                      imageUrl : ""
                    }
                  }
                } else  {
                  objectOutput = q
                }

                return (
                <ContentInput
                selectedImageUri={objectOutput.image ? objectOutput.image : selectedImageUri}
                setSelectedImageUri={setSelectedImageUri}
                  key={index}
                  title={q.title}
                  dataTmp={
                    q.latex == null || q.latex.length == 0
                      ? q.image == null || q.image.length == 0
                        ? "text"
                        : "image"
                      : "latex"
                  }
                  latexTmp={ objectOutput.latex}
                  imageTmp={objectOutput.image}
                  correctAnswerTmp={questionToEdit.answerIndex.includes(index)}
                  questionToEdit={questionToEdit}
                  setQuestionToEdit={setQuestionToEdit}
                  typeOfQuestion={false}
                  itemIndex={index}
                />
              )})
            }
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
            {moreOptionsVisible &&
            <View className="p-2 gap-3">
              <View className="bg-[#0c111d] border border-blue-900 rounded-xl p-3">
                <View className="flex-row items-center mb-2">
                  <View className="h-7 w-7 rounded-full bg-blue-900/40 items-center justify-center mr-2">
                    <Icon name="info-circle" size={14} color="#60a5fa" />
                  </View>
                  <Text className="text-blue-100 text-[14px] font-semibold">
                    {t("editQuestion.headerExplanation")}
                  </Text>
                </View>
                <TextInput
                  className="w-full text-white bg-gray-900 rounded-lg p-3 border-blue-500 border-[1px]"
                  placeholder={t("editQuestion.enterAExplanaition")}
                  value={questionToEdit.explaination ?? ""}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  style={{ minHeight: 72, maxHeight: 120, textAlignVertical: "top" }}
                  onChangeText={(text) => setQuestionToEdit({ ...questionToEdit, explaination: text })}
                />
              </View>

              <View className="bg-[#0c111d] border border-indigo-900 rounded-xl p-3">
                <View className="flex-row items-center mb-2">
                  <View className="h-7 w-7 rounded-full bg-indigo-900/40 items-center justify-center mr-2">
                    <Icon name="lightbulb" size={14} color="#a5b4fc" />
                  </View>
                  <Text className="text-indigo-100 text-[14px] font-semibold">
                    {t("editQuestion.headerHint")}
                  </Text>
                </View>
                <TextInput
                  className="w-full text-white bg-gray-900 rounded-lg p-3 border-indigo-500 border-[1px]"
                  placeholder={t("editQuestion.enterAHint")}
                  value={questionToEdit.hint ?? ""}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  style={{ minHeight: 72, maxHeight: 120, textAlignVertical: "top" }}
                  onChangeText={(text) => setQuestionToEdit({ ...questionToEdit, hint: text })}
                />
              </View>
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
