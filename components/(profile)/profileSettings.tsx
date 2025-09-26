import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useEffect } from "react";
import InfoModule from "../(tabs)/infoModule";
import OptionSelector from "../(tabs)/optionSelector";
import { useWindowDimensions } from "react-native";
import SettingsOption from "../(tabs)/settingsOption";
import { useState } from "react";
import CustomButton from "../(general)/customButton";
import { updateUserEmail, updateUserName, validateEmail } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import CustomTextInput1 from "../(general)/customTextInput1";
import { loadUserData, loadUserDataKathegory } from "@/lib/appwriteDaten";
import { setColorMode, setLanguage } from "@/lib/appwriteEdit";
import SkeletonListProfile from "../(general)/(skeleton)/skeletonListProfile";
import { TextInput } from "react-native-gesture-handler";
import { useActionCode } from "@/lib/appwriteShop";
import { useTranslation } from "react-i18next";
import { userDataKathegory } from "@/types/appwriteTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/assets/languages/i18n";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user, language, setNewLanguage, userUsage, setUserUsage } =
    useGlobalContext();
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  const [userData, setUserData] = useState<any | null | undefined>(null);
  const [userDataKathegory, setUserDataKathegory] =
    useState<userDataKathegory>();
  const [loading, setLoading] = useState(true);
  const [selectedColorMode, setSelectedColorMode] = useState<string | null>(
    "Darstellung"
  );

  useEffect(() => {
    if (user === null || user === undefined) return;
    async function fetchUserData() {
      let userData = await loadUserData(user.$id);
      setSelectedColorMode(
        userData && userData.darkmode
          ? t("profileSettings.darkmode")
          : t("profileSettings.darkmode")
      );

      setUserData(userData);
      const userDataKathegoryDoc = await loadUserDataKathegory(user.$id);
      const userDataKathegoryTyped: userDataKathegory | null =
        userDataKathegoryDoc as unknown as userDataKathegory;
      setSelectedLanguage(
        userDataKathegoryTyped &&
          (userDataKathegoryTyped.language === "de" ||
            userDataKathegoryTyped.language === "en" ||
            userDataKathegoryTyped.language === "fra" ||
            userDataKathegoryTyped.language === "es" ||
            userDataKathegoryTyped.language === "SPANISH")
          ? userDataKathegoryTyped.language
          : "DEUTSCH"
      );

      setUserDataKathegory(userDataKathegoryTyped);
      setLoading(false);
    }
    fetchUserData();
  }, [user]);

  const [modalVisible, setModalVisible] = useState(false);

  const personalInput = (
    value: string,
    title: string,
    onChange: (text: string) => void,
    text = false
  ) => {
    return (
      <TouchableOpacity className="flex-1 w-full mt-2">
        <Text className="text-gray-300 font-bold text-[13px] m-2">{title}</Text>
        {text ? (
          <View className="m-1">
            <Text className="text-gray-300 font-bold text-[13px] ml-3">
              {value}
            </Text>
          </View>
        ) : (
          <CustomTextInput1 value={value} onChange={onChange} />
        )}
      </TouchableOpacity>
    );
  };

  const [actioncode, setActionCode] = useState("");

  async function toggleModal() {
    const res = await useActionCode(actioncode);

    if (res && res != null) {
      setUserUsage((prev: any) => {
        if (
          prev.purcharses.length != 0 &&
          prev.purcharses.includes(actioncode)
        ) {
          setIsError(true);
          setErrorMessage("You already used this action code :(");
          setModalVisible(!modalVisible);
          return prev; // keine Änderung
        }

        // Aktionen ausführen
        let updated = { ...prev };

        if (res.item.includes("10ENERGY")) {
          updated.energy += 10;
        } else if (res.item.includes("100CHIPS")) {
          updated.chips += 100;
        } else if (res.item.includes("100ENERGY")) {
          updated.energy += 200;
        }
        if (updated.purcharses.length == 0) {
          updated.purcharses = [actioncode];
        } else {
          updated.purcharses = [...updated.purcharses, actioncode];
        }
        setSuccessMessage("Successfully applied action code");
        setIsSccess(true);

        return updated;
      });
    } else {
      setErrorMessage(actioncode + " is not a valid action code :(");
      setIsError(true);
    }

    setModalVisible(!modalVisible);
  }

  const modal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center p-2">
          <View
            className="w-full max-w-[300px] items-center bg-gray-800 p-4 rounded-[10px] border border-[1px] border-gray-600"
            style={{
              height: 200,
            }}
          >
            <Text className="text-white font-bold text-[15px] my-3">
              {t("profileSettings.actioncodeText")}
            </Text>
            <TextInput
              className="w-full bg-gray-700 text-gray-300 p-2 rounded-[10px] border border-gray-500"
              placeholderTextColor="#808080"
              value={actioncode}
              onChangeText={(text) => setActionCode(text)}
            />
            <View className="flex-1 flex-row items-center justify-center">
              <CustomButton
                title={t("profileSettings.cancel")}
                handlePress={() => setModalVisible(false)}
                containerStyles={
                  "w-[50%] bg-gray-800 mx-1 border-w-[1px] border-gray-500"
                }
              />
              <CustomButton
                title={t("profileSettings.ok")}
                handlePress={toggleModal}
                containerStyles={
                  !isFocused && firstFocus && text == ""
                    ? "w-[50%] bg-gray-700 mx-1 border-gray-700"
                    : "w-[50%] bg-blue-500 mx-1"
                }
                textStyles={"text-gray-300"}
                disabled={!isFocused && firstFocus && text == ""}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const ErrorModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isError || isSuccess}
        onRequestClose={() => {
          setIsError(!isError);
        }}
      >
        <TouchableOpacity
          className="flex-1 justify-start pt-5 items-center"
          onPress={() => {
            setIsError(false);
            setIsSccess(false);
          }}
        >
          <View
            className="red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700"
            style={{
              backgroundColor: isSuccess ? "green" : "#ff4d4d",
              borderColor: isSuccess ? "green" : "#ff4d4d",
            }}
          >
            <Text className="text-white font-bold text-gray-300">
              {isSuccess
                ? t("profileSettings.successActionCode")
                : errorMessage == "You already used this action code :("
                  ? t("profileSettings.alreadyUsed")
                  : actioncode + t("profileSettings.invalidCode")}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const [isFocused, setFocused] = useState(false);
  const [firstFocus, setFirstFocus] = useState(false);
  const [text, setText] = useState("");

  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const isVertical = width > 700;


  const [selectedLanguage, setSelectedLanguage] = useState<string | null>("de");

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  const languageoptions = [
    { label: "Deutsch", value: "de" },
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" }, 
    { label: "Français", value: "fra" },
  ];
  const colorOptions = [
    { label: t("profileSettings.darkmode"), value: "dark" },
  ];

  async function updateLanguage(text: string) {
    console.log(text);
    languageoptions.map((option) => {
    })
    const i = languageoptions.findIndex((option) => option.label === text);

    if (i == -1 ) return;
    console.log(languageoptions[i].value);
    setSelectedLanguage(languageoptions[i].value.toLowerCase());
    setNewLanguage(languageoptions[i].value.toLowerCase());
    await setLanguage(user.$id, languageoptions[i].value.toLowerCase());
    await i18n.changeLanguage(languageoptions[i].value.toLowerCase());
    
  }

  async function updateColorMode(text: string | null) {
    setSelectedColorMode(text);
    if (text !== null) {
      await setColorMode(user.$id, text == "Hell" ? false : true);
    }
  }
  const schoolTypeKey = userDataKathegory?.schoolType
    ? userDataKathegory.schoolType.toLowerCase()
    : null;
  const schoolType = t(`school.type.${schoolTypeKey}.title`);

  return (
    <View className="flex-1 items-center ">
      {!loading ? (
        <View className="flex-1 w-full items-center">
          <ErrorModal />
          <View
            className={`flex-1 w-full  rounded-[10px] bg-gray-900 ${isVertical ? "border-gray-500 border-[1px]" : null} `}
          >
            <View className="mt-2" />
            <ScrollView className="bg-gray-900">
              <InfoModule
                content={() => {
                  return (
                    <View className="flex-1 items-center ">
                      <View className="bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center">
                        <Text className="text-2xl text-gray-300 font-bold">
                          {user.name[0]}
                        </Text>
                      </View>
                      {personalInput(
                        user.name,
                        t("profileSettings.vorname"),
                        (text) => updateUserName(text)
                      )}
                      {personalInput(
                        user.email,
                        t("profileSettings.email"),
                        (text) => updateUserEmail(text),
                        true
                      )}
                      {!user.emailVerification ? (
                        <View
                          className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}
                        >
                          <Text className="text-red-300 font-bold text-[12px]">
                            {t("profileSettings.emailvalid")}
                          </Text>
                          <TouchableOpacity
                            className="py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]"
                            onPress={() => {
                              validateEmail();
                            }}
                          >
                            <Text className="text-gray-300 font-bold text-[12px]">
                              {t("profileSettings.emailrenew")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="w-full m-2 px-2">
                          <Text>
                            <Text className="text-green-300 font-bold text-[12px]">
                              {t("profileSettings.emailvalid2")}
                            </Text>
                          </Text>
                        </View>
                      )}

                      <View className="justify-start w-full">
                        {userDataKathegory &&
                        userDataKathegory.kategoryType == "UNIVERSITY" ? (
                          <View className="w-full">
                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.universityEducationGoals")}
                            </Text>
                            <Text className="font-semibold text-white ml-2">
                              {t(
                                `universityCategories.degrees.${userDataKathegory.studiengangZiel}.name`
                              )}
                            </Text>

                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.universityCategories")}
                            </Text>
                            <View>
                              {userDataKathegory.schoolSubjects.map(
                                (schoolSubjects, index) => {
                                  return (
                                    <Text
                                      key={index}
                                      className="font-semibold text-white ml-2"
                                    >
                                      {t(
                                        `universityCategories.universitySubjects.${schoolSubjects}.name`
                                      )}
                                    </Text>
                                  );
                                }
                              )}
                            </View>
                          </View>
                        ) : userDataKathegory &&
                          userDataKathegory.kategoryType == "SCHOOL" ? (
                          <View className="w-full">
                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.schooltype")}
                            </Text>
                            <Text className="font-semibold text-white ml-2">
                              {schoolType}
                            </Text>

                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.schoolgrade")}
                            </Text>
                            <Text className="font-semibold text-white ml-2">
                              {userDataKathegory.schoolGrade}
                            </Text>
                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.schoolsubjects")}
                            </Text>
                            <View>
                              {userDataKathegory.schoolSubjects.map(
                                (schoolSubjects, index) => {
                                  return (
                                    <Text
                                      key={index}
                                      className="font-semibold text-white ml-2"
                                    >
                                      {t(
                                        `school.subjects.${schoolSubjects}.name`
                                      )}
                                    </Text>
                                  );
                                }
                              )}
                            </View>
                          </View>
                        ) : userDataKathegory &&
                          userDataKathegory.kategoryType == "EDUCATION" ? (
                          <View className="w-full">
                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.educationKathegory")}
                            </Text>
                            <Text className="font-semibold text-white ml-2">
                              {t(
                                `education.educationKategories.${userDataKathegory.educationKathegory}.name`
                              )}
                            </Text>

                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.educationSubject")}
                            </Text>
                            <Text className="font-semibold text-white ml-2">
                              {t(
                                `education.educationSubjects.${userDataKathegory.educationKathegory}.${userDataKathegory.educationSubject}.name`
                              )}
                            </Text>
                          </View>
                        ) : (
                          <View className="w-full">
                            <Text
                              className="font-semibold text-white text-gray-500  "
                              style={{
                                color: "#808080",
                              }}
                            >
                              {t("profileSettings.schoolsubjects")}
                            </Text>
                            <View>
                              {userDataKathegory &&
                                userDataKathegory.schoolSubjects.map(
                                  (schoolSubjects, index) => {
                                    return (
                                      <Text
                                        key={index}
                                        className="font-semibold text-white ml-2"
                                      >
                                        {t(
                                          `school.subjects.${schoolSubjects}.name`
                                        )}
                                      </Text>
                                    );
                                  }
                                )}
                            </View>
                          </View>
                        )}
                        <View className="justify-start w-full items-start">
                          <TouchableOpacity
                            className="mt-3 mb-1 py-1 px-2 rounded-full border border-blue-500 items-center justify-center"
                            onPress={() =>
                              router.push({
                                pathname: "/personalize",
                                params: {
                                  editEducationGoals: "true",
                                },
                              })
                            }
                          >
                            <Text className="text-blue-500 font-bold">
                              {t("profileSettings.editEducationGoals")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
                header=""
                hideHead={true}
              />
              <InfoModule
                header=""
                content={() => {
                  return (
                    <View
                      className={`flex-1  ${ "items-start"}`}
                    >
                      <OptionSelector
                        title={t("profileSettings.colorMode")}
                        options={colorOptions}
                        selectedValue={selectedColorMode}
                        setSelectedValue={setSelectedColorMode}
                        onChangeItem={updateColorMode}
                      />
                      <OptionSelector
                        title={t("profileSettings.language")}
                        options={languageoptions}
                        selectedValue={
                          languageoptions.find((option) => option.value === selectedLanguage)?.label ?? "Deutsch"
                        }
                        setSelectedValue={setSelectedLanguage}
                        onChangeItem={updateLanguage}
                      />
                    </View>
                  );
                }}
                hideHead={true}
                infoStyles="z-20"
              />

              <InfoModule
                header=""
                content={() => {
                  return (
                    <View>
                      <SettingsOption
                        title={t("profileSettings.help")}
                        iconName={"life-ring"}
                        handlePress={() => router.push("/contact")}
                      />
                      <SettingsOption
                        title={t("profileSettings.policys")}
                        iconName={"shield-alt"}
                        handlePress={() => router.push("/policys")}
                      />
                      <SettingsOption
                        title={t("profileSettings.actioncode")}
                        iconName={"bolt"}
                        item={modal()}
                        handlePress={() => setModalVisible(true)}
                      />
                      <SettingsOption
                        title={t("profileSettings.logout")}
                        iconName={"sign-out"}
                        handlePress={() => router.push("/sign-out")}
                      />
                      <SettingsOption
                        title={t("profileSettings.deleteAccount")}
                        iconName="trash"
                        bottom={true}
                        handlePress={() => router.push("/delete-account")}
                      />
                    </View>
                  );
                }}
                hideHead={true}
              />
            </ScrollView>
          </View>
        </View>
      ) : (
        <SkeletonListProfile />
      )}
    </View>
  );
};

export default ProfileSettings;
