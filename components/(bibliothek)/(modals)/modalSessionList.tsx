import { View, Text, Modal, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome5";
import ModalEditSession from './modalEditSession';
import uuid from 'react-native-uuid';
import { useTranslation } from 'react-i18next';

const ModalSessionList = ({ isVisible, setIsVisible, sessions, setSessions }:{
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    sessions: any[],
    setSessions: React.Dispatch<React.SetStateAction<any[]>>
}) => {
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
   

    const [isVisibleEdit, setIsVisibleEdit] = useState(false);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleEditSession = (session:string, index:number) => {
        setSelectedSession(session);
        setSelectedIndex(index);
        setIsVisibleEdit(true);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            
            visible={isVisible}
        >
            
            <TouchableOpacity onPress={() => setIsVisible(false)} className='absolute top-0 left-0 w-full h-full justify-center items-center p-2 h-[90%]' style={{ backgroundColor: 'rgba(17, 24, 39,0.7)' }} >
                
                <View className={`p-4 bg-gray-800 border-gray-700 border-[1px] rounded-xl ${width < 400 ? "w-full" : " w-[400px]"} `}>
                    <ScrollView className=' h-[90%] w-full'>
                    <View className='flex-row items-center justify-between'>
                        <Text className='text-white text-xl mb-2 font-semibold'>{t("sessionList.title")}</Text>
                        <TouchableOpacity>
                            <Icon name="times" size={20} color="white" onPress={() => setIsVisible(false)}  />
                        </TouchableOpacity>
                    </View>
                    {
                        sessions ? sessions.map((session, index) => {
                            return (
                                <TouchableOpacity onPress={() => handleEditSession(session, index)} key={index} className='flex-row items-center bg-gray-900 justify-between p-2 border-gray-600 border-[1px] rounded-xl mt-2'>
                                    <Text className='text-white flex-1 '>{session.title}</Text>
                                    <Text className='text-white ml-2 flex-1'>{session.percent}%</Text>

                                    <View className='w-[25px] h-[25px] rounded-full border-[1px] border-gray-500 mx-2 items-center justify-center' 
                                    style={{
                                        backgroundColor:
                                        session.color === "red" ? "#DC2626" :
                                        session.color === "blue" ? "#2563EB" :
                                        session.color === "green" ? "#059669" :
                                        session.color === "yellow" ? "#CA8A04" :
                                        session.color === "orange" ? "#C2410C" :
                                        session.color === "purple" ? "#7C3AED" :
                                        session.color === "pink" ? "#DB2777" :
                                        session.color === "emerald" ? "#059669" :
                                        session.color === "cyan" ? "#0891B2" :
                                  "#1F2937",
                                    }}
                                    >
                                        <Icon name={session.iconName} size={15} color="white" />
                                    </View>
                                    {
                                        index == 0 ? null :
                                    <TouchableOpacity onPress={()=>{
                                        setSessions(prevSessions => {
                                            const newSessions = [...prevSessions];
                                            const temp = newSessions[index - 1];
                                            newSessions[index - 1] = newSessions[index];
                                            newSessions[index] = temp;
                                            return newSessions;
                                        })
                                    }} className='justify-center items-center h-[30px] w-[30px] rounded-full bg-gray-700'>
                                        <Icon name="arrow-up" size={15} color="white" />
                                    </TouchableOpacity>
                                    }
                                    {
                                        index == sessions.length - 1 ? null :
                                    
                                    <TouchableOpacity onPress={()=>{
                                        setSessions(prevSessions => {
                                            const newSessions = [...prevSessions];
                                            const temp = newSessions[index + 1];
                                            newSessions[index + 1] = newSessions[index];
                                            newSessions[index] = temp;
                                            return newSessions;
                                        })
                                    }}
                                    
                                    className=' ml-1 justify-center items-center h-[30px] w-[30px] rounded-full bg-gray-700'>
                                        <Icon name="arrow-down" size={15} color="white" />
                                    </TouchableOpacity>
                             }
                                </TouchableOpacity>
                            )
                        }) : null
                    }
                    <TouchableOpacity 
                    onPress={()=> {
                        setSessions([...sessions, {
                            title: "Neue Session",
                            percent: 0,
                            color: null,
                            iconName: "question",
                            questions:0,
                            description:"",
                            tags: [],
                            id: uuid.v4(),
                            generating: false,
                        }])
                    }} className='flex-row items-center justify-center p-2 border-gray-600 bg-gray-900 border-[1px] rounded-xl mt-2'>
                        <Text className='text-white'>{t("sessionList.addSession")}</Text>
                    </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableOpacity>
            {selectedSession && (
                <ModalEditSession
                    isVisible={isVisibleEdit}
                    setIsVisible={setIsVisibleEdit}
                    session={selectedSession}
                    sessions={sessions}
                    index={selectedIndex}
                    setSessions={setSessions}
                />
            )}
        </Modal>
    )
}

export default ModalSessionList;