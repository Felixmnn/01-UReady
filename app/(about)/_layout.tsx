import { View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const aboutLayout = () => {
  return (
    <View className='flex-1'>
        <>
            <Stack>
                <Stack.Screen name="contact"  
                options={{ 
                    headerShown: false 
                  }}
                />
                <Stack.Screen name="policys"  
                options={{ 
                    headerShown: false 
                  }}
                />
            </Stack>
        </>
    </View>
  )
}

export default aboutLayout