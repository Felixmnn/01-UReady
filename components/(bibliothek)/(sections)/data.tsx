import { View, Text,FlatList, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions, Modal } from 'react-native'
import React, { useState } from 'react'
import { quizQuestion } from '@/assets/exapleData/quizQuestion'
import Icon from "react-native-vector-icons/FontAwesome5";  
import  { router } from "expo-router"

const Data = ({selected,moduleSessions,questions,notes,documents,deleteDocument, addDocument}) => {


const filteredData = (selected > moduleSessions.length) ? questions : questions.filter((item) => item.sessionID == moduleSessions[selected].id)
const filteredNotes = (selected > moduleSessions.length) ? notes : notes.filter((item) => item.sessionID == moduleSessions[selected].id)
const filteredDocuments = (selected > moduleSessions.length) ? documents : documents.filter((item) => item.sessionID == moduleSessions[selected].id)
console.log("Filtered Data:", questions)

const CounterText = ({title,count}) => {
    return (
        <View className='flex-row justify-start items-center '>
        <Text className='text-white my-2'>{title}</Text>
        <Text className='ml-1 text-white text-[12px] px-1 rounded-[5px] bg-gray-700'>{count}</Text>
        </View>
    )
}

const AddData = ({title, subTitle, button, handlePress}) => {
    return (
    <View className='flex-row p-2 bg-gray-800 rounded-[10px] items-start justify-start border-[1px] border-gray-500 border-dashed'>
            <View className="items-center justify-center p-2">
                <Icon name="file" size={25} color="white"/>
            </View>
            <View className="ml-2">
                <Text className='text-white'>{title}</Text>
                <Text className='text-gray-300 text-[12px]'>{subTitle}</Text> 
                <TouchableOpacity onPress={handlePress} className='rounded-full p-2 bg-gray-800 flex-row items-center justify-center border-[1px] border-gray-600 mt-2'>
                    <Icon name="plus" size={15} color="white"/>
                    <Text className='ml-2 text-gray-300 text-[12px]'>{button}</Text>  
                </TouchableOpacity>
            </View>
        </View>
    )
}
const Status = ({status}) => {
    let color = "blue"
    let bgColor = "bg-blue-500"
    let smiley = "grin"
    if (status == "BAD") {
        color = "red"
        bgColor = "bg-red-700"
        smiley = "frown"
    } else if (status == "OK") {
        color = "yellow"
        bgColor = "bg-yellow-500"
        smiley = "meh"
    } else if (status == "GOOD") {
        color = "green"
        bgColor = "bg-green-500"
        smiley = "smile"
    }else {
        color = "blue"
        bgColor = "bg-blue-500"
        smiley = "grin"
    }
    return (
        <View className={`items-center justify-center rounded-full h-[20px] w-[20px] pt-[1px] ${bgColor}`}>
            <Icon name={smiley} size={15} color={color}/>
        </View>
    )
}
const {width, height} = useWindowDimensions();
const isVertical = width == 700;

const Selectable = ({icon, bgColor, iconColor, empfolen, title, handlePress}) => {
        return (
            <TouchableOpacity onPress={handlePress} 
                className=' justify-between w-full  min-h-[130px] flex-1 p-3 rounded-10px border-gray-600 border-[1px] rounded-[10px] m-2'
              
                >
                <View className={`h-[45px] w-[45px] ${bgColor} items-center justify-center rounded-full`}>
                    <Icon name={icon} size={25} color={iconColor}/>
                </View>
                { empfolen ?
                    <View className='items-center justify-center border-[1px] border-green-500 bg-green-700 bg-opacity-10 rounded-[5px] max-w-[60px]'>
                        <Text className='text-green-500 text-[10px]'>Empfohlen</Text>
                    </View>
                    :
                    null
                }
                <View className='flex-row items-center justify-between'>
                    <Text className='text-gray-200 font-bold text-[15px] pr-2'>{title}</Text>
                    <Icon name="chevron-right" size={20} color="white"/>
                </View>
            </TouchableOpacity>
        )
    }
    const [wrongType, setWrongType] = useState(false);
const NichtUnterstuzterDateityp = () => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={wrongType}
        >
        <TouchableOpacity onPress={()=> setWrongType(false)} className='flex-1 items-center justify-start mt-10'>
            <View className='bg-red-800 p-4 rounded-[10px]'>
                <Text className='text-white'>Dieser Dateityp wird nicht unterstützt</Text>
            </View>
        </TouchableOpacity>
        </Modal>
    )
}

    
return (
    <ScrollView className='' style={{
        scrollbarWidth: 'thin', // Dünne Scrollbar
        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
      }}>
        <NichtUnterstuzterDateityp/>
        {
            filteredData.length == 0 && filteredDocuments.length == 0 && filteredNotes.length == 0 ?
            <View className='p-4 flex-1 items-center justify-center'>
                
                <View className={`${width > 815 &&  width > 700? "flex-row" : "flex-col"} w-full`}>
                    <Selectable icon={"robot"} iconColor={"#7a5af8"} bgColor={"bg-[#372292]"} title={"AI Quiz Generieren"} empfolen={true} />
                    <Selectable icon={"file-pdf"} iconColor={"#004eea"} bgColor={"bg-[#00359e]"} title={"Dokument hinzufügen"} empfolen={false} handlePress={()=> {}}/>
                </View>
                <View className={`${width > 815 &&  width > 700? "flex-row" : "flex-col"} w-full`}>
                    <Selectable icon={"file-alt"} iconColor={"#c1840b"} bgColor={"bg-[#713b12]"} title={"Erstelle Fragen"} empfolen={false}  />
                    <Selectable icon={"sticky-note"} iconColor={"#15b79e"} bgColor={"bg-[#134e48]"} title={"Erstelle eine Notiz"} empfolen={false} />
                </View>
            </View>
            :
            <View className='flex-1'>
        <CounterText title='Fragen' count={filteredData.length}/>
        {filteredData ? 
        <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            style={{
                scrollbarWidth: 'thin', // Dünne Scrollbar
                scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
              }}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity 
                        onPress={()=> router.push({
                            pathname:"quiz",
                            params: {questions: JSON.stringify(filteredData)}
                        })} 
                        className='p-4 w-[180px] m-1 justify-between items-center p-4 border-[1px] border-gray-600 rounded-[10px] bg-gray-800'>
                        <View className='w-full justify-between flex-row items-center '>
                            {item.status !== null ? <Status status={item.status}/> : null}
                            <View className='bg-gray-900 rounded-[5px] items-center justify-cneter'>
                                <Text className="m-1 text-white text-[10px] px-1">+ Tags hinzufügen</Text>
                                
                            </View>
                            <Icon name="robot" size={15} color="white"/>
                        </View>
                        <Text className='text-white'>{item.question}</Text>
                        <View className='border-b-[1px] border-gray-600 my-4 w-full'/>
                        <View className='w-full items-end pr-2'> 
                            <Icon name="ellipsis-h" size={15} color="white"/>
                        </View>
                    </TouchableOpacity>
                )
            }}
            horizontal={true}
        /> : null}
        {filteredData.length == 0 ? <AddData title={"Fragen hinzufügen"} subTitle={"Erstelle deine ersten Fragen"} button={"Dokument hochladen"}  handlePress={()=> addDocument()}/> : null}

        <CounterText title='Dateien' count={filteredDocuments.length}/>{
            documents ? 
            <FlatList
            data={filteredDocuments}
            keyExtractor={(item) => item.$id}
            className='w-full'
            style={{
                scrollbarWidth: 'thin', // Dünne Scrollbar
                scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
              }}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity onPress={() => {
                        const fileType = item.fileType;
                    
                        if (fileType === "application/pdf") {
                            router.push({
                                pathname: "pdf",
                                params: { item: JSON.stringify(item) }
                            });
                        } else if (fileType === "application/msword" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                            router.push({
                                pathname: "word",
                                params: { item: JSON.stringify(item) }
                            });
                        } else {
                            setWrongType(true);
                            console.log("Unbekannter Dateityp:", fileType);
                        }
                    }}
                            className='w-full flex-row justify-between  p-2 border-b-[1px] border-gray-600'>
                        <View className='flex-row items-start justify-start'>
                            <Icon name="file" size={40} color="white"/>
                            <Text className='text-white mx-2 font-bold text-[14px]'>{item.title ? item.title : "Unbenannt"}</Text>
                        </View>
                        <View className='flex-row items-center justify-between'>
                        { item.uploaded ?
                        null
                        :
                        <ActivityIndicator size="small" color="#1E90ff" />
                        }
                        {
                            item.uploaded ?
                            <TouchableOpacity className='mr-2' onPress={() => {deleteDocument(item.$id)}} >
                                <Icon name="trash" size={15} color="white"/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity className='ml-2' onPress={() => {deleteDocument(item.$id)}} >
                                <Icon name="times" size={15} color="white"/>
                            </TouchableOpacity>
                        }
                        </View>
                    </TouchableOpacity>
                )}}
            />
            :
            <AddData title={"Datei hinzufügen"} subTitle={"Lade deine erste Datei hoch"} button={"Dokument hochladen"} />
        }
        {filteredDocuments.length == 0 ? <AddData title={"Datei hinzufügen"} subTitle={"Lade deine erste Datei hoch"} button={"Dokument hochladen"}  handlePress={()=> addDocument()}/> : null}
        <CounterText title='Notizen' count={filteredNotes.length}/>
        {
            notes  ? 
            <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.$id}
            className='w-full'
            style={{
                scrollbarWidth: 'thin', // Dünne Scrollbar
                scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
              }}
            renderItem={({item}) => {
                return (
                    <TouchableOpacity onPress={()=> {router.push({
                                pathname:"editNote",
                                params: {note: JSON.stringify(item)}
                            }) }} 
                            className='w-full flex-row justify-between  p-2 border-b-[1px] border-gray-600'>
                        <View className='flex-row items-start justify-start'>
                            <Icon name="file" size={40} color="white"/>
                            <Text className='text-white mx-2 font-bold text-[14px]'>{item.title ? item.title : "Unbenannt"}</Text>
                        </View>
                        <TouchableOpacity>
                            <Icon name="ellipsis-h" size={15} color="white"/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}}
            />
            :
            <AddData title={"Notizen hinzufügen"} subTitle={"Erstelle jetzt deine erste."} button={"Notiz ergänzen"} />

        }
        { filteredNotes.length == 0  ? <AddData title={"Notizen hinzufügen"} subTitle={"Erstelle jetzt deine erste."} button={"Notiz ergänzen"} /> : null}
    
        </View>}
    </ScrollView>
  )
}

export default Data