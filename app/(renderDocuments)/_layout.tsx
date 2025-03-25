import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const renderDocumentsLayout = () => {
  return (
    <View className='flex-1'>
        <>
            <Stack>
                <Stack.Screen name="pdf"  
                options={{ 
                    headerShown: false 
                  }}
                />
                <Stack.Screen name="word"  
                options={{ 
                    headerShown: false 
                  }}
                />
            </Stack>
            
        </>
    </View>
  )
}

export default renderDocumentsLayout