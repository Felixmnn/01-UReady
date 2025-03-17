import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const editLayout = () => {
  return (
    <View className='flex-1'>
        <>
            <Stack>
                <Stack.Screen name="editNote"  
                options={{ 
                    headerShown: false 
                  }}
                />
            </Stack>
        </>
    </View>
  )
}

export default editLayout