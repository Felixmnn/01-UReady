import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import BotBottomLeft from "../botBottomLeft";
import ProgressBar from "../(components)/progressBar";
import { useTranslation } from "react-i18next";

type Item = {
  id: string;
  name: string;
  icon?: string;
  image?: string;
};

const School = ({
  userData,
  setUserData,
  school,
  setClass,
}: {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  school: {
    id: string;
    name: string;
    icon?: string;
    image?: string;
    klassenstufen: string[];
  };
  setClass: React.Dispatch<React.SetStateAction<string | null>>;
  numColumns: number;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  return (
    <ScrollView className="w-full h-full">
      <BotBottomLeft
        message={t("personalizeFive.yourSchoolLevel")}
        imageSource="Waving"
        spechBubbleStyle="bg-blue-500"
        spBCStyle="max-w-[200px]"
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <View className="h-full  w-full justify-between items-center py-5">
        <View className="w-full">
          <ProgressBar
            percent={65}
            handlePress={() =>
              setUserData({ ...userData, signInProcessStep: "FOUR" })
            }
          />
        </View>
        <View className="justify-center items-center flex-row flex-wrap">
          {school.klassenstufen.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => {
                setClass(item);
                setUserData({ ...userData, signInProcessStep: "SIX" });
              }}
              className="p-4 border-gray-800 border-[1px] rounded-[10px] bg-gray-900 items-center justify-center m-1"
              style={{ width: width / 3 - 20, height: width / 3 - 20 }}
            >
              <Text className="text-gray-100 font-semibold text-[15px] text-center">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="items-center justiy-center"></View>
      </View>
    </ScrollView>
  );
};

export default School;
