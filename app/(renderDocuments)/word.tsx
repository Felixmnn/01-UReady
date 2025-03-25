import { View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from "expo-router";
import { loadDocument } from '@/lib/appwriteDaten';
import { Platform } from "react-native";
import { WebView } from "react-native-webview"; // Für Expo Go
import Icon from 'react-native-vector-icons/FontAwesome5';
import AiQuestionSettings from '@/components/(bibliothek)/(modals)/aiQuestionSettings';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';

const WordViewer = () => {
    const { item } = useLocalSearchParams();
    const [document, setDocument] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!item) return;
        
        const parsed = JSON.parse(item);
        setDocument(parsed);

        async function getDocument() {
            try {
                const url = await loadDocument(parsed.databucketID);
                setFileUrl(url);
            } catch (error) {
                console.error("Fehler beim Laden der Datei:", error);
            } finally {
                setLoading(false);
            }
        }
        getDocument();
    }, [item]);

    const { width } = useWindowDimensions();
    const isVertical = width < 700;

    return (
        <View className='flex-1 p-3 justify-center bg-gradient-to-b from-[#2b3d69] to-[#0c111d]'>
            <View className='flex-1 rounded-[10px] bg-gray-900 border-gray-600 border-[1px] m-4'>    
                <View className='bg-gray-900 items-center justify-between p-4 rounded-t-[10px]'>
                    <View className='flex-row items-center justify-between w-full'>
                    <View className='flex-row items-center'>
                        <TouchableOpacity onPress={()=> router.back()}>
                            <Icon name="arrow-left" size={20} color="white"/>
                        </TouchableOpacity>
                        <Text className='font-semibold text-xl ml-2 text-white'>{document != null ? document.title : null}</Text>
                    </View>
                    <GratisPremiumButton>
                        <View className='flex-row items-center'>
                        <Icon name="robot" size={15} color="white"/>
                        <Text className='text-[12px] text-gray-100 font-semibold ml-2'>Fragen generieren</Text>
                        </View>
                    </GratisPremiumButton>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
                ) : fileUrl ? (
                    Platform.OS === "web" ? (
                        // 📌 Web: Word mit Google Docs Viewer oder Office Online anzeigen
                        <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                            width="100%"
                            height="100%"
                            style={{
                                border: "none",
                                backgroundColor: "#121212"
                            }}
                        />
                    ) : (
                        // 📌 Expo Go (React Native): Word mit WebView anzeigen
                        <WebView
                            source={{ uri: `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true` }}
                            style={{ flex: 1, backgroundColor: "#121212" }}
                        />
                    )
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>Fehler beim Laden der Datei</Text>
                )}
            </View>
        </View>
    );
};

export default WordViewer;