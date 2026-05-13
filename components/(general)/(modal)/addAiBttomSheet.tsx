import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import PageAiCreate from "@/components/(getting-started)/pageAiCreate";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
import { useGlobalContext } from "@/context/GlobalProvider";
import { module, userDataKathegory } from "@/types/appwriteTypes";

const AddAiBottomSheet = ({
  isVisibleAiModule = false,
  setIsVisibleAiModule,
}: {
  isVisibleAiModule: boolean;
  setIsVisibleAiModule: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["20%", "60%", "90%"];

  useEffect(() => {
    if (isVisibleAiModule) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [isVisibleAiModule]);

  const { user, userData } = useGlobalContext();
  // Replace 'any' with the actual type if available, e.g., UserDataType
  const [userDataKategory, setUserDataKategory] = useState<userDataKathegory | null>(null);
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
      setUserDataKategory(res as unknown as userDataKathegory);
    }
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (userDataKategory == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date().toISOString(),
      creator: userDataKategory.$id ?? "",
      creationCountry: userDataKategory.country ?? "",
      creationUniversity: userDataKategory.university,
      creationUniversityProfession: userDataKategory.studiengangZiel,
      creationRegion: userDataKategory.region,
      creationUniversitySubject: userDataKategory.studiengang,
      creationSubject: userDataKategory.schoolSubjects,
      creationEducationSubject: userDataKategory.educationSubject,
      creationUniversityFaculty: userDataKategory.faculty,
      creationSchoolForm: userDataKategory.schoolType,
      creationKlassNumber: userDataKategory.schoolGrade,
      creationLanguage: userDataKategory.language,
      creationEducationKathegory: userDataKategory.educationKathegory,
      studiengangKathegory: Array.isArray(userDataKategory.studiengangKathegory)
        ? userDataKategory.studiengangKathegory
        : userDataKategory.studiengangKathegory
          ? [userDataKategory.studiengangKathegory]
          : [],
      kategoryType: userDataKategory.kategoryType ?? "",
    });
  }, [userDataKategory]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={() => {
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
        {userDataKategory && (
          <PageAiCreate
            calculatePrice={true}
            goBackVisible={false}
            setIsVisibleModal={setIsVisibleAiModule}
            newModule={newModule}
            setNewModule={setNewModule}
            setUserChoices={() => {}}
            userData={userData}
            tutorialStep={10}
            setTutorialStep={() => {}}
          />
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default AddAiBottomSheet;
