import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const GratisPremiumButton = ({
  children, 
  aditionalStyles, 
  handlePress, 
  active
}:{
  children?: React.ReactNode,
  aditionalStyles?: string,
  handlePress?: ()=>void,
  active?: boolean
}) => {
    const [isPressed, setIsPressed] = useState(false)
  return (
    
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={active ? !active : false}
      onPress={()=> {handlePress ? handlePress() : null}}
      className="items-center justify-center rounded-full h-[30px] "
      style={{
        transform: [{ translateY: isPressed ? 2 : 0 }],
        shadowColor: "#1e3a8a",
        shadowOpacity: 1,
        shadowRadius: 4,
        marginBottom: 5,
      }}
    >
        <View className={`flex-1 items-center rounded-full justify-center bg-gradient-to-b from-blue-500 to-blue-900 px-2 ${aditionalStyles}`}>
            {
                children ? children :<Text className='text-[12px] text-gray-100 font-semibold'>...</Text>

            }
        </View>
    </TouchableOpacity>
  )
}

export default GratisPremiumButton