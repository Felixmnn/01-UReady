import { View, Text, Modal, TouchableOpacity, Touchable } from 'react-native'
import React, { useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomTextInput1 from '@/components/(general)/customTextInput1';
import AiQuestionSettings from './aiQuestionSettings';

const AiQuestion = ({isVisible, setIsVisible, setSelected ,sessions}) => {
const [selectedType, setSelectedType] = useState("FILE")
const [promt, setPromt] = useState("")
const [topics, setTopics] = useState(["Algorythmen", "Datenstrukturen", "Java", "C++"])
const [selectedTopic, setSelectedTopic] = useState([])
const [settingsVisible, setSettingsVisible] = useState(false)
return (
    <View >
        <AiQuestionSettings isVisible={settingsVisible} setIsVisible={setSettingsVisible} sessions={sessions} />
                {
    isVisible ? 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <View 
            className="absolute top-0 left-0 w-full h-full justify-center items-center" 
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.5)' }}  // 50% Transparenz
        >
            <View className='min-w-[400px] bg-gray-800 border-gray-700 border-[1px] rounded-xl'>
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
                <View className='flex-1 min-h-[250px]'>
                    {
                        selectedType == "FILE" ?
                        <View className='flex-1 p-4 justify-between'>
                            <Text className='text-gray-200'>
                                Wähle eine Datei aus:
                            </Text>
                            <View className='w-full rounded-[10px] border-gray-600 border-[1px] p-2 mt-2 border-dashed'>
                                <Text className='text-gray-200 text-[12px]'>Ziehe eine Datei hier hin oder lade sie hoch</Text>
                                <TouchableOpacity className='flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2'>
                                    <Icon name="upload" size={20} color="white"/>
                                    <Text className='text-gray-300 ml-2 font-bold'>Dokument hochladen</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={()=> {setIsVisible(false);setSettingsVisible(true)}} disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 ${true ? "opacity-50" : null}`}>
                                <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text> 
                            </TouchableOpacity>
                        </View>
                        :
                        selectedType == "TOPIC" ?
                        <View className='flex-1  p-4 justify-between'>
                            <View>
                            <Text className='text-gray-200'>
                                Wähle mindestens ein Thema aus:
                            </Text>
                            <View className='flex-row flex-wrap mt-2'>
                                {
                                    topics.map((topic) => (
                                        <TouchableOpacity key={topic} className={` rounded-[5px] p-1 m-1 border-[1px] ${selectedTopic.includes(topic) ? "border-blue-500" : "border-gray-500"}`} onPress={()=> {
                                            if (selectedTopic.includes(topic)) {
                                                setSelectedTopic(selectedTopic.filter((item) => item !== topic))
                                            } else {
                                                setSelectedTopic([...selectedTopic, topic])
                                            }
                                        }}>
                                            <Text className='text-gray-300'>{topic}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                            </View>
                            <View className='border-gray-500 border-t-[1px] my-2'/> 
                            <Text className={`text-gray-200 my-2 text-center ${selectedTopic.length == 0 ? "text-red-500" : null}` }>{selectedTopic.length > 0 ? `Das gibt ${10 + (selectedTopic.length -1) * 6} Karteikarten` : "Wähle ein Thema"}</Text>
                            <TouchableOpacity onPress={()=> {setIsVisible(false);setSettingsVisible(true)}} disabled={selectedTopic.length == 0} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 ${selectedTopic.length == 0 ? "opacity-50" : null}`}>
                                <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text> 
                            </TouchableOpacity>
                        </View>
                        :
                        <View className='flex-1 p-4 justify-between'>
                            <CustomTextInput1 value={promt.length > 0 ? promt : "Gib einen Text ein"} placeholder="Text eingeben" inputStyles={"bg-gray-900"} onChange={setPromt} multiline={true} numberOfLines={5} />
                            <View className='flex-row items-center justify-between m-2'>
                            <View className='flex-row items-center justify-center'>
                                {
                                    promt.length < 150 ?
                                    <Text className='text-red-500 text-[12px]'>Text muss mindestens 150 zeichen lang sein</Text>
                                    :
                                    null
                                }
                            </View>
                            <Text className={`text-end text-gray-200 text-[12px] ${promt.length < 100 ? "text-red-500" : null}`} >
                                {promt.length}/1000 Zeichen
                            </Text>
                            </View>
                            <TouchableOpacity onPress={()=> {setIsVisible(false);setSettingsVisible(true)}} disabled={promt.length < 150} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 ${promt.length < 150 ? "opacity-50" : null}`}>
                            <Text className='text-gray-300 ml-2 font-bold'>Karten generieren</Text>
                            </TouchableOpacity>
                            
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