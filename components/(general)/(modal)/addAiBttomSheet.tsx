import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import PageAiCreate from "@/components/(getting-started)/pageAiCreate";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
import { useGlobalContext } from "@/context/GlobalProvider";
import { module, userDataKathegory } from "@/types/appwriteTypes";
import { userData } from "@/types/moduleTypes";

const AddAiBottomSheet = ({
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
  // Replace 'any' with the actual type if available, e.g., UserDataType
  const [userData, setUserData] = useState<userDataKathegory | null>(null);
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
      // Cast or map the result to userDataKathegory type
      setUserData(res as unknown as userDataKathegory);
    }
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (userData == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date().toISOString(),
      creator: userData.$id ?? "",
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
      studiengangKathegory: Array.isArray(userData.studiengangKathegory)
        ? userData.studiengangKathegory
        : userData.studiengangKathegory
          ? [userData.studiengangKathegory]
          : [],
      kategoryType: userData.kategoryType ?? "",
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
      backgroundStyle={{ backgroundColor: "#1F2937" }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          backgroundColor: "#111827",
          paddingBottom: 40,
        }}
        style={{ backgroundColor: "#111827" }}
        className={"bg-gray-900 "}
        showsVerticalScrollIndicator={false}
      >
        {userData && (
          <PageAiCreate
            calculatePrice={true}
            goBackVisible={false}
            setIsVisibleModal={setIsVisibleAiModule}
            newModule={newModule}
            setNewModule={setNewModule}
            setUserChoices={() => {
              setIsOpen(false);
            }}
            userData={userData}
          />
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default AddAiBottomSheet;
