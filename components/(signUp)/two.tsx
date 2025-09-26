import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import CountryFlag from "react-native-country-flag";
import Icon from "react-native-vector-icons/FontAwesome5";
import GratisPremiumButton from "../(general)/gratisPremiumButton";
import ProgressBar from "./(components)/progressBar";
import BotCenter from "./botCenter";
import { useTranslation } from "react-i18next";
import { userData } from "@/types/appwriteTypes";
import { setLanguage } from "@/lib/appwriteEdit";
import i18n from "@/assets/languages/i18n";
import { useGlobalContext } from "@/context/GlobalProvider";
/**
 * Country selection
 * The User can select theur prefered language
 * selectedLanguage type int
 * Languages type : Array<{ name, code, enum }>
 */
const StepTwo = ({
  selectedLanguage,
  setSelectedLanguage,
  languages,
  userData,
  setUserData,
  name,
}: {
  selectedLanguage: number | null;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<number | null>>;
  languages: Array<{ label: string; value: string; enum: string }>;
  userData: userData;
  setUserData: React.Dispatch<React.SetStateAction<userData | undefined>>;
  name: string;
}) => {
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation();
  const { user, language, setNewLanguage, userUsage, setUserUsage } = useGlobalContext();
  const languageoptions = [
      { label: "Deutsch", value: "de" },
      { label: "English", value: "en" },
      { label: "Spanish", value: "es" }, 
      { label: "Français", value: "fra" },
    ];
  async function updateLanguage(text: string) {
    
    const i = languageoptions.findIndex((option) => option.label === text);

    if (i == -1 ) return;
    setNewLanguage(languageoptions[i].value.toLowerCase());
    await setLanguage(user.$id, languageoptions[i].value.toLowerCase());
    await i18n.changeLanguage(languageoptions[i].value.toLowerCase());
    
  }

  return (
    <View className="h-full  w-full justify-between items-center py-5">
      <ProgressBar
        percent={30}
        handlePress={() =>
          setUserData({ ...userData, signInProcessStep: "ONE" })
        }
      />
      <View className="items-center justiy-center">
        <BotCenter
          message={t("personalizeTwo.niceToMeetYou", { name: "" })}
          imageSource="Language"
        />

        <View>
          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            className="flex-row w-[150px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 my-2 items-center justify-between mx-1"
          >
            <Text className="text-gray-300 font-semibold text-center mx-2 mt-[1px]">
              {selectedLanguage == null
                ? "Deutsch"
                : languages[selectedLanguage].label}
            </Text>
            <Icon
              name={!isActive ? "caret-down" : "caret-up"}
              size={20}
              color="#4B5563"
            />
          </TouchableOpacity>

          {isActive ? (
            <View
              className={`${Platform.OS == "web" ? "" : "absolute top-[48px]"}  left-1 w-[150px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] p-2 z-50 shadow-lg`}
            >
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    
                    await updateLanguage(language.label);
                   
                    setSelectedLanguage(index);
                    setIsActive(false);
                  }}
                  className="flex-row justify-start items-center p-2 rounded-lg m-1"
                >
                  <Text className="text-gray-300 font-semibold text-center mt-[1px] ">
                    {language.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      </View>
      <View className="w-full max-w-[200px] z-0">
        <GratisPremiumButton
          active={true}
          aditionalStyles={"rounded-full w-full bg-blue-500 z-0 "}
          handlePress={async () => {
            if (selectedLanguage == null) {
              setSelectedLanguage(0);
            }
            setUserData({ ...userData, signInProcessStep: "THREE" });
            setIsActive(false);
          }}
        >
          <Text className="text-gray-100 font-semibold text-[15px]">
            {t("personalizeTwo.continue")}
          </Text>
        </GratisPremiumButton>
      </View>
    </View>
  );
}; //{t("analysis.almostThere", { remaining: 10 - variables.varDataA.length })}
//    "resultsEnumCategory": "{{label}}: Avg {{avg}} ({{count}} values)",

export default StepTwo;
