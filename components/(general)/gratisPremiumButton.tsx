import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ModalPremium from '../(home)/modalPremium'

const GratisPremiumButton = ({children, aditionalStyles, handlePress, active}) => {
    const [isPressed, setIsPressed] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
  return (
    
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={active ? !active : false}
      onPress={()=> {handlePress ? handlePress() : setIsVisible(true)}}
      className="items-center justify-center rounded-full h-[30px] "
      style={{
        transform: [{ translateY: isPressed ? 2 : 0 }],
        shadowColor: "#1e3a8a",
        shadowOffset: { width: 0, height: isPressed ? 2 : 6 },
        shadowOpacity: 1,
        shadowRadius: 4,
        marginBottom: 5,
      }}
    >
        <View className={`flex-1 items-center rounded-full justify-center bg-gradient-to-b from-blue-300 to-blue-500 px-2 ${aditionalStyles}`}>
            <ModalPremium isVisible={isVisible} setIsVisible={setIsVisible} />
            {
                children ? children :<Text className='text-[12px] text-gray-100 font-semibold'>Gratis Premium testen</Text>

            }
        </View>
    </TouchableOpacity>
  )
}

export default GratisPremiumButton