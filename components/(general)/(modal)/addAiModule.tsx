import { View, Modal, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import PageAiCreate from "@/components/(getting-started)/pageAiCreate";
import { useGlobalContext } from "@/context/GlobalProvider";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
import { module, userDataKathegory } from "@/types/appwriteTypes";

const AddAiModule = ({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useGlobalContext();
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
      setUserData(res as unknown as userDataKathegory);
    }
    fetchUserData();
  }, [user]);

  const closeModal = () => {
    setIsVisible(false);
  };

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
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <TouchableWithoutFeedback
        onPress={closeModal}
        style={{
          marginTop: 50,
          paddingTop: 50,
        }}
      >
        <View
          className="absolute top-0 left-0 w-full h-full justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              className="h-full w-full rounded-[10px] "
              style={{
                maxWidth: 700,
                maxHeight: 800,
                marginTop: 50,
                paddingTop: 50,
              }}
            >
              <PageAiCreate
                setIsVisibleModal={setIsVisible}
                newModule={newModule}
                setNewModule={setNewModule}
                setUserChoices={() => {
                  setIsVisible(false);
                }}
                userData={userData}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddAiModule;
