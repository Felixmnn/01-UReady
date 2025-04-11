import { View, Text, TextInput, TouchableOpacity,ScrollView, SafeAreaView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from '../(general)/colorPicker';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import ModalAddTags from '../(bibliothek)/(pages)/(createQuestion)/modalAddTags';
import ModalSessionList from '../(bibliothek)/(modals)/modalSessionList';
import { addNewModule } from '@/lib/appwriteAdd';
import { router } from 'expo-router';
import { setUserDataSetup } from '@/lib/appwriteEdit';
import { useGlobalContext } from '@/context/GlobalProvider';
const PageCreateModule = ({userChoices, setUserChoices, userData, newModule, setNewModule}) => {
    const { user } = useGlobalContext()
    
        const [ sessions, setSessions ] = useState([]);
        
        const [ selectedColor, setSelectedColor ] = useState(null);
        const changeColor = (color) => {
            setSelectedColor(color);
            setNewModule({...newModule, color: color});
        }
        const [ isVisible, setIsVisible ] = useState(false);
        const active = selectedColor !== null && newModule.name !== "" && newModule.description !== "" && sessions.length > 0;
       const {width} = useWindowDimensions()
  return (
    <View className={`h-full w-full items-center justify-center  bg-blue-500 ${width > 700 ? " m-4 p-4"  : " "}`}>
        <ModalSessionList sessions={sessions} setSessions={setSessions} isVisible={isVisible} setIsVisible={setIsVisible} />
        
        <View className={`flex-1 bg-gray-900 border-gray-800 border-[1px]  items-start justify-start shadow-lg ${width > 700 ? "w-full rounded-[10px] p-4" : "p-2"} `}
        style={{
           
            shadowColor: newModule != null && newModule.color === "red" ? "#DC2626" :
            newModule.color === "blue" ? "#2563EB" :
            newModule.color === "green" ? "#059669" :
            newModule.color === "yellow" ? "#CA8A04" :
            newModule.color === "orange" ? "#C2410C" :
            newModule.color === "purple" ? "#7C3AED" :
            newModule.color === "pink" ? "#DB2777" :
            newModule.color === "emerald" ? "#059669" :
            newModule.color === "cyan" ? "#0891B2" :
            "#1F2937", // Grau-Blauer Glow
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10, // Für Android
        }} 
        >   
        <View className='m-2 w-full flex-row items-center justify-start '>
            <Icon name="arrow-left" size={20} color="white" onPress={() => setUserChoices(null)} />
            <Text  className='text-gray-100 font-bold text-xl font-bold mx-2'>Modul mit KI support</Text>
          </View>
            <View className='flex-row w-full'>
                
                <View className='flex-1 justify-between'>
                    <Text className='text-gray-300 font-semibold text-[15px]'>
                    Modul Name
                    </Text>
                    <TextInput
                            maxLength={50}
                            onChangeText={(text) => setNewModule({...newModule, name: text})}
                            value={newModule.name}
                            placeholder="Ein Origneller Name :)..."
                            className={`text-white  rounded-[10px] p-1 bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] `}
                            placeholderTextColor={"#AAAAAA"}
                        />
                </View>
                <TouchableOpacity>
                    <Icon name="globe" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View className='w-full flex-row'>
                <View className='flex-1'>
                    <Text className='text-gray-300 font-semibold text-[15px]'>
                    Modul Beschreibung
                    </Text>
                    <TextInput
                        maxLength={200}
                        onChangeText={(text) => setNewModule({...newModule, description: text})}
                        value={newModule.description}
                        placeholder="Hier kannst du eine Beschreibung für dein Modul eingeben..."
                        multiline={true}
                        numberOfLines={4}
                        className={`text-white rounded-[10px] p-1 bg-[#0c111d] p-2 m-2  border-gray-800 border-[1px] shadow-lg `}
                    />
                </View>
            </View>
            <View className='w-full flex-row justify-start'>
                <View  className='flex-1 justify-between my-2 '>
                    <Text className='text-gray-300 font-semibold text-[15px] '>
                        Sektionen hinzufügen
                    </Text>
                    <View className='flex-row items-center justify-start'>
                        <TouchableOpacity onPress={()=> setIsVisible(true)} className='bg-[#0c111d] p-3 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg'
                            style={{
                            width: 60,
                            height: 60,
                            }}
                            >
                            <Icon name="layer-group" size={30} color="#4B5563" />
                        </TouchableOpacity>
                        
                        <ScrollView 
                            horizontal={true}
                            contentContainerStyle={{ paddingRight: 20 }}
                            style={{ 
                                scrollbarWidth: 'thin', // Dünne Scrollbar
                                scrollbarColor: 'gray transparent' 
                            }}>
                                <View 
                                className='items-ceter justify-start '
                                style={{
                            height:80
                        }}></View>
                            {
                        sessions !== null && sessions.length > 0 ? sessions.map((session, index) => {
                            return (
                                <TouchableOpacity onPress={()=> setIsVisible(true)} className={`bg-[#0c111d] p-3 m-2  border-[1px] rounded-[10px] items-center justify-center shadow-lg`}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderColor: session.color,
                                    shadowColor: session.color,
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 6,
                                    elevation: 6, // Für Android
                                    }}
                                    >
                                    <Icon name={session.iconName} size={30} color={session.color} />
                                </TouchableOpacity>
                            )}):null}
                        <View>
                        </View>
                        
                        </ScrollView>
                    </View>
                </View>
            </View>
            <View className='w-full items-start'>
                <Text className='text-gray-300 font-semibold text-[15px]'>
                    Farbe wählen
                </Text>
                <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
            </View>

            <View className='mx-2 mt-2 w-full px-2'>
                <GratisPremiumButton aditionalStyles={`rounded-[10px] mx-3 w-full bg-blue-500 ${active? "" : "opacity-50"} `} active={active} handlePress={async()=> {
                    if (active){
                     console.log("Module: ", newModule)
                     const res = await addNewModule({...newModule, color: newModule.color.toUpperCase(), sessions:sessions.map(item => JSON.stringify(item)) });
                     console.log("Module added: ", res)
                    const resp = await setUserDataSetup(user.$id)
                    console.log(user.$id)
                    console.log("User data updated: ", resp)
                     router.push("/bibliothek")
                }}}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>
                    {active ? "Modul erstellen" :   !(sessions.length > 0 )? "Bitte mindestens eine Session erstellen" : "Bitte alle Felder ausfüllen"}
                    </Text>
                </GratisPremiumButton>
            </View>
        </View>   
    </View>
  )
}

export default PageCreateModule