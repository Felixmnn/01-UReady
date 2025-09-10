import { View, Text, Modal, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from '@/components/(general)/colorPicker';
import IconPicker from '@/components/(general)/iconPicker';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useTranslation } from 'react-i18next';

const ModalEditSession = ({ isVisible, setIsVisible, session, sessions, index, setSessions }:{
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    session: any,
    sessions: any[],
    index: number | null,
    setSessions: React.Dispatch<React.SetStateAction<any[]>>

}) => {
    const { t } = useTranslation();

   
    const [newTag, setNewTag] = useState(session);
    const { width } = useWindowDimensions();
    const [on, setOn] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    function changeColor(newColor:string, index:number) {
        setSessions(prevSessions =>
            prevSessions.map((session, i) =>
                i === index ? { ...session, color: newColor } : session
            )
        );
        setSelectedColor(newColor);
    }

    function changeIcon(newIcon:string, index:number) {
        setSessions(prevSessions =>
            prevSessions.map((session, i) =>
                i === index ? { ...session, iconName: newIcon } : session
            )
        );
        setSelectedIcon(newIcon);
    }

 
    return (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isVisible}
                >
                    <View className="h-full w-full absolute top-0 left-0   justify-center items-center ">
                        <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' >
                            <View className='justify-between  flex-row'>
                                <Text className='text-white font-bold text-[15px]'>
                                    {t("editSession.title")}
                                </Text>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <Icon name="times" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                            <Text className='text-gray-400 font-bold text-[12px]'>
                                {t("editSession.name")}
                            </Text>

                            <TextInput
                                className={`text-white  rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] shadow-lg bg-[#0c111d] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                                style={{
                                    height: 40,	
                                }}
                                value={newTag ? newTag.name : null}
                                maxLength={50}
                                placeholder={session.title ? session.title : t("editSession.placeholderSessions")}
                                placeholderTextColor={"#fff"}
                                
                            
                                onChangeText={(e) => setSessions(prevSessions =>
                                    prevSessions.map((session, i) =>
                                        i === index ? { ...session, title: e } : session
                                    )
                                )}
                            />
                            <Text className='text-gray-400 font-bold text-[12px]'>
                                {t("editSession.description")}
                            </Text>

                            <TextInput
                                value={newTag ? newTag.description : ""}
                                maxLength={150}
                                placeholderTextColor={"#fff"}
                                placeholder={session.description ? session.description : t("editSession.placeholderDescription")}
                                className={`text-white  rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] shadow-lg bg-[#0c111d] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                                style={{
                                    height: 40,	
                                }}
                                onChangeText={(e) => {
                                    setNewTag((prev:any) => ({ ...prev, description: e }));
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
                            <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={t("editSession.color")}
    indexItem={index} />
<IconPicker selectedIcon={selectedIcon} setSelectedIcon={changeIcon} title={t("editSession.icons")} selectedColor={selectedColor} indexItem={index} />
                            </View>
                        </View>
                    </View>
                </Modal>
    )
}

export default ModalEditSession;