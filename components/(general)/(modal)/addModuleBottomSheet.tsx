import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
import { useGlobalContext } from "@/context/GlobalProvider";
import CreateModule from "../createModule/createModule";
import { Session, userData } from "@/types/moduleTypes";
import { module } from "@/types/appwriteTypes";
const AddModuleBottomSheet = ({
  isVisibleAiModule = false,
  setIsVisibleAiModule,
}: {
  isVisibleAiModule: boolean;
  setIsVisibleAiModule: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ["20%", "60%", "90%"];
  useEffect(() => {
    if (isVisibleAiModule) {
      setIsOpen(true);
      sheetRef.current?.snapToIndex(0);
    } else {
      setIsOpen(false);
    }
  }, [isVisibleAiModule]);
  const { user } = useGlobalContext();
  const [userData, setUserData] = useState<userData | undefined>();
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
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [newModule, setNewModule] = useState<module>({
    name: "",
    subject: "",
    questions: 0,
    notes: 0,
    documents: 0,
    public: true,
    progress: 0,
    creator: "",
    color: "",
    sessions: [],
    tags: [],
    description: "",
    releaseDate: "",
    connectedModules: [],
    qualityScore: 0,
    duration: 0,
    upvotes: 0,
    downVotes: 0,
    creationCountry: "",
    creationUniversity: "",
    creationUniversityProfession: "",
    creationRegion: "",
    creationUniversitySubject: [],
    creationSubject: [],
    creationEducationSubject: "",
    creationUniversityFaculty: [],
    creationSchoolForm: "",
    creationKlassNumber: 0,
    creationLanguage: "",
    creationEducationKathegory: "",
    synchronization: false,

    copy: false,
    questionList: [],
    studiengangKathegory: [],
    kategoryType: "",
  });

  useEffect(() => {
    if (user == null) return;
    async function fetchUserData() {
      const res = await loadUserDataKathegory(user.$id);
      if (res) {
        // Map or cast the Document to userData type
        const mappedUserData: userData = {
          $id: res.$id,
          country: res.country ?? "",
          university: res.university ?? "",
          studiengangZiel: res.studiengangZiel ?? "",
          region: res.region ?? "",
          studiengang: res.studiengang ?? [],
          schoolSubjects: res.schoolSubjects ?? [],
          educationSubject: res.educationSubject ?? "",
          faculty: res.faculty ?? [],
          schoolType: res.schoolType ?? null,
          schoolGrade: res.schoolGrade ?? null,
          language: res.language ?? null,
          educationKathegory: res.educationKathegory ?? "",
          studiengangKathegory: res.studiengangKathegory ?? "",
          kategoryType: res.kategoryType ?? "",
          tutorialCompleted: res.tutorialCompleted ?? false,
          signInProcessStep: res.signInProcessStep ?? 0,
          createdAt: res.createdAt ?? "",
          updatedAt: res.updatedAt ?? "",
        };
        setUserData(mappedUserData);
      }
    }
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (userData == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date().toISOString(),
      creator: userData.$id,
      creationCountry: userData.country ?? "",
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
      creationEducationKathegory: userData.educationKathegory,
      studiengangKathegory: userData.studiengangKathegory
        ? Array.isArray(userData.studiengangKathegory)
          ? userData.studiengangKathegory
          : [userData.studiengangKathegory]
        : [],
      kategoryType: userData.kategoryType,
    });
  }, [userData]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => {
        setIsOpen(false);
        setIsVisibleAiModule(false);
      }}
      backgroundStyle={{ backgroundColor: "#1a202c" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          backgroundColor: "#1a202c",
          paddingBottom: 40,
        }}
        style={{ backgroundColor: "#1a202c" }}
        showsVerticalScrollIndicator={false}
      >
        <CreateModule
          newModule={newModule}
          setNewModule={setNewModule}
          setUserChoices={() => setIsVisibleAiModule(false)}
          goBackVisible={false}
          sessions={sessions}
          setSessions={setSessions}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setSelectedSession={setSelectedSession}
          hideCreateButton={false}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default AddModuleBottomSheet;
