import { View, Text, Image } from 'react-native'
import React from 'react'

const Fusioncharge = () => {
  return (
    <View className='items-center justify-center m-1 '
    style={{
        height: 27,
        width: 37,
    }}
    >
      <Image 
        source={require('../../assets/tokens/fusion.gif')}  
        style={{ width: 37, height: 37 }}
        resizeMode="contain"/>
    </View>
  )
}

export default Fusioncharge