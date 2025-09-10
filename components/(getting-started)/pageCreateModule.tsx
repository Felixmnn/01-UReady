import React from 'react';
import CreateModule from '../(general)/createModule';
import { View } from 'react-native';
import TutorialFirstModule from '../(tutorials)/tutorialFirstModule';
import { ModuleProps, userData } from '@/types/moduleTypes';

const PageCreateModule = ({ setUserChoices, newModule, setNewModule, setTutorialStep, tuturialStep= 10}:{
  setUserChoices: React.Dispatch<React.SetStateAction<null>>,
  newModule: ModuleProps,
  setNewModule: React.Dispatch<React.SetStateAction<ModuleProps>>,
  setTutorialStep?: React.Dispatch<React.SetStateAction<number>>,
  tuturialStep?: number
}) => {  
    const [ isVisible, setIsVisible ] = React.useState(true);
  return (
    <View className="flex-1 w-full">
      <TutorialFirstModule
        isVisible={isVisible && tuturialStep < 10}
        setIsVisible={setIsVisible}
        tutorialStep={tuturialStep}
        setTutorialStep={setTutorialStep}
      />

    <CreateModule setTutorialStep={setTutorialStep} tuturialStep={tuturialStep} newModule={newModule} setNewModule={setNewModule} setUserChoices={setUserChoices}/>
    </View>
  )
}

export default PageCreateModule