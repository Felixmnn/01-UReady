import { View, Text,SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
const personalize = () => {
    const steps = ["ZERO","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN"]
    const [signInProcessStep, setSignInProcessStep] = useState("TWO")
    
    const zero = () => {
        return (
            <View>
                <Text>Zero</Text>
            </View>
        )
    }
    const [disabled, setDisabled] = useState(false)
  return (
    <SafeAreaView className="flex-1 p-4 bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center">
        <View className='w-full h-[5px] rounded-full bg-gray-500'>
            <View className={` h-full bg-blue-500 rounded-full`} 
            style={{
                width: `${steps.indexOf(signInProcessStep)*10}%`
            }}>
            </View>
        </View>
        <View className='w-full items-start justify-start  ml-4 my-2'>
                <TouchableOpacity onPress={() => {
                    if (signInProcessStep !== "ZERO") {
                        setSignInProcessStep(steps[steps.indexOf(signInProcessStep)-1])
                    }
                }}>
                    <Icon name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        <View className='flex-1 items-center justify-center'>
            {zero()}
        </View>
        <View className='w-full items-center justify-end mr-4 my-2  '>
            <TouchableOpacity disabled={disabled} className={`${disabled ? "opacity-50 bg-gray-700" : "bg-blue-700"} items-center justify-center w-[150px] rounded-full px-4 py-2`} onPress={() => {
                if (signInProcessStep !== "TEN") {
                    setSignInProcessStep(steps[steps.indexOf(signInProcessStep)+1])
                }
            }}>
                <Text className='text-white'>Weiter</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default personalize