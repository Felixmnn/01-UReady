import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import PageAiCreate from '@/components/(getting-started)/pageAiCreate';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';
import { useGlobalContext } from '@/context/GlobalProvider';

const AddAiBottomSheet = ({isVisibleAiModule=false, setIsVisibleAiModule}) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [ isOpen, setIsOpen ] = useState(true);
    const snapPoints = ["20%","60%","90%"];  
    
    useEffect(() => {
        if (isVisibleAiModule) {
            setIsOpen(true);
            sheetRef.current?.snapToIndex(0);
        } else {
            setIsOpen(false);
        }
    }, [isVisibleAiModule]);

    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null)
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
            studiengangKathegory:userData.studiengangKathegory,
            kategoryType: userData.kategoryType,

        });
    },[userData])

  return (
    <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {setIsOpen(false);setIsVisibleAiModule(false)}}
        backgroundStyle={{ backgroundColor: '#1F2937',
           
         }} 
        >
        <BottomSheetScrollView
        contentContainerStyle={{ backgroundColor: '#111827', paddingBottom: 40 }}
        style={{ backgroundColor: '#111827' }}
        className={"bg-gray-900 "}
        showsVerticalScrollIndicator={false}>
                <PageAiCreate calculatePrice={true} goBackVisible={false} setIsVisibleModal={setIsVisibleAiModule} newModule={newModule} setNewModule={setNewModule} setUserChoices={()=> {setIsOpen(false)}} userData={userData}/>
        </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default AddAiBottomSheet