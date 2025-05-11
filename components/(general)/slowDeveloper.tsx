import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const SlowDeveloper = ({isVisible, setIsVisible}) => {
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
            className="absolute top-0 left-0 w-full h-full justify-center items-center " 
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }} 
            onPress={() => setIsVisible(false)}
        >
            <View className='bg-gray-800 border-gray-700 border-[1px] p-3 rounded-[10px] items-center justify-center '>
                <Text className='text-white text-xl font-bold'>Noch nicht Freigeschaltet</Text>
                <Text className='text-white mt-2 text-center'>Diese Funktion wird noch entwickelt und ist bald verfügbar.</Text>
                <TouchableOpacity className='bg-green-500 p-2 rounded-md mt-4' onPress={() => setIsVisible(false)}>
                    <Text className='text-white'>Schließen</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
    : null
}
        </View>
  )
}

export default SlowDeveloper