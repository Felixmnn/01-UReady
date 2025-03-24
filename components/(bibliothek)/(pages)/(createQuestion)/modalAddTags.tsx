import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import { updateDocument, updateModule } from '@/lib/appwriteEdit';
import ModalEditTag from './modalEditTag';
import uuid from 'react-native-uuid';

const ModalAddTags = ({selectedModule, addTags, isVisible, setIsVisible, selectedTags, selectedQuestion, setNewQuestion}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    console.log(setNewQuestion ? "true" : "false")
    const [module, setModule] = useState(selectedModule.tags)
    const [newTag, setNewTag] = useState("")
    const [loading, setLoading] = useState(false)


   

    async function addTag() {
        setLoading(true)
        const t = JSON.stringify({name: newTag, color: null, id: uuid.v4()});
        selectedModule.tags.push(t);
        if (setNewQuestion) {
            setNewQuestion(
                {
                    ...selectedQuestion,
                    tags: [...selectedQuestion.tags, t]
                }
            )
        } else {
            selectedQuestion.tags.push(t);
            await updateDocument(selectedQuestion);
        }
        await updateModule(selectedModule);
        setNewTag("");
        setLoading(false);
    }

    async function removeTag(tag) {
        setLoading(true)
        const index = selectedQuestion.tags.indexOf(tag);
        if (setNewQuestion) {
            setNewQuestion(
                {
                    ...selectedQuestion,
                    tags: selectedQuestion.tags.filter((item) => item !== tag)
                }
            )
        } else {
            selectedQuestion.tags.splice(index, 1);
            await updateDocument(selectedQuestion);
        }
        setLoading(false);
    }

    async function connectTag(tag) {
        setLoading(true)
        if (setNewQuestion) {
            setNewQuestion(
                {
                    ...selectedQuestion,
                    tags: [...selectedQuestion.tags, JSON.stringify(tag)]
                }
            )
        } else {
            selectedQuestion.tags.push(JSON.stringify(tag));
            await updateDocument(selectedQuestion);
        }
        setLoading(false);
    }
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedTagIndex, setSelectedTagIndex] = useState(null);

    async function updateTags(newTag) {
        setLoading(true)

        const moduleIndex = selectedModule.tags.findIndex(item => (item).includes(newTag.id));
        const questionIndex = selectedQuestion.tags.findIndex(item => (item).includes(newTag.id));
        const mIndex = module.findIndex(item => (item).includes(newTag.id));
        module[mIndex] = JSON.stringify(newTag);
        selectedModule.tags[moduleIndex] = JSON.stringify(newTag);
        if (setNewQuestion) {
            setNewQuestion(
                {
                    ...selectedQuestion,
                    tags: [...selectedQuestion.tags, JSON.stringify(newTag)]
                }
            )
        } else {
            selectedQuestion.tags[questionIndex] = JSON.stringify(newTag);
            await updateDocument(selectedQuestion);
        }
        await updateModule(selectedModule);
        setLoading(false);
    }


 return (
    <View>
     {
        isVisible ? 
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <View className="absolute top-0 left-0 w-full h-full justify-center items-center ">
            <ModalEditTag  modalVisible={modalVisible} setModalVisible={setModalVisible} tag={selectedTag} selectedTagIndex={selectedTagIndex} updateTags={updateTags}/>
            <View className='rounded-xl bg-gray-900 border-[1px] border-gray-700 p-2' style={{minWidth:400}}>
                <Text className='text-white font-bold text-[12px]'>
                    {"Tags(optional)"}
                </Text>
                <TouchableOpacity 
                    className={`flex-row items-center  border-[1px] mt-2 p-2 rounded-[5px] max-w-[400px] ${dropdownVisible ? 'border-blue-500' : 'border-gray-500 '}`} 
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                    <View className='flex-1 flex-row items-center justify-start flex-wrap'>
                    {selectedTags && selectedTags.length > 0 ? (
                        selectedTags.map((tag, index) => {
                            const pTag = JSON.parse(tag);
                            return (
                                <TouchableOpacity
                                    key={index} 
                                        onPress={()=> {setSelectedTag(pTag); setSelectedTagIndex(index); setModalVisible(true)}} 
                                        className={`flex-row items-center justify-center  px-2 py-1 m-1 border-[1px] rounded-[5px]`}
                                        style={{
                                            backgroundColor:
                                            pTag.color === "red" ? "#DC2626" :
                                            pTag.color === "blue" ? "#2563EB" :
                                            pTag.color === "green" ? "#059669" :
                                            pTag.color === "yellow" ? "#CA8A04" :
                                            pTag.color === "orange" ? "#C2410C" :
                                            pTag.color === "purple" ? "#7C3AED" :
                                            pTag.color === "pink" ? "#DB2777" :
                                            pTag.color === "emerald" ? "#059669" :
                                            pTag.color === "cyan" ? "#0891B2" :
                                            "#1F2937",
                                            borderColor:
                                            pTag.color === "red" ? "#F87171" :      
                                            pTag.color === "blue" ? "#93C5FD" :     
                                            pTag.color === "green" ? "#6EE7B7" :    
                                            pTag.color === "yellow" ? "#FDE047" :   
                                            pTag.color === "orange" ? "#FDBA74" :   
                                            pTag.color === "purple" ? "#C4B5FD" :   
                                            pTag.color === "pink" ? "#F9A8D4" :     
                                            pTag.color === "emerald" ? "#6EE7B7" :  
                                            pTag.color === "cyan" ? "#67E8F9" :     
                                            "#4B5563"  
                                          }}
                                        >                                
                                        <Text className="text-white text-[12px]" >{pTag.name}</Text>
                                        <TouchableOpacity onPress={()=> removeTag(tag)} className='items-center justify-center ml-2 pt-[1px]'>
                                            <Icon name="times" size={10} color="white"/>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                            )
                        }
                            
                        )
                    ) : (
                        <View className='flex-row w-full items-center justify-between'>
                            <Text className='font-bold text-[12px] text-gray-500'>Füge Tags hinzu</Text>
                        </View> 
                    )}
                    </View>
                    
                </TouchableOpacity>
                {dropdownVisible && (
                    <View className="bg-gray-800 border border-gray-700 rounded-[5px]  p-2 z-10 ">
                        <View className='flex-row items-center justify-between mx-2'>
                            <TouchableOpacity className='mr-2'>
                                <Icon name="search" size={10} color="white"/>
                            </TouchableOpacity>
                            <TextInput
                                className={`flex-1 my-1 mr-2 text-white p-2 border-blue-700 rounded-[5px]`}
                                onChangeText={(text) => setNewTag(text)}
                                value={newTag}
                            />
                            <TouchableOpacity onPress={() => addTag()} className={`${loading ? "opacity-50" : ""}`}>
                                <Text className='text-white text-[12px]'>+ Hinzufügen</Text>
                            </TouchableOpacity>
                        </View>

                        {module && module.map((tag, index) => {
                            const pTag = JSON.parse(tag);
                            return (
                                <TouchableOpacity onPress={()=> connectTag(pTag)} className='flex-row items-center justify-between' key={pTag}>
                                    <TouchableOpacity
                                        onPress={()=> {setSelectedTag(pTag);setSelectedTagIndex(index); setModalVisible(true)}} 
                                        className={`flex-row items-center justify-center  px-2 py-1 m-1 border-[1px] rounded-[5px] }`}
                                        style={{
                                            backgroundColor:
                                            pTag.color === "red" ? "#DC2626" :
                                            pTag.color === "blue" ? "#2563EB" :
                                            pTag.color === "green" ? "#059669" :
                                            pTag.color === "yellow" ? "#CA8A04" :
                                            pTag.color === "orange" ? "#C2410C" :
                                            pTag.color === "purple" ? "#7C3AED" :
                                            pTag.color === "pink" ? "#DB2777" :
                                            pTag.color === "emerald" ? "#059669" :
                                            pTag.color === "cyan" ? "#0891B2" :
                                            "#1F2937",
                                            borderColor:
                                            pTag.color === "red" ? "#F87171" :      
                                            pTag.color === "blue" ? "#93C5FD" :     
                                            pTag.color === "green" ? "#6EE7B7" :    
                                            pTag.color === "yellow" ? "#FDE047" :   
                                            pTag.color === "orange" ? "#FDBA74" :   
                                            pTag.color === "purple" ? "#C4B5FD" :   
                                            pTag.color === "pink" ? "#F9A8D4" :     
                                            pTag.color === "emerald" ? "#6EE7B7" :  
                                            pTag.color === "cyan" ? "#67E8F9" :     
                                            "#4B5563"  
                                          }}
                                        >                                
                                        <Text className="text-white text-[12px]" >{pTag.name}</Text>
                                    </TouchableOpacity>
                                    {selectedQuestion.tags.includes(tag) ? ( <Icon name="check" size={10} color="white"/> ) : null}
                                </TouchableOpacity>
                            )
                        }
                        )}
                    </View>
                )}

            <View className='flex-row justify-between my-2'>
                <TouchableOpacity className='flex-row items-center justify-center py-2 px-3 border-[1px] border-gray-500 rounded-full '>
                    <Icon name="tag" size={10} color="white"/>
                    <Text className='text-white font-bold ml-2 text-[12px]'>Tags verwalten</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-white py-2 px-3 rounded-full' onPress={()=> setIsVisible(false)}>
                    <Text className=' font-bold text-[12px] text-gray-900'>Fertig</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
        :
        null
     }
    </View>
  )
}

export default ModalAddTags