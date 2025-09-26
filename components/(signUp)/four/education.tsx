import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import BotBottomLeft from "../botBottomLeft";
import ProgressBar from "../(components)/progressBar";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import TouchSquare from "../(components)/touchSquare";

type TranslatedName = {
  [langCode: string]: string; // z.B. DE, EN, FR
};

export type AusbildungTyp = {
  id: string;
  icon: string;
  name: TranslatedName;
};

const Education = ({
  setUserData,
  userData,
  setAusbildungKathegorie,
}: {
  setUserData: (data: any) => void;
  userData: any;
  setAusbildungKathegorie: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const eduobjects = t("education.educationKategories", {
    returnObjects: true,
  }) as Record<string, { name: TranslatedName; icon: string }>;
  const eduKeys = Object.keys(eduobjects);
  const eduObj = eduKeys.map((key) => ({
    name: eduobjects[key].name,
    id: key,
    icon: eduobjects[key].icon,
  }));
  return (
    <ScrollView className="w-full ">
      <BotBottomLeft
        message={t("personalizeFour.wichEducation")}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="h-full  w-full justify-between items-center py-5">
        <View className="w-full">
          <ProgressBar
            percent={60}
            handlePress={() =>
              setUserData({ ...userData, signInProcessStep: "THREE" })
            }
          />
        </View>
        <View className="justify-center items-center flex-row flex-wrap ">
          {eduObj.map((item) => (
            <TouchSquare
              text={
                typeof item.name[i18n.language] === "string"
                  ? item.name[i18n.language]
                  : Object.values(item.name).join(", ")
              }
              icon={item.icon}
              key={item.id}
              handlePress={() => {
                setAusbildungKathegorie(item);
                setUserData({ ...userData, signInProcessStep: "FIVE" });
              }}
            />
          ))}
        </View>
        <View className="items-center justiy-center"></View>
      </View>
    </ScrollView>
  );
};

export default Education;
