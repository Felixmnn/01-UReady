import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import React, { useRef, useState, useEffect, use } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import UniversityFilters from "@/components/(entdecken)/university";
import SchoolFilters from "@/components/(entdecken)/school";
import EudcationFilters from "@/components/(entdecken)/education";
import OtherFilters from "@/components/(entdecken)/other";
import { router } from "expo-router";
import { adddModule } from "@/lib/appwriteAdd";
import languages from "@/assets/exapleData/languageTabs.json";
import TokenHeader from "@/components/(general)/tokenHeader";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import RenderResults from "@/components/(entdecken)/renderResults";
import { searchDocuments } from "@/lib/appwriteQuerySerach";
import { loadAllModules } from "@/lib/appwriteDaten";
import { useTranslation } from "react-i18next";
import { getMatchingModules } from "@/lib/appwriteEntdecken";
import { module } from "@/types/appwriteTypes";

type FilterType = {
  eductaionType: "UNIVERSITY" | "SCHOOL" | "EDUCATION" | "OTHER" | null;
  universityDegreeType:
    | "BACHELOR"
    | "MASTER"
    | "PHD"
    | "DIPLOM"
    | "STATE_EXAM"
    | "OTHER"
    | null;
  universityKategorie: string[] | undefined | null;

  schoolType?: string[] | undefined | null;
  schoolSubjects?: string[] | undefined | null;
  schoolGrades?: number[] | undefined | null;

  educationKathegory?: string[] | undefined | null;
  educationSubject?: string[] | undefined | null;

  otherSubjects?: string[] | undefined | null;
};

const entdecken = () => {
  const { t } = useTranslation();
  const { userUsage, setUserUsage, userData } = useGlobalContext();

  useEffect(() => {
    async function fetchAllModules() {
      const modules = await loadAllModules();
      if (modules) {
        setModules(
          ((modules as unknown) as module[]).filter(
            (m) =>
              m.public == true &&
              m.questions > 0 &&
              m.name.includes("Kopie") == false
          )
        );
      } else {
        setModules([]);
      }
    }
    fetchAllModules();
  }, []);

  const sheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = ["40%", "60%", "90%"];

  {
    /*Ersetze die is Copyed durch orginal Id für den Fal eines Clon Updates */
  }
  const { user, isLoggedIn, isLoading, setReloadNeeded, reloadNeeded } =
    useGlobalContext();
  const [rel, setRel] = useState(false);
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 300);

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  //Allgemeine Filter
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedKathegory, setSelectedKathegory] = useState("UNIVERSITY");

  //Module entdecken
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<module[]>([]);
  const [myModules, setMyModules] = useState<module>();

  //____ The filter Part _____________________________________________________________
  const [filters, setFilters] = useState({});

  const [realFilters, setRealFilters] = useState<FilterType>({
    eductaionType: "UNIVERSITY",
    universityDegreeType: null,
    universityKategorie: null,
    otherSubjects: null,
    educationSubject: null,
    educationKathegory: null,
    schoolGrades: null,
    schoolSubjects: null,
    schoolType: null,
  });

  async function fetchModules(filters: any) {
    const keys = Object.keys(filters);
    if (keys.length > 1) {
      const modules = await searchDocuments(filters);
      if (modules) {
        setModules(modules as module[]);
      } else {
        setModules([]);
      }
    }
  }

  useEffect(() => {
    fetchModules(filters);
  }, [filters]);

  //_____________________________________________________________________________________

  /**
   * Option includes the meta data for the School, University, Education and Other Filters
   */
  const options = [
    {
      name: t("entdecken.university"),
      enum: "UNIVERSITY",
      icon: "university",
      color: "#7a5af8",
      handlePress: () => {
        setSelectedKathegory("UNIVERSITY");
        setFilterVisible(false);
      },
    },
    {
      name: t("entdecken.school"),
      enum: "SCHOOL",
      icon: "school",
      color: "#20c1e1",
      handlePress: () => {
        setSelectedKathegory("SCHOOL");
        setFilterVisible(false);
      },
    },
    {
      name: t("entdecken.education"),
      enum: "EDUCATION",
      icon: "tools",
      color: "#4f9c19",
      handlePress: () => {
        setSelectedKathegory("EDUCATION");
        setFilterVisible(false);
      },
    },
    {
      name: t("entdecken.other"),
      enum: "OTHER",
      icon: "ellipsis-h",
      color: "#f39c12",
      handlePress: () => {
        setSelectedKathegory("OTHER");
        setFilterVisible(false);
      },
    },
  ];

  const [searchBarText, setSearchBarText] = useState("");
  const [focused, setFocused] = useState(false);

  async function add(mod: any) {
    setLoading(true);
    try {
      const res = await adddModule(mod);
      if (res) {
        setModules((prev: any) => [...prev, res]);
      }
      setLoading(false);
    } catch (error) {
      if (__DEV__) {
        console.log("Error", error);
      }
      setLoading(false);
    }
  }

  const CopyModulesButton = ({ topButton = false }) => {
    function calculateEnergyCost() {
      let price = 0;
      selectedModules.forEach((moduleId) => {
        const module = modules.find((m: any) => m.$id === moduleId);
        if (module) {
          const mprice = 1 + Math.floor((module.questions / 20) * 1); // Assuming each question costs 3 energy
          if (mprice > 10) {
            price += 10; // Cap the price at 10 energy
          } else {
            price += mprice; // Add the price of the module
          }
        }
      });
      return price;
    }

    return (
      <View
        className={`${Platform.OS == "web" ? "" : null}  rounded-full `}
        style={{
          height: topButton ? 35 : 50,
          padding: topButton ? 0 : 10,
        }}
      >
        <TouchableOpacity
          disabled={loading || userUsage.energy < calculateEnergyCost()}
          className={`${topButton ? "px-2" : ""} flex-1 flex-row items-center justify-center rounded-lg`}
          style={{
            backgroundColor:
               userUsage.energy >= calculateEnergyCost()
                ? "#3b82f6"
                : "#f63b3b",
            borderWidth: topButton ? 1 : 2,
            borderColor:
               userUsage.energy >= calculateEnergyCost()
                ? "#3c6dbc"
                : "#bc3c3c",
          }}
          onPress={async () => {
            setReloadNeeded([...reloadNeeded, "Bibliothek"]);
            if (selectedModules.length > 0) {
              modules.map((module: any) => {
                if (selectedModules.includes(module.$id)) {
                  const mod = {
                    name: module.name + " (Kopie)",
                    subject: module.subject,
                    questions: module.questionList.length,
                    notes: module.notes,
                    documents: module.documents,
                    public: false,
                    progress: 0,
                    creator: user.$id,
                    color: module.color,
                    sessions: module.sessions,
                    tags: module.tags,
                    description: module.description,
                    releaseDate: new Date(),
                    connectedModules: [],
                    qualityScore: module.qualityScore,
                    copy: true,
                    synchronization: false,
                    questionList: module.questionList.map((q:string) => JSON.stringify({ ...JSON.parse(q), userAnswer: null, status: null })),
                  };
                  add(mod);
                }
              });
            }
            if (userUsage.energy > 10 && userUsage.energy - calculateEnergyCost() < 10){
             setUserUsage({
              ...userUsage,
              energy: userUsage.energy - calculateEnergyCost(),
              streakLastUpdate: new Date().toISOString(),
            }); 
            } else {
            setUserUsage({
              ...userUsage,
              energy: userUsage.energy - calculateEnergyCost(),
            });
            }
            setRel(!rel);
            setSelectedModules([]);
            setMyModules(undefined);
            router.push("/bibliothek");
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : userUsage.energy > selectedModules.length * 3 ? (
            <View className="flex-row items-center">
              <Text
                className={`${topButton ? "text-[12px]" : "text-[15px] mb-1"} font-semibold  text-white  `}
              >
                {selectedModules.length == 1
                  ? t("entdecken.copy1")
                  : t("entdecken.copy2")}{" "}
                {t("entdecken.for")} {calculateEnergyCost()}
              </Text>
              <Icon
                name="bolt"
                size={topButton ? 10 : 15}
                color="white"
                className="ml-2"
              />
            </View>
          ) : (
            <Text
              className="text-white text-center  font-semibold text-[15px] mb-1"
              style={{
                maxWidth: width < 400 ? 200 : null,
              }}
            >
              {t("entdecken.noEnergy")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * This Component lets the User Pick SCHOOL, UNIVERSITY, EDUCATION or OTHER
   */
  const EducationFiel = () => {
    interface Option {
      name: string;
      enum: string;
      icon: string;
      color: string;
      handlePress: () => void;
    }

    interface Filters {
      kategoryType?: string;
      creationCountry?: string;
      [key: string]: any;
    }

    function handlePress(option: Option) {
      setFilters({
        kategoryType: option.enum,
        creationCountry: userData?.country || "DEUTSCHLAND",
      } as Filters);
    }

    return (
      <View
        className={`flex-row p-2 justify-between items-center rouned-[10px] w-full `}
      >
        <View
          className={` flex-row  items-center ${width > 400 ? "w-full" : "justify-between w-full"}`}
        >
          <View
            className="flex-1 justify-between flex-row items-center bg-gray-900 rounded-full"
            style={{
              height: 40,
              paddingHorizontal: 2,
              paddingVertical: 2,
            }}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.enum}
                className={` rounded-full  ${width > 600 ? "p-2" : "p-2"} ${selectedKathegory == option.enum ? "bg-blue-500 w-[120px] items-center" : ""}`}
                onPress={() => {
                  setRealFilters({
                    ...realFilters,
                    eductaionType: option.enum as FilterType["eductaionType"],
                  });
                  setSelectedKathegory(option.enum);
                  handlePress(option);
                }}
              >
                <View className="flex-row items-center ">
                  <Icon name={option.icon} size={20} color="#D1D5DB" />
                  {selectedKathegory == option.enum || width > 500 ? (
                    <Text className="ml-1 text-white font-semibold">
                      {option.name}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function getModules({
    loadingMore = false,
  }) {
    
    if (loading || (!hasMore && loadingMore)) return;
    setLoading(true);

    const schoolTypesRaw = [
      "grundschule",
      "hauptschule",
      "realschule",
      "gesamtschule",
      "gymnasium",
      "berufsschule",
      "sonstige",
    ];
    const schoolTypeObj = schoolTypesRaw.map((type) =>
      t(`school.type.${type}`, { returnObjects: true })
    );

    const subjectKeys = [
      "english",
      "math",
      "german",
      "biology",
      "chemistry",
      "physics",
      "history",
      "geography",
      "art",
      "music",
      "sports",
      "religion",
      "ethics",
      "computerScience",
      "socialStudies",
      "economics",
      "technology",
    ];

    const subjects = subjectKeys.map((type) =>
      t(`school.subjects.${type}`, { returnObjects: true })
    );

    const universityObject = t("universityCategories.degrees", {
      returnObjects: true,
    }) as { [key: string]: { name: string } };
    const universityDegreeTypeKeys = Object.keys(universityObject);
    const universityDegreeObj = universityDegreeTypeKeys.map((key) => ({
      name: universityObject[key].name,
      id: key,
    }));

    const uisSubsObject = t("universityCategories.universitySubjects", {
      returnObjects: true,
    }) as { [key: string]: { name: string } };
    const uisSubsKeys = Object.keys(uisSubsObject);
    const uisSubsObj = uisSubsKeys.map((key) => ({
      name: uisSubsObject[key].name,
      id: key,
    }));

    const eduKatObjects = t("education.educationKategories", {
      returnObjects: true,
    }) as Record<string, { name: string }>;
    const eduKatKeys = Object.keys(eduKatObjects);
    const eduKatList = eduKatKeys.map((key) => eduKatObjects[key].name);

    const indexOfEduKat = realFilters.educationKathegory?.map((kat) => {
      return eduKatList.findIndex((k) => k === kat);
    });

    const eduSubObjects = t(
      `education.educationSubjects.${eduKatKeys[indexOfEduKat && typeof indexOfEduKat[0] == "number" ? indexOfEduKat[0] : 0]}`,
      { returnObjects: true }
    ) as Record<string, { name: string }>;
    const eduSubKeys = Object.keys(eduSubObjects);
    const eduSubList = eduSubKeys.map((key) => eduSubObjects[key].name);

    const indexesOfSchoolTypes = realFilters.schoolType?.map((type) => {
      return schoolTypeObj.findIndex((obj: any) => obj.title === type);
    });
    const indexesOfSubjects = realFilters.schoolSubjects?.map((subject) => {
      return subjects.findIndex((s: any) => s?.name === subject);
    });
    const indexOfDegreeType =
      Array.isArray(realFilters.universityDegreeType) &&
      realFilters.universityDegreeType.length > 0
        ? realFilters.universityDegreeType.map((degree) => {
            return universityDegreeObj.findIndex((obj) => obj.name === degree);
          })
        : null;

    const indexOfUniversitySubjects = realFilters.universityKategorie?.map(
      (subject) => {
        return uisSubsObj.findIndex((s) => s.name === subject);
      }
    );

    const indexesOfEduSubjects = realFilters.educationSubject?.map(
      (subject) => {
        return eduSubList.findIndex((s) => s === subject);
      }
    );

    try {
      let res = await getMatchingModules({
        offset: offset,
        eductaionType: realFilters.eductaionType,
        universityDegreeType:
          indexOfDegreeType?.map((i) => universityDegreeTypeKeys[i]) || null,
        universityKategorie:
          indexOfUniversitySubjects?.map((i) => uisSubsKeys[i]) || null,
        schoolType: indexesOfSchoolTypes?.map((i) => schoolTypesRaw[i]) || null,
        schoolSubjects: indexesOfSubjects?.map((i) => subjectKeys[i]) || null,
        schoolGrades:
          realFilters.schoolGrades?.map((grade) => Number(grade)) || null,
        eductaionCategory: indexOfEduKat?.map((i) => eduKatKeys[i]) || null,
        educationSubject:
          indexesOfEduSubjects?.map((i) => eduSubKeys[i]) || null,
        otherSubjects: realFilters.otherSubjects,
      });
      res = res?.filter((m)=> modules.some((mod)=> mod.$id == m.$id) == false)
      if (loadingMore) {
        setModules((prev: module[]) => [
          ...prev,
          ...((res ?? []) as unknown as module[]),
        ]);
        setOffset((prev) => prev + (res ? res.length : 0));
      } else {
        setModules((res ?? []) as unknown as module[]);
        setOffset(res ? res.length : 0);
        
      }

      setHasMore(res && res.length === 5 ? true : false); // Assuming page size of 25
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getModules({
      loadingMore: false,
    });
  }, [realFilters]);

  return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1  w-full bg-[#0c111d] rounded-[10px] ">
            <TokenHeader userUsage={userUsage} />

            {/* Searchbar and Filter Activation */}
            <View className="flex-row w-full items-center">
              <View className="flex-1    w-full bg-gray-800  rounded-[10px] ml-4 mr-2 mb-2  px-2 flex-row items-center justify-between">
                <View
                  className="w-full flex-row items-center"
                  style={{
                    height: 40,
                  }}
                >
                  <Icon name="search" size={18} color="white" />
                  <TextInput
                    className="ml-3 w-full "
                    style={{
                      color: "white",
                      outline: "none",
                    }}
                    value={searchBarText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={t("entdecken.searchText")}
                    onChangeText={(text) => setSearchBarText(text)}
                    placeholderTextColor={"#797d83"}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  (setFilterVisible(!filterVisible),
                    sheetRef.current?.snapToIndex(0));
                  setIsOpen(true);
                }}
                className="h-[35px] rounded-[10px] mr-4 p-2 mb-2 bg-gray-800 items-center justify-start"
              >
                <Icon name="filter" size={15} color="white" />
              </TouchableOpacity>
            </View>
            <View className="w-full flex-row items-start justify-between mb-2 ">
              <View
                className=" bg-gray-500 rounded-full items-center justify-center"
                style={{
                  width: 80,
                  marginLeft: 18,
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  marginBottom: 8,
                }}
              >
                <Text className="text-white font-semibold text-[10px] ">
                  {modules.filter((m: any) => m.public == true).length}{" "}
                  {t("entdecken.results")}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mr-4">
                {selectedModules.length > 0 ? (
                  <CopyModulesButton topButton={true} />
                ) : (
                  <View
                className=" bg-gray-500 rounded-full items-center justify-center"
                style={{
                  marginLeft: 18,
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  marginBottom: 8,
                }}
              >
                <Text className="text-white font-semibold text-[10px] ">
                    {t("entdecken.selectToCopy")}
                  </Text>
                  </View>
                )}
              </View>
            </View>
            <RenderResults
              modules={modules.filter((m: any) => m.public == true)}
              selectedModules={selectedModules}
              setSelectedModules={setSelectedModules}
              numColumns={numColumns}
              searchBarText={searchBarText}
              getModules={getModules}
              setLoadingMore={setLoadingMore}
              loading={loading}
              hasMore={hasMore} 
            />

            {/* In Case the User selects a Module the copy Button becomes Visble */}
            {selectedModules.length == 0 ? null : <CopyModulesButton />}
            {filterVisible ? (
              <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                onClose={() => setFilterVisible(false)}
                backgroundStyle={{ backgroundColor: "#1F2937" }}
              >
                <BottomSheetScrollView
                  contentContainerStyle={{
                    backgroundColor: "#1F2937",
                    paddingBottom: 40,
                  }}
                  style={{ backgroundColor: "#1F2937" }}
                  showsVerticalScrollIndicator={false}
                >
                  <View className="w-full">
                    <EducationFiel />
                    {realFilters.eductaionType == "UNIVERSITY" ? (
                      <UniversityFilters
                        filters={realFilters}
                        setFilters={setRealFilters}
                      />
                    ) : null}
                    {realFilters.eductaionType == "SCHOOL" ? (
                      <SchoolFilters
                        filters={realFilters}
                        setFilters={setRealFilters}
                      />
                    ) : null}
                    {realFilters.eductaionType == "EDUCATION" ? (
                      <EudcationFilters
                        filters={realFilters}
                        setFilters={setRealFilters}
                      />
                    ) : null}
                    {realFilters.eductaionType == "OTHER" ? (
                      <OtherFilters
                        filters={realFilters}
                        setFilters={setRealFilters}
                      />
                    ) : null}
                  </View>
                </BottomSheetScrollView>
              </BottomSheet>
            ) : null}
          </View>
        );
      }}
      page={"Entdecken"}
      hide={false}
    />
  );
};

export default entdecken;
