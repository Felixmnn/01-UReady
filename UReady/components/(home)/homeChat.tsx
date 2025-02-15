import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import CustomTextInput1 from '../(general)/customTextInput1';
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomTextInputChat from '../(general)/customTextInputChat';


const HomeChat = ({setSelectedPage}) => {
    {/*Home Page mit chat Interface*/}
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const TouchableIcon = ({iconName, handlePress}) => {
        return (
            <TouchableOpacity onPress={handlePress} className='mx-3'>
                <Icon name={iconName} size={15}  color={"gray"}/>
            </TouchableOpacity>
        )
    }
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
        {
            _id: 1,
            text: 'Hallo! Wie kann ich dir helfen?',
            createdAt: new Date(),
            user: {
            _id: 2,
            name: 'Support-Bot',
            avatar: 'https://placekitten.com/100/100',
            },
        },
        ]);
    }, []);

  const onSend = useCallback((newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  return (
    <View className='flex-1 items-center '>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70 border-t-[1px] border-gray-700'></View> : null }
        <View className='flex-1 w-full bg-gradient-to-b from-[#001450] to-[#0c111e] rounded-[10px] border-gray-700 border-[1px]'>
            <View className='flex-row w-full justify-between rounded-[10px] bg-[#09162f] items-center p-4'>
                <View className='flex-row items-center'>
                    <Image
                               source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")}
                               style={{ width:50, height:50}}
                              />
                    <View className='m-2'>
                        <View className='flex-row items-center'>
                            <Text className='font-bold text-white mr-1'>Assistent</Text>
                            <Text className='bg-gray-700 items-center justify-center h-[14px] px-[1px] rounded-full text-gray-300 text-[10px]'>BETA</Text>
                        </View>
                        <Text className='text-[10px] text-gray-500'>Aktiv</Text>
                    </View>
                </View>
                <View className='flex-row'>
                    <TouchableIcon iconName={"undo"}/>
                    <TouchableIcon iconName={"chevron-down"} handlePress={()=> setSelectedPage("HomeGeneral")}/>

                </View>
            </View>
                <View className='flex-1'>
                    <GiftedChat
                        messages={messages}
                        onSend={(messages) => onSend(messages)}
                        user={{
                        _id: 1, // ID des aktuellen Nutzers
                        }}
                        placeholder="Schreibe eine Nachricht..."
                    />
                </View>
            <View className='flex-row p-3 items-center'>
                <TouchableOpacity className='rounded-full h-[40px] w-[40px] bg-gray-900 items-center justify-center border-gray-700 border-[1px]' onPress={()=> setIsVisibleDataUpload(true)} >
                    <Icon name="paperclip" size={15} color="gray"/>
                </TouchableOpacity>
                <View className=' pl-2 flex-1'>
                <CustomTextInputChat placeholder={"Frag mich was cooles..."} handlePress={()=> onSend(messages) }/>
                </View>
            </View>
        </View>
    </View>
  )
}

export default HomeChat