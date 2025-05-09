import { View, Text, TouchableOpacity, ScrollView,FlatList } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { loadUserDataKathegory} from "../../../lib/appwriteDaten"
import AddModule from '@/components/(general)/(modal)/addModule';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateUserUsageModules } from '@/lib/appwriteUpdate';

const AllModules = ({setSelected, modules, setSelectedModule}) => {
    const [last7Hidden, setLast7Hidden ] = useState(true)
    const { user,language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
      
    const texts = {
      "DEUTSCH":{
        title: "Bibliothek",
        last7: "Letzte 7 Tage",
        erstelleModul: "Modul erstellen",
      },
      "ENGLISH(US)":{
        title: "Library",
        last7: "Last 7 Days",
        erstelleModul: "Create Module",
      },
      "ENGLISH(UK)":{
        title: "Library",
        last7: "Last 7 Days",
        erstelleModul: "Create Module",
      },
      "AUSTRALIAN":{
        title: "Library",
        last7: "Last 7 Days",
        erstelleModul: "Create Module",
      },
      "SPANISH":{
        title: "Biblioteca",
        last7: "Últimos 7 días",
        erstelleModul: "Crear módulo",
      },
    }

    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);
    const numColumns = Math.floor(width / 300);
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
          copy: false,
          });

    const [ userData, setUserData] = useState(null)

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

    useEffect(() => {
        if (user == null) return;
        async function fetchUserData() {
           const res = await loadUserDataKathegory(user.$id);
           setUserData(res);
        }
        fetchUserData()
    }, [user])
console.log("New Module",newModule)

    console.log("Modules",modules.documents)
  return (
    <View className='flex-1 bg-[#0c111d] '>
      <AddModule isVisible={isVisibleNewModule} setIsVisible={setIsVisibleNewModule} newModule={newModule} setNewModule={setNewModule} />

        <View className={`flex-row p-4 justify-between items-center h-[60px] rouned-[10px] `}>
          <Text className='font-bold text-3xl text-gray-100'>
            {texts[selectedLanguage].title}
          </Text>
          <TouchableOpacity onPress={()=> {setIsVisibleNewModule(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
              <Icon name="cubes" size={15} color="white"/>
              {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>{texts[selectedLanguage].erstelleModul}</Text> : null}
          </TouchableOpacity>
        </View>
        <View className='border-t-[1px] border-gray-700 w-full  ' />
        <View className={`flex-1  bg-gray-900 ${isVertical ? "p-4" : "p-2"} `}>
          <TouchableOpacity className='' onPress={()=> setLast7Hidden(!last7Hidden)}>
            <View className='flex-row items-center justify-between w-full mb-2'>
              <Text className='font-bold text-gray-100 text-[18px]'>{texts[selectedLanguage].last7}</Text>
              <Icon name={last7Hidden ? "chevron-down" : "chevron-up"} size={15} color="white"/>
            </View>
          </TouchableOpacity>
          
        {
          !last7Hidden ? null :
          <FlatList
            data={modules.documents}
            renderItem={({ item,index }) => (
              <View className='flex-1 mr-2 '>
                <Karteikarte handlePress={async ()=> {await updateUserUsageModules(
                  user.$id, {
                    name: item.name,
                    percent : item.progress,
                    color: item.color,
                    fragen : item.questions,
                    sessions : item.sessions.length,
                    sessionID: item.$id
                  }
                );setSelected("SingleModule"); setSelectedModule(index); }} farbe={item.color} percentage={item.progress} titel={item.name} studiengang={item.description} fragenAnzahl={item.questions} notizAnzahl={item.notes} creator={item.creator} availability={item.public} icon={"clock"} publicM={item.public} />
              </View>
            )}
            keyExtractor={(item) => item.$id}
            key={numColumns}
            numColumns={numColumns}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            
          />
        }
        
        

        </View>
      </View>
  )
}

export default AllModules