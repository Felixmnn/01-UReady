import React, { useEffect, useState } from 'react'
import PageOptions from '@/components/(getting-started)/pageOptions';
import PageAiCreate from '@/components/(getting-started)/pageAiCreate';
import PageDiscover from '@/components/(getting-started)/pageDiscover';
import PageCreateModule from '@/components/(getting-started)/pageCreateModule';
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import  languages  from '@/assets/exapleData/languageTabs.json';

const gettingStarted = () => {
    const [userChoices, setUserChoices] = useState(null);
    const {user, isLoggedIn,isLoading,language } = useGlobalContext();
    const [ selectedLanguage, setSelectedLanguage ] = useState(language ? language : "DEUTSCH");
    const [texts, setTexts] =  useState(languages.gettingStarted[selectedLanguage] || languages.gettingStarted["DEUTSCH"]);
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
        setTexts(languages.gettingStarted[language] || languages.gettingStarted["DEUTSCH"]);
      }
    }, [language])

    useEffect(() => {
      if (!user) return;
      async function fetchUserDataKathegory(){
        const res = await loadUserData(user.$id);
        if (res && res.signInProcessStep == "DONE") {
          router.push("/home")
        }
      }
      fetchUserDataKathegory();
      },[user])

      useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); // oder "/sign-in"
        }
      }, [user, isLoggedIn, isLoading]);
      
    const [ userDataP, setUserData] = useState(null)

    useEffect(() => {
      if (userDataP == null) return ;
      setNewModule({
          ...newModule, 
          releaseDate: new Date(),
          creator:userDataP.$id,
          creationCountry: userDataP.country,
          creationUniversity: userDataP.university,
          creationUniversityProfession: userDataP.studiengangZiel,
          creationRegion: userDataP.region,
          creationUniversitySubject: userDataP.studiengang,
          creationSubject: userDataP.schoolSubjects,
          creationEducationSubject: userDataP.educationSubject,
          creationUniversityFaculty: userDataP.faculty,
          creationSchoolForm: userDataP.schoolType,
          creationKlassNumber: userDataP.schoolGrade,
          creationLanguage: userDataP.language,
          creationEducationKathegory:userDataP.educationKathegory,
          studiengangKathegory:userDataP.studiengangKathegory,
          kategoryType: userDataP.kategoryType,

      });
  },[userDataP])

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
      "public": true,
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
      creationEducationSubject: "",
      creationUniversityFaculty: [],
      creationSchoolForm: null,
      creationKlassNumber: null,
      creationLanguage: null,
      creationEducationKathegory:"",
      copy: false,
      questionList: [],
      synchronization: false
      });
      const [ tutorialStepAI, setTutorialStepAI] = useState(0);
      const [ tuturialStep, setTutorialStep] = useState(0);
  return (
        <SafeAreaView className=" flex-1 bg-gradient-to-b from-blue-900 to-[#0c111d]    items-center justify-center"
        style={{
          backgroundColor: "#0c111d",
        }}
        > 
          
          { userChoices == null ?           <PageOptions userChoices={userChoices} setUserChoices={setUserChoices}/>
          : userChoices == "GENERATE" ?     <PageAiCreate tutorialStep={tutorialStepAI} setTutorialStep={setTutorialStepAI} setIsVisibleModal={null}  setUserChoices={setUserChoices} newModule={newModule} setNewModule={setNewModule} userData={userDataP}/>
          : userChoices  == "DISCOVER" ?    <PageDiscover userChoices={userChoices} setUserChoices={setUserChoices} userData={userDataP}/>
          : userChoices == "CREATE" ?       <PageCreateModule tuturialStep={tuturialStep} setTutorialStep={setTutorialStep} setUserChoices={setUserChoices}  newModule={newModule} setNewModule={setNewModule}/>
          : null
}  
        </SafeAreaView>
  )
}

export default gettingStarted