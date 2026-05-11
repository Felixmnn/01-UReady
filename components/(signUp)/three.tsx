import { View } from "react-native";
import React from "react";
import BotCenter from "./botCenter";
import { useTranslation } from "react-i18next";
import TouchSquare from "./(components)/touchSquare";
import ProgressBar from "./(components)/progressBar";
import { router } from "expo-router";
import { userData } from "@/types/appwriteTypes";
import CountryPicker from "./(components)/countryPicker";

/**
 * Selction of Education Category and his Country
 */
const StepThree = ({
  setSelectedCountry,
  setSelectedKathegorie,
  userData,
  setUserData,
  editing,
  fastOnboarding,
  addDetails,
}: {
  setSelectedCountry: React.Dispatch<
    React.SetStateAction<{
      name: string;
      code: string;
      id: string;
      schoolListID: string;
      universityListID: string;
      educationListID: string;
      educationSubjectListID: string;
    }>
  >;
  setSelectedKathegorie: React.Dispatch<React.SetStateAction<string>>;
  userData: userData;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  editing?: boolean;
  fastOnboarding?: (params: { kategoryType: "SCHOOL" | "UNIVERSITY" | "EDUCATION" | "OTHER" }) => Promise<void>;
  addDetails?: boolean;
}) => {
  const { t } = useTranslation();

  /**
   * This section lets a user select wich education kathegorie he/she is attending
   */
  const textIcons = [
    [
      {
        text: t("personalizeThree.school"),
        icon: "school",
        handlePress: async() => {
          if (!addDetails) {
              fastOnboarding ? await fastOnboarding({ kategoryType: "SCHOOL" }) : null,
              setSelectedKathegorie("SCHOOL"),
              setUserData({ ...userData, signInProcessStep: "SEVEN" })
          } else {
            setSelectedKathegorie("SCHOOL"),
            setUserData({ ...userData, signInProcessStep: "FOUR" })
          }
        },
      },
      {
        text: t("personalizeThree.university"),
        icon: "university",
        handlePress: async () => {
          if (!addDetails) {
            fastOnboarding ? await fastOnboarding({ kategoryType: "UNIVERSITY" }) : null,
            setSelectedKathegorie("UNIVERSITY"),
            setUserData({ ...userData, signInProcessStep: "SEVEN" })
          } else {
            setSelectedKathegorie("UNIVERSITY"),
            setUserData({ ...userData, signInProcessStep: "FIVE" })
          }
        },
      },
    ],
    [
      {
        text: t("personalizeThree.education"),
        icon: "tools",
        handlePress:async () => {
          if (!addDetails) {
            fastOnboarding ? await fastOnboarding({ kategoryType: "EDUCATION" }) : null,
            setSelectedKathegorie("EDUCATION"),
            setUserData({ ...userData, signInProcessStep: "SEVEN" })
          } else {
             setSelectedKathegorie("EDUCATION"),
            setUserData({ ...userData, signInProcessStep: "FOUR" })
          }
        },
      },
      {
        text: t("personalizeThree.other"),
        icon: "ellipsis-h",
        handlePress: async() => {
          if (!addDetails) {
            fastOnboarding ? await fastOnboarding({ kategoryType: "OTHER" }) : null,
            setSelectedKathegorie("OTHER"),
            setUserData({ ...userData, signInProcessStep: "SEVEN" })
          } else {
             setSelectedKathegorie("OTHER"),
            setUserData({ ...userData, signInProcessStep: "SIX" })
          }
        },
      },
    ],
  ];

  return (
    <View className="h-full  w-full justify-between items-center py-5">
      <ProgressBar
        percent={40}
        handlePress={() => {
          if (editing) {
            router.replace("/profil");
            return;
          }
          setUserData({ ...userData, signInProcessStep: "TWO" });
        }}
      />
      <View className="items-center justiy-center">
        <BotCenter
          message={t("personalizeThree.whereDoYouStudy")}
          imageSource="Location"
        />
            <CountryPicker onSelect={(country:{id:string,name:string,code:string}) =>setSelectedCountry({
              ...country,
              schoolListID: "",
              universityListID: "",
              educationListID: "",
              educationSubjectListID: "",
            })}/>

        <View className="p-2 my-2 items-center justify-center mx-1">
          {textIcons.map((itextIconList, index) => (
            <View key={index} className="flex-row">
              {itextIconList.map((item, idx) => (
                <TouchSquare
                  key={idx}
                  text={item.text}
                  handlePress={item.handlePress}
                  icon={item.icon}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View className="w-full max-w-[200px]"></View>
    </View>
  );
};

export default StepThree;
