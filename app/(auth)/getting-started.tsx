import { View, Text, SafeAreaView, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ContinueBox from '@/components/(signUp)/(components)/continueBox';
import Icon from 'react-native-vector-icons/FontAwesome5'
import ColorPicker from '@/components/(general)/colorPicker';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import PageOptions from '@/components/(getting-started)/pageOptions';
import PageAiCreate from '@/components/(getting-started)/pageAiCreate';
import PageDiscover from '@/components/(getting-started)/pageDiscover';
import PageCreateModule from '@/components/(getting-started)/pageCreateModule';
import PageModulText from '@/components/(getting-started)/(aiCreate)/pageModulText';
import PageModulThema from '@/components/(getting-started)/(aiCreate)/pageModulThema';
import { useLocalSearchParams } from "expo-router"

const gettingStarted = () => {
    const [userChoices, setUserChoices] = useState(null);
    const { userData } = useLocalSearchParams()
    
  return (
        <SafeAreaView className="flex-1 p-4 bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center">
          { userChoices == null ?           <PageOptions userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices == "GENERATE" ?     <PageAiCreate userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices  == "DISCOVER" ?    <PageDiscover userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices == "CREATE" ?       <PageCreateModule userChoices={userChoices} setUserChoices={setUserChoices} userData={userData}/>
          : userChoices == "TEXTBASED" ?    <PageModulText userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices == "THEMENBASED" ?  <PageModulThema userChoices={userChoices} setUserChoices={setUserChoices}/>
          : null
}  
        </SafeAreaView>
    
  )
}

export default gettingStarted