import { View, ScrollView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import InfoModule from "../(tabs)/infoModule";
import { useWindowDimensions } from "react-native";
import { updateUserName } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { loadUserData, loadUserDataKathegory } from "@/lib/appwriteDaten";
import { setColorMode, setLanguage } from "@/lib/appwriteEdit";
import SkeletonListProfile from "../(general)/(skeleton)/skeletonListProfile";
import { useActionCode } from "@/lib/appwriteShop";
import { useTranslation } from "react-i18next";
import { userDataKathegory } from "@/types/appwriteTypes";
import i18n from "@/assets/languages/i18n";
import { handleValidationCode } from "@/lib/appwriteEmailValidation";
import {
  AppwritePublicProfile,
  getPublicProfile,
  updatePublicProfile,
  PublicEducationCategory,
} from "@/lib/collections/publicProfile";
import ProfileSettingsActionCodeModal from "./profileSettingsActionCodeModal";
import ProfileSettingsFeedbackModal from "./profileSettingsFeedbackModal";
import ProfileSettingsProfileSection from "./profileSettingsProfileSection";
import ProfileSettingsEducationSection from "./profileSettingsEducationSection";
import ProfileSettingsPreferencesSection from "./profileSettingsPreferencesSection";
import ProfileSettingsActionsSection from "./profileSettingsActionsSection";
import ProfileRewardedCommercial from "./profileRewardedCommercialEntry";

const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user, language, setNewLanguage, setUserUsage, isOffline } =
    useGlobalContext();
  const [userDataKathegory, setUserDataKathegory] =
    useState<userDataKathegory>();
  const [loading, setLoading] = useState(true);
  const [publicProfile, setPublicProfile] = useState<AppwritePublicProfile | null>(null);
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

      const loadedPublicProfile = await getPublicProfile(user.$id, {
        name: user.name,
        educationKategory: normalizePublicEducationCategory(
          userDataKathegoryTyped?.kategoryType
        ),
      });
      setPublicProfile(loadedPublicProfile);
      setLoading(false);
    }
    fetchUserData();
  }, [user]);

  const updatePublicProfileField = async (
    updates: Partial<
      Pick<AppwritePublicProfile, "bio" | "isPublic" | "name" | "educationKategory">
    >
  ) => {
    if (!publicProfile) return;
    const nextProfile: AppwritePublicProfile = {
      ...publicProfile,
      ...updates,
    };
    setPublicProfile(nextProfile);
    const saved = await updatePublicProfile(nextProfile);
    if (saved) {
      setPublicProfile(saved);
    }
  };

  const normalizePublicEducationCategory = (
    categoryType?: string | null
  ): PublicEducationCategory => {
    if (categoryType === "UNIVERSITY") return "UNIVERSITY";
    if (categoryType === "SCHOOL") return "SCHOOL";
    if (categoryType === "EDUCATION") return "EDUCATION";
    return "OTHER";
  };

  const syncEducationCategoryToPublicProfile = async () => {
    if (!publicProfile || !userDataKathegory) return;

    const nextEducationCategory = normalizePublicEducationCategory(
      userDataKathegory.kategoryType
    );
    if (publicProfile.educationKategory === nextEducationCategory) return;

    await updatePublicProfileField({
      educationKategory: nextEducationCategory,
    });
  };

  useEffect(() => {
    syncEducationCategoryToPublicProfile();
  }, [
    userDataKathegory?.kategoryType,
    publicProfile?.educationKategory,
  ]);

  const [modalVisible, setModalVisible] = useState(false);

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

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | number >("");
  const [successMessage, setSuccessMessage] = useState<string | number >("");
  const [verificationCode, setVerificationCode] = useState("");

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
    const i = languageoptions.findIndex((option) => option.label === text);

    if (i == -1 || !user) return;
    setSelectedLanguage(languageoptions[i].value.toLowerCase());
    setNewLanguage(languageoptions[i].value.toLowerCase());
    await setLanguage(user.$id, languageoptions[i].value.toLowerCase());
    await i18n.changeLanguage(languageoptions[i].value.toLowerCase());
    
  }

  async function updateColorMode(text: string | null) {
    setSelectedColorMode(text);
    if (text !== null && user) {
      await setColorMode(user.$id, text == "Hell" ? false : true);
    }
  }
  const schoolTypeKey = userDataKathegory?.schoolType
    ? userDataKathegory.schoolType.toLowerCase()
    : null;
  const schoolType = t(`school.type.${schoolTypeKey}.title`);
  const [ verified, setVerified ] = useState<boolean | null>(null);
  const confirmDisabled = !isFocused && firstFocus && text == "";
  const confirmContainerStyles = confirmDisabled
    ? "w-[50%] bg-gray-700 mx-1 border-gray-700"
    : "w-[50%] bg-blue-500 mx-1";

  const closeFeedbackModal = () => {
    setIsError(false);
    setIsSccess(false);
  };

  if (!user) {
    return (
      <View className="flex-1 items-center">
        <SkeletonListProfile />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center ">
      {!loading ? (
        <View className="flex-1 w-full items-center">
          <ProfileSettingsFeedbackModal
            isError={isError}
            isSuccess={isSuccess}
            setIsError={setIsError}
            setIsSuccess={setIsSccess}
            errorMessage={errorMessage}
            successMessage={successMessage}
            t={t}
          />
          <View
            className={`flex-1 w-full  rounded-[10px] bg-gray-900 ${isVertical ? "border-gray-500 border-[1px]" : null} `}
          >
            <View className="mt-2" />
            <ScrollView className={` bg-gray-900 ${Platform.OS === "ios" ? "mb-[65px]" : null} `}>
              <InfoModule
                content={() => {
                  return (
                    <ProfileSettingsProfileSection
                      t={t}
                      userName={user.name}
                      publicProfile={publicProfile}
                      isOffline={isOffline}
                      onTogglePublic={(newValue) =>
                        updatePublicProfileField({ isPublic: newValue })
                      }
                      onUpdateName={async (text) => {
                        await updateUserName(text);
                        await updatePublicProfileField({ name: text });
                      }}
                      onUpdateBio={async (text) =>
                        updatePublicProfileField({ bio: text })
                      }
                    />
                  )}}
                  hideHead={true}
                  header=""
              />
              <InfoModule
                header=""
                hideHead={true}
                content={() => {
                  return <ProfileRewardedCommercial />;
                }}
              />
              <InfoModule
                content={() => {
                  return (
                    <ProfileSettingsEducationSection
                      t={t}
                      user={{
                        $id: user.$id,
                        email: user.email,
                        emailVerification: user.emailVerification,
                      }}
                      isVertical={isVertical}
                      isOffline={isOffline}
                      verified={verified}
                      verificationCode={verificationCode}
                      setVerificationCode={setVerificationCode}
                      onRenewEmail={async () => {
                        const res = await handleValidationCode(user.email);
                        if (res && res.code === 100) {
                          setSuccessMessage(100);
                          setIsSccess(true);
                        } else {
                          setErrorMessage(res.code);
                          setIsError(true);
                        }
                      }}
                      onVerifyEmailCode={async () => {
                        const res = await handleValidationCode(
                          user.email,
                          verificationCode,
                          user.$id
                        );
                        if (res && res.code === 101) {
                          setVerified(true);
                          setSuccessMessage(101);
                          setIsSccess(true);
                        } else {
                          setVerified(false);
                          setErrorMessage(res.code);
                          setIsError(true);
                        }
                      }}
                      userDataKathegory={userDataKathegory}
                      schoolType={schoolType}
                      onPressEditEducationGoals={() =>
                        router.push({
                          pathname: "/personalize",
                          params: {
                            editEducationGoals: "true",
                          },
                        })
                      }
                    />
                  );
                }}
                header=""
                hideHead={true}
              />
              <InfoModule
                header=""
                content={() => {
                  return (
                    <ProfileSettingsPreferencesSection
                      t={t}
                      colorOptions={colorOptions}
                      selectedColorMode={selectedColorMode}
                      setSelectedColorMode={setSelectedColorMode}
                      onChangeColor={updateColorMode}
                      languageOptions={languageoptions}
                      selectedLanguage={selectedLanguage}
                      setSelectedLanguage={setSelectedLanguage}
                      onChangeLanguage={updateLanguage}
                    />
                  );
                }}
                hideHead={true}
                infoStyles="z-20"
              />

              <InfoModule
                header=""
                content={() => {
                  return (
                    <ProfileSettingsActionsSection
                      t={t}
                      isOffline={isOffline}
                      actionCodeItem={
                        <ProfileSettingsActionCodeModal
                          visible={modalVisible}
                          onClose={() => setModalVisible(false)}
                          isOffline={isOffline}
                          t={t}
                          actioncode={actioncode}
                          setActionCode={setActionCode}
                          onConfirm={toggleModal}
                          isFocused={isFocused}
                          firstFocus={firstFocus}
                          text={text}
                        />
                      }
                      onPressContact={() => router.push("/contact")}
                      onPressPolicys={() => router.push("/policys")}
                      onPressActionCode={() => setModalVisible(true)}
                      onPressLogout={() => router.push("/sign-out")}
                      onPressDeleteAccount={() => router.push("/delete-account")}
                    />
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
