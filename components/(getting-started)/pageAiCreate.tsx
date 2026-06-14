import {
  View,
  Text,
  ScrollView,
  Platform,
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
  setUserDataSetup,
} from "@/lib/appwriteEdit";
import TutorialFirstAIModule from "../(tutorials)/tutorialFirstAIModule";
import { Session } from "@/types/moduleTypes";
import CreateModule from "../(general)/createModule/createModule";
import { useTranslation } from "react-i18next";
import RenderMaterial from "./aiComponents/renderMaterial";
import MaterialInput from "./aiComponents/materialInput";
import ErrorModal from "./aiComponents/errorModal";
import LoadingProgressBar from "@/components/(general)/loadingProgressBar";
import {
  module,
  UserUsage,
} from "@/types/appwriteTypes";
import Offline from "../(general)/offline";
import RobotWihtMessage from "../(tutorials)/robotMessage";
import ProgressBar from "../(signUp)/(components)/progressBar";

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
  setTutorialStep,
  goBackVisible = true,
  calculatePrice = false,
}: {
  newModule: module;
  userData: UserUsage | null;
  setNewModule: React.Dispatch<React.SetStateAction<module>>;
  setUserChoices: React.Dispatch<React.SetStateAction<"GENERATE" | "DISCOVER" | "CREATE" | null>>;
  setIsVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  tutorialStep?: number;
  setTutorialStep: React.Dispatch<React.SetStateAction<number>>;
  goBackVisible?: boolean;
  calculatePrice?: boolean;
}) => {
  // Lokale
  const { t } = useTranslation();
  const { remainingTutorialSteps, setRemainingTutorialSteps } = useGlobalContext();
  const { user, reloadNeeded, setReloadNeeded, userUsage, setUserUsage, isOffline, setUserData,userCathegory } = useGlobalContext();
  console.log("User Cathegory: ", userCathegory.kategoryType);
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
        questionsType: "MULTIPLE",
        amountOfAnswers: 4
      },
    });
    if (userData) {
      setUserUsage({
              ...userUsage,
              energy: userUsage.energy - calculateTotalPrice(),
            });
    }
    const res = await setUserDataSetup(user.$id)
    if (res) setUserData(res);
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



  if (isOffline) return <Offline/>


  useEffect(() => {
    console.log("Tutorial Step: ", tutorialStep, newModule.name, newModule.description);
    if (tutorialStep == 2) {
      if (newModule.name.length > 2) {
        setTutorialVisible(true);
      }
      setRemainingTutorialSteps(["STUDY_A_SET"]);
    }
  }, [newModule, tutorialStep]);

  const [ showNext, setShowNext ] = useState(false);

  return (
    <ScrollView
      className={`flex-1 bg-gray-900 p-3   rounded-[10px] `}
      style={{
        width: "100%",
        elevation: 20,
      }}
    >
      <ProgressBar
        percent={tutorialStep > 2 && items.length > 0 ? 100 : tutorialStep > 2 ? 66 : 33}
        handlePress={() => {}}
        hideGoBack={true} 
        />
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
        isVisible={(tutorialVisible && tutorialStep < 2) || (tutorialStep == 2 && newModule.name.length > 2 && showNext) || loading}
        setIsVisible={setTutorialVisible}
        setTutorialStep={setTutorialStep}
        tutorialStep={tutorialStep}
        loading={loading}
        descriptionAndNameFilled={newModule.name.length > 2 && showNext}
      />
      <View className="w-full flex-1">
        <CreateModule
        categoryType={userCathegory.kategoryType ? userCathegory.kategoryType : "SCHOOL"}
        isTutorial={true}
        tutorialStep={tutorialStep}
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
          setShowNext={setShowNext}
          showNext={showNext}
        />
      </View>
      
      { tutorialStep > 2 ? (
      <View className="">
        <MaterialInput
          categoryType={userCathegory.kategoryType ? userCathegory.kategoryType : "SCHOOL"}

          isTutorial={true}
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
        <RenderMaterial
          items={items}
          selectedSession={selectedSession}
          setNewItem={setNewItem}
          newitem={newitem}
        />
        { items.length > 0 && (
        <GratisPremiumButton
          aditionalStyles="w-full rounded-lg mx-3  bg-blue-500"
          handlePress={async () => generateModule()}
          active={false}
        >
          
          {loading ? ( 
            <LoadingProgressBar active={loading} />
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
        )}
      </View>
      ) : null} 
    </ScrollView>
  );
};

export default PageAiCreate;
