import { View, Text, Image } from 'react-native'
import React from 'react'
import Card from './card'
import images from '@/assets/shopItems/itemConfig'

const Cardcombination = ({cards=[],title="Title"}) => {
    
  return (
    <View className='w-full items-center justify-center'>
        <View className="relative w-full h-[60px] mt-1 items-center justify-center">
            <Image source={images.head} style={{
              width: 350,
              resizeMode: 'contain',
              marginTop: 5,
            }} />
            <Text className="absolute text-white text-2xl font-bold pt-2"
              style={{
                color: "#bc8e00",
              }}
            >{title}</Text>
        </View>
        <View className='flex-row '>
            {
            cards?.map((item, index) => (
                <Card
                    key={index}
                    shopItem={item}
                />
            ))
            }
        </View>
    </View>
  )
}

export default Cardcombination