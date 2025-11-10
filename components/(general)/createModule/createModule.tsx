import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from "../colorPicker";
import ModalSessionList from "../../(bibliothek)/(modals)/modalSessionList";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { adddModule } from "@/lib/appwriteAdd";
import { setUserDataSetup } from "@/lib/appwriteEdit";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
import { useTranslation } from "react-i18next";
import { Session, UserData } from "@/types/moduleTypes";
import CustomButton from "../customButton";
import { module } from "@/types/appwriteTypes";

const CreateModule = ({
  newModule,
  setNewModule,
  setUserChoices,
  goBackVisible = true,
  sessions,
  setSessions,
  selectedColor,
  setSelectedColor,
  hideCreateButton = false,
  setSelectedSession,
}: {
  newModule: module;
  setNewModule: React.Dispatch<React.SetStateAction<module>>;
  setUserChoices: React.Dispatch<
    React.SetStateAction<"GENERATE" | "DISCOVER" | "CREATE" | null>
  >;
  goBackVisible?: boolean;
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  selectedColor: string | null;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  hideCreateButton?: boolean;
  setSelectedSession: React.Dispatch<React.SetStateAction<Session | null>>;
}) => {
  // Lokale States
  const { t } = useTranslation();

  const { user, reloadNeeded, setReloadNeeded } = useGlobalContext();
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (user == null) return;
    async function fetchUserData() {
      const res = await loadUserDataKathegory(user.$id);
      if (res) {
        setUserData({
          $id: res.$id,
          country: res.country,
          university: res.university,
          faculty: res.faculty,
          studiengang: res.studiengang,
          studiengangZiel: res.studiengangZiel,
          region: res.region,
          schoolSubjects: res.schoolSubjects,
          educationSubject: res.educationSubject,
          schoolType: res.schoolType,
          schoolGrade: res.schoolGrade,
          language: res.language,
          educationKathegory: res.educationKathegory,
          studiengangKathegory: res.studiengangKathegory,
          kategoryType: res.kategoryType,
          // add any other UserData fields here as needed
        });
      } else {
        setUserData(null);
      }
    }
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (userData == null) return;
    setNewModule({
      ...newModule,
      releaseDate: new Date().toISOString(),
      creator: userData.$id ?? "",
      creationCountry: userData.country || "",
      creationUniversity: userData.university,
      creationUniversityProfession:
        userData.studiengangZiel == "MASTER" ||
        userData.studiengangZiel ||
        "BACHELOR" ||
        userData.studiengangZiel == "STAATSEXAMEN" ||
        userData.studiengangZiel == "DIPLOM" ||
        userData.studiengangZiel == "PHD" ||
        userData.studiengangZiel == "OTHER"
          ? userData.studiengangZiel
          : null,
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
      color: "blue",
    });
  }, [userData]);

  // Farbauswahl übernehmen
  const changeColor = (color: string) => {
    setSelectedColor(color);
    setNewModule({ ...newModule, color: color });
  };

  function stringifySessions(sessions: Session[]): string[] {
    return sessions.map((item) => JSON.stringify(item));
  }
  const [showMore, setShowMore] = useState(false);

  return (
    <ScrollView
      className={`flex-1 bg-gray-900 p-2   rounded-[10px] `}
      style={{
        width: "100%",
        padding: hideCreateButton ? 0 : 10,
        elevation: 20, // Android
      }}
    >
      <ModalSessionList
        sessions={sessions}
        setSessions={setSessions}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="w-full">
        <View className="flex-row justify-between items-center">
          {goBackVisible ? (
            <TouchableOpacity
              className="m-2 flex-row items-center"
              onPress={() => setUserChoices(null)}
            >
              <Icon name="arrow-left" size={20} color="white" />
              <Text className="text-gray-100 font-bold text-xl font-bold mx-2">
                {hideCreateButton
                  ? t("createModule.aiCreate")
                  : t("createModule.newModule")}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-100 font-bold text-xl font-bold">
              {t("createModule.newModule")}
            </Text>
          )}
          <TouchableOpacity
            onPress={() =>
              setNewModule({
                ...newModule,
                public: newModule?.public ? false : true,
              })
            }
            className="mr-2 items-center border-gray-800 border-[1px] rounded-full py-1 px-2"
          >
            {newModule?.public ? (
              <View className="flex-row items-center justify-center">
                <Text
                  className="text-gray-300 font-semibold text-[15px] mr-1"
                  style={{
                    color: "#4B5563",
                  }}
                >
                  {t("createModule.public")}
                </Text>
                <Icon name="globe" size={15} color="#4B5563" />
              </View>
            ) : (
              <View className="flex-row items-center justify-center">
                <Text
                  className="text-gray-300 font-semibold text-[15px] mr-1"
                  style={{
                    color: "#4B5563",
                  }}
                >
                  {t("createModule.private")}
                </Text>
                <Icon name="lock" size={15} color="#4B5563" />
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-row ">
          <View className="flex-1 justify-between">
            <Text className="text-gray-300 font-semibold text-[15px]">
              {t("createModule.moduleName")}
            </Text>
            <TextInput
              maxLength={50}
              onChangeText={(text) =>
                setNewModule({ ...newModule, name: text })
              }
              value={newModule?.name}
              placeholder={t("createModule.aOriginalName")}
              className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] rounded-[10px]"
              placeholderTextColor="#AAAAAA"
            />
          </View>
        </View>

        {showMore && (
          <View className="felx-1">
            {/* Beschreibung */}
            <View className="">
              <View className="flex-row justify-between items-center pr-2">
                <Text className="text-gray-300 font-semibold text-[15px]">
                  {t("createModule.description")}
                </Text>
              </View>
              <TextInput
                maxLength={200}
                onChangeText={(text) =>
                  setNewModule({ ...newModule, description: text })
                }
                value={newModule?.description}
                placeholderTextColor={"#AAAAAA"}
                placeholder={t("createModule.aOriginalDescription")}
                multiline={true}
                numberOfLines={4}
                style={{ height: 90, textAlignVertical: "top" }}
                textAlignVertical="top"
                className="text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px]"
              />
            </View>

            {/* Farbe */}
            <View className=" items-start">
              <View className="w-full flex-row justify-between items-center pr-2">
                <Text className="text-gray-300 font-semibold text-[15px]">
                  {t("createModule.color")}
                </Text>
              </View>
              <ColorPicker
                selectedColor={selectedColor}
                changeColor={changeColor}
                indexItem={0}
              />
            </View>

            {/* Sitzungen (Sessions) */}
            <View className=" flex-row justify-start">
              <View className="flex-1 justify-between my-2">
                <View className="flex-row justify-between items-center pr-2">
                  <Text className="text-gray-300 font-semibold text-[15px]">
                    {t("createModule.sessions")}
                  </Text>
                </View>

                <View className="flex-row items-center justify-start">
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    className="bg-[#0c111d] p-3 m-2 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  >
                    <Icon name="layer-group" size={30} color="#4B5563" />
                  </TouchableOpacity>
                  <ScrollView
                    horizontal
                    contentContainerStyle={{ paddingRight: 20 }}
                  >
                    <View
                      className="flex-row items-center justify-start"
                      style={{ height: 80 }}
                    >
                      {sessions?.length > 0 &&
                        sessions.map((session, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() =>
                              setSelectedSession && setSelectedSession(session)
                            }
                            className="bg-[#0c111d]  border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                            style={{
                              width: 60,
                              height: 60,
                              margin: 5,
                              marginTop: 5,

                              borderColor: session?.color || "#1F2937",
                              shadowColor: session?.color || "#1F2937",
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.5,
                              shadowRadius: 6,
                              elevation: 6,
                            }}
                          >
                            <Icon
                              name={session.iconName}
                              size={30}
                              color={session.color}
                            />
                          </TouchableOpacity>
                        ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Material (Themen, Text, Dateien) */}
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity
          className="flex-row items-center justify-start  mx-2 my-1"
          onPress={() => setShowMore(!showMore)}
        >
          <Text className="text-gray-400 font-semibold text-[15px] mr-2">
            {showMore
              ? t("createModule.lessOptions")
              : t("createModule.moreOptions")}
          </Text>
        </TouchableOpacity>
        {/* Button zum Generieren des Moduls */}
        {!hideCreateButton && (
          <View className="mx-2 mt-2  px-2">
            <CustomButton
              title={
                newModule?.name.length < 3
                  ? t("createModule.enterAName")
                  : t("createModule.createModule")
              }
              handlePress={async () => {
                const res = await adddModule({
                  ...newModule,
                  publicAcess: newModule?.public ? true : false,
                  color:
                    typeof newModule.color == "string"
                      ? newModule.color.toUpperCase()
                      : "BLUE",
                  questions: 0,
                  sessions:
                    sessions.length > 0
                      ? stringifySessions(sessions)
                      : ([] as string[]), // <-- Type Assertion
                  releaseDate: new Date(), // Pass Date object instead of string
                });
                setReloadNeeded([...reloadNeeded, "BIBLIOTHEK"]);
                const resp = await setUserDataSetup(user.$id);
                router.push("/bibliothek");
              }}
              containerStyles="w-full rounded-[10px] bg-blue-500"
              disabled={newModule?.name.length < 3}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CreateModule;
