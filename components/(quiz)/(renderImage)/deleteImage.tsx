import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

/**
 * This component lets a user delete a Image on the Backend and locally
 */
const DeleteImage = () => {
  return (
    <View className='flex-row justify-center items-center  px-2  py-1 bg-red-600 rounded-full'>
      <Text className='text-white font-medium'>
        Delete Image</Text>
      <Icon name='trash' size={16} color='#fff' className='ml-2'/>
    </View>
  )
}

export default DeleteImage