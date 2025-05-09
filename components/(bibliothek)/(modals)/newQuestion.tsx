import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import  Selectable  from '../selectable'

const ModalNewQuestion = ({isVisible, setIsVisible, setSelected, selectAi, module, selected,sessions, addDocument, SwichToEditNote,texts, selectedLanguage, documents}) => {
    


    const [documtenPickerVisible, setDocumentPickerVisible] = useState(false);

    
  return (
    <View >
                {
    isVisible ? 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <TouchableOpacity 
            className="absolute top-0 left-0 w-full h-full justify-center items-center p-5" 
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}  // 50% Transparenz
            onPress={() => setIsVisible(false)}
        >
            <View className=' w-full max-w-[600px] items-center justify-center bg-gray-800 border-gray-700 border-[1px] rounded-xl p-2'>
                <View className='w-full flex-row justify-between'>
                    <Text className='text-white font-bold mr-2 text-[15px]' >{texts[selectedLanguage].addMaterial}</Text>
                    <Icon name="times" size={20} color="white"/>
                </View>
                <View className='w-full p-2'>
                    <Selectable texts={texts} selectedLanguage={selectedLanguage} icon={"robot"} iconColor={"#7a5af8"} bgColor={"bg-[#372292]"} title={texts[selectedLanguage].aiQuiz} empfolen={true} handlePress={()=> selectAi()}/>
                    <Selectable texts={texts} selectedLanguage={selectedLanguage} icon={"file-pdf"} iconColor={"#004eea"} bgColor={"bg-[#00359e]"} title={texts[selectedLanguage].dokUpload} empfolen={false} handlePress={()=> {addDocument()}}/>
                    <Selectable texts={texts} selectedLanguage={selectedLanguage} icon={"file-alt"} iconColor={"#c1840b"} bgColor={"bg-[#713b12]"} title={texts[selectedLanguage].crtQuestio} empfolen={false} handlePress={()=> setSelected("CreateQuestion")} />
                    <Selectable texts={texts} selectedLanguage={selectedLanguage} icon={"sticky-note"} iconColor={"#15b79e"} bgColor={"bg-[#134e48]"} title={texts[selectedLanguage].crtNote} empfolen={false}  handlePress={()=> {
                        SwichToEditNote(null);
                        }}/>
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
    : null
}
        </View>
  )
}

export default ModalNewQuestion