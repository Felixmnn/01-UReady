import { TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import RobotWihtMessage from './robotMessage';
import { useTranslation } from 'react-i18next';

const TutorialFirstModule = ({
  isVisible, 
  setIsVisible, 
  tutorialStep, 
  setTutorialStep
}:{
  isVisible: boolean, 
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  tutorialStep: number,
setTutorialStep?: React.Dispatch<React.SetStateAction<number>>    
}) => {
  const { t } = useTranslation();
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible && tutorialStep < 7}
        onRequestClose={() => {
            setIsVisible(false);
        }}>
        <TouchableOpacity className='flex-1 justify-center items-center bg-blue-500'
            onPress={() => setTutorialStep && setTutorialStep(tutorialStep + 1)}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
        {
            tutorialStep === 0 ? <RobotWihtMessage message={t("tutorialFirstModule.letUsCreate")} />
            : tutorialStep === 1 ? <RobotWihtMessage message={t("tutorialFirstModule.firstInfo")} />
            : tutorialStep === 2 ? <RobotWihtMessage message={t("tutorialFirstModule.forExample")} />
            : tutorialStep === 3 ? <RobotWihtMessage message={t("tutorialFirstModule.nextSession")} />
            : tutorialStep === 4 ? <RobotWihtMessage message={t("tutorialFirstModule.aSession")} />
            : tutorialStep === 5 ? <RobotWihtMessage message={t("tutorialFirstModule.thenContent")} />
            : tutorialStep === 6 ? <RobotWihtMessage message={t("tutorialFirstModule.nowYouCanCreate")} />
            : null
        }
        </TouchableOpacity>
    </Modal>
  )
}

export default TutorialFirstModule
