import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getSepcificModules } from "@/lib/appwriteQuerys";
import Karteikarte from "../(karteimodul)/karteiKarte";
import GratisPremiumButton from "../(general)/gratisPremiumButton";
import { addNewModule } from "@/lib/appwriteAdd";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { setUserDataSetup } from "@/lib/appwriteEdit";
import Icon from "react-native-vector-icons/FontAwesome5";
import ContinueBox from "../(signUp)/(components)/continueBox";
import {
  recommendationSearch,
  searchDocuments,
} from "@/lib/appwriteQuerySerach";
import languages from "@/assets/exapleData/languageTabs.json";
import BotCenter from "../(signUp)/botCenter";
import { userData } from "@/types/moduleTypes";
import { module } from "@/types/appwriteTypes";
import { useTranslation } from "react-i18next";

const PageDiscover = ({
  setUserChoices,
  userData,
  nothingForMe = () => {},
}: {
  setUserChoices: React.Dispatch<
    React.SetStateAction<"GENERATE" | "DISCOVER" | "CREATE" | null>
  >;
  userData: userData;
  nothingForMe?: () => void;
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();
  const [matchingModules, setMatchingModules] = useState<module[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 300);

  useEffect(() => {
    if (userData == null) return;
    async function fetchModules() {
      let modules: module[] = [];
      if (userData.kategoryType == "UNIVERSITY") {
        modules = (await recommendationSearch({
          kategoryType: userData.kategoryType,
          studiengangKathegory: userData.studiengangKathegory,
          creationUniversityFaculty: userData.faculty,
          creationUniversity: userData.university,
          creationUniversityProfession: userData.studiengangZiel,
          creationUniversitySubject: userData.studiengang,
          creationCountry: userData.country,
        })) as module[];
      } else if (userData.kategoryType == "SCHOOL") {
        modules = (await recommendationSearch({
          kategoryType: userData.kategoryType,
          creationCountry: userData.country,
          creationSubject: userData.schoolSubjects,
          creationRegion: userData.region,
          creationSchoolForm: userData.schoolType,
          creationLanguage: userData.language,
          creationKlassNumber: userData.schoolGrade,
        })) as module[];
      } else if (userData.kategoryType == "EDUCATION") {
        modules = (await recommendationSearch({
          kategoryType: userData.kategoryType,
          creationCountry: userData.country,
          creationEducationKathegory: userData.educationKathegory,
          creationEducationSubject: userData.educationKathegory,
        })) as module[];
      } else if (userData.kategoryType == "OTHER") {
        modules = (await recommendationSearch({
          creationCountry: userData.country,
          creationLanguage: userData.language,
          creationSubject: userData.schoolSubjects,
        })) as module[];
      }
      const filteredModules = modules.filter((module) => module.public) || [];
      setMatchingModules(filteredModules);
      setLoading(false);
    }
    fetchModules();
  }, [userData]);

  async function add(mod: any) {
    setLoading(true);
    try {
      const res = await addNewModule(mod);
      setLoading(false);
      setUserChoices(null);
    } catch (error) {
      if (__DEV__) {
        console.log("Error", error);
      }
      setLoading(false);
    }
  }
  return (
    <SafeAreaView className="w-full h-full p-4">
      <View>
        <Icon
          name="arrow-left"
          size={20}
          color="#20c1e1"
          onPress={() => {
            setUserChoices(null);
          }}
        />
      </View>

      <BotCenter
        message={
          loading
            ? t("gettingStarted.waitAMoment")
            : matchingModules.length > 0
              ? t("gettingStarted.iHaveFoundSomething")
              : t("gettingStarted.iHaveFoundNothing")
        }
        imageSource="Search"
      />
      {loading || matchingModules.length > 0 ? (
        <View className="flex-1    rounded-[10px] ml-2  justify-center z-10   ">
          <ScrollView className="w-full">
            <View className=" w-full h-full items-ceter justify-start  mt-4 ">
              {loading ? (
                <View className="w-full flex-row items-center justify-center ">
                  <ActivityIndicator size="small" color="#20c1e1" />
                  <Text className="text-gray-100 font-semibold text-[15px] m-2">
                    {t("gettingStarted.sucheLäuft")}
                  </Text>
                </View>
              ) : (
                <View
                  className={`${matchingModules.length > 0 ? "" : " items-center  justify-center"}`}
                >
                  <View className="flex-1 ">
                    <View className="flex-row flex-wrap justify-start items-center">
                      <View className="flex flex-row flex-wrap">
                        {matchingModules.map((item, index) => (
                          <View
                            key={item.$id}
                            className={`flex-1 mr-2 mb-2 ${selectedModules.includes(item.name) ? "" : "opacity-50"}`}
                            style={{
                              width: `${100 / numColumns}%`,
                              minWidth: 300,
                            }}
                          >
                            <Karteikarte
                              handlePress={() => {
                                if (selectedModules.includes(item.name)) {
                                  setSelectedModules(
                                    selectedModules.filter(
                                      (module) => module !== item.name
                                    )
                                  );
                                } else {
                                  setSelectedModules([
                                    ...selectedModules,
                                    item.name,
                                  ]);
                                }
                              }}
                              farbe={item.color ?? ""}
                              percentage={null}
                              titel={item.name}
                              studiengang={item.description}
                              fragenAnzahl={item.questions}
                              notizAnzahl={item.notes}
                              creator={item.creator}
                              publicM={item.public}
                              reportVisible={true}
                              moduleID={item.$id ?? ""}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          className={`flex-1 justify-center ${width > 500 ? "flex-row " : ""}`}
          style={{
            height: 200,
          }}
        >
          <ContinueBox
            text={t("gettingStarted.setTogether")}
            colorBorder={"#7a5af8"}
            colorBG={"#372292"}
            iconName={"bot"}
            handlePress={() => setUserChoices("GENERATE")}
            horizontal={width > 700 ? false : true}
            selected={true}
          />
          <ContinueBox
            text={t("gettingStarted.createSet")}
            colorBorder={"#4f9c19"}
            colorBG={"#2b5314"}
            iconName={"cubes"}
            handlePress={() => setUserChoices("CREATE")}
            horizontal={width > 700 ? false : true}
            selected={true}
          />
        </View>
      )}
      <View className="items-center justify-center m-2">
        {selectedModules.length > 0 ? (
          <TouchableOpacity
            className={
              "w-full max-w-[300px] rounded-full bg-blue-500 h-10 w-[100px] items-center justify-center"
            }
            onPress={async () => {
              if (selectedModules.length > 0) {
                matchingModules.map((module) => {
                  if (selectedModules.includes(module.name)) {
                    const mod = {
                      name: module.name + " (Kopie)",
                      subject: module.subject,
                      questions: module.questions,
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
                      duration: 0,
                      upvotes: 0,
                      downVotes: 0,
                      creationCountry: null,
                      creationUniversity: null,
                      creationUniversityProfession: null,
                      creationRegion: null,
                      creationUniversitySubject: [],
                      creationSubject: [],
                      creationEducationSubject: null,
                      creationUniversityFaculty: [],
                      creationSchoolForm: null,
                      creationKlassNumber: null,
                      creationLanguage: null,
                      creationEducationKathegory: null,
                      copy: true,
                      synchronization: false,
                    };
                    add(mod);
                  }
                });
              } else {
              }
              setUserDataSetup(user.$id);
              router.push("/bibliothek");
            }}
          >
            <Text className="text-gray-300 font-semibold text-[15px]">
              {selectedModules.length > 0
                ? selectedModules.length == 1
                  ? t("gettingStarted.useThisModule")
                  : `${t("gettingStarted.this")} ${selectedModules.length} ${t("gettingStarted.moduleUse")}`
                : t("gettingStarted.noModulesFound")}
            </Text>
          </TouchableOpacity>
        ) : null}
        {/* Nothing for me Button */}
        {matchingModules.length > 0 && (
          <TouchableOpacity
            className="w-full max-w-[300px] rounded-full bg-gray-700 h-10 mt-2 items-center justify-center"
            onPress={nothingForMe}
          >
            <Text className="text-gray-300 font-semibold text-[15px]">
              {t("gettingStarted.nothingForMe")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PageDiscover;
