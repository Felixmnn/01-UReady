import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import Karteikarte from "../(karteimodul)/karteiKarte";
import { module } from "@/types/appwriteTypes";
import Icon from "react-native-vector-icons/FontAwesome5";
import { adddModule } from "@/lib/appwriteAdd";
import { router } from "expo-router";

type DiscoverFilterSnapshot = {
  eductaionType?: "UNIVERSITY" | "SCHOOL" | "EDUCATION" | "OTHER" | null;
  universityDegreeType?: string[] | string | null;
  universityKategorie?: string[] | null;
  schoolType?: string[] | null;
  schoolSubjects?: string[] | null;
  schoolGrades?: number[] | null;
  educationKathegory?: string[] | null;
  educationSubject?: string[] | null;
  otherSubjects?: string[] | null;
};





const NoResultsComponent = ({
  userID,
  activeFilters,
  selectedLanguages,
  userCountry,
  userUniversity,
  userRegion,
}:{
  userID?: string;
  activeFilters: DiscoverFilterSnapshot;
  selectedLanguages: string[];
  userCountry?: string | null;
  userUniversity?: string | null;
  userRegion?: string | null;
}) => { 

  const toArray = (value: string[] | string | null | undefined) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const educationType = activeFilters.eductaionType ?? "";
  const universityDegreeTypes = toArray(activeFilters.universityDegreeType);
  const universitySubjects = activeFilters.universityKategorie ?? [];
  const schoolTypes = activeFilters.schoolType ?? [];
  const schoolSubjects = activeFilters.schoolSubjects ?? [];
  const schoolGrades = activeFilters.schoolGrades ?? [];
  const educationCategories = activeFilters.educationKathegory ?? [];
  const educationSubjects = activeFilters.educationSubject ?? [];
  const otherSubjects = activeFilters.otherSubjects ?? [];

  const sessions = [{
      title: "Thema 1",
      percent: 0,
      color: "blue",
      iconName: "book",
      questions: 0,
      description: "In dieser Lernsession geht es um das Thema 1",
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    },{
      title: "Thema 2",
      percent: 0,
      color: "red",
      iconName: "book-open",
      questions: 0,
      description: "In dieser Lernsession geht es um das Thema 2",
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    }]

  const newModule = {
    name: "Themenbereich",
    subject: "",
    questions: 0,
    notes: 0,
    documents: 0,
    public: true,
    progress: 0,
    creator: userID ?? "",
    color: "blue",
    sessions: sessions.map(session => JSON.stringify(session)),
    tags: ["MISSING_AREA"],
    description: "In diesem Modul geht es um die Themen, ... aus dem Themenbereich...",
    releaseDate: new Date().toISOString(),
    connectedModules: [],
    qualityScore: 0,
    duration: 0,
    upvotes: 0,
    downVotes: 0,
    creationCountry: userCountry ?? "DE",
    creationUniversity: userUniversity ?? null,
    creationUniversityProfession: universityDegreeTypes[0] ?? null,
    creationRegion: userRegion ?? null,
    creationUniversitySubject: universitySubjects,
    creationSubject: educationType === "OTHER" ? otherSubjects : schoolSubjects,
    creationEducationSubject: educationSubjects[0] ?? null,
    creationUniversityFaculty: [],
    creationSchoolForm: schoolTypes[0] ?? null,
    creationKlassNumber: schoolGrades[0] ?? null,
    creationLanguage: selectedLanguages[0] ?? null,
    creationEducationKathegory: educationCategories[0] ?? null,
    studiengangKathegory: universityDegreeTypes.map(type => type.toUpperCase()),
    kategoryType: educationType,
    copy: false,
    questionList: [],
    synchronization: false,
  };

  const handleLetsGoPress = async () => {
    console.log("newModule draft from entdecken filters:", newModule);
    const res = await adddModule(newModule);
    router.push({
          pathname: "/bibliothek",
          params: { selectedModuleId: res.$id },
    });
  };

  return (
    <View className="items-center mt-4">
      <Text className="text-gray-400 mt-4 text-lg text-center">
        Leider keine Module gefunden. Zeit das zu ändern! 
        Erstelle ein Modul in diesem Bereich. Erhalte Energie und das Abzeichen Macher:</Text>
      <View className="flex-row items-center mt-2">
        <Text className="text-xl font-bold"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
        >+10 </Text>
        <Icon name="bolt" size={20} color="#FBBF24" />
        <Text className="text-xl font-bold"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
        >
          {" & "}
        </Text>
        <View
        style={{
          backgroundColor: "#92400E",
          borderColor: "#FACC15",
          borderWidth:  2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 9999,
        }}>
          <Text style={{ color: "white" }} className="text-sm font-medium">
          Macher
          </Text>
        </View>
      </View>
      <TouchableOpacity className="w-[150px]   mt-2 px-4 py-2 bg-blue-500 rounded-full items-center justify-center"
        style={{
          backgroundColor: "#92400E",
          borderColor: "#FACC15",
          borderWidth:  2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 9999,
          width: 200,
        }}
        onPress={handleLetsGoPress}
      >
      
        <Text className="text-white text-lg text-center">Let's go!</Text>
      </TouchableOpacity>
    </View>
  )
}










const RenderResults = ({
  modules,
  selectedModules,
  setSelectedModules,
  numColumns,
  getModules,
  setLoadingMore,
  loading,
  hasMore,
  userID,
  activeFilters,
  selectedLanguages,
  userCountry,
  userUniversity,
  userRegion,
  searchBarText,
  isOffline,
}: {
  modules: module[];
  selectedModules: string[];
  setSelectedModules: React.Dispatch<React.SetStateAction<string[]>>;
  numColumns: number;
  getModules: ({ loadingMore }: { loadingMore: boolean }) => void;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  hasMore: boolean;
  userID?: string;
  activeFilters: DiscoverFilterSnapshot;
  selectedLanguages: string[];
  userCountry?: string | null;
  userUniversity?: string | null;
  userRegion?: string | null;
  searchBarText: string;
  isOffline: boolean;
}) => {
  const canShowCreateModuleSection =
    searchBarText.trim().length === 0 && !isOffline && !loading;

  return (
    <View className="flex-1 w-full pl-2 justify-center ">
      <FlatList
        data={modules}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("../../assets/noResults.png")}
              style={{ width: 200, height: 200, borderRadius: 5 }}
            />
            {canShowCreateModuleSection ? (
              <NoResultsComponent
                userID={userID}
                activeFilters={activeFilters}
                selectedLanguages={selectedLanguages}
                userCountry={userCountry}
                userUniversity={userUniversity}
                userRegion={userRegion}
              />
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1 / numColumns, // verteilt Spalten gleichmäßig
              height: 180, // feste Höhe
              marginRight: 8,
              marginBottom: 8,
              opacity: selectedModules.includes(item.$id ?? "") ? 1 : 0.6,
              borderColor: selectedModules.includes(item.$id ?? "")
                ? "#3B82F6"
                : "none",
              borderWidth: selectedModules.includes(item.$id ?? "") ? 2 : 0,
              borderBottomEndRadius: 12,
              borderBottomStartRadius: 12,
              borderTopStartRadius: 8,
              borderTopEndRadius: 8,
              
            }}
          >
            <Karteikarte
              handlePress={() => {
                if (selectedModules.includes(item.$id ?? "")) {
                  setSelectedModules(
                    selectedModules.filter((module) => module !== item.$id)
                  );
                } else {
                  if (item.$id) {
                    setSelectedModules([...selectedModules, item.$id]);
                  }
                }
              }}
              farbe={item.color ?? "blue"}
              percentage={null}
              titel={item.name}
              studiengang={item.description}
              fragenAnzahl={item.questions}
              notizAnzahl={item.notes}
              creator={item.creator}
              publicM={item.public}
              reportVisible={true}
              moduleID={item.$id}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.$id ?? `module-${index}`}
        key={numColumns} // wichtig, damit FlatList neu rendert bei Spaltenwechsel
        numColumns={numColumns}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!loading && hasMore) {
            setLoadingMore(true);
            getModules({ loadingMore: true });
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default RenderResults;
