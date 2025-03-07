import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const authLayout = () => {
  return (
    <View className='flex-1'>
        <>
            <Stack>
                <Stack.Screen name="sign-in"  
                options={{ 
                    headerShown: false 
                  }}
                />
                <Stack.Screen name="personalize"  
                options={{ 
                    headerShown: false 
                  }}
                />
                <Stack.Screen name="sign-up"  
                options={{ 
                    headerShown: false 
                  }}
                />
            </Stack>
        </>
    </View>
  )
}

export default authLayout