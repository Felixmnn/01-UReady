import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Selectable from "../selectable";
import { Session } from "@/types/moduleTypes";
import { module, note, question } from "@/types/appwriteTypes";
import { useTranslation } from "react-i18next";
import { updateModuleData } from "@/lib/appwriteUpdate";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getQuestionsFromMMKV } from "@/lib/mmkvFunctions";
import BotWaiting from "@/components/(signUp)/botWaiting";
import { getPublicProfile, updatePublicProfile } from "@/lib/collections/publicProfile";
import QuestionListSection from "./dataParts/QuestionListSection";
import DocumentListSection from "./dataParts/DocumentListSection";
import NoteListSection from "./dataParts/NoteListSection";
import MissingAreaChecklistSection from "./dataParts/MissingAreaChecklistSection";
import CustomButton from "@/components/(general)/customButton";
import { getMissingAreaDefaults, missingAreaPlaceholderValues } from "@/lib/missingAreaDefaults";


type AppwriteDocument = {
  $id: string;
  title: string;
  fileType: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
  databucketID: string;
  status: string;
  textChunks?: string[];  
};

type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";

const Data = ({
  addDocumentJobSheetRef,
  setSelectedFile,
  setIsVisibleEditQuestion,
  setQuestionToEdit,
  onRefresh,
  refreshing,
  selected,
  moduleSessions,
  questions,
  notes,
  documents,
  deleteDocument,
  module,
  addDocument,
  setIsVisibleNewQuestion,
  SwichToEditNote,
  selectedSessionID: 
  selectedS,
  setModule,
  setQuestions,
  selectAi ,
  selectedSession,
  loadingQuestionsDone,
  showRewardToast,
  setShowRewardToast,
}: {
  addDocumentJobSheetRef: React.RefObject<any>;
  setSelectedFile: React.Dispatch<React.SetStateAction<AppwriteDocument | null>>;
  selectedSession: Session | null;
  setQuestions: React.Dispatch<React.SetStateAction<question[]>>;
  setIsVisibleEditQuestion: React.Dispatch<
    React.SetStateAction<{ state: boolean; status: "ADD" | "EDIT" }>
  >;
  isVisibleEditQuestion: { state: boolean; status: "ADD" | "EDIT" };
  setQuestionToEdit: React.Dispatch<React.SetStateAction<any>>;
  onRefresh: () => void;
  setSelectedScreen: React.Dispatch<
    React.SetStateAction<ScreenType>
  >;
  refreshing: boolean;
  selected: number;
  moduleSessions: Session[];
  questions: question[];
  notes: note[];
  documents: AppwriteDocument[];
  deleteDocument: (
    id: string,
    type?: "question" | "note" | "document"
  ) => Promise<void>;
  module: module;
  addDocument: () => void;
  setIsVisibleNewQuestion: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisibleAI: React.Dispatch<React.SetStateAction<boolean>>;
  SwichToEditNote: (noteID: string | null) => void;
  selectedLanguage: string;
  selectedSessionID: string;
  setModule: React.Dispatch<React.SetStateAction<module>>;
  selectAi : () => void;
  loadingQuestionsDone: boolean;
  showRewardToast: boolean;
  setShowRewardToast: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { width } = useWindowDimensions();
  const questionsInMMKV = module.$id ? getQuestionsFromMMKV(module.$id ? module.$id : "").length : -1
  const { isOffline , userUsage, setUserUsage, user } = useGlobalContext()
    const { t } = useTranslation();
  const [optionsVisible, setOptionsVisible] = useState<string[]>([]);
  const [isRewardApplying, setIsRewardApplying] = useState(false);
  const rewardAppliedRef = React.useRef<Set<string>>(new Set());
  const previousAllDoneRef = React.useRef(false);
  function handleOptionsVisibility(id = "") {
    if (optionsVisible.includes(id)) {
      setOptionsVisible(optionsVisible.filter((item) => item !== id));
    } else {
      if (optionsVisible.length > 0) {
        setOptionsVisible([]);
      } else {
        setOptionsVisible([...optionsVisible, id]);
      }
    }
  }

  //To ensure that the question status is displayed correctly, it is loaded from the module configuration
  //and added to the question object
  const filtered =
    selected > moduleSessions.length
      ? questions
      : questions.filter(
          (item) => item.sessionID == moduleSessions[selected]?.id
        );
  type ParsedQuestion = {
    id?: string;
    status?: string;
    [key: string]: any;
  };

  const questionListWithParsedItems = module.questionList.map((i) => {
    let pI: ParsedQuestion | string = i;
    try {
      pI = JSON.parse(i) as ParsedQuestion;
    } catch (e) {
      pI = { id: undefined, status: undefined };
    }
    return pI;
  });
  
  const filteredData = filtered.map((item) => {
    return {
      ...item,
      status:
        (() => {
          const found = questionListWithParsedItems.find(
            (question) =>
              typeof question === "object" &&
              question !== null &&
              "id" in question &&
              (question as ParsedQuestion)?.id === item.$id
          );
          return typeof found === "object" && found !== null && "status" in found
            ? (found as ParsedQuestion).status
            : null;
        })(),
    };
  });

  //Filter the notes and documents based on the selected session
  const filteredNotes =
    selected > moduleSessions.length
      ? notes
      : notes.filter((item) => item.sessionID == moduleSessions[selected]?.id);
  const filteredDocuments =
    selected > moduleSessions.length
      ? documents
      : documents.filter(
          (item) => item.sessionID == moduleSessions[selected]?.id
        );
  const [wrongType, setWrongType] = useState(false);
  const missingAreaDefaults = getMissingAreaDefaults(t);

  const checklistStatus = React.useMemo(() => {
    const normalizedModuleName = (module?.name ?? "").trim();
    const normalizedModuleDescription = (module?.description ?? "").trim();

    const defaultModuleNames = missingAreaPlaceholderValues.moduleNames;
    const defaultModuleDescriptions = missingAreaPlaceholderValues.moduleDescriptions;

    const isModuleNameDone =
      normalizedModuleName.length > 0 &&
      !defaultModuleNames.includes(normalizedModuleName);
    const isModuleDescriptionDone =
      normalizedModuleDescription.length > 0 &&
      !defaultModuleDescriptions.includes(normalizedModuleDescription);

    const parsedSessions = (module?.sessions ?? []).map((sessionItem) => {
      try {
        return typeof sessionItem === "string" ? JSON.parse(sessionItem) : sessionItem;
      } catch {
        return null;
      }
    });

    const defaultSessionTemplates = missingAreaPlaceholderValues.sessionTemplates;

    const isSessionInfoDone =
      parsedSessions.length >= defaultSessionTemplates.length &&
      defaultSessionTemplates.every((template, index) => {
        const currentSession = parsedSessions[index] as
          | { title?: string; description?: string }
          | null;

        if (!currentSession) return false;

        const title = (currentSession.title ?? "").trim();
        const description = (currentSession.description ?? "").trim();

        return (
          title.length > 0 &&
          description.length > 0 &&
          !template.titles.includes(title) &&
          !template.descriptions.includes(description)
        );
      });

    const isQuestionsDone = module.questionList.length >= 20;

    return {
      isModuleNameDone,
      isModuleDescriptionDone,
      isSessionInfoDone,
      isQuestionsDone,
      allDone:
        isModuleNameDone &&
        isModuleDescriptionDone &&
        isSessionInfoDone &&
        isQuestionsDone,
    };
  }, [module]);
  const applyRewards = async (rewardKey: string) => {
      try {
        rewardAppliedRef.current.add(rewardKey);
        setIsRewardApplying(true);
        if (userUsage) {
          setUserUsage({
            ...userUsage,
            energy: userUsage.energy + 10,
          });
        }
        if (user?.$id) {
          const profile = await getPublicProfile(user.$id);
          if (profile) {
            const currentBadges = Array.isArray(profile.badges) ? profile.badges : [];
            if (!currentBadges.includes("DOER")) {
              await updatePublicProfile({
                ...profile,
                badges: [...currentBadges, "DOER"],
              });
            }
          }
        }
        const updatedTags = (module.tags ?? []).filter((tag) => tag !== "MISSING_AREA");
        if (module.$id) {
          await updateModuleData(module.$id, {
            ...(module as any),
            tags: updatedTags,
          } as any);
        }
          setModule({
            ...module,
            tags: updatedTags,
          });
          setShowRewardToast(true);
      } catch (error) {
        rewardAppliedRef.current.delete(rewardKey);
        if (__DEV__) {
          console.error("Error applying MISSING_AREA rewards:", error);
        }
      } finally {
        setIsRewardApplying(false);
      }
    };

  React.useEffect(() => {
    const rewardKey = module.$id ?? `${module.name}-${module.releaseDate}`;
    const justCompleted = !previousAllDoneRef.current && checklistStatus.allDone;
    previousAllDoneRef.current = checklistStatus.allDone;

    if (!module?.tags?.includes("MISSING_AREA")) return;
    if (!justCompleted) return;
    if (isRewardApplying) return;
    if (rewardAppliedRef.current.has(rewardKey)) return;

    applyRewards(rewardKey);
  }, [
    checklistStatus.allDone,
    isRewardApplying,
    module?.$id,
    module?.name,
    module?.releaseDate,
    module?.tags,
  ]);

  React.useEffect(() => {
    if (!showRewardToast) return;
    const timeout = setTimeout(() => {
      setShowRewardToast(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showRewardToast]);

  /**
   * Unused component to show the upload status of the file
   */
  const NichtUnterstuzterDateityp = () => {
    return (
      <Modal animationType="fade" transparent={true} visible={wrongType}>
        <TouchableOpacity
          onPress={() => setWrongType(false)}
          className="flex-1 items-center justify-start mt-10"
        >
          <View className="bg-red-800 p-4 rounded-[10px]">
            <Text className="text-white">
              {t("data.unsupported")}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  return (
    <View className="flex-1">
      <Modal
              animationType="fade"
              transparent={true}
              visible={showRewardToast}
              statusBarTranslucent={true}
              presentationStyle="overFullScreen"
              onRequestClose={() => setShowRewardToast(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowRewardToast(false)}
                className="flex-1 items-center justify-start pt-8 mt-5"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
              >
                <View
                  className="w-[92%] rounded-2xl p-4"
                  style={{
                    borderWidth: 2,
                    borderColor: "#8b720d",
                    backgroundColor: "rgba(48, 39, 8, 0.96)",
                  }}
                >
                  <View className="mb-2 flex-row items-center justify-center">
                    <Text className="text-[15px] font-bold" style={{ color: "white" }}>
                      {missingAreaDefaults.rewardToastTitle}
                    </Text>
                  </View>

                  <View className="w-full items-center flex-row justify-center mb-2">
                    <Text className="text-xl font-bold" style={{ color: "#FBBF24", fontWeight: "bold" }}>
                      {(userUsage?.energy ?? 0) - 10} {" -> "} {userUsage?.energy ?? 0}
                    </Text>
                    <View className="ml-1 mr-1">
                      <Icon name="bolt" size={18} color="#FBBF24" />
                    </View>
                  </View>
                  <View className="w-full items-center flex-row justify-center">
                  <View
                    style={{
                      backgroundColor: "#92400E",
                      borderColor: "#FACC15",
                      borderWidth: 2,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 9999,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text style={{ color: "white" }} className="text-sm font-medium">
                      {missingAreaDefaults.badgeLabel}
                    </Text>
                  </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
      {module.tags?.includes("MISSING_AREA") && <MissingAreaChecklistSection checklistStatus={checklistStatus} setShowRewardToast={setShowRewardToast} />}
      <NichtUnterstuzterDateityp />
      {filteredData.length == 0 &&
      filteredDocuments.length == 0 &&
      filteredNotes.length == 0 ?
      
      
      (
        <ScrollView>
          {
            loadingQuestionsDone == false &&
            !isOffline && questionsInMMKV == 0 && module.questionList.length != 0 ?
            <BotWaiting 
            message={".."}
            amountOfQuestions={module.questionList.length}
          />
          :

          
          <View className="flex-1">
            { (!isOffline ) && 
            <Selectable
              icon={"robot"}
              iconColor={"#7a5af8"}
              bgColor={"bg-[#372292]"} 
              title={t("data.aiQuiz")}
              empfolen={false}
              handlePress={() => selectAi()}
            />}
             <Selectable
              icon={"file-alt"}
              iconColor={"#338723ff"} 
               bgColor={"bg-[#89ea00ff]"} 
              title={t("data.crtQuestio")}
              empfolen={false}
              handlePress={() => {
                setIsVisibleEditQuestion({
                  state: true,
                  status: "ADD",
                });
              }}
            />
            {!isOffline &&
            <Selectable
               icon={"file-pdf"} 
                iconColor={"#004eea"}
              bgColor={"bg-[#00359e]"}
               title={t("bibliothek.addDocument")} 
               empfolen={false} 
               handlePress={()=> {addDocument()}}/>
          }
           
            <Selectable
              icon={"sticky-note"}
              iconColor={"#15b79e"}
              bgColor={"bg-[#134e48]"}
              title={t("data.crtNote")}
              empfolen={false}
              handlePress={() => {
                SwichToEditNote(null);
              }}
            />
          </View>
          }


        </ScrollView>
      ) : (
        <ScrollView
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
              title={Platform.OS === "ios" ? t("bibliothek.refresh"): undefined}
              titleColor={Platform.OS === "ios" ? "#374151" : undefined} // gray-700
              // Web
              progressViewOffset={Platform.OS === "web" ? 0 : 0}
            />
          }
        >
          <View className="flex-1">

            <QuestionListSection
              t={t}
              moduleSessions={moduleSessions}
              selected={selected}
              questions={questions}
              setIsVisibleNewQuestion={setIsVisibleNewQuestion}
              module={module}
              selectedS={selectedS}
              selectedSession={selectedSession}
              userUsage={userUsage}
              setUserUsage={setUserUsage}
              setIsVisibleEditQuestion={setIsVisibleEditQuestion}
              deleteDocument={deleteDocument}
              optionsVisible={optionsVisible}
              handleOptionsVisibility={handleOptionsVisibility}
              setQuestionToEdit={setQuestionToEdit}
              setQuestions={setQuestions}
              setModule={setModule}
            />
            {isOffline ? null : (
              <DocumentListSection
                t={t}
                selectedS={selectedS}
                filteredDocuments={filteredDocuments}
                documents={documents}
                width={width}
                setSelectedFile={setSelectedFile}
                addDocumentJobSheetRef={addDocumentJobSheetRef}
                deleteDocument={deleteDocument}
                addDocument={addDocument}
              />
            )}
            <NoteListSection
              t={t}
              selectedS={selectedS}
              filteredNotes={filteredNotes}
              notes={notes}
              SwichToEditNote={SwichToEditNote}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Data;
