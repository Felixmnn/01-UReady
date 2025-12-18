import React, { use, useEffect, useState } from "react";
import PageOptions from "@/components/(getting-started)/pageOptions";
import PageAiCreate from "@/components/(getting-started)/pageAiCreate";
import PageDiscover from "@/components/(getting-started)/pageDiscover";
import { useGlobalContext } from "@/context/GlobalProvider";
import {  loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import { SafeAreaView } from "react-native-safe-area-context";
import {  router } from "expo-router";
import { ModuleProps, Session, userData } from "@/types/moduleTypes";
import TutorialFirstModule from "@/components/(tutorials)/tutorialFirstModule";
import { Text, View } from "react-native";
import CreateModule from "@/components/(general)/createModule/createModule";
import { getUserDataConfigFromMMKV } from "@/lib/mmkvFunctions";
import { checkSession } from "@/lib/appwrite";

const gettingStarted = () => {
  console.log("Getting Started Component Rendered");
  const [userChoices, setUserChoices] = useState<"GENERATE" | "DISCOVER" | "CREATE" | null>(null);
  
  const userData = getUserDataConfigFromMMKV();
 


  const { user, setUser, isLoggedIn, isLoading, setUserUsage,userUsage, userCathegory, setUserCategory } = useGlobalContext();
  
  useEffect(() => {
    if(!user) {
      checkSession().then((res) => {
        if(!res) {
          router.replace("/");
        } else {
          setUser(res);
          loadUserUsage(res.$id).then((usage) => {
            setUserUsage(usage);
          })}
        });
    } else {
      console.log("User vorhanden im GS");
      if (!userUsage) {
        loadUserUsage(user.$id).then((usage) => {
          console.log("Geladene UserUsage im GS:", usage);
          setUserUsage(usage);
        });
      }
      console.log(" UserUsage vorhanden");
      console.log("UserKathegory im GS:", userCathegory);
      if (!userCathegory) {
        loadUserDataKathegory(user.$id).then((dataKat) => {
          console.log("Geladene UserKathegory im GS:", dataKat);
          setUserCategory(dataKat);
        });
      }
      console.log(" UserKathegory vorhanden");
    }
  }, [user]);
  
   useEffect(() => {
    if (!userCathegory) return;
    if (userCathegory.signInProcessStep == "DONE"){ 
      router.replace("/home");
    } 
  }, [userCathegory]);


  const [sessions, setSessions] = useState<Session[]>([
    {
      title: "S1",
      percent: 0,
      color: "blue",
      iconName: "book",
      questions: 0,
      description: "",
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    },
  ]);
  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [newModule, setNewModule] = useState<ModuleProps>({
    name: "",
    subject: "",
    questions: 0,
    notes: 0,
    documents: 0,
    public: true,
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
    creationEducationKathegory: "",
    studiengangKathegory: "",
    kategoryType: "",
    copy: false,
    questionList: [],
    synchronization: false,
  });

  /*
  useEffect(() => {
    if (!user) return;
    async function fetchUserDataKathegory() {
      const res = await loadUserData(user.$id);
      if (res && res.signInProcessStep == "FINISHED") {
        router.push("/personalize");
      }
    }
    fetchUserDataKathegory();
  }, [user]);
  */
  /*
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/");
    }
  }, [user, isLoggedIn, isLoading]);
  */

  useEffect(() => {
    if (userCathegory == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date(),
      creator: userCathegory.$id,
      creationCountry: userCathegory.country,
      creationUniversity: userCathegory.university,
      creationUniversityProfession: userCathegory.studiengangZiel,
      creationRegion: userCathegory.region,
      creationUniversitySubject: userCathegory.studiengang,
      creationSubject: userCathegory.schoolSubjects,
      creationEducationSubject: userCathegory.educationSubject,
      creationUniversityFaculty: userCathegory.faculty,
      creationSchoolForm: userCathegory.schoolType,
      creationKlassNumber: userCathegory.schoolGrade,
      creationLanguage: userCathegory.language,
      creationEducationKathegory: userCathegory.educationKathegory,
      studiengangKathegory: userCathegory.studiengangKathegory,
      kategoryType: userCathegory.kategoryType,
    });
  }, [userCathegory]);


  const [tutorialStepAI, setTutorialStepAI] = useState(0);
  const [tuturialStep, setTutorialStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

 
  
  return (
    <SafeAreaView
      className=" flex-1 bg-gradient-to-b from-blue-900 to-[#0c111d]    items-center justify-center"
      style={{
        backgroundColor: "#0c111d",
      }}
    > 
    
      {userChoices == null ? (
        <PageOptions
          setUserChoices={setUserChoices}
        />
      ) : userChoices == "GENERATE" && userCathegory ? (
        <PageAiCreate
          tutorialStep={tutorialStepAI}
          setTutorialStep={setTutorialStepAI}
          setIsVisibleModal={null}
          setUserChoices={setUserChoices}
          newModule={newModule}
          setNewModule={setNewModule}
          userData={userCathegory}
          isGettingStarted={true} 
        />
      ) : userChoices == "DISCOVER" && userCathegory ? (
        <PageDiscover setUserChoices={setUserChoices} userData={userCathegory} nothingForMe={() => setUserChoices("CREATE")}/>
      ) : userChoices == "CREATE" ? (
        <View className="flex-1 w-full">
          <TutorialFirstModule
            isVisible={isVisible && tuturialStep < 10}
            setIsVisible={setIsVisible}
            tutorialStep={tuturialStep}
            setTutorialStep={setTutorialStep}
          />

          <CreateModule
            newModule={newModule}
            setNewModule={setNewModule}
            setUserChoices={setUserChoices}
            sessions={sessions}
            setSessions={setSessions}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default gettingStarted;
