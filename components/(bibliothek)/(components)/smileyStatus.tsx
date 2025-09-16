import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

/**
     * This component displays the smiley of a Question card
     * @param status - The status can be NULL, BAD, OK, GOOD or GREAT 
*/
const SmileyStatus = ({status}:{
    status: "BAD" | "OK" | "GOOD" | "GREAT" | null
}) => {
    let color = "blue"
    let bgColor = "bg-blue-500"
    let smiley = "grin"
    if (status == "BAD") {
        color = "red"
        bgColor = "bg-red-700"
        smiley = "frown"
    } else if (status == "OK") {
        color = "yellow"
        bgColor = "bg-yellow-500"
        smiley = "meh"
    } else if (status == "GOOD") {
        color = "green"
        bgColor = "bg-green-500"
        smiley = "smile"
    }else {
        color = "blue"
        bgColor = "bg-blue-500"
        smiley = "grin"
    }
    return (
        <View className={`items-center justify-center rounded-full h-[20px] w-[20px] pt-[1px] ${bgColor}`}>
            <Icon name={smiley} size={15} color={color}/>
        </View>
    )
}

export default SmileyStatus