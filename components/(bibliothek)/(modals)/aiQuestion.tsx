import { View, Text, Modal, TouchableOpacity, Touchable, ActivityIndicator, TextInput,ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import uuid from 'react-native-uuid';
import { materialToQuestion } from '@/functions/(aiQuestions)/materialToQuestions';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addDocumentJob } from '@/lib/appwriteAdd';
import  languages  from '@/assets/exapleData/languageTabs.json';
import { Animated } from 'react-native';

const AiQuestion = ({isVisible, setQuestionLoadedSessions,module, setIsVisible,setErrorMessage, setIsError, setSelected ,selectedModule , selectedSession, setQuestions, questions, documents, sessions, setSessions, uploadDocument}) => {
const { userUsage, setUserUsage,language } = useGlobalContext()
 const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    useEffect(() => {
    if(language) {
        setSelectedLanguage(language)
    }
    }, [language])

const texts = languages.aiQuestion;


const [selectedType, setSelectedType] = useState("FILE")
const [promt, setPromt] = useState("")
const [selectedTopic, setSelectedTopic] = useState([])
const [isLoading, setIsLoading] = useState(false)


const [ selectedFile, setSelectedFile ] = useState(null)

const overlayOpacity = useRef(new Animated.Value(0)).current;
const [flashing, setFlashing] = useState(false);
const flashRed = () => {
  setFlashing(true);
  overlayOpacity.setValue(0);
  Animated.sequence([
    Animated.timing(overlayOpacity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }),
  ]).start(() => {
    // ⏳ Animation fertig
    setFlashing(false);
  });
};



const GenerateByFile = () => {
    
    return (
        <View className='flex-1 p-4 justify-between'>
            <Text className='text-gray-200'>
            {texts[selectedLanguage].selectFile}
            </Text>
            <View className='w-full rounded-[10px] border-gray-600 border-[1px] p-2 mt-2 border-dashed '>
                {
                    documents && documents.length > 0 ?
                    <ScrollView className=' overflow-y-auto '
                    style={{ maxHeight: 150 }}
                    >
                        {
                        documents.map((item, index) => {
                            return (
                                <TouchableOpacity onPress={()=> setSelectedFile(item)} key={index} className='flex-row items-center justify-between bg-gray-800 rounded-[10px] p-2 mt-2'
                                    style={{
                                        borderColor: selectedFile?.$id == item.$id ? "#2196f3" : "#0c111d",
                                        borderWidth: selectedFile?.$id == item.$id ? 2 : 1,
                                        backgroundColor: selectedFile?.$id == item.$id ? 'rgba(33, 150, 243, 0.5)' : "#0c111d",
                                    }}
                                >
                                    <View className='flex-row items-center'>
                                        <Icon name="file-pdf" size={20} color="white"/>
                                        <Text className='text-gray-300 ml-2 font-bold'>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    </ScrollView>
                    : 
                    <View className="items-center justify-center" style={{ height: 150 }}  >
                        <TouchableOpacity onPress={()=> uploadDocument()}  className='flex-row items-center justify-center bg-gray-800 rounded-full p-2 mt-2'>
                            <Icon name="upload" size={20} color="white"/>
                            <Text className='text-gray-300 ml-2 font-bold'>{texts[selectedLanguage].uploadDocument}</Text>
                        </TouchableOpacity>
                    </View>
                }   
            </View>
            { selectedFile == null ?
            <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
                <Text className='text-gray-300 ml-2 font-bold'>{texts[selectedLanguage].sumDocument}</Text>
            </TouchableOpacity>
            :
            <View className="w-full relative justify-center "
            style={{
                maxHeight: 50
            }}
            >
            {/* Dein Button */}
            <GratisPremiumButton
                aditionalStyles={"w-full relative bg-blue-500"}
                handlePress={() => {
                if (userUsage.energy < 3 ) {

                    flashRed();
                    
                    return;
                }
                createDocumentJob();
                }}
            >
                {isLoading ? (
                <ActivityIndicator size="small" color="#00ff00" />
                ) : (
                <View className="flex-row relative items-center">
                    <Text className="text-white font-semibold text-[15px] mb-1">
                    Karteikarten für 3
                    </Text>
                    <Icon name="bolt" size={15} color="white" className="ml-2" />
                    <Text className="text-white ml-2 font-bold mb-1">generieren.</Text>
                </View>
                )}
            </GratisPremiumButton>
            {
            flashing ?
            <>
            <Animated.View
            className=' absolute  w-full bg-red-500 rounded-full'
            style={{
                height: 30,
                opacity: overlayOpacity,
                bottom: 35,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderRadius: 15

                

            }} 
        
            />
            <Text className='absolute text-red-900 font-bold text-center w-full top-6'>
                {texts[selectedLanguage].notEnoughEnergy}
            </Text>
            </>
            : null
        }

            {/* 🔴 Overlay über dem Button */}
           
            </View>
            }
        </View>
    )
}
async function createDocumentJob() {
    if (userUsage.energy < 3 ) {
        setErrorMessage("You don't have enough energy to summarize this document. Please wait until your energy is recharged or buy some in the shop.")
        setIsError(true)
        return
    } 
    const job = {
        databucketID: selectedFile.databucketID,
        subjectID: selectedModule.$id,
        sessionID: selectedSession ? selectedSession.id : sessions[0].id,
    }
    if ( !job.databucketID || !job.subjectID || !job.sessionID) {
        setErrorMessage("Please select a file, module and session to create a job.")
        setIsError(true)
        return
    }
    await addDocumentJob(job)
    setSessions((prevSessions) => {
        const newSessions = [...prevSessions];
        const targetSessionId = selectedSession ? selectedSession.id : sessions[0].id;
        const sessionIndex = sessions.findIndex((session) => session.id === targetSessionId);
        if (sessionIndex !== -1) {
            newSessions[sessionIndex].tags = "JOB-PENDING";
        }
        return newSessions;
    })
    setUserUsage({
        ...userUsage,
        energy: userUsage.energy - 3
    })
    setIsVisible(false)
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
    setItems([...items, {...newitem, id: uuid.v4(), sessionID:selectedSession ? selectedSession.id : sessions[0].id}]);
    setNewItem({ ...newitem, content: '' });
};
const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }; 

return (
    <View className='' >
                {
    isVisible ? 
    <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    > 
        <View className="h-full w-full absolute top-0 left-0   justify-center items-center p-2  "
        style={{ backgroundColor: 'rgba(17, 24, 39,0.7)' }}
        >
            <View className='w-full h-full  max-w-[400px] bg-[#0c111d] border-gray-700 rounded-xl'

                style={{ borderWidth: 2, maxHeight: 400 }}>
                <TouchableOpacity  onPress={() => setIsVisible(false)} 
                    className=' p-4  flex-row justify-between '>
                    <Text className='text-gray-300 font-bold mr-2 '>{texts[selectedLanguage].title}</Text>
                    <Icon name="times" size={20} color="white"/>
                </TouchableOpacity>
                <View className='flex-row items-center justify-between bg-[#0c111d] '>
                    <TouchableOpacity onPress={()=> setSelectedType("FILE")} className={`flex-1 p-2 border-blue-600 items-center mx-2 ${selectedType == "FILE" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "FILE" ? "text-white" : null}`}>{texts[selectedLanguage].file}</Text>      
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setSelectedType("TOPIC")} className={`flex-1 p-2 border-blue-600 items-center mx-2 ${selectedType == "TOPIC" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "FILE" ? "text-white" : null}`}>{texts[selectedLanguage].topic}</Text>      
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setSelectedType("TEXT")} className={`flex-1 p-2 border-blue-600  items-center  mx-2 ${selectedType == "TEXT" ? "border-b-[2px] " : null}`}>
                        <Text className={`text-gray-200 text-[15px] ${selectedType == "TEXT" ? "text-white" : null}`}>{texts[selectedLanguage].text}</Text>
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
                            maxLength={2000}
                            onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                            value={newitem.content}
                            className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
                            style={{
                                height:76,
                                textAlign: 'left',
                                justifyContent: 'start',
                                textAlignVertical: 'top',   
                            }}
                            />
                            
                        </View>
                        <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].yourTopics}</Text>
                                  <View className="flex-row flex-wrap justify-start items-center mb-2">
                                    {items.length > 0 ? (
                                      items.filter(item => item.sessionID == selectedSession ? selectedSession.id : sessions[0].id).map((item, index) => {
                                        const iconMap = {
                                          TOPIC: 'layer-group',
                                          PEN: 'pen',
                                          FILE: 'file',
                                        };
                                        return (
                                          <TouchableOpacity
                                            key={index}
                                            className="bg-[#0c111d] flex-row px-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
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
                                            {texts[selectedLanguage].noMaterials}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  { items.length == 0 ?
                                    <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
                                        <Text className='text-gray-300 ml-2 font-bold'>{texts[selectedLanguage].generateCards}</Text>
                                    </TouchableOpacity>
                                    :
                                    <GratisPremiumButton aditionalStyles={"w-full bg-blue-500"} handlePress={async ()=> {
                                        if (userUsage.energy < items.length * 1) {
                                            setErrorMessage("You don't have enough energy to generate these cards. Please wait until your energy is recharged or buy some in the shop.")
                                            setIsError(true)
                                            return
                                        }
                                        const res = await materialToQuestion(
                                            items.filter(item => item.sessionID == selectedSession ? selectedSession.id : sessions[0].id), 
                                            selectedSession ? selectedSession.id : sessions[0].id, 
                                            selectedModule.$id, 
                                            setQuestions, 
                                            questions, 
                                            setIsLoading, 
                                            module,
                                            
                                        )
                                        setUserUsage({
                                        ...userUsage,
                                        energy: userUsage.energy - items.length * 1
                                        })
                                        setQuestions([...questions, ...res])
                                        setQuestionLoadedSessions([])
                                        setItems([])
                                        setIsVisible(false)
                                    }}>
                                        {
                                            isLoading ?
                                            <ActivityIndicator size="small" color="#00ff00" />
                                            :
                                            <View className='flex-row items-center'>
                                                            <Text className='text-white  font-semibold text-[15px] mb-1'>Karteikarten für {items.length*1}</Text>
                                                            <Icon name="bolt" size={15} color="white" className="ml-2" />
                                                            <Text className='text-white ml-2 font-bold mb-1'>generieren.</Text>
                                            </View>

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
                            maxLength={2000}
                            onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                            value={newitem.content}
                            
                            className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
                            style={{
                                height:76,
                                textAlign: 'left',
                                justifyContent: 'start',
                                textAlignVertical: 'top',      

                            }}
                            />
                            
                        </View>
                        <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].yourTexts}</Text>
                                  <View className="flex-row flex-wrap justify-start items-center mb-2">
                                    {items.length > 0 ? (
                                      items.filter(item => item.sessionID == selectedSession ? selectedSession.id : sessions[0].id).map((item, index) => {
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
                                            {texts[selectedLanguage].noMaterials}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  { items.length == 0 ?
                                    <TouchableOpacity disabled={true} className={`flex-row items-center justify-center bg-gray-700 rounded-full p-2 mt-2 opacity-50`}>
                                        <Text className='text-gray-300 ml-2 font-bold'>{texts[selectedLanguage].generateCards}</Text>
                                    </TouchableOpacity>
                                    :
                                    <GratisPremiumButton aditionalStyles={"w-full bg-blue-500"} handlePress={async ()=> {
                                        if (userUsage.energy < items.length * 1) {
                                            setErrorMessage("You don't have enough energy to generate these cards. Please wait until your energy is recharged or buy some in the shop.")
                                            setIsError(true)
                                            return
                                        }
                                        const res = await materialToQuestion(
                                            items.filter(item => item.sessionID == selectedSession ? selectedSession.id : sessions[0].id), 
                                            selectedSession ? selectedSession.id : sessions[0].id, 
                                            selectedModule.$id, 
                                            setQuestions, 
                                            questions, 
                                            setIsLoading, 
                                            module
                                        )
                                        setUserUsage({
                                        ...userUsage,
                                        energy: userUsage.energy - items.length * 1
                                        })
                                        setQuestions([...questions, ...res])
                                        setItems([])
                                        setIsVisible(false)
                                    }}>
                                        {
                                            isLoading ?
                                            <ActivityIndicator size="small" color="#00ff00" />
                                            :
                                            <View className='flex-row items-center'>
                                                            <Text className='text-white  font-semibold text-[15px] mb-1'>Karteikarten für {items.length*1}</Text>
                                                            <Icon name="bolt" size={15} color="white" className="ml-2" />
                                                            <Text className='text-white ml-2 font-bold mb-1'>generieren.</Text>
                                            </View>
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