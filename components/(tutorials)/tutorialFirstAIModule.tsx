import { Modal, TouchableOpacity } from "react-native";
import React from "react";
import RobotWihtMessage from "./robotMessage";
import { useTranslation } from "react-i18next";

const TutorialFirstAIModule = ({
  isVisible,
  setIsVisible,
  tutorialStep,
  setTutorialStep,
  loading,
  descriptionAndNameFilled,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tutorialStep: number;
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  descriptionAndNameFilled: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible && (tutorialStep < 3 || loading) && tutorialStep < 6}
      onRequestClose={() => {
        if (tutorialStep < 2) {
          setIsVisible(false); 
        }
      }}
    >
      <TouchableOpacity
        className="flex-1 justify-center items-center bg-blue-500"
        onPress={() => setTutorialStep(tutorialStep + 1)}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        {tutorialStep === 0 ? (
          <RobotWihtMessage message={t("tutorialFirstAIModule.createFirstStudySet")} />
        )  : tutorialStep === 1 ? (
          <RobotWihtMessage message={t("tutorialFirstAIModule.startWithNameAndDescription")} />
        ) : tutorialStep === 2 && descriptionAndNameFilled ? (
          <RobotWihtMessage message={t("tutorialFirstAIModule.addMaterialForStudySet")} />
        ) : null}

        {loading && tutorialStep === 3 && (
          <RobotWihtMessage message={t("tutorialFirstAIModule.creatingStudySet")} type="search" />
        )}
        {loading && tutorialStep === 4 && (
          <RobotWihtMessage message={t("tutorialFirstAIModule.funFactOfflineUse")} type="search" />
        )}
        {loading && tutorialStep === 5 && (
          <RobotWihtMessage message={t("tutorialFirstAIModule.publicDiscoverNote")} type="search" />
        )}
      </TouchableOpacity>
    </Modal>
  );
};

export default TutorialFirstAIModule;
