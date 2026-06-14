import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Karteikarte from "../(karteimodul)/karteiKarte";
import { module } from "@/types/appwriteTypes";
import Icon from "react-native-vector-icons/FontAwesome5";
import { adddModule } from "@/lib/appwriteAdd";
import { router } from "expo-router";
import germanTranslation from "@/assets/languages/locales/de/translation.json";
import { useTranslation } from "react-i18next";
import { getMissingAreaDefaults } from "@/lib/missingAreaDefaults";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from "react-native-svg";


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
  minQuestions?: number;
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
  const { t } = useTranslation();
  const missingAreaDefaults = getMissingAreaDefaults(t);

  const toArray = (value: string[] | string | null | undefined) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const educationType = activeFilters.eductaionType ?? "OTHER";
  const universityDegreeTypes = toArray(activeFilters.universityDegreeType);
  const universitySubjects = activeFilters.universityKategorie ?? [];
  const schoolTypes = activeFilters.schoolType ?? [];
  const schoolSubjects = activeFilters.schoolSubjects ?? [];
  const schoolGrades = activeFilters.schoolGrades ?? [];
  const educationCategories = activeFilters.educationKathegory ?? [];
  const educationSubjects = activeFilters.educationSubject ?? [];
  const otherSubjects = activeFilters.otherSubjects ?? [];

  const educationCategoryObject = germanTranslation.education.educationKategories;
  const educationCategoryEntries = Object.entries(educationCategoryObject);
  const educationCategoryKeys = educationCategories.map((value) => {
    const byName = educationCategoryEntries.find(([, category]) => category?.name === value)?.[0];
    const byKey = value in educationCategoryObject ? value : null;
    return byKey ?? byName ?? value;
  });

  const educationSubjectObject = germanTranslation.education.educationSubjects;
  const schoolTypeObject = germanTranslation.school.type;
  const schoolTypeEntries = Object.entries(schoolTypeObject);
  const schoolTypeKeys = schoolTypes.map((value) => {
    const byTitle = schoolTypeEntries.find(([, type]) => type?.title === value)?.[0];
    const byKey = value in schoolTypeObject ? value : null;
    return byKey ?? byTitle ?? value;
  });

  const schoolSubjectObject = germanTranslation.school.subjects;
  const schoolSubjectEntries = Object.entries(schoolSubjectObject);
  const schoolSubjectKeys = schoolSubjects.map((value) => {
    const byName = schoolSubjectEntries.find(([, subject]) => subject?.name === value)?.[0];
    const byKey = value in schoolSubjectObject ? value : null;
    return byKey ?? byName ?? value;
  });
  const schoolSubjectNames = schoolSubjectKeys.map(
    (key) => schoolSubjectObject[key as keyof typeof schoolSubjectObject]?.name ?? key
  );
  const parsedSchoolClassNumber = (() => {
    const raw = schoolGrades[0] as unknown;
    if (raw === null || raw === undefined) return null;

    const parsed =
      typeof raw === "number" ? raw : Number.parseInt(String(raw), 10);

    return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
  })();

  const mapEducationSubjectToKey = (value: string) => {
    for (const categoryKey of educationCategoryKeys) {
      const categorySubjects = educationSubjectObject[categoryKey as keyof typeof educationSubjectObject];
      if (!categorySubjects) continue;

      const byKey = value in categorySubjects ? value : null;
      if (byKey) return byKey;

      const byName = Object.entries(categorySubjects).find(([, subject]) => subject?.name === value)?.[0];
      if (byName) return byName;
    }

    for (const categorySubjects of Object.values(educationSubjectObject)) {
      const byKey = value in categorySubjects ? value : null;
      if (byKey) return byKey;

      const byName = Object.entries(categorySubjects).find(([, subject]) => subject?.name === value)?.[0];
      if (byName) return byName;
    }

    return value;
  };
  const educationSubjectKeys = educationSubjects.map(mapEducationSubjectToKey);

  console.log("NoResultsComponent activeFilters:", activeFilters);
  console.log("Education Category (raw):", activeFilters.educationKathegory);
  console.log("Education Subject (raw):", activeFilters.educationSubject);
  console.log("Education Category (keys):", educationCategoryKeys);
  console.log("Education Subject (keys):", educationSubjectKeys);
  console.log("School Type (raw):", activeFilters.schoolType);
  console.log("School Type (keys):", schoolTypeKeys);
  console.log("School Subject (raw):", activeFilters.schoolSubjects);
  console.log("School Subject (keys):", schoolSubjectKeys);

  const sessions = [{
      title: missingAreaDefaults.sessions[0].title,
      percent: 0,
      color: "blue",
      iconName: "book",
      questions: 0,
      description: missingAreaDefaults.sessions[0].description,
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    },{
      title: missingAreaDefaults.sessions[1].title,
      percent: 0,
      color: "red",
      iconName: "book-open",
      questions: 0,
      description: missingAreaDefaults.sessions[1].description,
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    }]

  const newModule = {
    name: missingAreaDefaults.moduleName,
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
    description: missingAreaDefaults.moduleDescription,
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
    creationSubject: educationType === "OTHER" ? otherSubjects : schoolSubjectNames,
    creationEducationSubject: educationSubjectKeys[0] ?? null,
    creationUniversityFaculty: [],
    creationSchoolForm: schoolTypeKeys[0]?.toUpperCase() ?? null,
    creationKlassNumber: parsedSchoolClassNumber,
    creationLanguage: selectedLanguages[0] ?? null,
    creationEducationKathegory: educationCategoryKeys[0] ?? null,
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
    <View
      className="items-center mt-4"
      style={{
        borderColor: "#FACC15",
        borderWidth: 2,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#6B3A0C",
      }}
    >
      <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgLinearGradient id="goldenCardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6B3A0C" />
            <Stop offset="55%" stopColor="#9A5A12" />
            <Stop offset="100%" stopColor="#C9851A" />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#goldenCardGradient)" />
      </Svg>

      <Text className="text-gray-400 mt-4 text-lg text-center px-2"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
      >
       {t("missingArea.discoverCardHeadline")}

      </Text>
      <View className="flex-row items-center mt-2">
        <Text className="text-xl font-bold"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
        >{t("missingArea.rewardEnergy")}</Text>
        <Text className="text-xl font-bold"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
        >
          {` ${t("missingArea.rewardAnd")} `}
        </Text>
        <View
        style={{
          backgroundColor: "#FACC15",
          borderColor: "#FACC15",
          borderWidth:  2,
          paddingHorizontal: 4,
          paddingVertical: 0,
          borderRadius: 9999,
        }}>
          <Text  className="text-sm font-medium"
                  style={{ color: "#92400E", fontWeight: "bold" }}

          >
          {missingAreaDefaults.badgeLabel}
          </Text>
        </View>
        <Text className="text-xl font-bold"
        style={{ color: "#FBBF24", fontWeight: "bold" }}
        >{` ${t("missingArea.rewardBadgeSuffix")}`}</Text>
      </View>
      <TouchableOpacity className="w-[150px]   mt-4 mb-4 px-4 py-2 bg-blue-500 rounded-full items-center justify-center"
        style={{
          backgroundColor: "#FACC15",
          borderColor: "#FACC15",
          borderWidth:  2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 9999,
          width: 200,
        }}
        onPress={handleLetsGoPress}
      >
      
        <Text className="text-white text-lg text-center"
        style={{ color: "#92400E", fontWeight: "bold" }}
        >{missingAreaDefaults.rewardCta}</Text>
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
  const hasMinQuestionsFilter = (activeFilters.minQuestions ?? 0) > 0;
  const canShowCreateModuleSection =
    searchBarText.trim().length === 0 && !isOffline && !loading && !hasMinQuestionsFilter;

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
