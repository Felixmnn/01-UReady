import { View, Text, TouchableOpacity, ScrollView,FlatList } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import { useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import CustomButton from '../../(general)/customButton';
import {loadModules, loadUserDataKathegory} from "../../../lib/appwriteDaten"
import GratisPremiumButton from '@/components/(general)/gratisPremiumButton';
import AddModule from '@/components/(general)/(modal)/addModule';
import { useGlobalContext } from '@/context/GlobalProvider';

const AllModules = ({setSelected, modules, setSelectedModule}) => {
    const [last7Hidden, setLast7Hidden ] = useState(true)
    const { user } = useGlobalContext();
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
            Bibliothek {width}
          </Text>
          <TouchableOpacity onPress={()=> {setIsVisibleNewModule(true)}} className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}>
              <Icon name="cubes" size={15} color="white"/>
              {isVertical ? <Text className='text-gray-300 text-[12px] ml-2'>Modul erstellen</Text> : null}
          </TouchableOpacity>
        </View>
        <View className='border-t-[1px] border-gray-700 w-full  ' />
        <View className={`flex-1  bg-gray-900 ${isVertical ? "p-4" : "p-2"} `}>
          <TouchableOpacity className='' onPress={()=> setLast7Hidden(!last7Hidden)}>
            <View className='flex-row items-center justify-between w-full mb-2'>
              <Text className='font-bold text-gray-100 text-[18px]'>Last 7 Days</Text>
              <Icon name={last7Hidden ? "chevron-down" : "chevron-up"} size={15} color="white"/>
            </View>
          </TouchableOpacity>
        {
          !last7Hidden ? null :
          <FlatList
            data={modules.documents}
            renderItem={({ item,index }) => (
              <View className='flex-1 mr-2  '>
                <Karteikarte handlePress={()=> {setSelected("SingleModule"); setSelectedModule(index)}} farbe={item.color} percentage={item.progress} titel={item.name} studiengang={item.description} fragenAnzahl={item.questions} notizAnzahl={item.notes} creator={item.creator} availability={item.public} icon={"clock"} publicM={item.public} />
              </View>
            )}
            keyExtractor={(item) => item.$id}
            key={numColumns}
            numColumns={numColumns}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onEndReached={fetchItems}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <Text>Loading...</Text> : null}
          />
        }
        
        </View>
      </View>
  )
}

export default AllModules