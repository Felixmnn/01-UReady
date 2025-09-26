import { Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import RobotWihtMessage from "./robotMessage";
import languages from "@/assets/exapleData/languageTabs.json";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTranslation } from "react-i18next";

const TutorialFirstAIModule = ({
  isVisible,
  setIsVisible,
  tutorialStep,
  setTutorialStep,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tutorialStep: number;
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible && tutorialStep < 2}
      onRequestClose={() => {
        setIsVisible(false);
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
          <RobotWihtMessage message={t("tutorialFirstModule.letUsCreate")} />
        )  : null}
      </TouchableOpacity>
    </Modal>
  );
};

export default TutorialFirstAIModule;
