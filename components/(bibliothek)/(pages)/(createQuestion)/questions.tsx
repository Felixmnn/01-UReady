import { View, Text, FlatList, TouchableOpacity,  } from 'react-native'
import React from 'react'

const Questions = ({screenHeight, questions, setSelectedQuestion, selectedQuestion,newQuestion, checkNewQuestion}) => {
      
        return (
            <View className={` border-r-[1px] border-gray-500`} 
            style={{height:screenHeight-100}}
                >
                <FlatList
                    data={questions}
                    keyExtractor={(item)=> item.question}
                    style={{
                        scrollbarWidth: 'thin', // Dünne Scrollbar
                        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
                      }}
                    ListHeaderComponent={()=> {
                        return (
                            <View>
                                <TouchableOpacity onPress={()=> checkNewQuestion()} className={`bg-white mx-2 mt-4 mb-2 rounded-full p-2 items-center justify-center`}>
                                    <Text className='font-semibold'>+Neue Karteikarte</Text>
                                </TouchableOpacity>
                               <TouchableOpacity onPress={()=> setSelectedQuestion(0)} className={`mx-3 my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${selectedQuestion  == 0   ? "border-blue-700" : "border-gray-500"} border-[1px] p-1 items-center justify-center`}>
                                            <Text className='text-white text-center text-[10px]'>{newQuestion.question}</Text>
                                            <View className='w-full border-t-[1px] border-gray-500 my-2'/>
                                            <Text className='text-white text-[10px]'>{newQuestion.answers[0]}</Text>
                                </TouchableOpacity> 
                            </View>
                        )
                    }}
                    renderItem={({ item,index }) => {
                        return (
                            <TouchableOpacity onPress={()=> setSelectedQuestion(index + 1)} className={`mx-3 my-2 w-[180px] h-[100px] bg-gray-800 rounded-[10px] ${selectedQuestion  == index +1   ? "border-blue-700" : "border-gray-500"} border-[1px] p-1 items-center justify-center`}>
                                    <View className='w-full items-center justify-center'>
                                        <Text className='text-white text-center text-[10px]'>{item.question}</Text>
                                        <View className='w-full border-t-[1px] border-gray-500 my-2'/>
                                        <Text className='text-white text-[10px]'>{item.answers[0]}</Text>
                                    </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        )
        }

export default Questions