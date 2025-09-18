import { View, Text } from 'react-native'
import React from 'react'

const FilterPicker = ({
    handlePress,
    options,
    selectedOptions,
    title
}:{
    handlePress: (option: string) => void,
    options: string[],
    selectedOptions: string[] | null,
    title: string
}) => {
  return (
    <View className='w-full px-4'>
        <Text className='text-lg font-semibold text-gray-700 mb-2 mt-4'>
            {title}
        </Text>
        <View className='flex-row flex-wrap justify-start items-center w-full py-1'>
        {
            options.map((option, index) => {
            return (
                <Text onPress={() => handlePress(option)} key={index} className={`p-2 rounded-[5px] m-1 ${selectedOptions?.includes(option) ? "bg-blue-500" : "bg-gray-500"}`}  >
                    {option}
                </Text>
            )
            })
        }
        </View>
    </View>
  )
}

export default FilterPicker