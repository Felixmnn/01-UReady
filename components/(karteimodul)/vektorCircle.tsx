import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import React from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useState, useEffect } from 'react'
import Svg, { Circle } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome5";


const VektorCircle = ({color, percentage, icon, strokeColor}) => {
    const radius = 15; 
    const strokeWidth = 3;
    const center = 20; 
    const circumference = 2 * Math.PI * radius;
    const progress = (percentage / 100) * circumference;

    const angle = (percentage / 100) * 360 - 90; 
    const radians = (angle * Math.PI) / 180; 

    const dotX = center + radius * Math.cos(radians);
    const dotY = center + radius * Math.sin(radians);
  return (
    <View className="relative w-13 h-13 justify-center items-center ">
          <Svg width="40" height="40" viewBox="0 0 40 40">
            {/* Hintergrundkreis */}
            <Circle
              cx="20"
              cy="20"
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              opacity={0.2}
            />
            {/* Fortschrittsbalken, startet bei 12 Uhr */}
            <Circle
              cx="20"
              cy="20"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference? circumference - progress: 0}
              strokeLinecap="round"
              transform="rotate(-90 20 20)" // Start bei 12 Uhr
            />
            {/* 📌 Roter Punkt */}
            <Circle cx={dotX} cy={dotY} r="5" fill={color} />
          </Svg>
          {/* Icon/Text in der Mitte */}
          <View className="absolute top-3 left-0 right-0 flex items-center">
            <Icon name={icon} size={16} color={color}/>
          </View>
        </View>
  )
}

export default VektorCircle