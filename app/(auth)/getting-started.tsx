import { View, Text, SafeAreaView, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ContinueBox from '@/components/(signUp)/(components)/continueBox';
import Icon from 'react-native-vector-icons/FontAwesome5'
import ColorPicker from '@/components/(general)/colorPicker';
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import PageOptions from '@/components/(getting-started)/pageOptions';
import PageAiCreate from '@/components/(getting-started)/pageAiCreate';
import PageDiscover from '@/components/(getting-started)/pageDiscover';
import PageCreateModule from '@/components/(getting-started)/pageCreateModule';
import PageModulText from '@/components/(getting-started)/(aiCreate)/pageModulText';
import PageModulThema from '@/components/(getting-started)/(aiCreate)/pageModulThema';
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';
import PageModuleDocument from '@/components/(getting-started)/(aiCreate)/pageModuleDocument';

const gettingStarted = () => {
    const [userChoices, setUserChoices] = useState(null);
    const { user } = useGlobalContext()
    const [ userData, setUserData] = useState(null)

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

    useEffect(() => {
        if (user == null) return;
        async function fetchUserData() {
           const res = await loadUserDataKathegory(user.$id);
           setUserData(res);
        }
        fetchUserData()
    }, [user])

    const [ newModule, setNewModule] = useState({
      name: "",
      subject: "",
      questions: 0,
      notes: 0,
      documents: 0,
      public: false,
      progress: 0,
      creator: "",
      color: null,
      sessions: [],
      tags: [],
      description: "",
      releaseDate: null,
      connectedModules: [],
      qualityScore: 0,
      duration: 0,
      upvotes: 0,
      downVotes: 0,
      creationCountry: null,
      creationUniversity: null,
      creationUniversityProfession: null,
      creationRegion: null,
      creationUniversitySubject: [],
      creationSubject: [],
      creationEducationSubject: [],
      creationUniversityFaculty: [],
      creationSchoolForm: null,
      creationKlassNumber: null,
      creationLanguage: null,
      creationEducationKathegory:[],
      copy: false,
      });
    
  return (
        <SafeAreaView className="bg-[#0c111d] flex-1 p-4 bg-gradient-to-b from-blue-900 to-[#0c111d]  items-center justify-center">
          {
            userChoices !== null ?
          <TouchableOpacity onPress={()=> {
            if (userChoices == "TEXTBASED" || userChoices == "THEMENBASED"){
                setUserChoices("GENERATE")
            } else {
                setUserChoices(null);
            }
          }} className='absolute top-5 left-5 p-2 bg-gray-900 border-gray-800 border-[1px] items-center justify-center rounded-full shadow-lg'
            style={{
              height: 34,
              width: 34,
              zIndex:100,
            }}
            >
            <Icon name="arrow-left" size={20} color="white"/>
          </TouchableOpacity>
          :null
          }
          { userChoices == null ?           <PageOptions userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices == "GENERATE" ?     <PageAiCreate userChoices={userChoices} setUserChoices={setUserChoices} newModule={newModule} setNewModule={setNewModule} userData={userData}/>
          : userChoices  == "DISCOVER" ?    <PageDiscover userChoices={userChoices} setUserChoices={setUserChoices} userData={userData}/>
          : userChoices == "CREATE" ?       <PageCreateModule userChoices={userChoices} setUserChoices={setUserChoices} userData={userData} newModule={newModule} setNewModule={setNewModule}/>
          : userChoices == "TEXTBASED" ?    <PageModulText newModule={newModule} setNewModule={setNewModule} userData={userData}/>
          : userChoices == "THEMENBASED" ?  <PageModulThema newModule={newModule} setNewModule={setNewModule} userData={userData}/>
          : userChoices == "DOCUMENTBASED" ?  <PageModuleDocument  newModule={newModule} setNewModule={setNewModule} userData={userData}/>
          : null
}  
        </SafeAreaView>
    
  )
}

export default gettingStarted