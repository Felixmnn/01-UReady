import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'   
import images from '@/assets/shopItems/itemConfig'

const Card = ({
    currency="€",
    price="0.00",
    backgroundColor="#644f0b",
    textbackgroundColor="#373225",
    borderColor="#644f0b",
    textColor="#bc8e00",
    title="Chips",
    imageSource=images.chips,
    width=110,
}) => {

  return (
    <TouchableOpacity className='rounded-[10px] '
        style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        shadowColor: backgroundColor,
        shadowOffset: { width: 0, height: 5 }, // ⬅️ nur nach unten
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, // Für Android
        width: width,
        height: 160,
        margin: 5,
        }}

    >   
        <Text className='text-white font-semibold text-[13px] text-center'>
            {title}
        </Text>
        <View className='flex-1  items-center justify-center '>
            <Image source={imageSource} style={{
                height:"95%",
                resizeMode: 'contain',
                marginTop: 5,
                marginBottom: 5,
            }} />

        </View>
        <View   className='rounded-b-[10px] items-center justify-center '
                style={{
                    height: 35,
                    backgroundColor: textbackgroundColor,
                }}
        >
            
            <Text className='text-white font-bold  text-2xl text-center'
                style={{
                    color: textColor,
                }}>
                {price} {currency == "chip"? 
                <Icon name="mikrochip" size={20} color={"white"}/> 
                 : currency}
            </Text>
        </View>
    </TouchableOpacity>
  )
}

export default Card