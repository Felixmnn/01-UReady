import { View, Text } from 'react-native'
import React from 'react'

const InfoModule = ({content, header, additional,hideHead,infoStyles}) => {
  return (
    <View className={`mx-5 ${infoStyles}`}>
          {
            hideHead ? null :
            <View className='flex-row items-end'>
              <Text className='text-white mt-2 ml-1 font-bold text-[15px]'>{header}</Text>
              <View className='bg-blue-900 border-blue-300 border-[1px] rounded-full px-2 pb-[2px] ml-2'>
                  <Text className='text-blue-300 text-[12px]'>{additional}</Text>
              </View>
            </View>
          }
        <View className='bg-gray-800 p-4 my-2 rounded-[10px] border border-[1px] border-gray-600'>
        {content()}
        </View>
    </View>
  )
}

export default InfoModule