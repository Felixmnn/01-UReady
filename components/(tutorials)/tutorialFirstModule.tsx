import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import RobotWihtMessage from './robotMessage';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';

const TutorialFirstModule = ({isVisible, setIsVisible, tutorialStep, setTutorialStep}) => {
    const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.tutorialModule[selectedLanguage] || languages.tutorialModule.DEUTSCH;
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible && tutorialStep < 7}
        onRequestClose={() => {
            setIsVisible(false);
        }}>
        <TouchableOpacity className='flex-1 justify-center items-center bg-blue-500'
            onPress={() => setTutorialStep(tutorialStep + 1)}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
        {
            tutorialStep === 0 ? <RobotWihtMessage message={texts.letUsCreate} />
            : tutorialStep === 1 ? <RobotWihtMessage message={texts.firstInfo} />
            : tutorialStep === 2 ? <RobotWihtMessage message={texts.forExample} />
            : tutorialStep === 3 ? <RobotWihtMessage message={texts.nextSession} />
            : tutorialStep === 4 ? <RobotWihtMessage message={texts.aSession} />
            : tutorialStep === 5 ? <RobotWihtMessage message={texts.thenContent} />
            : tutorialStep === 6 ? <RobotWihtMessage message={texts.nowYouCanCreate} />
            : null

                }
        </TouchableOpacity>
    </Modal>
  )
}

export default TutorialFirstModule
