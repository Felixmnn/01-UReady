import { View, Text } from "react-native";
import React, { useState } from "react";
import BotBottomLeft from "../botBottomLeft";
import { useTranslation } from "react-i18next";
import ProgressBar from "../(components)/progressBar";
import SearchList from "../(components)/searchList";
import GratisPremiumButton from "@/components/(general)/gratisPremiumButton";



const Education = ({
  setUserData,
  userData,
  ausbildungKathegorie,
  saveUserData,
  subjectSelection,
  selectedSubjects,
  subjectFilter,
  setSubjectFilter,
}: {
  setUserData: (data: any) => void;
  userData: any;
  ausbildungKathegorie: { id: string; name: { [key: string]: string } };
  saveUserData: () => Promise<void>;
  subjectSelection: (item: { name: string; icon: string }) => void;
  selectedSubjects: { name: string; icon: string }[];
  subjectFilter: string;
  setSubjectFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const eduObjects = t(
    `education.educationSubjects.${ausbildungKathegorie.id}`,
    { returnObjects: true }
  ) as Record<string, { name: string; icon: string }>;
  const preppedEduObjects = Object.keys(eduObjects).map((key) => ({
    id: key,
    name: eduObjects[key].name,
    icon: eduObjects[key].icon,
  }));
  const [isVisible, setIsVisible] = useState(true);

  return (
    <View className="h-full  w-full justify-between py-5">
      <BotBottomLeft
        message={t("personalizeFive.interestingArea")}
        imageSource="Waving"
        spechBubbleStyle="bg-blue-500"
        spBCStyle="max-w-[200px]"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="w-full">
        <ProgressBar
          percent={75}
          handlePress={() =>
            setUserData({ ...userData, signInProcessStep: "FOUR" })
          }
        />
      </View>

      <SearchList
        data={preppedEduObjects}
        handlePress={subjectSelection}
        filter={subjectFilter}
        setFilter={setSubjectFilter}
        selectedItems={selectedSubjects}
        abschlussziel={t("personalizeSix.yourSubjects")}
      />

      <View />
      <GratisPremiumButton
        active={true}
        aditionalStyles={"rounded-full w-full bg-blue-500 rounded-lg  "}
        handlePress={() => {
          saveUserData();
        }}
      >
        <Text className="text-gray-100 font-semibold text-[15px]">
          {t("personalizeSix.letsGo")}
        </Text>
      </GratisPremiumButton>
    </View>
  );
};

export default Education;
