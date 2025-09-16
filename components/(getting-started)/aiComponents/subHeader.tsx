import { View, Text } from 'react-native'
import React from 'react'

const SubHeader = ({ title }: {
    title: string
}) => {
    return (
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">{title}</Text>
          </View>
    );
  }

export default SubHeader