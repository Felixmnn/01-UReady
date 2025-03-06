import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";

const ContinueModal = ({isVisible, setIsVisible, setSelectedQuestion}) => {
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
                        <Text className='text-white font-bold mr-2'>Letzte Frage erreicht</Text>
                        <Icon name="times" size={20} color="white"/>
                    </View>
                    <Text className='text-white text-[12px] font-semibold my-2'>Der Assistent unterstützt Bilder, Dokumente und mehr</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
    : null
}
        </View>
  )
}

export default ContinueModal