import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from 'expo-router'
import { addNote, addDocumentConfig, addDocumentToBucket } from '@/lib/appwriteEdit';
import ModalDocumentPicker from './modalDocumentPicker';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';


const ModalNewQuestion = ({isVisible, setIsVisible, setSelected, selectAi, module, selected,sessions, addDocument}) => {
    const Selectable = ({icon, bgColor, iconColor, empfolen, title, handlePress}) => {
        return (
            <TouchableOpacity onPress={handlePress} className='justify-between max-w-[200px] min-h-[130px] flex-1 p-3 rounded-10px border-gray-600 border-[1px] rounded-[10px] m-2'>
                <View className={`h-[45px] w-[45px] ${bgColor} items-center justify-center rounded-full`}>
                    <Icon name={icon} size={25} color={iconColor}/>
                </View>
                { empfolen ?
                    <View className='items-center justify-center border-[1px] border-green-500 bg-green-700 bg-opacity-10 rounded-[5px] max-w-[60px]'>
                        <Text className='text-green-500 text-[10px]'>Empfohlen</Text>
                    </View>
                    :
                    null
                }
                <View className='flex-row items-center justify-between'>
                    <Text className='text-gray-200 font-bold text-[15px] pr-2'>{title}</Text>
                    <Icon name="chevron-right" size={20} color="white"/>
                </View>
            </TouchableOpacity>
        )
    }

async function SwichToEditNote() {
    setIsVisible(false);

    console.log("Das akutelle Modul",module)
    console.log("Die Modul ID:",module.$id)

    const note = {
        notiz: "",
        sessionID: sessions[selected].title,
        subjectID: module.$id,
        title: "",
    }
    try {
        
        const res = await addNote(note);
        console.log(res);
        router.push({
            pathname:"editNote",
            params: {note: JSON.stringify(res)}
        })
    } catch (error) {
        console.log(error);
    }}

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
            className="absolute top-0 left-0 w-full h-full justify-center items-center" 
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}  // 50% Transparenz
            onPress={() => setIsVisible(false)}
        >
            <View className='p-4 bg-gray-800 border-gray-700 border-[1px] rounded-xl'>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                    <View className='flex-row flex-1 justify-between'>
                        <Text className='text-white font-bold mr-2 text-[15px]' >Material hinzufügen</Text>
                        <Icon name="times" size={20} color="white"/>
                    </View>
                    <View className='flex-row'>
                        <Selectable icon={"robot"} iconColor={"#7a5af8"} bgColor={"bg-[#372292]"} title={"AI Quiz Generieren"} empfolen={true} handlePress={()=> selectAi()}/>
                        <Selectable icon={"file-pdf"} iconColor={"#004eea"} bgColor={"bg-[#00359e]"} title={"Dokument hinzufügen"} empfolen={false} handlePress={()=> {addDocument()}}/>
                    </View>
                    <View className='flex-row'>
                        <Selectable icon={"file-alt"} iconColor={"#c1840b"} bgColor={"bg-[#713b12]"} title={"Erstelle Fragen"} empfolen={false} handlePress={()=> setSelected("CreateQuestion")} />
                        <Selectable icon={"sticky-note"} iconColor={"#15b79e"} bgColor={"bg-[#134e48]"} title={"Erstelle eine Notiz"} empfolen={false}  handlePress={()=> {
                            SwichToEditNote(null);
                            }}/>
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
    : null
}
        </View>
  )
}

export default ModalNewQuestion