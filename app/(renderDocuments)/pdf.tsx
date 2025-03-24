import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router,useLocalSearchParams } from "expo-router"

const pdf = () => {
    const {item} = useLocalSearchParams();
  return (
    <View>
    <TouchableOpacity onPress={()=> router.back()}><Text>Zurück</Text></TouchableOpacity>
      <Text>{item}</Text>
    </View>
  )
}

export default pdf