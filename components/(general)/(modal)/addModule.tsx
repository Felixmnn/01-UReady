import { View, Text, Modal, TouchableOpacity,TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomTextInput from '../customTextInput'
import ColorPicker from '../colorPicker'
import Icon from "react-native-vector-icons/FontAwesome5";
import FinalTextInput from '../finalTextInput'
import { useGlobalContext } from '@/context/GlobalProvider'
import { addNewModule } from "./../../../lib/appwriteAdd"
import CreateModule from '../createModule';

const AddModule = ({isVisible, setIsVisible, newModule, setNewModule,amount=0}) => {
    const {user} = useGlobalContext();

    const [loading , setLoading] = useState(false);

    useEffect(() => {
        setIsVisible(false)
    }
    , [amount])

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <View  className='absolute top-0 left-0 w-full h-full justify-center items-center '>
            <CreateModule newModule={newModule} setNewModule={setNewModule} setUserChoices={()=> setIsVisible(false)} isModal={setIsVisible}/>
        </View>
    </Modal>
  )
}

export default AddModule