import { View, Text, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";
import CustomBottomSheet from "./customBottomSheet";
import { useTranslation } from "react-i18next";
import { addDocumentJob } from "@/lib/appwriteDaten";
import { useGlobalContext } from "@/context/GlobalProvider";
import { module } from "@/types/appwriteTypes";
import { updateModule } from "@/lib/appwriteEdit";

type AppwriteDocument = {
  $id: string;
  title: string;
  fileType: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
  databucketID: string;
};

type DocumentJobConfig = {
  databucketID: string;
  sessionID: string;
  subjectID: string;

  fileContent?: "TEXT" | "QUESTIONS" | null;
  numberAnswers?: 1 | 2 | 3 | 4 | 5 | null;
  questionType?: "SINGLE" | "MULTIPLE" | null;

  hasPriority?: boolean;
  createdBy?: string;
};

const AddDocumentJobSheet = ({
  sheetRef,
  selectedFile,
  module,
  setModule ,
  setSessions
}: {
  sheetRef: React.RefObject<any>;
  selectedFile: AppwriteDocument | null;
    module: module;
    setModule: React.Dispatch<React.SetStateAction<module | null>>;
    setSessions: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { t } = useTranslation();
  const { userUsage , setUserUsage, user} = useGlobalContext();

  const [fileContent, setFileContent] =
    useState<"text" | "fragen" | null>(null);
  const [answerCount, setAnswerCount] = useState<number>(4);
  const [choiceType, setChoiceType] = useState<"single" | "multiple">("single");
  const [priority, setPriority] = useState<boolean>(false);

  // -----------------------------------------
  // 🔥 Energie-Berechnung
  // -----------------------------------------
  const energyCost = (() => {
    if (!fileContent) return 0;
    const base = fileContent === "text" ? 10 : 5;
    return priority ? base * 2 : base;
  })();

  const hasEnoughEnergy = userUsage?.energy >= energyCost;

 async function updateModuleSession() {
    console.log("Module before update:", module);

    try {
        const newSessions = module.sessions.map((session: any) => {
            // Session ist ein STRING → muss geparst werden
            if (typeof session === "string") {
                const parsed = JSON.parse(session);

                if (parsed.id === selectedFile?.sessionID) {
                    parsed.tags = [...(parsed.tags ?? []), "JOB-PENDING"];
                }

                return JSON.stringify(parsed);
            }

            // Session ist ein Objekt
            if (session.id === selectedFile?.sessionID) {
                return {
                    ...session,
                    tags: [...(session.tags ?? []), "JOB-PENDING"]
                };
            }

            return session; // unverändert zurückgeben
        });
        
        console.log("😩New Session lenthgth:", newSessions.length);
        console.log("🫡New Sessions:", module.sessions.length);
        // Modul aktualisieren
        const updatedModule = {
            ...module,
            sessions: newSessions
        };


        console.log("Module after update:", updatedModule);

        const res = await updateModule(updatedModule);
        if (res) {
          setModule(res as any as module);
          setSessions(res.sessions.map((session: string) => JSON.parse(session)));
        }
        
        console.log("Module updated with JOB-PENDING tag", res);

    } catch (error) {
        console.error("Error updating module session:", error);
    }
}



  return (
    <CustomBottomSheet ref={sheetRef}>
      <View className="flex-1 p-4">
        {/* Title */}
        <Text className="text-xl font-bold text-slate-100 mb-2">
          {t("document.selectedDocument")}
        </Text>

        {/* Name */}
        <Text className="text-slate-200 mb-3 text-lg font-semibold ml-1">
          {selectedFile?.title}
        </Text>

        {/* File content */}
        <Text className="text-lg font-bold text-slate-100 mb-2">
          {t("document.fileContent")}
        </Text>

        {/* Type selection */}
        <View className="flex-row w-full mb-4">
          <TouchableOpacity
            onPress={() => setFileContent("text")}
            className={`flex-1 p-3 mr-2 rounded-xl ${
              fileContent === "text"
                ? "bg-blue-600"
                : "bg-[#161B22] border border-[#30363D]"
            }`}
          >
            <Text className="text-slate-100 font-semibold text-center">
              {t("document.typeText")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFileContent("fragen")}
            className={`flex-1 p-3 rounded-xl ${
              fileContent === "fragen"
                ? "bg-blue-600"
                : "bg-[#161B22] border border-[#30363D]"
            }`}
          >
            <Text className="text-slate-100 font-semibold text-center">
              {t("document.typeQuestions")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quiz Settings */}
        {fileContent && (
          <View className="w-full">
            {/* Quiz Settings Title */}
            <Text className="text-lg font-bold text-slate-100 mb-3">
              {t("document.quizSettings")}
            </Text>

            {/* Answer Count */}
            <Text className="text-slate-300 font-semibold mb-1">
              {t("document.answerCount")}
            </Text>

            <View className="flex-row mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setAnswerCount(n)}
                  className={`flex-1 p-2 mx-1 rounded-lg ${
                    answerCount === n
                      ? "bg-blue-600"
                      : "bg-[#161B22] border border-[#30363D]"
                  }`}
                >
                  <Text className="text-center text-slate-100 font-bold">{n}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Choice Type */}
            <Text className="text-slate-300 font-semibold mb-1">
              {t("document.choiceType")}
            </Text>

            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => setChoiceType("single")}
                className={`flex-1 p-3 mr-2 rounded-xl ${
                  choiceType === "single"
                    ? "bg-blue-600"
                    : "bg-[#161B22] border border-[#30363D]"
                }`}
              >
                <Text className="text-center text-slate-100 font-semibold">
                  {t("document.singleChoice")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setChoiceType("multiple")}
                className={`flex-1 p-3 rounded-xl ${
                  choiceType === "multiple"
                    ? "bg-blue-600"
                    : "bg-[#161B22] border border-[#30363D]"
                }`}
              >
                <Text className="text-center text-slate-100 font-semibold">
                  {t("document.multipleChoice")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Priority Toggle */}
            <View className="w-full mb-6 bg-[#161B22] border border-[#30363D] rounded-xl p-4">
              <View className="flex-row justify-between items-center">
                <View className="w-3/4">
                  <Text className="text-slate-100 font-semibold text-lg">
                    {t("document.priorityTitle")}
                  </Text>
                  <Text className="text-slate-400 text-sm mt-1">
                    {t("document.priorityDescription")}
                  </Text>
                </View>

                <Switch
                  value={priority}
                  onValueChange={setPriority}
                  trackColor={{ false: "#6B7280", true: "#3B82F6" }}
                  thumbColor={priority ? "#FBBF24" : "#E5E7EB"}
                />
              </View>

              {/* Price Display */}
              <View className="mt-3 flex-row justify-between items-center">
                <Text className="text-slate-300 text-sm">
                  {t("document.energyCost")}: {energyCost} ⚡
                </Text>

                <Text className="text-slate-300 text-sm">
                  {t("document.remaining")}: {userUsage?.energy ?? 0} ⚡
                </Text>
              </View>

              {!hasEnoughEnergy && (
                <Text className="text-red-500 text-sm mt-2 font-semibold">
                  {t("document.notEnoughEnergy")}
                </Text>
              )}
            </View>

            {/* Convert Button */}
            <TouchableOpacity
              disabled={!hasEnoughEnergy}
              onPress={async () => {
                if (!hasEnoughEnergy) return;

                const jobConfig: DocumentJobConfig = {
                    databucketID: selectedFile?.databucketID || "",
                    sessionID: selectedFile?.sessionID || "",
                    subjectID: selectedFile?.subjectID || "",
                    numberAnswers: answerCount as 1 | 2 | 3 | 4 | 5,
                    questionType:
                    choiceType === "multiple" ? "MULTIPLE" : "SINGLE",
                    hasPriority: priority,
                    fileContent: fileContent === "text" ? "TEXT" : "QUESTIONS",
                    createdBy: user?.$id || "",
                };

                console.log("Adding job:", jobConfig);
                const res = await addDocumentJob(jobConfig);
                console.log("Job added:", res);
                setUserUsage((prev: any) => prev ? { ...prev, energy: prev.energy - energyCost } : prev);
                await updateModuleSession();
                sheetRef.current?.closeSheet()();
              }}
              className={`w-full rounded-xl p-3 justify-center items-center 
                ${
                  !hasEnoughEnergy
                    ? "bg-gray-700 opacity-50"
                    : priority
                    ? "bg-[#FBBF24]"
                    : "bg-blue-600"
                }
              `}
            >
              <Text
                className={`font-bold ${
                  !hasEnoughEnergy
                    ? "text-gray-300"
                    : priority
                    ? "text-black"
                    : "text-slate-100"
                }`}
              >
                {priority
                  ? t("document.convertPriority")
                  : fileContent === "text"
                  ? t("document.convertTextQuiz")
                  : t("document.convertQuestionsQuiz")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete */}
        <TouchableOpacity
          className="w-full bg-red-700 rounded-xl p-3 justify-center items-center mt-6 shadow-md shadow-red-900/40"
          onPress={() => console.log("Delete Document")}
        >
          <Text className="text-slate-100 font-bold">{t("document.delete")}</Text>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
};

export default AddDocumentJobSheet;
