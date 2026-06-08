import { TouchableOpacity, Modal } from "react-native";
import React from "react";
import RobotWihtMessage from "./robotMessage";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";

const SpecificTutorialStep = ({
  isVisible,
  setIsVisible,
  tutorialStep,
  setTutorialStep,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tutorialStep: string;
  setTutorialStep?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const { remainingTutorialSteps, setRemainingTutorialSteps } = useGlobalContext();
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible }
      onRequestClose={() => {
          setIsVisible(false); 
      }}
    >
      <TouchableOpacity
        className="flex-1 justify-center items-center bg-blue-500"
        onPress={() => {
            if (tutorialStep) {
             const filteredRemainingSteps = remainingTutorialSteps.filter(step => step !== tutorialStep);
             setRemainingTutorialSteps(filteredRemainingSteps);
            }
        }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        { tutorialStep === "STUDY_A_SET" && (
            <RobotWihtMessage message={"Zeit etwas zu Lernen clicke auf eine Frage oder das ▶️ Symbol um zu starten."} />
        )}
        
      </TouchableOpacity>
    </Modal>
  );
};

export default SpecificTutorialStep;
