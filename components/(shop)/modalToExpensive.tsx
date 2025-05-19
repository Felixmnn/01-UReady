import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

const  ModalToExpensive = ({isVisible,setIsVisible}) => {
    
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <TouchableOpacity
            activeOpacity={1} // wichtig, damit Klick nicht durchgeht
            onPress={() => setIsVisible(false)}
            style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // 💡 nur hier Transparenz
                justifyContent: 'start',
                alignItems: 'center',
                paddingTop: 30,
            }}
>
            <View className='w-[90%] h-[200px] bg-[#373225] rounded-[10px] items-center justify-start '>
                <View className=' rounded-[10px] items-center justify-start p-3'
                    style={{
                        backgroundColor: "#D32F2F", 
                    }}
                >
                <Text className='text-gray-300 font-bold text-[20px]'>This item is too expensive</Text>
                <Text className='text-gray-300 font-bold text-[15px]'>You need more chips</Text>
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default  ModalToExpensive