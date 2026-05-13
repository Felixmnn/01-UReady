import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomBottomSheet from "./customBottomSheet";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";
import { module, question } from "@/types/appwriteTypes";
import { addNewQuestionToModule } from "@/functions/(aiQuestions)/materialToModule";
import { uuid } from "expo-modules-core";
import { Session } from "@/types/moduleTypes";

type AppwriteDocument = {
  $id: string;
  title: string;
  fileType: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
  databucketID: string;
  status: string;
  textChunks?: string[];  
};

const AddDocumentJobSheet = ({
  sheetRef,
  selectedFile,
  module,
  sessionID,
  setModule ,
  setSessions,
  questions,
  setQuestions,
  selectedSession,
}: {
  sheetRef: React.RefObject<any>;
  selectedFile: AppwriteDocument | null;
    module: module;
    sessionID: string;  
    setModule: React.Dispatch<React.SetStateAction<module | null>>;
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    questions: question[];
    setQuestions: React.Dispatch<React.SetStateAction<question[]>>;
  selectedSession: {
    id: string;
    title: string;
    description: string;
    moduleID: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;   
}) => {
  const { t } = useTranslation();
  const { userUsage} = useGlobalContext();

  const [fileContent, setFileContent] =useState<"text" | "fragen" | null>(null);


  // -----------------------------------------
  // 🔥 Energie-Berechnung
  // -----------------------------------------
  const energyCost = (() => {
    if (selectedFile?.textChunks) {
      let costPerChunk = 1; // Standardkosten pro Chunk
      if (fileContent === "fragen") {
        costPerChunk = 1; // Kosten pro Chunk, wenn Fragen generiert werden
      } else {
        costPerChunk = 1; // Kosten pro Chunk, wenn nur Text verarbeitet wird
      }
      const totalCost = selectedFile.textChunks.length * costPerChunk;
    return totalCost;
    }
    return 0;
  })();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalDuration =
    selectedFile?.textChunks?.length
      ? selectedFile.textChunks.length * 20 * 1000 // ms
      : 0;
  const startProgress = () => {
  setProgress(0);
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const value = Math.min(elapsed / totalDuration, 1);
    setProgress(value);

    if (value >= 1) {
      clearInterval(interval);
    }
  }, 100);

  return interval;
};




return (
  <CustomBottomSheet ref={sheetRef}>
    <View className="flex-1 p-5 bg-gray-900">

      {/* Header */}
      <Text className="text-2xl font-bold text-white mb-1">
        {t("document.selectedDocument")}
      </Text>
      <Text className="text-gray-400 text-sm mb-4">
        Wähle aus, wie das Dokument verarbeitet werden soll
      </Text>

      {/* Dokument */}
      <View className="bg-gray-800 rounded-2xl p-4 mb-6 border border-gray-700">
        <Text className="text-gray-400 text-xs mb-1">
          {t("document.name")}
        </Text>
        <Text className="text-white text-lg font-semibold">
          {selectedFile?.title}
        </Text>
      </View>

      {/* Auswahl */}
      <View className="mb-6">
        <Text className="text-white font-semibold mb-3">
          {t("document.fileContent")}
        </Text>

        <View className="flex-row gap-3">
          {/* Text */}
          <TouchableOpacity
            onPress={() => setFileContent("text")}
            className={`flex-1 rounded-xl p-4 mr-1 border ${
              fileContent === "text"
                ? "bg-blue-600 border-blue-500"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <Text className="text-white font-semibold mb-1">
              {t("document.typeText")}
            </Text>
            <Text className="text-gray-300 text-xs">
              Fragen auf Basis eines Textes erstellen
            </Text>
          </TouchableOpacity>

          {/* Fragen */}
          <TouchableOpacity
            onPress={() => setFileContent("fragen")}
            className={`flex-1 rounded-xl p-4 ml-1 border ${
              fileContent === "fragen"
                ? "bg-blue-600 border-blue-500"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <Text className="text-white font-semibold mb-1">
              {t("document.typeQuestions")}
            </Text>
            <Text className="text-gray-300 text-xs">
              Gegebene Fragen umwandeln
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA */}
      {fileContent && (
          <TouchableOpacity
            disabled={loading || userUsage?.energy < energyCost}
            className={`rounded-2xl overflow-hidden ${
              loading || userUsage?.energy < energyCost
                ? "bg-gray-700"
                : "bg-blue-600"
            }`}
            onPress={async () => {
              if (!totalDuration) return;

              setLoading(true);
              const timer = startProgress();

              try {

                if (!selectedFile) return;
                await addNewQuestionToModule({
                  material: selectedFile.textChunks!.map((string) => {
                    return {
                      type: fileContent == "fragen" ? "QUESTION" : "PEN",
                      content: string,
                      uri: null,
                      sessionID: sessionID,
                      id: uuid.v4(),
                    }}),
                  module: module,
                  setModule: setModule,
                  setQuestions: setQuestions,
                  setLoading: ()=> {},
                  setSessions: setSessions,
                  selectedSession: selectedSession,
                });
                
                sheetRef.current?.closeSheet();
              } finally {
                clearInterval(timer);
                setProgress(1);
                setLoading(false);
              }
            }}
          >
            {/* Progress Bar */}
            {loading && (
              <View
                className="absolute left-0 top-0 bottom-0 bg-blue-500"
                style={{ width: `${progress * 100}%` }}
              />
            )}

            {/* Content */}
            <View className="py-4 items-center">
              <Text className="text-white font-semibold text-base">
                {loading
                  ? `Verarbeitung… ${Math.round(progress * 100)}%`
                  : `${t("document.energyCost")} ${energyCost}⚡`}
              </Text>

              {!loading && (
                <Text className="text-white text-xs opacity-80 mt-1">
                  Dauer: ca. {totalDuration / 1000}s
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}

    </View>
  </CustomBottomSheet>
);
};

export default AddDocumentJobSheet;
