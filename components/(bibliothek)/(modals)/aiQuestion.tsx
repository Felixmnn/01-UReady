import { View, Text, Modal, TouchableOpacity, Touchable, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import { generateQuestionsFromText } from '@/functions/(aiQuestions)/questionFromText';
import { questionFromTopic } from '@/functions/(aiQuestions)/questionFromTopic';
import { addQUestion } from '@/lib/appwriteEdit';
import uuid from 'react-native-uuid';
import { materialToQuestion } from '@/functions/(aiQuestions)/materialToQuestions';


const AiQuestion = ({isVisible, setIsVisible, setSelected ,selectedModule , selectedSession, setQuestions, questions}) => {
console.log("🐋🐋🐋", questions)
const [selectedType, setSelectedType] = useState("FILE")
const [promt, setPromt] = useState("")
const [topics, setTopics] = useState(["Algorythmen", "Datenstrukturen", "Java", "C++"])
const [selectedTopic, setSelectedTopic] = useState([])
const [settingsVisible, setSettingsVisible] = useState(false)
const [isLoading, setIsLoading] = useState(false)
console.log(selectedSession)

async function generateItems(type) {
    setIsLoading(true)

    if (type == "TEXT") {
        const res = await generateQuestionsFromText(promt, 10, selectedSession.id, selectedModule.$id)
        console.log(res)
        const match = res.match(/\[.*\]/s);
        const jsonData = JSON.parse(match[0]);
        console.log(jsonData)
        for (let i = 0; i < jsonData.length; i++) {
            try {
                jsonData[i].sessionID = selectedSession.id;
                jsonData[i].subjectID = selectedModule.$id;
                await addQUestion(jsonData[i])
                setQuestions([...questions, jsonData[i]])

            } catch (error) {
                console.log(error)
            }

        }
    } else if (type == "TOPIC") {
        const res = await questionFromTopic(selectedTopic, selectedSession.id, selectedModule.$id)
        console.log(res)
        const match = res.match(/\[.*\]/s);
        const jsonData = JSON.parse(match[0]);
        console.log(jsonData)
        for (let i = 0; i < jsonData.length; i++) {
            try {
                await addQUestion(jsonData[i])
                setQuestions([...questions, jsonData[i]])

            } catch (error) {
                console.log(error)
            }

        }
    } else if (type == "FILE") {
    }

    setIsLoading(false)
    setIsVisible(false);

}


const GenerateByFile = () => {
    return (
        <View className='flex-1 p-4 justify-between'>
            <Text className='text-gray-200'>
                Wähle eine Datei aus:
            </Text>
            <View className='w-full rounded-[10px] border-gray-600 border-[1px] p-2 mt-2 border-dashed'>
                <Text className='text-gray-200 text-[12px]'>Ziehe eine Datei hier hin oder lade sie hoch</Text>
                <TouchableOpacity className='flex-row items-center justify-center bg-gray-800 rounded-full p-2 mt-2'>
                    <Icon name="upload" size={20} color="white"/>
                    <Text className='text-gray-300 ml-2 font-bold'>Dokument hochladen</Text>
                </TouchableOpacity>
            </View>
            { true ?
            <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
            <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text>
            </TouchableOpacity>
            :
            <GratisPremiumButton aditionalStyles={"w-full"} handlePress={()=> generateItems("FILE")}>
                {
                    isLoading ?
                     <ActivityIndicator size="small" color="#00ff00" />
                     :
                     <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text> 

                }
            </GratisPremiumButton>
            }
        </View>
    )
}



const [items, setItems] = useState([]); 
const [newitem, setNewItem] = useState({
    type: 'PEN',
    content: '',
    uri: null,
    sessionID:null,
    id:null
  });
const addItem = () => {
    setItems([...items, {...newitem, id: uuid.v4(), sessionID:selectedSession.id}]);
    setNewItem({ ...newitem, content: '' });
};
const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

return (
    <View >
                {
    isVisible ? 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <View className="h-full w-full absolute top-0 left-0   justify-center items-center p-2 ">
            <View className='w-full max-w-[400px] bg-[#0c111d] border-gray-700 rounded-xl'
                style={{ borderWidth: 2 }}>
                <TouchableOpacity  onPress={() => setIsVisible(false)} 
                    className=' p-4  flex-row justify-between '>
                    <Text className='text-gray-300 font-bold mr-2 '>Generiere Karteikarten mit AI aus...</Text>
                    <Icon name="times" size={20} color="white"/>
                </TouchableOpacity>
                <View className='flex-row items-center justify-between bg-[#0c111d] '>
                    <TouchableOpacity onPress={()=> setSelectedType("FILE")} className={`flex-1 p-2 border-blue-600 items-center mx-2 ${selectedType == "FILE" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "FILE" ? "text-white" : null}`}>Datei</Text>      
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setSelectedType("TOPIC")} className={`flex-1 p-2 border-blue-600 items-center mx-2 ${selectedType == "TOPIC" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "FILE" ? "text-white" : null}`}>Topic</Text>      
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setSelectedType("TEXT")} className={`flex-1 p-2 border-blue-600  items-center  mx-2 ${selectedType == "TEXT" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "TEXT" ? "text-white" : null}`}>Text</Text>
                    </TouchableOpacity>
                </View>  
                <View className='flex-1 min-h-[250px] bg-gray-800    rounded-b-[10px]'>
                    {
                        selectedType == "FILE" ?
                        <GenerateByFile/>
                        :
                        selectedType == "TOPIC" ?
                        <View className='flex-1 p-4 justify-between'>
                        <View className="flex-row items-start ">
                            <View className='items-center justify-between mt-2 mb-2 ml-2'>
                            <TouchableOpacity
                                disabled={newitem.content.length < 2}
                                onPress={addItem}
                                className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                style={{ height: 34, width: 34,marginBottom:5 }}
                            >
                                <Icon name="plus" size={15} color="#4B5563" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                disabled={newitem.content.length < 2}
                                onPress={() => handleDeleteItem(newitem.id)}

                                className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                style={{ height: 34, width: 34 }}
                            >
                                <Icon name="trash" size={15} color="#C62828" />
                            </TouchableOpacity>
                            </View>
                            <TextInput
                            multiline
                            numberOfLines={5}
                            maxLength={5000}
                            onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                            value={newitem.content}
                            className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
                            style={{
                                height:112,
                                textAlign: 'left',
                                justifyContent: 'start',
                            }}
                            />
                            
                        </View>
                        <Text className="text-gray-300 font-semibold text-[15px]">Deine Themen:</Text>
                                  <View className="flex-row flex-wrap justify-start items-center mb-2">
                                    {items.length > 0 ? (
                                      items.filter(item => item.sessionID == selectedSession.id).map((item, index) => {
                                        const iconMap = {
                                          TOPIC: 'layer-group',
                                          PEN: 'pen',
                                          FILE: 'file',
                                        };
                                        return (
                                          <TouchableOpacity
                                            key={index}
                                            className="bg-[#0c111d] flex-row p-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                            style={{ height: 30 }}
                                            onPress={() => {
                                              setNewItem({ ...newitem, content: item.content, type: item.type, uri: item.uri, sessionID:item.sessionID, id:item.id });
                                            }}
                                          >
                                            <Icon name={iconMap[item.type]} size={15} color="#4B5563" />
                                            <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                                              {item.content.length > 20
                                                ? item.content.substring(0, 20) + '...'
                                                : item.content}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      })
                                    ) : (
                                      <TouchableOpacity
                                        className="bg-[#0c111d] flex-row p-2 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                        style={{ height: 30, width: 180 }}
                                      >
                                        <Icon name="book-open" size={15} color="#4B5563" />
                                        <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                                          Noch keine Materialien
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  { items.length == 0 ?
                                    <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
                                        <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text>
                                    </TouchableOpacity>
                                    :
                                    <GratisPremiumButton aditionalStyles={"w-full"} handlePress={async ()=> {
                                        const res = await materialToQuestion(
                                            items.filter(item => item.sessionID == selectedSession.id), 
                                            selectedSession.id, 
                                            selectedModule.$id, 
                                            setQuestions, 
                                            questions, 
                                            setIsLoading, 
                                        )
                                        setQuestions([...questions, ...res])
                                        setItems([])
                                        setIsVisible(false)
                                    }}>
                                        {
                                            isLoading ?
                                            <ActivityIndicator size="small" color="#00ff00" />
                                            :
                                            <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text> 

                                        }
                                    </GratisPremiumButton>
                                    }
                    </View>
                        :
                        <View className='flex-1 p-4 justify-between'>
                        <View className="flex-row items-start ">
                            <View className='items-center justify-between mt-2 mb-2 ml-2'>
                            <TouchableOpacity
                                disabled={newitem.content.length < 2}
                                onPress={addItem}
                                className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                style={{ height: 34, width: 34,marginBottom:5 }}
                            >
                                <Icon name="plus" size={15} color="#4B5563" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                disabled={newitem.content.length < 2}
                                onPress={() => handleDeleteItem(newitem.id)}

                                className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                style={{ height: 34, width: 34 }}
                            >
                                <Icon name="trash" size={15} color="#C62828" />
                            </TouchableOpacity>
                            </View>
                            <TextInput
                            multiline
                            numberOfLines={5}
                            maxLength={5000}
                            onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                            value={newitem.content}
                            className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
                            style={{
                                height:112,
                                textAlign: 'left',
                                justifyContent: 'start',
                            }}
                            />
                            
                        </View>
                        <Text className="text-gray-300 font-semibold text-[15px]">Deine Texte:</Text>
                                  <View className="flex-row flex-wrap justify-start items-center mb-2">
                                    {items.length > 0 ? (
                                      items.filter(item => item.sessionID == selectedSession.id).map((item, index) => {
                                        const iconMap = {
                                          TOPIC: 'layer-group',
                                          PEN: 'pen',
                                          FILE: 'file',
                                        };
                                        return (
                                          <TouchableOpacity
                                            key={index}
                                            className="bg-[#0c111d] flex-row p-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                            style={{ height: 30 }}
                                            onPress={() => {
                                              setNewItem({ ...newitem, content: item.content, type: item.type, uri: item.uri, sessionID:item.sessionID, id:item.id });
                                            }}
                                          >
                                            <Icon name={iconMap[item.type]} size={15} color="#4B5563" />
                                            <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                                              {item.content.length > 20
                                                ? item.content.substring(0, 20) + '...'
                                                : item.content}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      })
                                    ) : (
                                      <TouchableOpacity
                                        className="bg-[#0c111d] flex-row p-2 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                        style={{ height: 30, width: 180 }}
                                      >
                                        <Icon name="book-open" size={15} color="#4B5563" />
                                        <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                                          Noch keine Materialien
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  { items.length == 0 ?
                                    <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
                                        <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text>
                                    </TouchableOpacity>
                                    :
                                    <GratisPremiumButton aditionalStyles={"w-full"} handlePress={async ()=> {
                                        const res = await materialToQuestion(
                                            items.filter(item => item.sessionID == selectedSession.id), 
                                            selectedSession.id, 
                                            selectedModule.$id, 
                                            setQuestions, 
                                            questions, 
                                            setIsLoading, 
                                        )
                                        setQuestions([...questions, ...res])
                                        setItems([])
                                        setIsVisible(false)
                                    }}>
                                        {
                                            isLoading ?
                                            <ActivityIndicator size="small" color="#00ff00" />
                                            :
                                            <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text> 

                                        }
                                    </GratisPremiumButton>
                                    }
                    </View>
                    }
                </View>
            </View>
        </View>
    </Modal>
    : null
}
        </View>
  )
}

export default AiQuestion