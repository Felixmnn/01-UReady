import React from "react";
import { View, Text, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import { getMissingAreaDefaults } from "@/lib/missingAreaDefaults";

type ChecklistStatus = {
  isModuleNameDone: boolean;
  isModuleDescriptionDone: boolean;
  isSessionInfoDone: boolean;
  isQuestionsDone: boolean;
};

const MissingAreaChecklistSection = ({ checklistStatus,setShowRewardToast }: { checklistStatus: ChecklistStatus, setShowRewardToast: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { t } = useTranslation();
  const missingAreaDefaults = getMissingAreaDefaults(t);


  const checklistItems = [
    { id: "name", label: missingAreaDefaults.checklist.name, done: checklistStatus.isModuleNameDone },
    { id: "desc", label: missingAreaDefaults.checklist.description, done: checklistStatus.isModuleDescriptionDone },
    { id: "sessions", label: missingAreaDefaults.checklist.sessions, done: checklistStatus.isSessionInfoDone },
    { id: "questions", label: missingAreaDefaults.checklist.questions, done: checklistStatus.isQuestionsDone },
  ];

    React.useEffect(() => {
        if (checklistItems.every(item => item.done)) {
            setShowRewardToast(true);
        }
    }, [checklistStatus]);

  return (
    <View
      className=" mt-2 mb-4 rounded-2xl p-2"
      style={{
        borderWidth: 2,
        borderColor: "#8b720d",
        backgroundColor: "rgba(250, 204, 21, 0.1)",
      }}
    >
      <View className="ml-2 my-2 flex-row items-center">
        <View className="mr-2 rounded-full bg-amber-400/20">
          <Icon name="tasks" size={20} color="#9CA3AF" />
        </View>
        <Text className=" text-[15px] font-bold" style={{ color: "#9CA3AF" }}>
          {missingAreaDefaults.checklistTitle}
        </Text>
      </View>

      {checklistItems.map((item, index) => (
        <View
          key={item.id}
          className={`flex-row items-center py-2  ${index !== checklistItems.length - 1 ? "border-b border-white" : ""}`}
          style={{ borderColor: "#9CA3AF" }}
        >
          <View
            className={`mr-3 ml-2 h-6 w-6 items-center justify-center rounded-full border-2 ${
              item.done ? "border-white " : "border-gray-400"
            }`}
            style={{
              borderColor: item.done ? "#9CA3AF" : "#9CA3AF",
            }}
          >
            {item.done ? <Icon name="check" size={11} color="#9CA3AF" /> : null}
          </View>

          <Text
            className={`flex-1 text-[14px] ${item.done ? "text-gray-400 line-through" : "text-white"}`}
            style={{
              color: item.done ? "#9CA3AF" : "#FFFFFF",
              textDecorationLine: item.done ? "line-through" : "none",
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MissingAreaChecklistSection;
