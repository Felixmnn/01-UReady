import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import DeleteModule from "../(modals)/deleteModule";

type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";

const Header = ({
  setSelectedScreen,
  selected,
  sessions,
  questions,
  moduleSessions,
  setIsVisibleNewQuestion,
  texts,
  selectedLanguage,
  moduleName,
  moduleDescription,
  moduleID,
  modules,
  setModules,
  setSelectedModule,
  openQuizSheet,
  openSessionSheet,
}: {
  setSelectedScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
  selected: number;
  sessions: any[];
  questions: any[];
  moduleSessions: any[];
  setIsVisibleNewQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  texts: any;
  selectedLanguage: string;
  moduleName: string;
  moduleDescription: string;
  moduleID: string;
  modules: any;
  setModules: React.Dispatch<React.SetStateAction<any>>;
  setSelectedModule: React.Dispatch<React.SetStateAction<string>>;
  openQuizSheet: () => void;
  openSessionSheet: () => void;
}) => {
  const { width } = useWindowDimensions();
  const [deleteModuleVisible, setDeleteModuleVisible] = useState(false);
  const isVertical = width > 700;
  let filteredData = [];
  if (selected! > moduleSessions.length) {
    filteredData =
      selected > moduleSessions.length
        ? questions
        : questions.filter(
            (item) => item.sessionID == moduleSessions[selected].id
          );
  } else {
    filteredData = questions;
  }

  return (
    <View className={`${!isVertical ? "bg-[#0c111d]" : null}`}>
      <DeleteModule
        moduleID={moduleID}
        moduleName={moduleName}
        isVisible={deleteModuleVisible}
        setIsVisible={setDeleteModuleVisible}
        modules={modules}
        setModules={setModules}
        setSelectedModule={setSelectedModule}
        description={moduleDescription}
      />
      <View className="flex-row w-full justify-between p-4 items-center">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => setSelectedScreen("AllModules")}>
            <Icon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
          <Text className="font-bold text-white text-[15px]">{moduleName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setDeleteModuleVisible(true)}
          className="px-2"
        >
          <Icon name="ellipsis-v" size={15} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-full  flex-row px-4 justify-between items-center">
        <Text
          className="text-gray-200 font-bold text-2xl "
          style={{ maxWidth: isVertical ? "70%" : "50%" }}
        >
          {selected > sessions.length
            ? "All Questions"
            : sessions[selected].title}
        </Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={openSessionSheet}
            className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}
          >
            <Icon name={"layer-group"} color={"white"} size={15} />
            {isVertical ? (
              <Text className="text-gray-300 text-[12px] ml-2">
                {texts[selectedLanguage].sessions}
              </Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsVisibleNewQuestion(true)}
            className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}
          >
            <Icon name="plus" size={15} color="white" />
            {isVertical ? (
              <Text className="text-gray-300 text-[12px] ml-2">
                {texts[selectedLanguage].addMaterial}
              </Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={questions.length == 0}
            onPress={openQuizSheet}
            style={{ opacity: questions.length == 0 ? 0.5 : 1, paddingLeft: 5 }}
            className={`flex-row items-center rounded-full bg-gray-800 mr-2 border-gray-600 border-[1px]  ${isVertical ? "p-2 " : "h-[32px] w-[32px] justify-center pr-1 pt-[1px] "} `}
          >
            <Icon name="play" size={15} color="white" />
            {isVertical ? (
              <Text className="text-gray-300 text-[12px] ml-2">
                {texts[selectedLanguage].learnNow}
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;
