import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MaterialInput from "@/components/(getting-started)/aiComponents/materialInput";
import QuestionSettings from "@/components/(getting-started)/aiComponents/questionSettings";
import RenderMaterial from "@/components/(getting-started)/aiComponents/renderMaterial";
import CustomBottomSheet from "./customBottomSheet";
import { uuid } from "expo-modules-core";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/(general)/customButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { addNewQuestionToModule } from "@/functions/(aiQuestions)/materialToModule";

type Items = {
  type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
  content: string;
  uri: string | null;
  sessionID: string;
  id: string | null;
}[];

const NewAiQuestionsSheet = ({
  sessions,
  setSessions,
  sheetRef,
  selectedSession,
  module,
  questions,
  setQuestions,
}: {
  sessions: any[];
  setSessions: React.Dispatch<React.SetStateAction<any[]>>;
  sheetRef: React.RefObject<any>;
  selectedSession: {
    id: string;
    title: string;
    description: string;
    moduleID: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  module: any;
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [moreOptions, setMoreOptions] = React.useState(false);
  const { t } = useTranslation();
  const { userUsage } = useGlobalContext();
  const [items, setItems] = useState<Items>([]);
  const [loading, setLoading] = useState(false);

  const [newitem, setNewItem] = useState<{
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string;
    id: string | null;
  }>({
    type: "PEN",
    content: "",
    uri: null,
    sessionID: selectedSession?.id ?? "", // Default to first session id or empty string
    id: null,
  });
  const handleDeleteItem = (itemId: string | null) => {
    if (itemId === null) return;
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };
  const [selectedMaterialType, setSelectedMaterialType] = useState<
    "PEN" | "TOPIC" | "FILE" | "QUESTION"
  >("PEN");
  const [questionOptions, setQuestionOptions] = useState<{
    questionsType: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "TEXT";
    amountOfAnswers: number;
  }>({
    questionsType: "MULTIPLE_CHOICE",
    amountOfAnswers: 4,
  });
  function calculateTotalPrice() {
    let totalPrice = 0;
    items.forEach((item) => {
      if (item.type === "PEN") {
        totalPrice += 1;
      } else if (item.type === "TOPIC") {
        totalPrice += 1;
      } else if (item.type === "FILE") {
        totalPrice += 3;
      } else {
        totalPrice += 1;
      }
    });
    return totalPrice;
  }

  const addItem = () => {
    if (!selectedSession) return;
    setItems([
      ...items,
      {
        ...newitem,
        id: uuid.v4(),
        sessionID: selectedSession.id,
        type: newitem.type as "PEN" | "TOPIC" | "FILE" | "QUESTION",
      },
    ]);
    setNewItem({ ...newitem, content: "", sessionID: selectedSession.id });
  };

  return (
    <CustomBottomSheet ref={sheetRef}>
      <View className=" m-2">
        <MaterialInput
          addItem={addItem}
          selectedMaterialType={selectedMaterialType}
          setSelectedMaterialType={setSelectedMaterialType}
          newitem={newitem}
          setNewItem={setNewItem}
          items={items}
          handleDeleteItem={handleDeleteItem}
          selectedSession={
            selectedSession
              ? {
                  id: selectedSession.id,
                  title: selectedSession.title,
                  description: selectedSession.description,
                  moduleID: null,
                  createdAt: "",
                  updatedAt: "",
                }
              : null
          }
          handleFileUpload={async () => {}} // Provide a stub or your actual handler
          fileList={[]} // Provide your actual file list if available
          setItems={setItems} // Pass the setItems state setter
        />

        {moreOptions && (
          <QuestionSettings
            questionOptions={questionOptions}
            setQuestionOptions={setQuestionOptions}
          />
        )}

        <TouchableOpacity>
          <Text
            className="text-gray-400 font-semibold text-[15px] mb-2"
            onPress={() => setMoreOptions(!moreOptions)}
          >
            {moreOptions
              ? t("createModule.lessOptions")
              : t("createModule.moreOptions")}
          </Text>
        </TouchableOpacity>

        <RenderMaterial
          items={items}
          selectedSession={
            selectedSession
              ? {
                  ...selectedSession,
                  percent: 0,
                  color: "",
                  iconName: "",
                  questions: 0, // Changed to a number to match expected type
                  tags: [], // Add default value for tags
                  generating: false, // Add default value for generating
                }
              : null
          }
          setNewItem={setNewItem}
          newitem={newitem}
        />

        <CustomButton
          containerStyles="w-full rounded-lg   bg-blue-700 mb-2"
          title={
            userUsage.energy > calculateTotalPrice()
              ? "Fragen für " + calculateTotalPrice() + "⚡ generieren"
              : "Nicht genug Energie (⚡)"
          }
          handlePress={async () => {
            await addNewQuestionToModule({
              material: items,
              module: module,
              questions: questions,
              setQuestions: setQuestions,
              setLoading: setLoading,
              sessions: sessions,
              setSessions: setSessions,
              selectedSession: selectedSession,
            });
            sheetRef.current?.close();
          }}
          disabled={
            items.length < 1 ||
            loading ||
            userUsage.energy < calculateTotalPrice()
          }
        />
      </View>
    </CustomBottomSheet>
  );
};

export default NewAiQuestionsSheet;
