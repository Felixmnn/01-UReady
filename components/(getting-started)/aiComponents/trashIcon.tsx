import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

/**
   * Touchable Opacity zum löschen eines Themas oder eines Textes
   */
  const TrashIcon = ({
    handlePress,
    newitem
}:{
    handlePress: ()=>void,
    newitem: {
        type: "TOPIC" | "PEN" | "FILE" | "QUESTION",
        content: string,
        uri: string | null,
        sessionID: string | null,
        id: string | null,
    },  
}) => {
    return (
    <TouchableOpacity
        disabled={newitem.content.length < 2}
        onPress={handlePress}

        className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
        style={{ height: 34, width: 34 }}
      >
      <Icon name="trash" size={15} color="#C62828" />
    </TouchableOpacity>
    )
  }

export default TrashIcon