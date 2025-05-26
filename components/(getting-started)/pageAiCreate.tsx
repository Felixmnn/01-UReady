
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, useWindowDimensions, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ColorPicker from '../(general)/colorPicker';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import ModalSessionList from '../(bibliothek)/(modals)/modalSessionList';
import { materialToModule } from '@/functions/(aiQuestions)/materialToModule';
import uuid from 'react-native-uuid';
import { useGlobalContext } from '@/context/GlobalProvider';
import { returnShadowComponents } from '@/functions/returnColor';
import * as DocumentPicker from 'expo-document-picker';
import { addDocumentConfig, addDocumentToBucket, updateDocumentConfig } from '@/lib/appwriteEdit';
import * as FileSystem from 'expo-file-system';


const PageAiCreate = ({ newModule, userData, setNewModule, setUserChoices, setIsVisibleModal }) => {
  // Lokale States
  const { user, reloadNeeded, setReloadNeeded } = useGlobalContext();
  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading , setLoading] = useState(false); 
  const [selectedSession, setSelectedSession] = useState(0);
  const [isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage] = useState(null);
  // Material-Auswahl
  const [selectedMaterialType, setSelectedMaterialType] = useState('PEN');
  const [newitem, setNewItem] = useState({
    type: 'PEN',
    content: '',
    uri: null,
    sessionID:null,
    id:null
  });
  const [items, setItems] = useState([]); 

  const [ fileList, setFileList] = useState([]);
  const tempModuleID = uuid.v4();
  const tempSessionID = uuid.v4();  
 
  useEffect(() => {
    console.log("FileList: ", fileList);
  },[fileList])

  /**
   * File Upload Funktion
   * Currently only supports PDF files
   */
  async function handleFileUpload() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (res.canceled) return;

      const file = res.assets[0];

      if (
        file.mimeType !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setErrorMessage("Only supported file type: PDF");
        console.log("Unsupported file type");
        setIsError(true);
        return;
      }

      const doc = {
        title: file.name,
        subjectID: tempModuleID,
        sessionID: tempSessionID,
        id: uuid.v4(),
        type: file.mimeType || "application/pdf",
        uploaded: false,
      };

      setFileList((prev) => [...prev, doc]);

      const appwriteRes = await addDocumentConfig(doc);
          
        // Step 3 - Read the file differently based on platform
        let fileBlob;
        if (Platform.OS === 'web') {
            // Web: fetch URI as Blob
            fileBlob = await fetch(file.uri).then(res => res.blob());
        } else {
            // Native (Android/iOS): read file as base64, then convert to Blob
            const base64 = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
        }
        const uploadRes = await addDocumentToBucket({
            fileID: doc.id,
            fileBlob: fileBlob,
        });
        console.log("Upload response: ", uploadRes);
        return;
      }
     catch (error) { 
      console.log("Error uploading file: ", error);
    }}

  
  /**
   * Component wich tells the user user that something went wrong
   */
  const ErrorModal = ({isError, setIsError}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isError}
            onRequestClose={() => {
              setIsError(!isError);
            }}
        >
            <TouchableOpacity className='flex-1 justify-start pt-5 items-center' onPress={()=> setIsError(false)}>
                <View className='red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700'>
                    <Text className='text-white'>{errorMessage}</Text>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };


  // Farbauswahl übernehmen
  const changeColor = (color) => {
    setSelectedColor(color);
    setNewModule({ ...newModule, color: color });
  };

  // Komponente für Wechsel des Materialtyps
  const SelectMaterialType = ({ iconName, type, handlePress }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedMaterialType(type);
        handlePress();
      }}
      className={`${
        selectedMaterialType === type ? 'bg-gray-800' : 'bg-[#0c111d]'
      } rounded-full items-center justify-center shadow-lg h-[35px] w-[35px]`}
    >
      <Icon name={iconName} size={20} color="#4B5563" />
    </TouchableOpacity>
  );

  // Methode zum Hinzufügen eines Items
  const addItem = () => {
    setItems([...items, {...newitem, id: uuid.v4(), sessionID:selectedSession.id}]);
    setNewItem({ ...newitem, content: '' });
  };


  /**
   * Tocuhable Opacity zum hinzufügen eines Themas oder eines Textes 
   */
  const PlusIcon = ({ typeText=true}) => {
    return (
      <TouchableOpacity
          disabled={newitem.content.length < 2  && typeText}
          onPress={async () => {
            if (newitem.type == "FILE") {
              await handleFileUpload();
            } else {
              addItem();
            }
          }}
          className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
          style={{ height: 34, width: 34,marginBottom:5 }}
        >
        <Icon name="plus" size={15} color="#4B5563" />
      </TouchableOpacity>
    )
  }

  /**
   * Touchable Opacity zum löschen eines Themas oder eines Textes
   */
  const TrashIcon = ({handlePress}) => {
    return (
    <TouchableOpacity
        disabled={newitem.content.length < 2}
        onPress={handlePress}

        className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
        style={{ height: 34, width: 34 }}
      >
      <Icon name="trash" size={15} color="#C62828" />
    </TouchableOpacity>
    )
  }

  /**
   * Subheader Componente für die einzelenen Komponenten
   */
  const SubHeader = ({ title }) => {
    return (
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">{title}</Text>
          </View>
    );
  }
 
  /**
   * useEffect um sicherzsutellen, dass der Nutzer immer eine ausgewählte Sitzung hat
   */
  useEffect(() => {
    if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  },[sessions])

 


  return (
    <ScrollView className={`flex-1 bg-gray-900 p-3 shadow-lg  rounded-[10px] `}
      style={{
        width: '100%',
        shadowColor: returnShadowComponents(newModule?.color ? newModule.color : "black"),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 20,
      }}
      >
      <ErrorModal isError={isError} setIsError={setIsError}/>
      <ModalSessionList
        sessions={sessions}
        setSessions={setSessions}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
        <View className='w-full'>
        {/* Header */}
        <View className='flex-row justify-between items-center'> 
            <TouchableOpacity className='m-2 flex-row items-center' onPress={() => setUserChoices(null)}> 
              <Icon name="arrow-left" size={20} color="white"  />
              <Text  className='text-gray-100 font-bold text-xl font-bold mx-2'>Neues Modul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewModule({ ...newModule, public:newModule?.public ? false : true })}
              className='mr-2 items-center border-gray-800 border-[1px] rounded-full py-1 px-2'
              >
              {
                newModule?.public ? (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-gray-300 font-semibold text-[15px] mr-1'
                      style={{
                        color: "#4B5563",
                      }}
                    >Öffentlich</Text>
                    <Icon name="globe" size={15} color="#4B5563" />
                  </View>
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-gray-300 font-semibold text-[15px] mr-1'
                      style={{
                        color: "#4B5563",
                      }}
                    >Privat</Text>
                    <Icon name="lock" size={15} color="#4B5563" />
                  </View>
                )
                }
            </TouchableOpacity>
        </View>
        {/* Title */}
        <View>
          <SubHeader title="Modul Name" />
          <TextInput
            maxLength={50}
            onChangeText={(text) => setNewModule({ ...newModule, name: text })}
            value={newModule?.name}
            placeholder="Ein origineller Name :)..."
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        {/* Description */}
        <View className="">
          <SubHeader title="Beschreibung" />
          <TextInput
            maxLength={200}
            onChangeText={(text) => setNewModule({ ...newModule, description: text })}
            value={newModule?.description}
            placeholderTextColor={"#AAAAAA"}
            placeholder="Beschreibung für dein Modul..."
            multiline={true}
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top'}}
            textAlignVertical="top"
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
          />
        </View>
         {/* Choosing the Color */}
        <View className=" items-start">
          <SubHeader title="Farbe" />
          <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
        </View>
        {/* Adding Material */}
        <View>
        <SubHeader title="Sitzung" />
          <View className="flex-row items-center justify-start">
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              className="bg-[#0c111d] p-3 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
              style={{ 
                  width: 60,
                  height: 60 
                }}
            >
              <Icon name="layer-group" size={30} color="#4B5563" />
            </TouchableOpacity>
            <ScrollView
              
              horizontal
              contentContainerStyle={{ paddingRight: 20 }}
              style={{scrollbarWidth: 'thin', scrollbarColor: 'gray transparent' }}
            >
              <View className="flex-row items-center justify-start"
                style={{ height: 80}}

              >
              {sessions?.length > 0 &&
                sessions.map((session, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSession(session)}
                    className="bg-[#0c111d]  border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                    style={{
                      width: selectedSession.id == session.id ? 60 : 50,
                      height: selectedSession.id == session.id ? 60 : 50,
                      margin: 5,
                      marginTop: selectedSession.id == session.id ? 5 : 10,

                      borderColor: session.color,
                      shadowColor: session.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 6,
                      elevation: 6,
                    }}
                  >
                    <Icon name={session.iconName} size={30} color={session.color} />
                  </TouchableOpacity>
                ))}
                </View>
            </ScrollView>
          </View>
        </View>
        {/* Material */}
        <View className=" m-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300 font-semibold text-[15px]">
              {selectedMaterialType === 'PEN'
                ? 'Ergänze einen Text:'
                : selectedMaterialType === 'FILE'
                ? 'Ergänze ein File:'
                : 'Ergänze ein Thema:'}
            </Text>
            <View className="flex-row rounded-full items-center justify-center bg-[#0c111d] border-gray-800 border-[1px] shadow-lg">
              <SelectMaterialType
                iconName="pen"
                type="PEN"
                handlePress={() => setNewItem({ type: 'PEN', content: '', uri: null,sessionID:null, id:null })}
              />
              <SelectMaterialType
                iconName="layer-group"
                type="TOPIC"
                handlePress={() => setNewItem({ type: 'TOPIC', content: '', uri: null, sessionID:null, id:null })}
              />
              <SelectMaterialType
                iconName="file"
                type="FILE"
                handlePress={() => setNewItem({ type: 'FILE', content: '', uri: null, sessionID:null, id:null })}
              />
            </View>
          </View>

          {/* Section containing inputs relvant for creating a Topic */}
          {selectedMaterialType === 'TOPIC' && (
            <View className="flex-row items-center justify-start">
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <PlusIcon/>
                <TrashIcon handlePress={() => handleDeleteItem(newitem.id)}/>
              </View>
              <TextInput
                maxLength={50}
                onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                value={newitem.content}
                placeholder="Eine neue Kategorie ..."
                className="flex-1 text-white  bg-[#0c111d] p-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] ml-2"
                placeholderTextColor={"#AAAAAA"}
                textAlignVertical="top"
                multiline={true}
                style={{
                  height:75,
                  textAlign: 'left',
                  textAlignVertical: 'top',
                  justifyContent: 'start',
                }}
              />
            </View>
          )}

          {/* Section containing inputs for text based creation */}
          {selectedMaterialType === 'PEN' && (
            <View className="flex-row items-start ">
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <PlusIcon />
                <TrashIcon handlePress={() => handleDeleteItem(newitem.id)}/>
              </View>
              <TextInput
                multiline
                numberOfLines={5}
                maxLength={5000}
                onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                value={newitem.content}
                className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
                placeholderTextColor={"#AAAAAA"}
                placeholder="Ein neuer Text ..."
                style={{
                  height:75,
                  textAlign: 'left',
                  textAlignVertical: 'top',
                  justifyContent: 'start',
                }}
              />
            </View>
          )}

          {/* FILE hinzufügen */}
          {selectedMaterialType === 'FILE' && (
            <View className="flex-row items-center justify-start">
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <PlusIcon typeText={false}/>
                <TrashIcon handlePress={() => handleDeleteItem(newitem.id)}/>
              </View>
              <ScrollView
                style={{ width: '100%', }}
                horizontal={true}
              >
                {
                  fileList.map((file, index) => {
                    console.log("File: ", file);
                    return (
                    <TouchableOpacity key={index}
                                      className="bg-[#0c111d] flex-row p-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                                      style={{
                                        backgroundColor: items.some(item => item.id == file.id) ? "#0000ac" : null,
                                        height: 73,
                                      }}
                                      onPress={() => {
                                        if (items.some(item => item.id == file.id)) {
                                          handleDeleteItem(file.id);
                                        } else {
                                        setItems([
                                          ...items,
                                          {
                                          type: 'FILE',
                                          content: file.title,
                                          uri: null,
                                          sessionID: selectedSession.id,
                                          id: file.id,
                                        }
                                        ])}
                                      }}
                                      >
                      <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1 p-3">
                        {file.title.length > 20
                          ? file.title.substring(0, 20) + '...'
                          : file.title}
                      </Text>
                      <Text>
                        {
                          items.some(item => item.id == file.id) ? (
                            <Icon name="check" size={15} color="#4B5563" />
                          ) : (
                            <Icon name="plus" size={15} color="#4B5563" />
                          )
                        }
                      </Text>
                        
                    </TouchableOpacity>
                    )
                  })}
              </ScrollView>
            </View>
            
          )}

        {/* Übersicht aller hinzugefügten Items */}
        <SubHeader title="Materialien" />
        <View className="flex-row flex-wrap justify-start items-center">
          {items.filter(item => item.sessionID == selectedSession.id).length > 0 ? (
            items.filter(item => item.sessionID == selectedSession.id).map((item, index) => {
              const iconMap = {
                TOPIC: 'layer-group',
                PEN: 'pen',
                FILE: 'file',
              };
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-[#0c111d] flex-row p-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 30 }}
                  onPress={() => {
                    setNewItem({ ...newitem, content: item.content, type: item.type, uri: item.uri, sessionID:item.sessionID, id:item.id });
                  }}
                >
                  <Icon name={iconMap[item.type]} size={15} color="#4B5563" />
                  <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                    {item.content.length > 20
                      ? item.content.substring(0, 20) + '...'
                      : item.content}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <TouchableOpacity
              className="bg-[#0c111d] flex-row p-2 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
              style={{ height: 30, width: 180 }}
            >
              <Icon name="book-open" size={15} color="#4B5563" />
              <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                Noch keine Materialien
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </View>
        {/* Generating the Module */}
        <View className="mx-2 mt-2  px-2">
      <GratisPremiumButton
        aditionalStyles="w-full rounded-[10px] mx-3 bg-blue-500"
        handlePress={async () => {
          if (newModule.name.length < 2) {
            setErrorMessage('Bitte einen Modulnamen eingeben!');
            setIsError(true);
            return;
          } else if (newModule.description.length < 2) {
            setErrorMessage('Bitte eine Beschreibung eingeben!');
            setIsError(true);
            return;
          } else if (newModule.color == null) {
            setErrorMessage('Bitte eine Farbe auswählen!');
            setIsError(true);
            return;
          } else if (items.length < 1) {
            setErrorMessage('Bitte eine Sitzung hinzufügen!');
            setIsError(true);
            return;
          } else if (!sessions.every(session => items.some(item => item.sessionID == session.id))) {
            setErrorMessage('Bitte eine Sitzung hinzufügen!');
            setIsError(true);
            return;
          }

          await materialToModule(
            user,
            items,
            userData,
            newModule,
            setNewModule,
            questions,
            setQuestions,
            sessions,
            setSessions,
            setLoading,
            reloadNeeded,
            setReloadNeeded,
            setIsVisibleModal ? setIsVisibleModal : null,
            
          );
        }}
      >
        {loading ? <ActivityIndicator size="small" color="#4B5563" /> : <Text className="text-gray-700 font-semibold text-[15px]">Modul Generieren</Text>}
          
        
      </GratisPremiumButton>
        </View>
        </View>
      </ScrollView>
  );
};

export default PageAiCreate;