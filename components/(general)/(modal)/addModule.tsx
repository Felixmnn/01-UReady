import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '../customTextInput'
import { TextInput } from 'react-native-gesture-handler'
import ColorPicker from '../colorPicker'
import Icon from "react-native-vector-icons/FontAwesome5";
import FinalTextInput from '../finalTextInput'
import { useGlobalContext } from '@/context/GlobalProvider'
import { addNewModule } from "./../../../lib/appwriteAdd"

const AddModule = ({isVisible, setIsVisible}) => {
    const {user} = useGlobalContext();
    console.log("The user is",user)
    const [newModule, setNewModule] = useState(null)

    useEffect(() => {
        if(user === null) return;
        const newM = {
            name: "",
            subject: "",
            questions: 0,
            notes: 0,
            documents: 0,
            public: false,
            progress: 0,
            creator: user.$id,
            color: "",
            sessions: [],
            tags: []
        }
        setNewModule(newM)
    }
    ,[user])

    function changeColor(color, index) {
        setNewModule({...newModule, color: color})
    }

    const [textInputActive , setTextInputActive] = useState(false)
    const [textInputActive2 , setTextInputActive2] = useState(false)

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <TouchableOpacity onPress={()=> setIsVisible(false)} className='absolute top-0 left-0 w-full h-full justify-center items-center '>
            <View className='bg-gray-900 p-4 rounded-xl '>
                <View className='flex-row justify-between items-center p-2'>
                    <Text className='text-[15px] font-bold text-gray-300'>Neues Modul</Text>
                    <TouchableOpacity onPress={()=> setNewModule({...newModule, public: !newModule.public})}>
                        {
                            newModule !== null && newModule.public ?
                            <Icon name="globe" size={20} color="white"/>
                            :
                            <Icon name="lock" size={20} color="white"/>
                        
                        }
                    </TouchableOpacity>
                </View>
                {
                    newModule !== null ?
                <View>
                <TextInput
                        
                        className={`text-white flex-1 rounded-[10px] p-1 ${textInputActive ? "bg-[#0c111d]" : null} p-2 my-1 mx-2 border-gray-700 border-[1px] `}
                        onChangeText={(text) => setNewModule({...newModule, name: text})}
                        value={newModule.name}
                        placeholder="Name"
                        onBlur={()=> setTextInputActive(false)}
                        onFocus={()=> setTextInputActive(true)}
                    />
                <TextInput
                        className={`text-white flex-1 rounded-[10px] p-1 ${textInputActive2 ? "bg-[#0c111d]" : null} p-2 my-1 mx-2 border-gray-700 border-[1px] `}
                        onChangeText={(text) => setNewModule({...newModule, subject: text})}
                        value={newModule.subject}
                        placeholder="Fach"
                        onBlur={()=> setTextInputActive2(false)}
                        onFocus={()=> setTextInputActive2(true)}
                    />
                <ColorPicker color={newModule.color} selectedColor={newModule.color} changeColor={changeColor}/>
                <TouchableOpacity onPress={()=> {addNewModule(newModule);setIsVisible(false)}}className='bg-blue-700 p-2 rounded-[10px] m-2 items-center justify-center'>
                    <Text>Modul hinzufügen</Text>
                </TouchableOpacity>
                </View>
                 : null

                }
               
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default AddModule