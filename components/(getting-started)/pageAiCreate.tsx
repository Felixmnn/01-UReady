import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import GratisPremiumButton from "../(general)/gratisPremiumButton";
import ModalSessionList from "../(bibliothek)/(modals)/modalSessionList";
import { materialToModule } from "@/functions/(aiQuestions)/materialToModule";
import uuid from "react-native-uuid";
import { useGlobalContext } from "@/context/GlobalProvider";
import * as DocumentPicker from "expo-document-picker";
import {
  addDocumentConfig,
  addDocumentToBucket,
  addDocumentToBucketWeb,
  setUserData,
} from "@/lib/appwriteEdit";
import TutorialFirstAIModule from "../(tutorials)/tutorialFirstAIModule";
import { Session } from "@/types/moduleTypes";
import CreateModule from "../(general)/createModule/createModule";
import { useTranslation } from "react-i18next";
import RenderMaterial from "./aiComponents/renderMaterial";
import MaterialInput from "./aiComponents/materialInput";
import ErrorModal from "./aiComponents/errorModal";
import QuestionSettings from "./aiComponents/questionSettings";
import {
  module,
  userData,
  userDataKathegory,
  UserUsage,
} from "@/types/appwriteTypes";
import Offline from "../(general)/offline";

type Items = {
  type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
  content: string;
  uri: string | null;
  sessionID: string | null;
  id: string | null;
}[];

const PageAiCreate = ({
  newModule,
  userData,
  setNewModule,
  setUserChoices,
  setIsVisibleModal,
  tutorialStep = 10,
  setTutorialStep = null,
  goBackVisible = true,
  calculatePrice = false,
}: {
  newModule: module;
  userData: UserUsage | null;
  setNewModule: any;
  setUserChoices: any;
  setIsVisibleModal: any;
  tutorialStep?: number;
  setTutorialStep?: any;
  goBackVisible?: boolean;
  calculatePrice?: boolean;
}) => {
  // Lokale
  const { t } = useTranslation();

  const { user, reloadNeeded, setReloadNeeded, userUsage, setUserUsage, isOffline } = useGlobalContext();
  const [questions, setQuestions] = useState<any[]>([]);
  const [sessions, setSessions] = useState<Session[]>([
    {
      title: "S1",
      percent: 0,
      color: "blue",
      iconName: "book",
      questions: 0,
      description: "",
      tags: [],
      id: Math.random().toString(36).substring(7),
      generating: false,
    },
  ]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(true);

  const [selectedSession, setSelectedSession] = useState<Session | null>({
    title: "S1",
    percent: 0,
    color: "blue",
    iconName: "book",
    questions: 0,
    description: "string",
    tags: [],
    id: Math.random().toString(36).substring(7),
    generating: false,
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Material-Auswahl
  const [selectedMaterialType, setSelectedMaterialType] = useState<
    "PEN" | "TOPIC" | "FILE" | "QUESTION"
  >("PEN");
  const [newitem, setNewItem] = useState<{
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string;
    id: string | null;
  }>({
    type: "PEN",
    content: "",
    uri: null,
    sessionID: sessions[0]?.id ?? "", // Default to first session id or empty string
    id: null,
  });
  const [items, setItems] = useState<Items>([]);

  const tempModuleID = uuid.v4();
  const tempSessionID = uuid.v4();

  /**
   * File Upload Funktion
   * Currently only supports PDF files
   */
  async function handleFileUpload() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (res.canceled) return;

      const file = res.assets[0];

      if (
        file.mimeType !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setErrorMessage(t("createModule.onlyPdf"));
        setIsError(true);
        return;
      }

      const doc = {
        title: file.name,
        subjectID: tempModuleID,
        sessionID: tempSessionID,
        id: uuid.v4(),
        type: file.mimeType || "application/pdf",
        uploaded: false,
      };

      const appwriteRes = await addDocumentConfig(doc);

      // Step 3 - Read the file differently based on platform
      let fileBlob;
      let uploadRes;
      if (Platform.OS === "web") {
        // ✅ Web: fetch URI as Blob
        fileBlob = await fetch(file.uri).then((res) => res.blob());
        const data = {
          id: doc.id,
          file: fileBlob,
        };

        uploadRes = await addDocumentToBucketWeb(data);
      } else {
        // ✅ Native: pass file as { uri, name, type }
        fileBlob = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
          size: file.size,
        };
        uploadRes = await addDocumentToBucket(doc.id, fileBlob);
      }

      return;
    } catch (error) {
      if (__DEV__) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  const handleDeleteItem = (itemId: string | null) => {
    if (itemId === null) return;
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  /**
   * useEffect um sicherzsutellen, dass der Nutzer immer eine ausgewählte Sitzung hat
   */
  useEffect(() => {
    if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions]);

  function calculateTotalPrice() {
    let totalPrice = 0;
    items.forEach((item) => {
      if (item.type === "PEN") {
        totalPrice += 1;
      } else if (item.type === "TOPIC") {
        totalPrice += 1;
      } else if (item.type === "FILE") {
        totalPrice += 3;
      } else {
        totalPrice += 1;
      }
    });
    return totalPrice;
  }

  async function generateModule() {
    if (newModule.name.length < 2) {
      setErrorMessage(t("createModule.errorMissingName"));
      setIsError(true);
      return;
    } else if (items.length < 1) {
      setErrorMessage(t("createModule.errorMissingSessions"));
      setIsError(true);
      return;
    } else if (
      !sessions.every((session) =>
        items.some((item) => item.sessionID == session.id)
      )
    ) {
      setErrorMessage(t("createModule.errorMissingSessionsContent"));
      setIsError(true);
      return;
    } else if (
      userData &&
      (!userData || calculateTotalPrice() > userData.energy) &&
      calculatePrice
    ) {
      setErrorMessage(t("createModule.noEnergy"));
      setIsError(true);
      return;
    }
    // Map local question type to expected type for materialToModule
    const mapQuestionType = (
      type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "TEXT"
    ): "MULTIPLE" | "SINGLE" | "QA" => {
      switch (type) {
        case "MULTIPLE_CHOICE":
          return "MULTIPLE";
        case "SINGLE_CHOICE":
          return "SINGLE";
        case "TEXT":
          return "QA";
        default:
          return "MULTIPLE";
      }
    };

    await materialToModule({
      user,
      newModule,

      material: items,
      sessions: sessions.map((session) => ({
        ...session,
        tags: Array.isArray(session.tags)
          ? session.tags
          : [],
      })),
      setSessions,
      setLoading,
      reloadNeeded,
      setReloadNeeded,
      setIsVisibleModal,
      questionOptions: {
        questionsType: mapQuestionType(questionOptions.questionsType),
        amountOfAnswers: [2, 3, 4, 5, 6].includes(
          questionOptions.amountOfAnswers
        )
          ? (questionOptions.amountOfAnswers as 2 | 3 | 4 | 5 | 6)
          : 4,
      },
    });
    if (userData) {
      setUserUsage({
              ...userUsage,
              energy: userUsage.energy - calculateTotalPrice(),
            });
    }
  }

  const addItem = () => {
    if (!selectedSession) return;
    setItems([
      ...items,
      {
        ...newitem,
        id: uuid.v4(),
        sessionID: selectedSession.id,
        type: newitem.type as "PEN" | "TOPIC" | "FILE" | "QUESTION",
      },
    ]);
    setNewItem({ ...newitem, content: "", sessionID: selectedSession.id });
  };

  const [moreOptions, setMoreOptions] = useState(false);

  const [questionOptions, setQuestionOptions] = useState<{
    questionsType: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "TEXT";
    amountOfAnswers: number;
  }>({
    questionsType: "MULTIPLE_CHOICE",
    amountOfAnswers: 4,
  });


  if (isOffline) return <Offline/>
  return (
    <ScrollView
      className={`flex-1 bg-gray-900 p-3   rounded-[10px] `}
      style={{
        width: "100%",
        elevation: 20,
      }}
    >
      <ErrorModal
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
      <ModalSessionList
        sessions={sessions}
        setSessions={setSessions}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <TutorialFirstAIModule
        isVisible={tutorialVisible}
        setIsVisible={setTutorialVisible}
        setTutorialStep={setTutorialStep}
        tutorialStep={tutorialStep}
      />
      <View className="w-full">
        <CreateModule
          newModule={{
            ...newModule,
            releaseDate:
              typeof newModule.releaseDate === "string"
                ? newModule.releaseDate
                : newModule.releaseDate &&
                    (newModule.releaseDate as any) instanceof Date
                  ? (newModule.releaseDate as Date).toISOString()
                  : "",
          }}
          setUserChoices={setUserChoices}
          setNewModule={setNewModule}
          sessions={sessions}
          setSessions={setSessions}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          goBackVisible={goBackVisible}
          hideCreateButton={true}
          setSelectedSession={setSelectedSession}
        />
      </View>
      <View className=" m-2">
        <MaterialInput
          addItem={addItem}
          selectedMaterialType={selectedMaterialType}
          setSelectedMaterialType={setSelectedMaterialType}
          newitem={newitem}
          setNewItem={setNewItem}
          items={items}
          handleDeleteItem={handleDeleteItem}
          selectedSession={
            selectedSession
              ? {
                  id: selectedSession.id,
                  title: selectedSession.title,
                  description: selectedSession.description,
                  moduleID: null,
                  createdAt: "",
                  updatedAt: "",
                }
              : null
          }
          handleFileUpload={handleFileUpload}
          fileList={items
            .filter((item) => item.type === "FILE")
            .map((item) => ({
              title: item.content,
              id: item.id ?? "",
            }))}
          setItems={setItems}
        />

        {moreOptions && (
          <QuestionSettings
            questionOptions={questionOptions}
            setQuestionOptions={setQuestionOptions}
          />
        )}

        <TouchableOpacity>
          <Text
            className="text-gray-400 font-semibold text-[15px] mb-2"
            onPress={() => setMoreOptions(!moreOptions)}
          >
            {moreOptions
              ? t("createModule.lessOptions")
              : t("createModule.moreOptions")}
          </Text>
        </TouchableOpacity>

        <RenderMaterial
          items={items}
          selectedSession={selectedSession}
          setNewItem={setNewItem}
          newitem={newitem}
        />
        <GratisPremiumButton
          aditionalStyles="w-full rounded-lg mx-3  bg-blue-500"
          handlePress={async () => generateModule()}
          active={false}
        >
          
          {loading ? (
            <ActivityIndicator size="small" color="#4B5563" />
          ) : !calculatePrice ? (
            <Text className="text-gray-300 font-semibold text-[15px]">
              {t("createModule.generateModule")}
            </Text>
          ) : (
            <View className="flex-row items-center">
              <Text className="text-white  font-semibold text-[15px] ">
                {t("singleModule.generateModuleFor")} {calculateTotalPrice()}
              </Text>
              <Icon name="bolt" size={15} color="white" className="mx-1 mt-1" />
              <Text className="text-white  font-semibold text-[15px]  mb-[1px]">
                {t("singleModule.energy")}
              </Text>
            </View>
          )}
        </GratisPremiumButton>
      </View>
    </ScrollView>
  );
};

export default PageAiCreate;
