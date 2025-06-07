import { View, Modal, useWindowDimensions, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import PageAiCreate from '@/components/(getting-started)/pageAiCreate'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';

const AddAiModule = ({isVisible, setIsVisible}) => {
    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null)
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
          creationEducationSubject: "",
          creationUniversityFaculty: [],
          creationSchoolForm: null,
          creationKlassNumber: null,
          creationLanguage: null,
          creationEducationKathegory:"",
            synchronization: false,

          copy: false,
            questionList: [],
          });

    useEffect(() => {
              if (user == null) return;
              async function fetchUserData() {
                  const res = await loadUserDataKathegory(user.$id);
                  setUserData(res);
              }
              fetchUserData()
          }, [user])

      const closeModal = () => {
    setIsVisible(false);
  };
          
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

            });
        },[userData])

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View
            className="absolute top-0 left-0 w-full h-full justify-center items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                className="h-full w-full rounded-[10px] "
                style={{
                  maxWidth: 700,
                  maxHeight: 800,
                }}
              >
                <PageAiCreate setIsVisibleModal={setIsVisible} newModule={newModule} setNewModule={setNewModule} setUserChoices={()=> {setIsVisible(false)}} userData={userData}/>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  )
}

export default AddAiModule