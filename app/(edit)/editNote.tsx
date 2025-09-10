import React, { useEffect, useState } from 'react'
import { View,TextInput, TouchableOpacity, Text } from 'react-native'
import { useWindowDimensions } from 'react-native';
import Tabbar from '@/components/(tabs)/tabbar';
import { router,useLocalSearchParams } from "expo-router"
import { removeNote, updateNote } from '@/lib/appwriteEdit';
import { useGlobalContext } from '@/context/GlobalProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

const CreateNote = () => {
    const { t } = useTranslation();
    const {user, isLoggedIn,isLoading } = useGlobalContext();
    const {note} = useLocalSearchParams()
    const [noteData, setNoteData] = useState(
        JSON.parse(Array.isArray(note) ? note[0] : note)
    )
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const [ungespeichert, setUngespeichert] = useState(false)
    const loading = false;
    async function saveChanges() {
        await updateNote(noteData);
        setUngespeichert(false);
    }
    useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); // oder "/sign-in"
        }
      }, [user, isLoggedIn, isLoading]);
    async function tryBack() {
        try {
            router.back()
            router.push("/bibliothek")
        } catch (error) {
            router.push("/bibliothek")

        }
    }

    return (
        <Tabbar content={()=> { return(
        
            <View className='flex-1'>
              {loading ? (

                null
            ) : (
        <View className='flex-1 items-center '>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }

            <View className='flex-1 w-full   bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                
                <TextInput
                    className=' bg-gray-800 mt-2 mx-2 border-gray-700 border-[1px] rounded-[10px] p-2 text-white '
                    value={noteData.title ? noteData.title : ""}
                    placeholder={t("editNote.noTitle")}
                    placeholderTextColor={"white"}
                    onChangeText={(text) => {
                        setNoteData({...noteData, title: text})
                        setUngespeichert(true)
                    }}
                    onBlur={() => saveChanges()}
                    maxLength={50}
                />
                <TextInput
                    className='flex-1 bg-gray-800 m-2 border-gray-700 border-[1px] rounded-[10px] p-2 text-white '
                    multiline={true}
                    value={noteData.notiz}
                    maxLength={2000}
                      textAlignVertical="top"

                    placeholderTextColor={"white"}
                    placeholder={t("editNote.noNote")}
                    onChangeText={(text) => {
                        setNoteData({...noteData, notiz: text})
                        setUngespeichert(true)
                    }}
                    onBlur={() => saveChanges()}
                />
                <View className='flex-row justify-between items-center p-2'>
                    <TouchableOpacity
                        className='bg-blue-600 p-2 rounded-[10px]'
                        onPress={() => {
                            saveChanges();
                            setUngespeichert(false);
                            tryBack();
                        }}
                    >
                        <Text className='text-white'>{t("editNote.save")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='bg-red-600 p-2 rounded-[10px] flex-row items-center'
                        onPress={async() => {
                            await removeNote(noteData.$id);
                            tryBack();
                        }}
                    >
                        <Icon name="trash" size={15} color="white" />
                        <Text className='text-white ml-2'>{t("editNote.delete")}</Text>
                    </TouchableOpacity> 
                </View>
            </View>    

        </View>
        )
                }
                </View>
                
            )}} page={"Bibliothek"} hide={true} />
          )
    
}

export default CreateNote