import { View, Text, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import RoadMap from "../(sections)/roadMap";
import Data from "../(sections)/data";
import Header from "../(sections)/header";
import SwichTab from "../../(tabs)/swichTab";
import {
  addDocumentConfig,
  addDocumentToBucket,
  addDocumentToBucketWeb,
  addNote,
  removeDocumentConfig,
  removeQuestion,
  updateDocumentConfig,
  updateModule,
} from "@/lib/appwriteEdit";
import uuid from "react-native-uuid";
import * as DocumentPicker from "expo-document-picker";
import {
  getAllDocuments,
  getAllQuestionsByIds,
  getSessionNotes,
} from "@/lib/appwriteQuerys";
import { updateModuleData } from "@/lib/appwriteUpdate";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import { loadModule } from "@/lib/appwriteDaten";
import ChangeQuestions from "../(modals)/changeQuestion";
import { CustomBottomSheetRef } from "../(bottomSheets)/customBottomSheet";
import NewQuestionSheet from "../(bottomSheets)/newQuestionSheet";
import NewAiQuestionsSheet from "../(bottomSheets)/newAiQuestionsSheet";
import StartQuizSheet from "../(bottomSheets)/startQuizSheet";
import SessionListSheet from "../(bottomSheets)/sessionListSheet";
import {  note, question } from "@/types/appwriteTypes";
import { Session } from "@/types/moduleTypes";
import { useTranslation } from "react-i18next";
import { getUnsavedModulesFromMMKV, getQuestionsFromMMKV, saveQuestionsToMMKV, saveNotesToMMKV, getNotesFromMMKV, addDocumentConfigToMMKV, saveDocumentConfigsToMMKV, getDocumentConfigsFromMMKV, removeDocumentConfigFromMMKV } from "@/lib/mmkvFunctions";
import AddDocumentJobSheet from "../(bottomSheets)/addDocumentJob";
import { checkMMKVNoteDocumentListRefreshTimestampExpiry, checkMMKVQuestionListRefreshTimestampExpiry, setMMKVLastNoteDocumentListRefreshTimestamp, setMMKVLastQuestionListRefreshTimestamp } from "@/lib/mmkvUpdateTimestamps";
import { sendTextExtractionRequest } from "@/lib/appwriteFunctions";
import { templateQuestionsCA,templateNotesCA,templateDocumentsCA,sessionDataTitle,moduleData } from '@/lib/exampleData';

type QuestionListItem = {
  id: string;
  status: null | "BAD" | "OK" | "GOOD" | "GREAT";
}
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


/**
 * The SingleModule Component is responsible for rendering the deatils of a single module.
 * @param setSelectedScreen - Is used to navigate on the bibliothek screen. Between the different modules.
 * @param moduleEntry - The module entry is the currently selected module.
 */
type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";

const SingleModule = ({
  setSelectedScreen,
  moduleEntry,
  modules,
  setModules,
}: {
  setSelectedScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
  moduleEntry: any;
  modules: any;
  setModules: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { t } = useTranslation();
  {
    /* Dimensions and Window Measurements */
  }
  const [loadingQuestionsDone, setLoadingQuestionsDone] = useState(false);
  const { width } = useWindowDimensions();
  const isVertical = width > 700;
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  function reverseToManyStringifyActions(array: any[]) {
    return array.map((item) => {
      try {
        let result = item;
        while (typeof result === "string") {
          try {

            result = JSON.parse(result);
          } catch (e) {
            break;
          }
        }
        return result;
      } catch (error) {
        if (__DEV__) {
        console.error("Error parsing item:", item, error);
        }
        return item; // Return the original item if parsing fails
      }
    });
  }
  {
    /* Relevant Data - Modules $ Sessions */
  }
  const [module, setModule] = useState({
    ...moduleEntry,
    questionList: Array.isArray(moduleEntry.questionList) ? reverseToManyStringifyActions(moduleEntry.questionList) : [],
  });
  const [selectedSession, setSelectedSession] = useState(0);
  const [questions, setQuestions] = useState<question[]>(getQuestionsFromMMKV(module.$id));
  
  const parsedSessions = Array.isArray(module.sessions)
  ? module.sessions.map((session: string) => {
      try {
        return JSON.parse(session);
      } catch (e) {
        if (__DEV__) {
          console.error("Error parsing session:", session, e);
        }
        return session;
      }
    })
  : [];
  const [sessions, setSessions] = useState(parsedSessions);

  const [notes, setNotes] = useState<note[] | []>(sessions && sessions.length > selectedSession && sessions[selectedSession]?.id ? getNotesFromMMKV(sessions[selectedSession].id) : []);
  const [documents, setDocuments] = useState<AppwriteDocument[]>(sessions && sessions.length > selectedSession && sessions[selectedSession]?.id ? getDocumentConfigsFromMMKV(sessions[selectedSession].id) : []);

  const useScreenshotTemplateCA = true;
  const screenshotSessionId = sessions[selectedSession]?.id || "ALL";
  const screenshotModuleId = module?.$id || "demo-module-ca-1";
  const algebraSessionId = sessions[0]?.id || screenshotSessionId;
  const analysisSessionId = sessions[1]?.id || screenshotSessionId;
  const stochastikSessionId = sessions[2]?.id || screenshotSessionId;

  console.log(sessions[selectedSession]?.id, module?.$id,sessions[0]?.id,sessions[1]?.id, )

  const displayQuestions = useScreenshotTemplateCA ? templateQuestionsCA : questions;
  const displayNotes = useScreenshotTemplateCA ? templateNotesCA : notes;
  const displayDocuments = useScreenshotTemplateCA ? templateDocumentsCA : documents;
  const displayModule = useScreenshotTemplateCA
    ? {
        ...module,
        name: moduleData.name,
        description: moduleData.description,
      }
    : module;
  const displaySessions = useScreenshotTemplateCA
    ? sessions.map((session: Session, index: number) => ({
        ...session,
        title:
          sessionDataTitle[
            index
          ] || `Lernsitzung ${index + 1}`,
      }))
    : sessions;

  {
    /* Language and Texts */
  }
  const [selectedLanguage, setSelectedLanguage] = useState("DEUTSCH");
  const { language } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);


  //____________________________________________________________Ende der Variablen____________________________________________________________

  


  /**
   * This function updates the sessions each time the sessions change.
   * The sessions are each stored as a JSON string in the module.
   */
  useEffect(() => {
    if (!module) return;
    const locallySavedQuestionLists = getUnsavedModulesFromMMKV();
    let newQuestionList = typeof module.questionList[0] === "string" ? module.questionList : module.questionList.map((q: any) => JSON.stringify(q))
    if (locallySavedQuestionLists.some((qL) => qL.moduleID === module.$id)) {
    const locallySavedList = locallySavedQuestionLists.find(
      (qL) => qL.moduleID === module.$id
    );

    if (locallySavedList) {
       newQuestionList = locallySavedList.items
      
    }
  }
    
    setModule({
      ...module,
      questionList: newQuestionList
    })
    async function updateModuleLocal() {
      const newModule = {
        ...module,
        sessions: sessions.map((session: string) => JSON.stringify(session)),
        quesitonList:newQuestionList,
      };
      await updateModule(newModule);
    }
    updateModuleLocal();
  }, [sessions]);

  const [questionLoadedSessions, setQuestionLoadedSessions] = useState<
    string[]
  >([]);
  /**
   * The Function recives a Array of Questions and calcultes how many percent are null, good, bad, ok or great.
   *
   * @param {Array} questions - Array of question objects.
   */
  function calculatePercent(questions: question[]) {
    let points = 0;
    if (!questions || questions.length === 0) return 100;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].status === "BAD") {
        points -= 1;
      } else if (questions[i].status === "GOOD") {
        points += 1;
      } else if (questions[i].status === "GREAT") {
        points += 1.5;
      } else if (questions[i].status === "OK") {
        points += 0.5;
      }
    }
    const percent = Math.round((points / questions.length) * 100);
    return isNaN(percent) ? 0 : percent < 0 ? 0 : percent > 100 ? 100 : percent;
  }



  async function repairQuestionListAndNotes() {
    const notes = getNotesFromMMKV(module.$id);

    const questions = getQuestionsFromMMKV(module.$id);
    const parsedList = reverseToManyStringifyActions(module.questionList);
    const listFormat = questions.map((item) => {
      return {
        id: item.$id,
        status: null,
      };
    })
    const listFormatFiltered = listFormat.filter((q) => parsedList.every((pl) => pl.id !== q.id));

    if (listFormatFiltered.length > 0) {
      const newQuestionList = [...parsedList, ...listFormatFiltered];
    } 
    await updateModuleData(module.$id, {
      ...module,
      questionList: [...parsedList, ...listFormatFiltered].map((item) => JSON.stringify(item)),
      questions: questions.length,
      notes: notes.length,
    });
  }

  repairQuestionListAndNotes();

  //_____________________________________________________________When Selected Session Changes_____________________________________________________________
 


  function ensureQuestionListIsParsed(questionList: string[] | QuestionListItem[]): QuestionListItem[] {
    try {
      return questionList.map((item) => {
        if (typeof item === "string") {
          return JSON.parse(item);
        }
        return item;
      });
    } catch (error) {
      return []
    }}
  function checkIfOldQuestionsEqualNewQuestions(oldList: any[], newList: any[]) {
    if (oldList.length !== newList.length) return false;
    for (let i = 0; i < oldList.length; i++) {
      if (oldList[i].id !== newList[i].id) return false;
    }
    return true;
  }
  /**
   * From now on, the questions will only be fetched from the QuestionList.
   * This ensures that only the questions that are actually in the module are loaded.
   * This function recives the Object form of the questionList.
   * Compleat refresh is triggerd when the user pulls to refresh or every 60 Minutes.
   */
  async function fetchAllQuestions(quesitonList: QuestionListItem[], moduleID: string, mandatory = false) {
    try {
    let allQuestions = null;
    const parsedQuestionList = ensureQuestionListIsParsed(quesitonList);
    const totalRefreshNeeded = checkMMKVQuestionListRefreshTimestampExpiry(moduleID) || mandatory ;
    if (totalRefreshNeeded) {
      setMMKVLastQuestionListRefreshTimestamp(moduleID);
      setLoadingQuestionsDone(false);
      const res = await getAllQuestionsByIds(parsedQuestionList.map(q => q.id));
      if (res === "404" || res === "400") {
        allQuestions = getQuestionsFromMMKV(moduleID);

      } else {
        
        allQuestions = res;
        saveQuestionsToMMKV(moduleID, allQuestions as any as question[]);
      }
    } else {
      allQuestions = getQuestionsFromMMKV(moduleID);
    }
      setLoadingQuestionsDone(true);

    if (!checkIfOldQuestionsEqualNewQuestions(questions, allQuestions)) {
      setQuestions(allQuestions as unknown as question[]);
    }
    
    } catch (error) {
      if (__DEV__) {  
        console.error("Error fetching all questions:", error);
      }
  }}


  useEffect(() => {
    if (!module) return;
    if (!refreshing ) return;
    fetchAllQuestions(module.questionList, module.$id,true);
  }, [refreshing]);

  useEffect(() => {
    if (!module) return;
    fetchAllQuestions(module.questionList, module.$id, false);
  }, []);


  async function fetchNotesDocumentsForSession(
      sessionID: string,
      mandatory = false
    ): Promise<{
      notes: note[] | null;
      documents: AppwriteDocument[] | null;
    }> {
    let notes = null;
    let documents = null;
    const totalRefreshNeeded = checkMMKVNoteDocumentListRefreshTimestampExpiry(sessionID) || mandatory ;
    if (totalRefreshNeeded) {
      setMMKVLastNoteDocumentListRefreshTimestamp(sessionID);
       notes = await getSessionNotes(sessionID);
       documents = await getAllDocuments(sessionID);

    } else {
      notes = getNotesFromMMKV(sessionID);
      documents = getDocumentConfigsFromMMKV(sessionID);
    }
    
    return { 
      notes: notes as note[],
      documents: documents as AppwriteDocument[]
    } 
  }


  async function fetchQuestions(sessionID: string, moduleID: string, mandatory = false) {
    if (sessionID === "ALL") {
      
      const allNotes = [];
      const allDocuments = [];
      for (const session of sessions) {
        const { notes, documents } = await fetchNotesDocumentsForSession(session.id, mandatory);
        if (notes) {
          allNotes.push(...notes);
        } 
        if (documents) {
          allDocuments.push(...documents);
        }
      }
      setNotes(allNotes as unknown as note[]);
      setDocuments(allDocuments as unknown as AppwriteDocument[]);
    } else {
    const { notes, documents } = await fetchNotesDocumentsForSession(sessionID, mandatory);

    if (notes) {
      setNotes(notes as unknown as note[]);
      saveNotesToMMKV(sessionID, notes as unknown as note[])
    }
    if (documents) {
      setDocuments(documents as unknown as AppwriteDocument[]);
      saveDocumentConfigsToMMKV(sessionID, documents as unknown as AppwriteDocument[]);
    }
    }
  }

  function calculatePercentForSession(questionList:QuestionListItem[]){
    let total = 0;
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].status == "BAD") {
        total -= 1;
      } else if (questionList[i].status == "GOOD") {
        total += 1;
      } else if (questionList[i].status == "GREAT") {
        total += 1.5;
      } else if (questionList[i].status == "OK") {
        total += 0.25;
      } else {
        total += 0;
      }
    }
    const percent = Math.round((total / questionList.length) * 100);
    return percent < 0 ? 0 : percent > 100 ? 100 : percent;
  }

  function updateSessionProgress(sessions: Session[], questions: question[], questionList: QuestionListItem[]) {
    const newSessions = sessions.map((session: Session) => {
      const sessionQuestionList = questionList.filter(
        (q) => {
          const question = questions.find((quest) => quest.$id === q.id);
          return question && question.sessionID === session.id;
        }
      );
      const percent = calculatePercentForSession(sessionQuestionList);
      return {
        ...session,
        percent: percent,
        questions: sessionQuestionList.length,
      }
    });
    return newSessions;
  }

  async function checkForUpdates() {
    const moduledata = await loadModule(module.$id);
    if (moduledata) {
      setModule(moduledata);

      const sessions = moduledata.sessions.map((session: string) => JSON.parse(session));
      const newSessions = updateSessionProgress(sessions, questions, ensureQuestionListIsParsed(moduledata.questionList));
      setSessions(newSessions);
    }
    let notes = null;
    let documents = null;
    if (sessions && sessions.length > selectedSession) {
       notes = await getSessionNotes(sessions[selectedSession].id);
       documents = await getAllDocuments(sessions[selectedSession].id);
    } else {
      notes = await getSessionNotes("ALL");
      documents = await getAllDocuments("ALL");
    }
    if (notes) {
      setNotes(notes as unknown as note[]);
    }
    if (documents) {
      setDocuments(documents as unknown as AppwriteDocument[]);
    }
  }

  //This effect causes Questions to render
  useEffect(() => {
    if (sessions && sessions.length > selectedSession) {
        fetchQuestions(sessions[selectedSession].id, module.$id, refreshing);
    } else {
        fetchQuestions("ALL", module.$id, refreshing);
    }
    setLoading(false);
  }, [ selectedSession, refreshing]);

  //_____________________________________________________________General Functions_____________________________________________________________

  useFocusEffect(
    React.useCallback(() => {
      checkForUpdates();
    }, [])
  );
  /**
   * Switches to the EditNote screen with a new empty note.
   */
  async function SwichToEditNote() {
    setIsVisibleNewQuestion(false);
    const note = {
      notiz: "",
      sessionID: sessions[selectedSession] ? sessions[selectedSession].id : "",
      subjectID: module.$id,
      title: "",
    };
    try {
      const res = await addNote(note);
      router.push({
        pathname: "/editNote",
        params: { note: JSON.stringify(res) },
      });
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  }
  /**
   * This function loads a document from the users device and uploads it to the Appwrite bucket.
   * Additioally, a document config is created wich contaiMons the relevant data for the document.
   */
  async function addDocument() {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if (res.canceled) return;

      const file = res.assets[0];
      if (file.mimeType !== "application/pdf") {
        alert(t("invalidFileType"));
        return;
      }
      const doc = {
        title: file.name,
        subjectID: module.$id,
        sessionID: sessions[selectedSession]?.id || "ALL",
        id: uuid.v4(),
        type: file.mimeType || "application/octet-stream",
        uploaded: false,
        status:"PENDING"
      };
      //TAGTAG


      // Step 2 - Save the config
      const appwriteRes = await addDocumentConfig(doc);
      


      // Step 3 - Read the file differently based on platform
      let fileBlob;
      let uploadRes;
      if (Platform.OS === "web") {
        fileBlob = await fetch(file.uri).then((res) => res.blob());
        const data = {
          id: doc.id,
          file: fileBlob,
        };
        uploadRes = await addDocumentToBucketWeb(data);
      } else {
        fileBlob = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
          size: file.size,
        };
        uploadRes = await addDocumentToBucket(doc.id, fileBlob);
        
      }

      if (appwriteRes) {
        appwriteRes.uploaded = true;
        if (uploadRes) appwriteRes.databucketID = uploadRes.$id;
        const final = await updateDocumentConfig({
          ...appwriteRes,
          uploaded: true,
          databucketID: uploadRes ? uploadRes.$id : undefined,
          status:"PENDING"
        });

        console.log("Appwrite document config created:", appwriteRes);
        if (appwriteRes?.$id) {
          sendTextExtractionRequest(appwriteRes?.$id)
        }

        addDocumentConfigToMMKV(sessions[selectedSession]?.id || "ALL",final as any as AppwriteDocument);


        if (final) {
          setDocuments((prevDocuments) => [
            ...prevDocuments,
            final as unknown as AppwriteDocument,
          ]);
        }
      }
      setIsVisibleNewQuestion(false);
    } catch (error) {
      if (__DEV__) {
        console.log("Error in addDocument:", error);
      }
    } finally {
      setIsVisibleNewQuestion(false);
    }
  }
  /**
   * This function removes a document locally and deletes it from the Appwrite bucket.
   * @param {string} id - The ID of the document to update.
   */
  async function deleteDocument(id: string, type = "document") {
    try {
      if (type === "document") {
        setDocuments(documents.filter((document) => document.$id !== id));
        removeDocumentConfig(id);
        removeDocumentConfigFromMMKV(sessions[selectedSession]?.id || "ALL", id);
      } else if (type === "question") {
        const updatedQuestions = questions.filter(
          (q: question | null) => q && q.$id !== id
        );
        setQuestions(updatedQuestions.filter((q): q is question => q !== null));
        const parsedList = reverseToManyStringifyActions(module.questionList);
        const updatedQuestionList = parsedList.filter((q) => q.id !== id);
        const res = await updateModuleData(module.$id, {
          ...module,
          questionList: updatedQuestionList.map((item) => JSON.stringify(item)),
          questions: updatedQuestionList.length,
          progress: calculatePercent(
            updatedQuestions.filter((q): q is question => q !== null)
          ), // <- Hier ist der Fix
        });

        await removeQuestion(id);
      }
    } catch (error) {
      if (__DEV__) {
        console.log("❌ Fehler beim Löschen:", error);
      }
    }
  }

  const [isVisibleNewQuestion, setIsVisibleNewQuestion] = useState(false);
  const [isVisibleAI, setIsVisibleAI] = useState(false);
  const [change, setChange] = useState(0);

  /**
   * This function checks for each question if it is in the questionList.
   * If not, it adds the question with the status null to ensure that there is a new state for each user.
   * In case the question List changes it checks if the Array needs to be updated.
   */
  useEffect(() => {
    async function updateQuestionList() {
      let hasChanges = false;
      const parsedQuestions = reverseToManyStringifyActions(
        module.questionList
      );
      const noDuplicates = parsedQuestions.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      if (
        noDuplicates.length !== module.questionList.length ||
        module.questions !== noDuplicates.length
      ) {
        const res = await updateModuleData(module.$id, {
          ...module,
          questionList: noDuplicates.map((item) => JSON.stringify(item)),
          questions: noDuplicates.length,
          progress: calculatePercent(
            questions.filter((q): q is question => q !== null)
          ),
        });
      }
    }

    updateQuestionList();
  }, [questions]);

  useEffect(() => {
    setTab(1);
    setChange(change + 1);
  }, [selectedSession]);

  const [questionToEdit, setQuestionToEdit] = useState({
    $id: undefined,
    question: "",
    questionUrl: "",
    questionLatex: "",
    questionSVG: "", // Added missing property
    answers: [],
    answerIndex: [],
    tags: [],
    public: false,
    sessionID: null,
    aiGenerated: false,
    subjectID: moduleEntry.$id,
    status: "",
    hint: "",
    explaination: "",
  });


  const [isVisibleEditQuestion, setIsVisibleEditQuestion] = useState<{
    state: boolean;
    status: "ADD" | "EDIT";
  }>({
    state: false,
    status: "ADD",
  });
  const bottomSheetRef = React.useRef<CustomBottomSheetRef>(null);
  const aiBottomSheetRef = React.useRef<CustomBottomSheetRef>(null);
  const startQuizBottomSheetRef = React.useRef<CustomBottomSheetRef>(null);
  const sessionSelectionBottomSheetRef =
    React.useRef<CustomBottomSheetRef>(null);
  const addDocumentJobSheetRef = React.useRef<CustomBottomSheetRef>(null);

  const [selectedFile, setSelectedFile] = useState<AppwriteDocument | null>(null);

  return (
    <View className="flex-1 rounded-[10px] items-center ">
      
      {isVertical ? (
        <View className=" h-[15px] w-[95%] bg-gray-900 bg-opacity-70 rounded-t-[10px]  opacity-50"></View>
      ) : null}
      <View className="flex-1 rounded-[10px] w-full bg-gray-900  border-gray-700 ">
        {loading ? (
          <Text>...</Text>
        ) : (
          <View className="flex-1">
            <Header
              module={displayModule}
              setModule={setModule}
              moduleUsers={displayModule.tags}
              moduleID={displayModule.$id}
              moduleName={displayModule.name}
              setIsVisibleNewQuestion={() =>
                bottomSheetRef.current?.openSheet(0)
              }
              moduleSessions={displaySessions}
              questions={questions}
              setSelectedScreen={setSelectedScreen}
              selected={selectedSession}
              sessions={displaySessions}
              modules={modules}
              setModules={setModules}
              moduleDescription={displayModule.description}
              openQuizSheet={() =>
                startQuizBottomSheetRef.current?.openSheet(0)
              }
              openSessionSheet={() =>
                sessionSelectionBottomSheetRef.current?.openSheet(0)
              }
            />
            {!isVertical ? (
              <SwichTab
                setTab={setTab}
                tab={tab}
                tab1={"Map"}
                tab2={"Fragen"}
                change={change ? true : false}
              />
            ) : null}
            <View
              className={`border-t-[1px] border-gray-600 ${isVertical ? "mt-3" : null}`}
            />
           
            <View className={`flex-1 ${isVertical ? "flex-row" : null}`}>
              {tab == 0 ? (
                <View className="h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[500px]">
                  <RoadMap
                    moduleSessions={displaySessions}
                    selected={selectedSession}
                    setSelected={setSelectedSession}
                    questions={questions}
                    currentModule={displayModule}
                    moduleDescription={displayModule.description}
                  />
                </View>
              ) : null}
              {isVertical || tab == 1 ? (
                <View className="p-4 flex-1">
                 
                  <Data
                  loadingQuestionsDone={loadingQuestionsDone}
                  key={JSON.stringify(module) + questions.length + JSON.stringify(module.session)}
                  addDocumentJobSheetRef={addDocumentJobSheetRef}
                  setSelectedFile={setSelectedFile}
                  selectedSession={ displaySessions[selectedSession] ? displaySessions[selectedSession] : null}
                    selectAi={() => aiBottomSheetRef.current?.openSheet(1)}
                    setQuestions={setQuestions}
                    setQuestionToEdit={setQuestionToEdit}
                    isVisibleEditQuestion={isVisibleEditQuestion}
                    setIsVisibleEditQuestion={setIsVisibleEditQuestion}
                    setIsVisibleNewQuestion={() =>
                bottomSheetRef.current?.openSheet(0)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    selectedLanguage={selectedLanguage}
                    SwichToEditNote={SwichToEditNote}
                    setIsVisibleAI={setIsVisibleAI}
                    addDocument={addDocument}
                    deleteDocument={deleteDocument}
                    moduleSessions={displaySessions}
                    selected={selectedSession}
                    questions={displayQuestions.filter(q => {
                      if (!displaySessions[selectedSession]?.id) return true;
                      if (displaySessions[selectedSession].id === q.sessionID) return true;
                      return false;
                    })}
                    notes={displayNotes}
                    documents={displayDocuments}
                    module={displayModule}
                    setSelectedScreen={setSelectedScreen}
                    selectedSessionID={
                      displaySessions[selectedSession]
                        ? displaySessions[selectedSession].id
                        : "ALL"
                    }
                    setModule={setModule}
                  />
                </View>
              ) : null}
              
            </View>
          </View>
        )}
      </View>
       
        
        
{/*______________________Modals_____________________ */}

      {isVisibleEditQuestion.state && (
        <ChangeQuestions
          question={questionToEdit}
          questions={questions.filter((q): q is question => q !== null)}
          setQuestions={setQuestions}
          module={module}
          setModule={setModule}
          selectedSession={sessions[selectedSession]}
          isVisibleEditQuestion={isVisibleEditQuestion}
          setIsVisibleEditQuestion={setIsVisibleEditQuestion}
        />
      )}
      <NewQuestionSheet
        sheetRef={bottomSheetRef}
        setQuestionToEdit={setQuestionToEdit}
        setIsVisibleEditQuestion={setIsVisibleEditQuestion}
        isVisibleEditQuestion={isVisibleEditQuestion}
        selectedLanguage={selectedLanguage}
        SwichToEditNote={SwichToEditNote}
        module={module}
        addDocument={addDocument}
        isVisible={isVisibleNewQuestion}
        setIsVisible={setIsVisibleNewQuestion}
        openSheet={(index?: number) => bottomSheetRef.current?.openSheet(index)}
        close={() => {
          bottomSheetRef.current?.closeSheet();
        }}
        selectAi={() => {
          bottomSheetRef.current?.closeSheet();
          aiBottomSheetRef.current?.openSheet(1);
        }}
      />

      <NewAiQuestionsSheet
        setModule={setModule}
        sheetRef={aiBottomSheetRef}
        selectedSession={sessions[selectedSession] || null}
        module={module}
        setQuestions={setQuestions}
        setSessions={setSessions}
      />
      <SessionListSheet
        sheetRef={sessionSelectionBottomSheetRef}
        sessions={sessions}
        setSessions={setSessions}
      />
      <AddDocumentJobSheet
        sheetRef={addDocumentJobSheetRef}
        selectedFile={selectedFile} 
        module={module}
        setModule={setModule}
        setSessions={setSessions}
        sessionID={sessions[selectedSession]?.id || "ALL"}
        selectedSession={sessions[selectedSession]}
        setQuestions={setQuestions}
        

        


      />

      <StartQuizSheet
        questionList={module.questionList ? module.questionList.map((i:string)=> typeof i == "string" ? JSON.parse(i) : i) : []}
        sheetRef={startQuizBottomSheetRef}
        moduleID={module.$id}
        sessionID={
          sessions[selectedSession] ? sessions[selectedSession].id : "ALL"
        }
        maxQuestions={displayQuestions ? displayQuestions.length : 0}
        questions={displayQuestions}
      />
    </View>
  );
};

export default SingleModule;
