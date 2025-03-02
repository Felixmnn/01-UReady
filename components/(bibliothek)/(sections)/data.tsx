import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { quizQuestion } from '@/assets/exapleData/quizQuestion'
import Icon from "react-native-vector-icons/FontAwesome5";  
const Data = ({data,selected}) => {

const filteredData = quizQuestion.filter((item) => item.pid == data.modules[selected].id)
const CounterText = ({title,count}) => {
    return (
        <View className='flex-row justify-start items-center '>
        <Text className='text-white my-2'>{title}</Text>
        <Text className='ml-1 text-white text-[12px] px-1 rounded-[5px] bg-gray-700'>{count}</Text>
        </View>
    )
}

const AddData = ({title, subTitle, button}) => {
    return (
    <View className='flex-row p-2 bg-gray-800 rounded-[10px] items-start justify-start border-[1px] border-gray-500 border-dashed'>
            <View className="items-center justify-center p-2">
                <Icon name="file" size={25} color="white"/>
            </View>
            <View className="ml-2">
                <Text className='text-white'>{title}</Text>
                <Text className='text-gray-300 text-[12px]'>{subTitle}</Text> 
                <TouchableOpacity className='rounded-full p-2 bg-gray-800 flex-row items-center justify-center border-[1px] border-gray-600 mt-2'>
                    <Icon name="plus" size={15} color="white"/>
                    <Text className='ml-2 text-gray-300 text-[12px]'>{button}</Text>  
                </TouchableOpacity>
            </View>
        </View>
    )
}
    
return (
    <View>
        <CounterText title='Fragen' count={filteredData.length}/>
        <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity className='p-4 w-[180px] m-1 justify-between items-center p-4 border-[1px] border-gray-600 rounded-[10px] bg-gray-800'>
                        <View className='w-full justify-between flex-row items-center '>
                            <View className='bg-gray-900 rounded-[5px] items-center justify-cneter'>
                                <Text className="m-1 text-white text-[10px] px-1">+ Tags hinzufügen</Text>
                            </View>
                            <Icon name="microchip" size={15} color="white"/>
                        </View>
                        <Text className='text-white'>{item.frage}</Text>
                        <View className='border-b-[1px] border-gray-600 my-4 w-full'/>
                        <View className='w-full items-end pr-2'> 
                            <Icon name="ellipsis-h" size={15} color="white"/>
                        </View>
                    </TouchableOpacity>
                )
            }}
            horizontal={true}
        />
        <CounterText title='Dateien' count={0}/>
        <AddData title={"Datei hinzufügen"} subTitle={"Lade deine erste Datei hoch"} button={"Dokument hochladen"} />
        <CounterText title='Notizen' count={0}/>
        <AddData title={"Notizen hinzufügen"} subTitle={"Erstelle jetzt deine erste."} button={"Notiz ergänzen"} />
    </View>
  )
}

export default Data