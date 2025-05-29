import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomTextInputChat from '../(general)/customTextInputChat';
import { v4 as uuidv4 } from 'uuid';

const HomeChat = ({setSelectedPage}) => {
    const [response, setResponse] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
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
    const [text,setText] = useState ("")
    
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
        {
            _id: 1,
            text: 'Hallo! Wobei kann ich dir heute helfen?',
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

  async function messageReply(message) {

    onSend(message)
    setButtonDisabled(true)
    setIsTyping(true)
    if (apiUrl){
        const res = await handleRequest()
        onSend({text:res,user:{"_id":2},createdAt:new Date(),_id:uuidv4()}) 
    } else {
        onSend({text:"Für eine Antwort fehlt der Api key",user:{"_id":2},createdAt:new Date(),_id:uuidv4()})
    }
    setButtonDisabled(false)
    setIsTyping(false)
  }
  const handleRequest = async () => {
    const apiKey = apiUrl; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Die Body-Daten für die Anfrage
    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: text}],
    });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`);
      }

      const data = await res.json();

      // Überprüfe, ob die Antwort `choices` enthält und greife auf den Text zu
      if (data && data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content.trim());  // Antworte mit dem Text
        return(data.choices[0].message.content.trim())
      } else {
        setResponse('Keine Antwort von OpenAI erhalten.');
        return('Keine Antwort von OpenAI erhalten.')
      }
    } catch (error) {
      console.error('Error fetching OpenAI API:', error);
      setResponse('Es gab einen Fehler bei der Anfrage!');
    }
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;

    // User message styling using NativeWind
    if (currentMessage.user._id === 1) {
      return (
        <View className="flex-row justify-end mb-2 mr-4">
          <View className="bg-blue-500 p-3 rounded-xl max-w-[70%]">
            <Text className="text-white text-base">{currentMessage.text}</Text>
            <Text className="text-gray-300 text-xs text-right mt-1">
                {currentMessage.createdAt.toLocaleTimeString()}            
          </Text>
          </View>
        </View>
      );
    } else {
      // Bot message styling using NativeWind
      return (
        <View className="flex-row mb-2 ml-4 ">
          <View className="bg-[0a1327] p-3 rounded-xl max-w-[70%] border-gray-700 border-[1px]">
            <Text className="text-white text-base font-semibold">{currentMessage.text}</Text>
            <Text className="text-gray-500 text-xs mt-1">
            {currentMessage.createdAt.toLocaleTimeString()}            
            </Text>
          </View>
        </View>
      );
    }
  };
 

  

  return (
    <View className='flex-1 items-center '>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70 border-t-[1px] border-gray-700'></View> : null }
        <View className='flex-1 w-full bg-gradient-to-b from-[#001450] to-[#0c111e] rounded-[10px] border-gray-700 border-[1px]'>
            <View className='flex-row w-full justify-between rounded-[10px] bg-[#09162f] items-center p-4'>
                <View className='flex-row items-center'>
                    <Image
                               source={require("../../assets/Check.gif")}
                               style={{ width:50, height:50}}
                              />
                    <View className='m-2'>
                        <View className='flex-row items-center'>
                            <Text className='font-bold text-white mr-1'>Assistent</Text>
                            <Text className='bg-gray-700 items-center justify-center h-[14px] px-[1px] rounded-full text-gray-300 text-[10px]'>BETA</Text>
                        </View>
                        <Text className='text-[10px] text-gray-500'>{isTyping ?  "Aktiv" : "BEREIT"}</Text>
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
                        onSend={(messages) => {onSend(messages)}}
                        user={{
                        _id: 1, // ID des aktuellen Nutzers
                        }}
                        placeholder="Schreibe eine Nachricht..."
                        renderInputToolbar={() => null}
                        isTyping={isTyping}
                        renderMessage={renderMessage}
                    />
                </View>
                
            <View className='flex-row p-3 items-center'>
                <TouchableOpacity className='rounded-full h-[40px] w-[40px] bg-gray-900 items-center justify-center border-gray-700 border-[1px]' onPress={()=> setIsVisibleDataUpload(true)} >
                    <Icon name="paperclip" size={15} color="gray"/>
                </TouchableOpacity>
                <View className=' pl-2 flex-1'>
                <CustomTextInputChat buttonDisabled={buttonDisabled} placeholder={"Frag mich was cooles..."}  text={text} setText={setText} handlePress={()=> {messageReply({text:text ,user:{"_id":1},createdAt:new Date(),_id:uuidv4()}), setText("")} }/>
                </View>
            </View>
        </View>
    </View>
  )
}

export default HomeChat