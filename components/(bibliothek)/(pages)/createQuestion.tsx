import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";

const CreateQuestion = ({setSelected2,module, selectedModule}) => {
    console.log(module.documents[selectedModule])
    const Header = () => {
        return (
        <View className='flex-row justify-between items-center p-3 bg-gray-800  w-full rounded-t-[10px]'>
            <View className='flex-row items-center'>
                <TouchableOpacity onPress={()=> setSelected2("SingleModule") }>
                    <Icon name="arrow-left" size={20} color="white"/>
                </TouchableOpacity>
                <View className='items-start justify-center ml-3'>
                    <Text className='text-white font-bold'>Quiz Frage für "{module.documents[selectedModule].name}" erstellen</Text>
                    <Text className='text-gray-500 text-[12px]'> Alle änderungen gespeichert</Text>
                </View>
            </View>
            <View className='flex-row bg-gradient-to-b from-[#2b3d69] to-blue-500 items-center justify-center px-2 py-1 rounded-full'>
                <Icon name="microchip" size={15} color="white"/>
                <Text className='text-white ml-2'>Mit AI generieren</Text>
            </View>
        </View>
        )
    }
  return (
    <View className='flex-1'>
        <Header/>
    </View>
  )
}

export default CreateQuestion