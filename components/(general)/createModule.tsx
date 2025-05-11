
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ColorPicker from '../(general)/colorPicker';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import ModalSessionList from '../(bibliothek)/(modals)/modalSessionList';
import { router } from 'expo-router'; 
import { useGlobalContext } from '@/context/GlobalProvider';
import { addNewModule } from '@/lib/appwriteAdd';
import { setUserDataSetup } from '@/lib/appwriteEdit';
import ErrorPopup from './(modal)/errorPopup';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';

const CreateModule = ({ newModule,  setNewModule, setUserChoices, isModal=null }) => {
  // Lokale States
  const { user, reloadNeeded, setReloadNeeded } = useGlobalContext();
  const [sessions, setSessions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading , setLoading] = useState(false); 
  const [selectedSession, setSelectedSession] = useState(0);
  const [isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage] = useState(null);
  const [ userData, setUserData] = useState(null)
  useEffect(() => {
          if (user == null) return;
          async function fetchUserData() {
              const res = await loadUserDataKathegory(user.$id);
              setUserData(res);
          }
          fetchUserData()
      }, [user])
      
  useEffect(() => {
        if (userData == null) return ;
        setNewModule({
            ...newModule, 
            releaseDate: new Date(),
            creator:userData.$id,
            creationCountry: userData.country,
            creationUniversity: userData.university,
            creationUniversityProfession: userData.studiengangZiel,
            creationRegion: userData.region,
            creationUniversitySubject: userData.studiengang,
            creationSubject: userData.schoolSubjects,
            creationEducationSubject: userData.educationSubject,
            creationUniversityFaculty: userData.faculty,
            creationSchoolForm: userData.schoolType,
            creationKlassNumber: userData.schoolGrade,
            creationLanguage: userData.language,
            creationEducationKathegory:userData.educationKathegory,
            studiengangKathegory:userData.studiengangKathegory
        });
    },[userData])
  
  // Farbauswahl übernehmen
  const changeColor = (color) => {
    setSelectedColor(color);
    setNewModule({ ...newModule, color: color });
  };




  const {width} = useWindowDimensions()
  return (
    <ScrollView className={`flex-1 bg-gray-900 p-2  shadow-lg ${width > 700 ? " rounded-[10px]" : ""}`}
   
      style={{
        width: '100%',

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

        
        borderWidth: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Android
      }}
      >
        <ErrorPopup isError={isError} setIsError={setIsError} errorMessage={errorMessage}/>
      <ModalSessionList
        sessions={sessions}
        setSessions={setSessions}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
        <View className='w-full'>
          <View className='m-2 flex-row items-center'>
            <Icon name="arrow-left" size={20} color="white" onPress={() => setUserChoices(null)} />
            <Text  className='text-gray-100 font-bold text-xl font-bold mx-2'>Neues Modul</Text>
          </View>
          <View className="flex-row ">
            <View className="flex-1 justify-between">
              <Text className="text-gray-300 font-semibold text-[15px]">Modul Name</Text>
              <TextInput
                maxLength={50}
                onChangeText={(text) => setNewModule({ ...newModule, name: text })}
                value={newModule?.name}
                placeholder="Ein origineller Name :)..."
                className="text-white w-full bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] rounded-[10px]"
                placeholderTextColor="#AAAAAA"
              />
            </View>
            <TouchableOpacity onPress={() => setNewModule({ ...newModule, public:newModule?.public ? false : true })}
              className='h-[30px] w-[30px]'
              >
              {
                newModule?.public ? (
                  <Icon name="globe" size={20} color="#4B5563" />
                ) : (
                  <Icon name="lock" size={20} color="#4B5563" />
                )
                }
            </TouchableOpacity>
          </View>

          {/* Beschreibung */}
        <View className="">
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">Beschreibung</Text>
          </View>
          <TextInput
            maxLength={200}
            onChangeText={(text) => setNewModule({ ...newModule, description: text })}
            value={newModule?.description}
            placeholderTextColor={"#AAAAAA"}
            placeholder="Beschreibung für dein Modul..."
            multiline
            numberOfLines={4}
            className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
          />
        </View>

         {/* Farbe */}
         <View className=" items-start">
          <View className="w-full flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">Farbe</Text>
          </View>
          <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
        </View>

{/* Sitzungen (Sessions) */}
<View className=" flex-row justify-start">
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
                          width: 60,
                          height: 60,
                          margin: 5,
                          marginTop: 5,

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

              {/* Material (Themen, Text, Dateien) */}
        
       

          
            
             {/* Button zum Generieren des Moduls */}
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
              } else if (sessions.length === 0) {
                setErrorMessage('Bitte eine Sitzung hinzufügen!');
                setIsError(true);
                return;
              
              }

            const res = await addNewModule({...newModule, color: newModule.color.toUpperCase(), questions: 0, sessions:sessions.map(item => JSON.stringify(item)) });
            setReloadNeeded([...reloadNeeded, "BIBLIOTHEK"]);
            const resp = await setUserDataSetup(user.$id)
            router.push("/bibliothek")
            if ( isModal) {
              isModal(false)
            }
            }}
          >
            {loading ? <ActivityIndicator size="small" color="#4B5563" /> : <Text className="text-gray-700 font-semibold text-[15px]">Modul erstellsen</Text>}
              
            
          </GratisPremiumButton>
            </View>
          </View>
        </View>

        </View>
      </ScrollView>
  );
};

export default CreateModule;