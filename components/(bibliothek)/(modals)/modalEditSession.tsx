import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from '@/components/(general)/colorPicker';
import IconPicker from '@/components/(general)/iconPicker';

const ModalEditSession = ({ isVisible, setIsVisible, session, sessions, index, setSessions }) => {
    const [newTag, setNewTag] = useState(session);
    const [on, setOn] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);

    function changeColor(newColor, index) {
        console.log("Color wurde geändert", newColor);
        console.log("Index ist", index);
        setSessions(prevSessions =>
            prevSessions.map((session, i) =>
                i === index ? { ...session, color: newColor } : session
            )
        );
        console.log("Die neue Sessions", sessions);
        setSelectedColor(newColor);
    }

    function changeIcon(newIcon, index) {
        setSessions(prevSessions =>
            prevSessions.map((session, i) =>
                i === index ? { ...session, iconName: newIcon } : session
            )
        );
        setSelectedIcon(newIcon);
    }

    function deleteSession(index) {
        setSessions(prevSessions => prevSessions.filter((_, i) => i !== index));
        setIsVisible(false);
    }

    return (
        <View>
            {isVisible ? (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isVisible}
                >
                    <View className="absolute top-0 left-0 w-full h-full justify-center items-center ">
                        <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' style={{ minWidth: 400 }}>
                            <View className='justify-between flex-row'>
                                <Text className='text-white font-bold text-[15px]'>
                                    Session Bearbeiten
                                </Text>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text className='text-gray-400 font-bold text-[12px]'>
                                Session Name
                            </Text>

                            <TextInput
                                className={`text-white flex-1 rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                                value={newTag ? newTag.name : null}
                                placeholder={session.title}
                                onChangeText={(e) => setSessions(prevSessions =>
                                    prevSessions.map((session, i) =>
                                        i === index ? { ...session, title: e } : session
                                    )
                                )}
                            />
                            <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title="Session Farbe" indexItem={index} />
                            <IconPicker selectedIcon={selectedIcon} setSelectedIcon={changeIcon} title={"Session Icons"} selectedColor={selectedColor} indexItem={index} />
                            
                        </View>
                    </View>
                </Modal>
            ) : null}
        </View>
    )
}

export default ModalEditSession;