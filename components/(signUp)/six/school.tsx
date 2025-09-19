import { View, Text } from "react-native";
import React, { useState } from "react";
import BotBottomLeft from "../botBottomLeft";
import ProgressBar from "../(components)/progressBar";
import SearchList from "../(components)/searchList";
import GratisPremiumButton from "@/components/(general)/gratisPremiumButton";
import { useTranslation } from "react-i18next";
import CustomButton from "@/components/(general)/customButton";

const School = ({
  userData,
  setUserData,
  handleItemPress,
  selectedKathegorie,
  selectedSubjects,
  saveUserData,
}: {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  handleItemPress: (item: { name: string; icon: string }) => void;
  selectedKathegorie: string;
  selectedSubjects: { name: string; icon: string }[];
  saveUserData: () => Promise<void>;
}) => {
  const [subjectFilter, setSubjectFilter] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();
  const subjectsRaw = t("school.subjects", { returnObjects: true }) as Record<
    string,
    { icon: string; name: string }
  >;
  const keys = Object.keys(subjectsRaw);
  const subjectsToObjects = keys.map((key) => {
    return {
      id: key,
      icon: subjectsRaw[key].icon,
      name: subjectsRaw[key].name,
    };
  });

  const subjects: Array<{ name: string; icon?: string }> = Array.isArray(
    subjectsRaw
  )
    ? subjectsRaw
    : [];
  const filteredData = subjects
    .filter((item) =>
      item.name.toLowerCase().includes(subjectFilter.toLowerCase())
    )
    .map((item) => ({
      name: item.name,
      icon: item.icon || "", // falls Icon fehlt, leeres String oder Default setzen
    }));

  return (
    <View className="h-full  w-full justify-between items-center py-5 ">
      <BotBottomLeft
        message={t("personalizeSix.whatSubjects")}
       
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="w-full ">
        <ProgressBar
          percent={85}
          handlePress={() => {
            if (selectedKathegorie === "SCHOOL") {
              setUserData({ ...userData, signInProcessStep: "FIVE" });
            } else {
              setUserData({ ...userData, signInProcessStep: "THREE" });
            }
          }}
        />
      </View>
      <SearchList
        data={subjectsToObjects}
        handlePress={handleItemPress}
        filter={subjectFilter}
        setFilter={setSubjectFilter}
        selectedItems={selectedSubjects}
        abschlussziel={t("personalizeSix.yourSubjects")}
      />

      <CustomButton
        disabled={selectedSubjects.length < 1}
        containerStyles={"rounded-lg w-full bg-blue-500 mt-2 "}
        handlePress={() => {
          saveUserData();
        }}
        title={t("personalizeSix.letsGo")}
      />
    </View>
  );
};

export default School;
