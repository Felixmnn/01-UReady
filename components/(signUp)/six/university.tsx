import { View, Text } from "react-native";
import React, { useState } from "react";
import BotBottomLeft from "../botBottomLeft";
import ProgressBar from "../(components)/progressBar";
import SearchList from "../(components)/searchList";
import GratisPremiumButton from "@/components/(general)/gratisPremiumButton";
import { useTranslation } from "react-i18next";

const University = ({
  userData,
  setUserData,
  selectedSubjects,
  handleItemPress,
  saveUserData,
}: {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  selectedSubjects: { name: string; icon: string }[];
  handleItemPress: (item: { name: string; icon: string }) => void;
  saveUserData: () => Promise<void>;
}) => {
  const [subjectFilter, setSubjectFilter] = useState("");

  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();
  const subjectsRaw = t("universityCategories.universitySubjects", {
    returnObjects: true,
  }) as Record<string, { icon: string; name: string }>;
  const keys = Object.keys(subjectsRaw);
  const subjectsToObjects = keys.map((key) => {
    return {
      id: key,
      icon: subjectsRaw[key].icon,
      name: subjectsRaw[key].name,
    };
  });

  return (
    <View className="h-full  w-full justify-between items-center py-5">
      <BotBottomLeft
        message={t("personalizeSix.almostDone")}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="w-full">
        <ProgressBar
          percent={85}
          handlePress={() => {
            setUserData({ ...userData, signInProcessStep: "FIVE" });
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
      <View className="w-full max-w-[200px] mt-3">
        <GratisPremiumButton
          active={true}
          aditionalStyles={"rounded-full w-full bg-blue-500  "}
          handlePress={() => {
            saveUserData();
          }}
        >
          <Text className="text-gray-100 font-semibold text-[15px]">
            {t("personalizeSix.letsGo")}
          </Text>
        </GratisPremiumButton>
      </View>
    </View>
  );
};

export default University;
