import { View, Text, Modal, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from '@/components/(general)/colorPicker';
import IconPicker from '@/components/(general)/iconPicker';
import { useGlobalContext } from '@/context/GlobalProvider';

const ModalEditSession = ({ isVisible, setIsVisible, session, sessions, index, setSessions }) => {

    const { user,language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    useEffect(() => {
        if(language) {
        setSelectedLanguage(language)
        }
    }, [language])
    const texts ={
        "DEUTSCH":{
            title: "Session bearbeiten",
            name: "Session Name",
            descriotion: "Session Beschreibung",
            icons: "Session Icons",
            placeholderSessions: "Sessions",
            placeholderDescription: "Beschreibung",
            },
        "ENGLISH(US)":{
            title: "Edit Session",
            name: "Session Name",
            descriotion: "Session Description",
            icons: "Session Icons",
            placeholderSessions: "Sessions",
            placeholderDescription: "Description",
            },
        "ENGLISH(UK)":{
            title: "Edit Session",
            name: "Session Name",
            descriotion: "Session Description",
            icons: "Session Icons",
            placeholderSessions: "Sessions",
            placeholderDescription: "Description",
            },
        "AUSTRALIAN":{
            title: "Edit Session",
            name: "Session Name",
            descriotion: "Session Description",
            icons: "Session Icons",
            placeholderSessions: "Sessions",
            placeholderDescription: "Description",
            },
        "SPANISH":{
            title: "Editar sesión",
            name: "Nombre de la sesión",
            descriotion: "Descripción de la sesión",
            icons: "Iconos de sesión",
            placeholderSessions: "Sesiones",
            placeholderDescription: "Descripción",
            },

        
    }
    const [newTag, setNewTag] = useState(session);
    const { width } = useWindowDimensions();
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
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isVisible}
                >
                    <View className="h-full w-full absolute top-0 left-0   justify-center items-center m-2 ">
                        <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' >
                            <View className='justify-between  flex-row'>
                                <Text className='text-white font-bold text-[15px]'>
                                    {texts[selectedLanguage].title}
                                </Text>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text className='text-gray-400 font-bold text-[12px]'>
                                {texts[selectedLanguage].name}
                            </Text>

                            <TextInput
                                className={`text-white  rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] shadow-lg bg-[#0c111d] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                                style={{
                                    height: 40,	
                                }}
                                value={newTag ? newTag.name : null}
                                maxLength={30}
                                placeholder={session.title ? session.title : texts[selectedLanguage].placeholderSessions}
                                placeholderTextColor={"AAAAAA"}
                                onChangeText={(e) => setSessions(prevSessions =>
                                    prevSessions.map((session, i) =>
                                        i === index ? { ...session, title: e } : session
                                    )
                                )}
                            />
                            <Text className='text-gray-400 font-bold text-[12px]'>
                                {texts[selectedLanguage].descriotion}
                            </Text>

                            <TextInput
                                value={newTag ? newTag.description : ""}
                                maxLength={30}
                                placeholderTextColor={"AAAAAA"}
                                placeholder={session.description ? session.description : texts[selectedLanguage].placeholderDescription}
                                className={`text-white  rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] shadow-lg bg-[#0c111d] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                                style={{
                                    height: 40,	
                                }}
                                onChangeText={(e) => {
                                    setNewTag((prev) => ({ ...prev, description: e }));
                                    setSessions((prevSessions) =>
                                    prevSessions.map((sessionItem, i) =>
                                        i === index ? { ...sessionItem, description: e } : sessionItem
                                    )
                                    );
                                }}
                            />
                            <View 
                            style={{
                                width: width > 600 ? 500 : width - 40,

                            }}
                            >
                            <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={"Session Farbe"} indexItem={index} />
                            <IconPicker selectedIcon={selectedIcon} setSelectedIcon={changeIcon} title={texts[selectedLanguage].icons} selectedColor={selectedColor} indexItem={index} />
                            </View>
                        </View>
                    </View>
                </Modal>
    )
}

export default ModalEditSession;