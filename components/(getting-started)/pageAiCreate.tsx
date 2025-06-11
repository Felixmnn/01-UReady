
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
import { addDocumentConfig, addDocumentToBucket, addDocumentToBucketWeb, setUserData } from '@/lib/appwriteEdit';
import TutorialFirstAIModule from '../(tutorials)/tutorialFirstAIModule';
import  languages  from '@/assets/exapleData/languageTabs.json';


const PageAiCreate = ({ newModule, userData, setNewModule, setUserChoices, setIsVisibleModal, tutorialStep= 10, setTutorialStep=null, goBackVisible=true, calculatePrice=false  }) => {
  // Lokale States
  const { language, setUserUsage, userUsage } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.createModule;
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])

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
      let uploadRes;
      if (Platform.OS === 'web') {
        // ✅ Web: fetch URI as Blob
        fileBlob = await fetch(file.uri).then(res => res.blob());
        const data = {
          id : doc.id,
          file: fileBlob,
        }

        uploadRes = await addDocumentToBucketWeb(data);
        console.log("Web upload response:", uploadRes);
      } else {
        // ✅ Native: pass file as { uri, name, type }
        fileBlob = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
          size: file.size,
        };
        uploadRes = await addDocumentToBucket(
        doc.id,
        fileBlob,
      );
      }

      

      console.log("✅ Upload response:", uploadRes);
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

 
  const [ tutorialVisible, setTutorialVisible ] = useState(true);

  function calculateTotalPrice() {
    let totalPrice = 0;
    items.forEach(item => {
      if (item.type === 'PEN') {
        totalPrice += 1}
      else if (item.type === 'TOPIC') {
        totalPrice += 1}
      else if (item.type === 'FILE') {
        totalPrice += 3}

    }
    );
    console.log("💵Total Price: ", totalPrice);
    return totalPrice
  }

  calculateTotalPrice()
  return (
    <ScrollView className={`flex-1 bg-gray-900 p-3   rounded-[10px] `}
      style={{
        width: '100%',
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
      <TutorialFirstAIModule
        isVisible={tutorialVisible}
        setIsVisible={setTutorialVisible}
        setTutorialStep={setTutorialStep}
        tutorialStep={tutorialStep}
      />
        <View className='w-full'>
        {/* Header */}
        <View className='flex-row justify-between items-center'> 
          {goBackVisible ?
            <TouchableOpacity className='m-2 flex-row items-center' onPress={() => setUserChoices(null)}> 
              <Icon name="arrow-left" size={20} color="white"  />
              <Text  className='text-gray-100 font-bold text-xl font-bold mx-2'>{texts[selectedLanguage].newModule}</Text>
            </TouchableOpacity>
            :      <Text  className='text-gray-100 font-bold text-xl font-bold'>AI Modul</Text>

            }
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
                    >{texts[selectedLanguage].public}</Text>
                    <Icon name="globe" size={15} color="#4B5563" />
                  </View>
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-gray-300 font-semibold text-[15px] mr-1'
                      style={{
                        color: "#4B5563",
                      }}
                    >{texts[selectedLanguage].private}</Text>
                    <Icon name="lock" size={15} color="#4B5563" />
                  </View>
                )
                }
            </TouchableOpacity>
        </View>
        {/* Title */}
        <View>
          <SubHeader title={texts[selectedLanguage].moduleName} />
          <TextInput
            maxLength={50}
            onChangeText={(text) => setNewModule({ ...newModule, name: text })}
            value={newModule?.name}
            placeholder={texts[selectedLanguage].aOriginalName}
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        {/* Description */}
        <View className="">
          <SubHeader title={texts[selectedLanguage].description} />
          <TextInput
            maxLength={200}
            onChangeText={(text) => setNewModule({ ...newModule, description: text })}
            value={newModule?.description}
            placeholderTextColor={"#AAAAAA"}
            placeholder={texts[selectedLanguage].aOriginalDescription}
            multiline={true}
            numberOfLines={4}
            style={{ height: 90, textAlignVertical: 'top'}}
            textAlignVertical="top"
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
          />
        </View>
         {/* Choosing the Color */}
        <View className=" items-start">
          <SubHeader title={texts[selectedLanguage].color} />
          <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
        </View>
        {/* Adding Material */}
        <View>
        <SubHeader title={texts[selectedLanguage].sessions} />
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
                ? texts[selectedLanguage].addAText
                : selectedMaterialType === 'FILE'
                ? texts[selectedLanguage].addAFile
                : texts[selectedLanguage].addATopic}
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
                placeholder={texts[selectedLanguage].aNewKathegorie}
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
                placeholder={texts[selectedLanguage].aNewText}
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
        <SubHeader title={texts[selectedLanguage].materials} />
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
              style={{ height: 30, width: 250 }}
            >
              <Icon name="book-open" size={15} color="#4B5563" />
              <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1">
                {texts[selectedLanguage].noMaterialAdded}
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
            setErrorMessage(texts[selectedLanguage].errorMissingName);
            setIsError(true);
            return;
          } else if (newModule.description.length < 2) {
            setErrorMessage(texts[selectedLanguage].errorMissingDescription);
            setIsError(true);
            return;
          } else if (newModule.color == null) {
            setErrorMessage(texts[selectedLanguage].errorMissingColor);
            setIsError(true);
            return;
          } else if (items.length < 1) {
            setErrorMessage(texts[selectedLanguage].errorMissingSessions);
            setIsError(true);
            return;
          } else if (!sessions.every(session => items.some(item => item.sessionID == session.id))) {
            setErrorMessage(texts[selectedLanguage].errorMissingSessions);
            setIsError(true);
            return;
          } else if ((calculateTotalPrice() > userData.energy && calculatePrice) ) {
            setErrorMessage("You don't have enough energy to generate this module. Please buy more energy or reduce the number of items.");
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
          setUserData({
            ...userData,
            energy: userData.energy - calculateTotalPrice(),
          });
        }}
      >
        { loading ? <ActivityIndicator size="small" color="#4B5563" /> : 
        !calculatePrice ? <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].generateModule}</Text>
        :
        <View className='flex-row items-center'>
                        <Text className='text-white  font-semibold text-[15px] '>Modul für {calculateTotalPrice()}</Text>
                        <Icon name="bolt" size={15} color="white" className="mx-1 mt-1" />
                        <Text className='text-white  font-semibold text-[15px]  mb-[1px]'>generieren</Text>

        </View>
      
      }
        
        
      </GratisPremiumButton>
        </View>
        </View>
      </ScrollView>
  );
};

export default PageAiCreate;