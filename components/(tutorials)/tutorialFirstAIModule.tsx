import { View, Text, Modal, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RobotWihtMessage from './robotMessage';

const TutorialFirstAIModule = ({isVisible, setIsVisible, tutorialStep, setTutorialStep }) => {

  

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible && tutorialStep < 10}
        onRequestClose={() => {
            setIsVisible(false);
        }}>
        <TouchableOpacity className='flex-1 justify-center items-center bg-blue-500'
            onPress={() => setTutorialStep(tutorialStep + 1)}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
        {
            tutorialStep === 0 ? <RobotWihtMessage message="Laass uns gemeinsam dein erstes Modul erstellen!" /> 
: tutorialStep === 1 ? <RobotWihtMessage message="Zuuerst brauchen wir ein paar grundlegende Infos zu deinem Modul." /> 
: tutorialStep === 2 ? <RobotWihtMessage message="Zuum Beispiel: Name, Beschreibung und eine Farbe zur besseren Übersicht." /> 
: tutorialStep === 3 ? <RobotWihtMessage message="Alls nächstes kannst du deine erste Session hinzufügen." /> 
: tutorialStep === 4 ? <RobotWihtMessage message="Eiine Session ist eine einzelne Veranstaltung, wie eine Vorlesung oder Unterrichtseinheit." /> 
: tutorialStep === 5 ? <RobotWihtMessage message="Daann fehlt nur noch der Inhalt für dein Modul." /> 
: tutorialStep === 6 ? <RobotWihtMessage message="Diiesen kannst du anhand von Themen, Texten oder Dateien erstellen." /> 
: tutorialStep === 7 ? <RobotWihtMessage message="Wäähle dafür einfach eine Session aus und ergänze den gewünschten Inhalt" /> 
: tutorialStep === 8 ? <RobotWihtMessage message="Daas ist alles, was du für dein erstes Modul brauchst." /> 
: tutorialStep === 9 ? <RobotWihtMessage message="Jeetzt kannst du dein Modul erstellen – es wird automatisch generiert." /> 
: null

        }
        </TouchableOpacity>
    </Modal>
  )
}

export default TutorialFirstAIModule