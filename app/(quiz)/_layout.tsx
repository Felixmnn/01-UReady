import { View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const quizLayout = () => {
  return (
    <View className='flex-1'>
        <>
            <Stack>
                <Stack.Screen name="quiz"  
                options={{ 
                    headerShown: false 
                  }}
                /> 
               
                
            </Stack> 
        </>
    </View>
  )
}

export default quizLayout