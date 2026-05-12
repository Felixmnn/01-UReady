import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
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
}: {
  selectedLanguage: number | null;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<number | null>>;
  languages: Array<{ label: string; value: string; enum: string }>;
  userData: userData;
  setUserData: React.Dispatch<React.SetStateAction<userData | undefined>>;
}) => {
  const { t } = useTranslation();
  const { user, setNewLanguage } = useGlobalContext();
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
      <View className="items-center justify-center">
        <BotCenter
          message={t("personalizeTwo.niceToMeetYou", { name: "" })}
          imageSource="Language"
        />

        <View className="   rounded-[10px] p-2 my-2">
          <View className="flex-row flex-wrap justify-center">
            {languages.map((language, index) => {
              const isSelected = selectedLanguage === index;
              return (
                <TouchableOpacity
                  key={language.value}
                  onPress={async () => {
                    await updateLanguage(language.label);
                    setSelectedLanguage(index);
                  }}
                  className={`w-[110px] p-2 rounded-lg m-1 items-center border ${
                    isSelected
                      ? "bg-gray-700 border-gray-500"
                      : "bg-gray-900 border-gray-800"
                  }`}
                >
                  <Text className="text-gray-300 font-semibold text-center mt-[1px]">
                    {language.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
