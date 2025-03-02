import { View, Text } from 'react-native'
import React, { useState } from 'react'
import SessionProgress from '../sessionProgress'

const RoadMap = ({data, selected, setSelected}) => {    
  return (
    <View>
      {
        data.modules.map((module, index) => {
            return (
                <SessionProgress selected={selected == index} setSelected={()=> setSelected(index)} first={index == 0} last={ index == data.modules.length} progress={module.progress} >
                    <Text className='text-white'>S{index +1}</Text>
                </SessionProgress>
            )
    })
    }
    </View>
  )
}

export default RoadMap