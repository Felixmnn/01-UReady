import {
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ContinueBox from "../(signUp)/(components)/continueBox";
import Icon from "react-native-vector-icons/FontAwesome5";
import VektorCircle from "../(karteimodul)/vektorCircle";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getModules, getSessionQuestions } from "@/lib/appwriteQuerys";
import languages from "@/assets/exapleData/languageTabs.json";
import { returnColor } from "@/functions/returnColor";
import TokenHeader from "../(general)/tokenHeader";
import AddAiBottomSheet from "../(general)/(modal)/addAiBttomSheet";
import AddModuleBottomSheet from "../(general)/(modal)/addModuleBottomSheet";
import CustomButton from "../(general)/customButton";
import { useTranslation } from "react-i18next";
import { module, UserUsage } from "@/types/appwriteTypes";
import { Session } from "@/types/moduleTypes";
import KaTeXExample from "./katext";

type MiniModule = {
  name: string;
  percent: number;
  color: string;
  fragen: number;
  sessions: number;
  sessionID: string;
};

type MiniSession = {
  name: string;
  percent: number;
  color: string;
  icon: string;
  questions: number;
  sessionID: string;
};

const { width } = Dimensions.get("window");

const HomeGeneral = () => {
  const { t } = useTranslation();
  const { user, userUsage,setUserUsage } = useGlobalContext();
  const selected = "de" // Can be de, en, fr, es




  
  const [userUsageP, setUserUsageP] = useState<UserUsage | null>(null);
  let count = 0;
  useEffect(() => {
    count++;
    if (userUsage) {
      setUserUsageP({
        ...userUsage,
        lastModules: userUsage.lastModules.map((item: string) =>
          JSON.parse(item)
        ),
        lastSessions: userUsage.lastSessions.map((item: string) =>
          JSON.parse(item)
        ),
      });
    }
  }, [userUsage]);

  const { language} = useGlobalContext();
  const [selectedLanguage, setSelectedLanguage] = useState("DEUTSCH");
  const texts = languages.home;
  useEffect(() => {
    count++;
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  {
    /*Überschrift für die einzelnen Abteie */
  }
  const Header = ({ title }: { title: string }) => {
    return (
      <View className="flex-row items-center justify-between my-2">
        <Text className="text-white font-bold text-[15px]">{title}</Text>
      </View>
    );
  };

  async function directToModule(moduleID: string) {
    const allModulesRaw = await getModules(user.$id);
    const allModules: module[] = allModulesRaw as unknown as module[];
    const index = allModules?.findIndex((item) => {
      return item.$id === moduleID;
    });
    if (index !== -1) {
      router.push({
        pathname: "/bibliothek",
        params: { selectedModuleIndex: index?.toString() },
      });
    } else {
      router.push("/bibliothek");
    }
  }

  const Module = ({ item }: { item: MiniModule }) => {
    return (
      <TouchableOpacity
        className="bg-gray-900 rounded-[10px] mx-2 border-gray-800 border-[1px]  items-center justify-between"
        onPress={() => {
          directToModule(item.sessionID);
        }}
      >
        <View
          className={`bg-${item.color?.toLowerCase()}-500 rounded-t-[10px]`}
          style={{
            backgroundColor: returnColor(item.color?.toLowerCase()),
            width: "100%",
            height: 5,
          }}
        />
        <View className="p-3 justify-start">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-[15px]">
              {item.name}
            </Text>
            <VektorCircle
              color={item.color?.toLowerCase() ?? "blue"}
              percentage={item.percent}
              icon={"clock"}
              strokeColor={item.color?.toLowerCase() ?? "blue"}
            />
          </View>
          <Text className="my-1 text-gray-300 font-semibold text-[14px]">
            {item.fragen}
            {t("home.questions")} • {item.sessions} {t("home.sessions")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  async function startQuiz(session: MiniSession) {
    console.log("Starting quiz for session:", session);
    const questions = await getSessionQuestions(session.sessionID);
    if (!questions || questions.length == 0) {
      router.push("/bibliothek");
      return;
    }
    console.log(
      "Elements:",
      session.sessionID,
      "infinite", // infinite, limited, limitedTime, limitedAllCorrect
      "multiple", // single, multiple, questionAnswer
      null, // How many questions should be in the quiz
      null, // Timelimit will be in seconds
      questions[0].subjectID //CHANGE REQUIRED LATER IN PRODUCTION
    );

    router.push({
      pathname: "/quiz",
      params: {
        sessionID: session.sessionID,
        quizType: "infinite", // infinite, limited, limitedTime, limitedAllCorrect
        questionType: "multiple", // single, multiple, questionAnswer
        questionAmount: null, // How many questions should be in the quiz
        timeLimit: null, // Timelimit will be in seconds
        moduleID: questions[0].subjectID,
      },
    });
  }

  const Session = ({ item }: { item: MiniSession }) => {
    return (
      <TouchableOpacity
        className="bg-gray-900 rounded-[10px] p-3 mx-2 border-gray-800 border-[1px]  items-center justify-between"
        onPress={() => startQuiz(item)}
      >
        <View className="flex-row items-center justify-between">
          <View className="items-start  ">
            <Text className="text-white font-bold text-[15px]">
              {item.name}
            </Text>
            <Text className="text-gray-500 font-bold text-[15px]">
              {item.questions} {t("home.questions")}
            </Text>
          </View>
          <View className="p-3">
            <Icon name={item.icon} size={20} color={"white"} />
          </View>
        </View>
        <View className="rounded-full p-2">
          <Text className="text-white font-bold text-[15px]">
            {item.percent}%
          </Text>
        </View>
        <View className="bg-gray-700 rounded-full w-full ">
          <View
            className={` bg-${item.color}-500 rounded-full p-1`}
            style={{
              width: `${item.percent}%`,
              backgroundColor: returnColor(item.color?.toLowerCase() || "blue"),
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  {
    /* Schnelle Aktionen für den Nutzer */
  }
  let quickActions = [
    {
      text: t("home.learnSetKI"),
      colorBorder: "#7a5af8",
      colorBG: "#372292",
      iconName: "bot",
      handlePress: () => setIsVisibleAiModule(true),
    },
    {
      text: t("home.learnSetDiscover"),
      colorBorder: "#20c1e1",
      colorBG: "#0d2d3a",
      iconName: "search",
      handlePress: () => router.push("/entdecken"),
    },
    {
      text: t("home.learnSetCreate"),
      colorBorder: "#4f9c19",
      colorBG: "#2b5314",
      iconName: "cubes",
      handlePress: () => setIsVisibleNewModule(true),
    },
  ];

  const [isVisibleNewModule, setIsVisibleNewModule] = useState(false);

  const QuickAction = ({
    item,
  }: {
    item: {
      text: string;
      colorBorder: string;
      colorBG: string;
      iconName: string;
      handlePress: () => void;
    };
  }) => {
    return (
      <ContinueBox
        text={item.text}
        colorBorder={item.colorBorder}
        colorBG={item.colorBG}
        iconName={item.iconName}
        handlePress={item.handlePress}
        horizontal={ true}
        selected={true}
      />
    );
  };

  const [isVisibleNewAiModule, setIsVisibleAiModule] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="h-full w-full ">
      
      <TokenHeader/>

      <ScrollView
        style={{
          height: "100%",
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // Android
            colors={Platform.OS === "android" ? ["#3b82f6"] : undefined} // blue-500
            progressBackgroundColor={
              Platform.OS === "android" ? "#000" : undefined
            } // gray-200
            // iOS
            tintColor={Platform.OS === "ios" ? "#3b82f6" : undefined}
            title={Platform.OS === "ios" ? t("home.refresh") : undefined}
            titleColor={Platform.OS === "ios" ? "#374151" : undefined} // gray-700
            // Web
            progressViewOffset={Platform.OS === "web" ? 0 : 0}
          />
        }
      >
        <View className="flex-1 rounded-[10px] p-3">
          <Header title={t("home.lastModules")} />
          <ScrollView horizontal={true} className="flex-row">
            {!userUsageP || userUsageP.lastModules.length == 0 ? (
              <View className="flex-1">
                <Module
                  item={{
                    name: t("home.firstModule"),
                    percent: 100,
                    color: "blue",
                    fragen: 10,
                    sessions: 7,
                    sessionID: "default-module-1",
                  }}
                />
              </View>
            ) : (
              userUsageP.lastModules
              .map((item, index) => {
                const miniModule: MiniModule =
                  typeof item === "string" ? JSON.parse(item) : item;
                return <Module key={index} item={miniModule} />;
              })
            )}
          </ScrollView>
          <Header title={t("home.lastSessions")} />
          <ScrollView horizontal={true} className="flex-row">
            {!userUsageP  || userUsageP.lastSessions
              .map((s) => (typeof s === "string" ? JSON.parse(s) : s))
              .filter((s) => s.questions > 0).length == 0 ? (
              <View className="flex-row">
                <Session
                  item={{
                    name: t("home.firstModule"),
                    percent: 100,
                    color: "blue",
                    icon: "cubes",
                    questions: 5,
                    sessionID: "default-session-1",
                  }}
                />
                <Session
                  item={{
                    name: t("home.personalziedProfile"),
                    percent: 100,
                    color: "red",
                    icon: "user",
                    questions: 7,
                    sessionID: "default-session-2",
                  }}
                />
                <Session
                  item={{
                    name: t("home.signUp"),
                    percent: 100,
                    color: "green",
                    icon: "user",
                    questions: 3,
                    sessionID: "default-session-3",
                  }}
                />
              </View>
            ) : (
              userUsageP.lastSessions
                .map((s) => (typeof s === "string" ? JSON.parse(s) : s))
                .filter((s) => s.questions > 0)
                .map((item, index) => {
                  return <Session key={index} item={item} />;
                })
            )}
          </ScrollView>
          <Header title={t("home.quickActions")} />
          <View
            key={selectedLanguage}
            className={` `}
          >
            {quickActions.map((item, index) => {
              return <QuickAction key={index} item={item} />;
            })}
          </View>
        </View>

       
         
      </ScrollView>
      {isVisibleNewAiModule ? (
        <AddAiBottomSheet
          isVisibleAiModule={isVisibleNewAiModule}
          setIsVisibleAiModule={setIsVisibleAiModule}
        />
      ) : null}
      {isVisibleNewModule ? (
        <AddModuleBottomSheet
          isVisibleAiModule={isVisibleNewModule}
          setIsVisibleAiModule={setIsVisibleNewModule}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default HomeGeneral;
