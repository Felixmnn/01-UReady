import React, { useEffect, useState } from "react";
import PageOptions from "@/components/(getting-started)/pageOptions";
import PageAiCreate from "@/components/(getting-started)/pageAiCreate";
import PageDiscover from "@/components/(getting-started)/pageDiscover";
import { useGlobalContext } from "@/context/GlobalProvider";
import { loadUserData, loadUserDataKathegory } from "@/lib/appwriteDaten";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ModuleProps, Session, userData } from "@/types/moduleTypes";
import TutorialFirstModule from "@/components/(tutorials)/tutorialFirstModule";
import { View } from "react-native";
import CreateModule from "@/components/(general)/createModule/createModule";
import { updateUserData } from "@/lib/appwriteUpdate";
import { setUserDataSetup } from "@/lib/appwriteEdit";

const gettingStarted = () => {
  const [userChoices, setUserChoices] = useState<
    "GENERATE" | "DISCOVER" | "CREATE" | null
  >(null);
  
  

  const { user, isLoggedIn, isLoading } = useGlobalContext();
  useEffect(() => {
    setUserDataSetup(user.$id);
  }, []);
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

  useEffect(() => {
    if (!user) return;
    async function fetchUserDataKathegory() {
      const res = await loadUserData(user.$id);
      if (res && res.signInProcessStep == "DONE") {
        router.push("/home");
      }
    }
    fetchUserDataKathegory();
  }, [user]);

  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/");
    }
  }, [user, isLoggedIn, isLoading]);

  const [userDataP, setUserData] = useState<userData>();

  useEffect(() => {
    if (userDataP == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date(),
      creator: userDataP.$id,
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
      creationEducationKathegory: userDataP.educationKathegory,
      studiengangKathegory: userDataP.studiengangKathegory,
      kategoryType: userDataP.kategoryType,
    });
  }, [userDataP]);

  useEffect(() => {
    if (user == null) return;
    async function fetchUserData() {
      const res = await loadUserDataKathegory(user.$id);
      if (res) {
        // Map or cast the Document to userData type
        const mappedUserData: userData = {
          $id: res.$id,
          country: res.country,
          university: res.university,
          studiengangZiel: res.studiengangZiel,
          region: res.region,
          studiengang: res.studiengang,
          schoolSubjects: res.schoolSubjects,
          educationSubject: res.educationSubject,
          faculty: res.faculty,
          schoolType: res.schoolType,
          schoolGrade: res.schoolGrade,
          language: res.language,
          educationKathegory: res.educationKathegory,
          studiengangKathegory: res.studiengangKathegory,
          kategoryType: res.kategoryType,
          tutorialCompleted: res.tutorialCompleted ?? false,
          signInProcessStep: res.signInProcessStep ?? "",
          createdAt: res.createdAt ?? "",
          updatedAt: res.updatedAt ?? "",
        };
        setUserData(mappedUserData);
      }
    }
    fetchUserData();
  }, [user]);

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
          userChoices={userChoices}
          setUserChoices={setUserChoices}
        />
      ) : userChoices == "GENERATE" && userDataP ? (
        <PageAiCreate
          tutorialStep={tutorialStepAI}
          setTutorialStep={setTutorialStepAI}
          setIsVisibleModal={null}
          setUserChoices={setUserChoices}
          newModule={newModule}
          setNewModule={setNewModule}
          userData={userDataP}
        />
      ) : userChoices == "DISCOVER" && userDataP ? (
        <PageDiscover setUserChoices={setUserChoices} userData={userDataP} nothingForMe={() => setUserChoices("CREATE")}/>
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
