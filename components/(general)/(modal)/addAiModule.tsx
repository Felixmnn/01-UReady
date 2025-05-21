import { View, Modal, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import PageAiCreate from '@/components/(getting-started)/pageAiCreate'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';

const AddAiModule = ({isVisible, setIsVisible}) => {
    const { user } = useGlobalContext();
    const { heigth } = useWindowDimensions();
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

  return (
    <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <View  className='absolute bottom-0 left-0 w-full h-full  justify-center items-center '
            
             
            >
      <PageAiCreate newModule={newModule} setNewModule={setNewModule} setUserChoices={()=> {setIsVisible(false)}} userData={userData}/>
    </View>
        </Modal>
  )
}

export default AddAiModule