import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import VektorCircle from './vektorCircle'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useGlobalContext } from '@/context/GlobalProvider';
import languages  from '@/assets/exapleData/languageTabs.json';
import { reportModule } from '@/lib/appwriteAdd';
const Karteikarte = ({titel, studiengang, fragenAnzahl,notizAnzahl , farbe, creator,handlePress, percentage, publicM, reportVisible=false, moduleID=""}) => {
  // Studiengang ist jetz Beschreibung

  const { user,language } = useGlobalContext()

  const [modalVisible, setModalVisible] = useState(false);
  const ReportModal = () => {
    const [reason, setReason] = useState("");
     const handleSubmit = async () => {
        await reportModule({
          moduleID: moduleID,
          moduleCreator: creator,
          personThatReported: user.$id,
          message: reason,
        });
        console.log("Report submitted with reason:", reason);
        setModalVisible(false);
      };
    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="w-full bg-gray-800 rounded-2xl p-5">
            <Text className="text-lg text-white font-bold mb-4">{titel} melden</Text>

            <Text className="text-sm mb-2 text-gray-300">Grund der Meldung:</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3 text-sm min-h-[80px] text-white"
              multiline
              placeholder="Beschreibe den Grund für die Meldung..."
              placeholderTextColor="#888"
              value={reason}
              maxLength={200}
              onChangeText={setReason}
              
            />

            {/* Buttons */}
            <View className="flex-row justify-end mt-4 space-x-3">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500">Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Absenden</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])
    const texts = languages.karteikarte;
  
    const color = 
      farbe === "RED" ? "#DC2626" :
      farbe === "BLUE" ? "#2563EB" :
      farbe === "GREEN" ? "#059669" :
      farbe === "YELLOW" ? "#CA8A04" :
      farbe === "ORANGE" ? "#C2410C" :
      farbe === "PURPLE" ? "#7C3AED" :
      farbe === "PINK" ? "#DB2777" :
      farbe === "EMERALD" ? "#059669" :
      farbe === "CYAN" ? "#0891B2" :
      "#1F2937";


    return(
    <TouchableOpacity className=' '  onPress={handlePress}
    >
      <ReportModal/>
      <View className={` rounded-t-[10px] border-t-[1px] border-gray-700 `} style={{height:5, backgroundColor:color}}/>
      <View className=' p-3 bg-[#1f242f] border-[1px] border-gray-700 rounded-b-[10px] ' style={{borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
        <View className='flex-row justify-between items-start'>
          <View >
            <Text className='my-1 font-semibold text-[15px] text-gray-100'>{titel.length > 30 ? titel.substring(0,30) + "..." : titel}</Text>
            <Text className='my-1 text-[12px] text-gray-400'
            style={{maxWidth: 220, height: 50}}
            >{ studiengang ? studiengang.length > 100 ? studiengang.substring(0,100) + "..." : studiengang : null}</Text>
          </View>
          {
            percentage !== null ?
          <VektorCircle color={color} percentage={percentage} icon={"clock"} strokeColor={color}/>
          :null
          }
        </View>
        <View className='flex-row'>
          <Text className='my-1 text-gray-300 font-semibold text-[14px]'>{fragenAnzahl} {texts[selectedLanguage].questio} • {notizAnzahl} {texts[selectedLanguage].notes}</Text>
        </View>
        <View className='border-t-[1px] border-gray-700 my-2'/>
        <View className='flex-row justify-between items-center'>
          <View className='py-[2px] px-2 border-[1px] border-gray-700 rounded-full flex-row items-center'>
            <Icon name="user" size={10} color="white"/>
            <Text className='text-gray-300 text-[12px] ml-1'>{creator == "YOU" ? "Von Dir" : creator.length > 10 ? creator.substring(0, 10) + "..." : creator  }</Text>
          </View>
          <View className='flex-row justify-between'>
            <TouchableOpacity className='mr-4'>
              {
                !publicM ?
                <Icon name="lock" size={18} color="white"/>
                :
                <Icon name="globe" size={18} color="white"/>
              }            
              </TouchableOpacity>
            <TouchableOpacity className='mr-1'>
              <Icon name="ellipsis-h" size={18} color="white"/>
            </TouchableOpacity>
            {reportVisible ?
            <TouchableOpacity className='ml-2' onPress={() => setModalVisible(true)}>
              <Icon name="exclamation-triangle" size={18} color="white"/>
            </TouchableOpacity>
            : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
    )
  }

export default Karteikarte