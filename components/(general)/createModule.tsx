
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ColorPicker from '../(general)/colorPicker';
import GratisPremiumButton from '../(general)/gratisPremiumButton';
import ModalSessionList from '../(bibliothek)/(modals)/modalSessionList';
import { router } from 'expo-router'; 
import { useGlobalContext } from '@/context/GlobalProvider';
import { adddModule } from '@/lib/appwriteAdd';
import { setUserDataSetup } from '@/lib/appwriteEdit';
import ErrorPopup from './(modal)/errorPopup';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';
import  languages  from '@/assets/exapleData/languageTabs.json';

const CreateModule = ({ newModule,  setNewModule, setUserChoices, isModal=null,goBackVisible=true }) => {
  // Lokale States
  const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.createModule;
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])

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
            studiengangKathegory:userData.studiengangKathegory,
            kategoryType: userData.kategoryType,
            color: "blue"

        });
    },[userData])
  
  // Farbauswahl übernehmen
  const changeColor = (color) => {
    setSelectedColor(color);
    setNewModule({ ...newModule, color: color });
  };




  const {width} = useWindowDimensions()
  const [ tutorialVisible, setTutorialVisible] = useState(false);
  return (
    <ScrollView className={`flex-1 bg-gray-900 p-2   rounded-[10px] `}

      style={{
        width: '100%',
        
        elevation: 20, // Android
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
          <View className='flex-row justify-between items-center'> 
            {goBackVisible ?
            <TouchableOpacity className='m-2 flex-row items-center' onPress={() => setUserChoices(null)}> 
              <Icon name="arrow-left" size={20} color="white"  />
              <Text  className='text-gray-100 font-bold text-xl font-bold mx-2'>{texts[selectedLanguage].newModule}</Text>
            </TouchableOpacity>
            : <Text  className='text-gray-100 font-bold text-xl font-bold'>{texts[selectedLanguage].newModule}</Text>}
            <TouchableOpacity onPress={() => setNewModule({ ...newModule, "public":newModule?.public ? false : true })}
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
          <View className="flex-row ">
            <View className="flex-1 justify-between">
              <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].moduleName}</Text>
              <TextInput
                maxLength={50}
                onChangeText={(text) => setNewModule({ ...newModule, name: text })}
                value={newModule?.name}
                placeholder={texts[selectedLanguage].aOriginalName}
                className="text-white w-full bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] rounded-[10px]"
                placeholderTextColor="#AAAAAA"
              />
            </View>
            
          </View>

          {/* Beschreibung */}
        <View className="">
          <View className="flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].description}</Text>
          </View>
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

         {/* Farbe */}
         <View className=" items-start">
          <View className="w-full flex-row justify-between items-center pr-2">
            <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].color}</Text>
          </View>
          <ColorPicker selectedColor={selectedColor} changeColor={changeColor} title={null} />
        </View>

{/* Sitzungen (Sessions) */}
<View className=" flex-row justify-start">
          <View className="flex-1 justify-between my-2">
            <View className="flex-row justify-between items-center pr-2">
              <Text className="text-gray-300 font-semibold text-[15px]">
                {texts[selectedLanguage].sessions}
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

                          borderColor: session?.color || '#1F2937',
                          shadowColor: session?.color || '#1F2937',
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
              /*
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
              } else if (sessions.length === 0) {
                setErrorMessage(texts[selectedLanguage].errorMissingSessions);
                setIsError(true);
                return;
              
              }
              */
            const res = await adddModule({...newModule, color: newModule.color.toUpperCase(), questions: 0, sessions:sessions.map(item => JSON.stringify(item)) });
            setReloadNeeded([...reloadNeeded, "BIBLIOTHEK"]);
            const resp = await setUserDataSetup(user.$id)
            router.push("/bibliothek")
            
            }}
          >
            {loading ? <ActivityIndicator size="small" color="#4B5563" /> : <Text className="text-gray-300 font-semibold text-[15px]">{texts[selectedLanguage].createModule}</Text>}
              
            
          </GratisPremiumButton>
            </View>
          </View>
        </View>

        </View>
      </ScrollView>
  );
};

export default CreateModule;