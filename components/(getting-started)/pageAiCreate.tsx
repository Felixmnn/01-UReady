
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ColorPicker from '../(general)/colorPicker';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import ModalSessionList from '../(bibliothek)/(modals)/modalSessionList';
import { materialToModule } from '@/functions/(aiQuestions)/materialToModule';
import uuid from 'react-native-uuid';
import { useGlobalContext } from '@/context/GlobalProvider';

const PageAiCreate = ({ newModule, userData, setNewModule, setUserChoices, userChoices }) => {
  // Lokale States
  const { user } = useGlobalContext();
  const [newTopic, setNewTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [manualSesions, setManualSessions] = useState(false);
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
  const [items, setItems] = useState([]); // Struktur: { type, content, uri? }

  const ErrorModal = ({isError, setIsError}) => {
    return (
        <Modal
            animationType="fade"
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

  return (
    <View className="h-full w-full items-center justify-center m-4 p-4">
      <ErrorModal isError={isError} setIsError={setIsError}/>
      <ModalSessionList
        sessions={sessions}
        setSessions={setSessions}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />

      <View
        className="bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-4 m-2 items-center justify-start shadow-lg"
        style={{
          width: 800,
          shadowColor:
            (newModule?.color === 'red' && '#DC2626') ||
            (newModule?.color === 'blue' && '#2563EB') ||
            (newModule?.color === 'green' && '#059669') ||
            (newModule?.color === 'yellow' && '#CA8A04') ||
            (newModule?.color === 'orange' && '#C2410C') ||
            (newModule?.color === 'purple' && '#7C3AED') ||
            (newModule?.color === 'pink' && '#DB2777') ||
            (newModule?.color === 'emerald' && '#059669') ||
            (newModule?.color === 'cyan' && '#0891B2') ||
            '#1F2937',
          borderColor:newModule?.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 10, // Android
        }}
      >
        {/* Modulnamen-Eingabe */}
        <View className="flex-row w-full">
          <View className="flex-1 justify-between">
            <Text className="text-gray-300 font-semibold text-[15px]">Modul Name</Text>
            <TextInput
              maxLength={50}
              onChangeText={(text) => setNewModule({ ...newModule, name: text })}
              value={newModule?.name}
              placeholder="Ein origineller Name :)..."
              className="text-white w-[50%] bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] rounded-[10px]"
            />
          </View>
          <TouchableOpacity>
            <Icon name="globe" size={30} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Beschreibung */}
        <View className="w-full">
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">Beschreibung</Text>
          </View>
          <TextInput
            maxLength={200}
            onChangeText={(text) => setNewModule({ ...newModule, description: text })}
            value={newModule?.description}
            placeholder="Beschreibung für dein Modul..."
            multiline
            numberOfLines={4}
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
          />
        </View>

        {/* Farbe */}
        <View className="w-full items-start">
          <View className="w-full flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">Farbe</Text>
          </View>
          <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
        </View>

        {/* Sitzungen (Sessions) */}
        <View className="w-full flex-row justify-start">
          <View className="flex-1 justify-between my-2">
            <View className="flex-row justify-between items-center pr-2">
              <Text className="text-gray-300 font-semibold text-[15px]">
                Sitzungen
              </Text>
              
            </View>
           
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
                  className="flex-row items-center justify-start"
                  horizontal
                  contentContainerStyle={{ paddingRight: 20 }}
                  style={{ height: 80, scrollbarWidth: 'thin', scrollbarColor: 'gray transparent' }}
                >
                  {sessions?.length > 0 &&
                    sessions.map((session, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedSession(session)}
                        className="bg-[#0c111d] p-3 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
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
                </ScrollView>
              </View>
            
          </View>
        </View>

        {/* Material (Themen, Text, Dateien) */}
        <View className="w-full m-2">
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">
              {selectedMaterialType === 'PEN'
                ? 'Ergänze einen Text:'
                : selectedMaterialType === 'FILE'
                ? 'Ergänze ein File:'
                : 'Ergänze eine Datei:'}
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

          {/* TOPIC hinzufügen */}
          {selectedMaterialType === 'TOPIC' && (
            <View className="flex-row items-center justify-start">
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="plus" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2   border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="layer-group" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                    onPress={() => handleDeleteItem(newitem.id)}

                  className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34 }}
                >
                  <Icon name="trash" size={15} color="#C62828" />
                </TouchableOpacity>
              </View>
              <TextInput
                maxLength={50}
                onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                value={newitem.content}
                placeholder="Eine neue Kategorie ..."
                className="text-white w-[50%] bg-[#0c111d] p-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] ml-2"
              />
            </View>
          )}

          {/* PEN hinzufügen */}
          {selectedMaterialType === 'PEN' && (
            <View className="flex-row items-start w-full">
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="plus" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2   border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="layer-group" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={() => handleDeleteItem(newitem.id)}

                  className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34 }}
                >
                  <Icon name="trash" size={15} color="#C62828" />
                </TouchableOpacity>
              </View>
              <TextInput
                multiline
                numberOfLines={5}
                maxLength={5000}
                onChangeText={(text) => setNewItem({ ...newitem, content: text })}
                value={newitem.content}
                className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] w-full"
              />
            </View>
          )}

          {/* FILE hinzufügen */}
          {selectedMaterialType === 'FILE' && (
            <View className="flex-row items-center justify-start">
              {/* Hier könntest du die Datei-Logik einfügen */}
              <View className='items-center justify-between mt-2 mb-2 ml-2'>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="plus" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={addItem}
                  className="bg-[#0c111d] flex-row p-2   border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34,marginBottom:5 }}
                >
                  <Icon name="layer-group" size={15} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={newitem.content.length < 2}
                  onPress={() => handleDeleteItem(newitem.id)}

                  className="bg-[#0c111d] flex-row p-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 34, width: 34 }}
                >
                  <Icon name="trash" size={15} color="#C62828" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Übersicht aller hinzugefügten Items */}
          <Text className="text-gray-300 font-semibold text-[15px] m-1">Deine Themen:</Text>
          <View className="flex-row flex-wrap justify-start items-center">
            {items.length > 0 ? (
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

        {/* Button zum Generieren des Moduls */}
        <View className="mx-2 mt-2 w-full px-2">
          <GratisPremiumButton
            aditionalStyles="rounded-[10px] mx-3 w-full"
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
              );
            }}
          >
            {loading ? <ActivityIndicator size="small" color="#4B5563" /> : <Text className="text-gray-700 font-semibold text-[15px]">Modul Generieren</Text>}
              
            
          </GratisPremiumButton>
        </View>
      </View>
    </View>
  );
};

export default PageAiCreate;