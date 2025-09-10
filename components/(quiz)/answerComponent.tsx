import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { isColor } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BlockMath } from 'react-katex';

const AnswerComponent = ({
    index,
    selectAnswer,
    showAnsers,
    dataType,
    isCorrect,
    parsedItem,
    width,
    isSelected,
}: {
    index: number,
    selectAnswer: (answer: string) => void,
    showAnsers: boolean,
    dataType: "text" | "image" | "latex",
    isCorrect: boolean,
    parsedItem: any,
    width: number,
    isSelected: boolean,


}) => {
    
  return (
    <TouchableOpacity
        key={index}
        disabled={showAnsers}
        onPress={() => selectAnswer(JSON.stringify(parsedItem))}
        className={`${width > 900 ? "w-[48%] mr-2 mt-2" : "w-full"} items-center justify-center border-[1px] p-2 rounded-[10px] mb-2 
        ${showAnsers
            ? isCorrect
            ? "bg-green-900 border-green-600"
            : "bg-red-900 border-red-600"
            : isSelected
            ? "bg-blue-900 border-blue-600"
            : "bg-gray-800 border-gray-600"
        }`}
        style={{
            maxHeight: 150
        }}
    >
        <View className="flex-1 items-center justify-center">
        {dataType === "latex" ? (
            <View className="w-full rounded-lg overflow-hidden">
            <BlockMath
                math={parsedItem.latex}
                className="text-white"
                style={{ color: "white", fontSize: 10 }}
            />
            </View>
        ) : dataType === "image" ? (
            <View className="w-full rounded-lg overflow-hidden min-h-10 items-center">
            <Image
                source={{ uri: parsedItem.image }}
                style={{
                width: 200,
                aspectRatio: 1.5,
                borderRadius: 10,
                }}
                resizeMode="cover"
            />
            </View>
        ) : (
            <Text className="text-white text-center font-bold text-[18px]">
            {parsedItem.title}
            </Text>
        )}

        {showAnsers && isSelected && (
            isCorrect ? (
            <Icon name="check" size={15} color="green" />
            ) : (
            <Icon name="times" size={15} color="red" />
            )
        )}
        </View>
    </TouchableOpacity>
    );
}

export default AnswerComponent