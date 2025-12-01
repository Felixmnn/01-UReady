import { View, Text, Platform, Modal, TouchableOpacity } from "react-native";
import React, { use, useEffect, useState } from "react";
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
  getSessionQuestions,
} from "@/lib/appwriteQuerys";
import { updateModuleData, updateModuleQuestionList } from "@/lib/appwriteUpdate";
import ModalNewQuestion from "../(modals)/newQuestion";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";
import languages from "@/assets/exapleData/languageTabs.json";
import { useFocusEffect } from "@react-navigation/native";
import { loadModule } from "@/lib/appwriteDaten";
import ChangeQuestions from "../(modals)/changeQuestion";
import CustomBottomSheet, { CustomBottomSheetRef } from "../(bottomSheets)/customBottomSheet";
import NewQuestionSheet from "../(bottomSheets)/newQuestionSheet";
import NewAiQuestionsSheet from "../(bottomSheets)/newAiQuestionsSheet";
import StartQuizSheet from "../(bottomSheets)/startQuizSheet";
import SessionListSheet from "../(bottomSheets)/sessionListSheet";
import { note, question } from "@/types/appwriteTypes";
import { Session } from "@/types/moduleTypes";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/mmkv";
import { getUnsavedModulesFromMMKV, getQuestionsFromMMKV, saveQuestionsToMMKV, saveNotesToMMKV, getNotesFromMMKV } from "@/lib/mmkvFunctions";
import CustomButton from "@/components/(general)/customButton";

type QuestionListItem = {
  id: string;
  status: null | "BAD" | "OK" | "GOOD" | "GREAT";
}

type Note = {
  $id?: string;
  title: string;
  notiz: string;
  sessionID: string;
  subjectID: string;
};

type AppwriteDocument = {
  $id: string;
  title: string;
  type: string;
  subjectID: string;
  sessionID: string;
  uploaded: boolean;
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

  const [documents, setDocuments] = useState<AppwriteDocument[]>([]);
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

  const [notes, setNotes] = useState<note[] | []>(sessions && sessions.length > selectedSession && sessions[selectedSession].id ? getNotesFromMMKV(sessions[selectedSession].id) : []);
  {
    /* Language and Texts */
  }
  const [selectedLanguage, setSelectedLanguage] = useState("DEUTSCH");
  const { language } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await checkForUpdates();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  const texts = languages.singleModule;

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
    return percent < 0 ? 0 : percent > 100 ? 100 : percent;
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
  /**
   * This function is called when the Page is reopened or the module is changed.
   */
  async function updateSessionData(
    sessionID = "",
    percent = 0,
    amountQuestions = 0
  ) {
    sessions.forEach((session: Session) => {
      if (
        session.id === sessionID &&
        (session.percent !== percent || session.questions !== amountQuestions)
      ) {
        setSessions((prevSessions: Session[]) => {
          const updatedSessions = [...prevSessions];
          const index = updatedSessions.findIndex((s) => s.id === sessionID);

          if (index !== -1) {
            updatedSessions[index] = {
              ...updatedSessions[index],
              percent: percent,
              questions: amountQuestions,
            };
          }

          return updatedSessions;
        });
      }
    });
  }


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
   */
  async function fetchAllQuestions(quesitonList: QuestionListItem[], moduleID: string) {
    try {
    const parsedQuestionList = ensureQuestionListIsParsed(quesitonList);
    const allQuestions = await getAllQuestionsByIds(parsedQuestionList.map(q => q.id));
    if (allQuestions === "404" || allQuestions === "400") return ;

    
    /*
    SPÄTER AKTIVIEREN
    if (allQuestions.length < quesitonList.length) {
      // Some questions are missing, thus we need to update the questionList
      const newQuestionList = quesitonList.filter(ql => allQuestions.some(aq => aq.$id === ql.id));
      await updateModuleData(moduleID, {
        questionList: newQuestionList.map((item) => JSON.stringify(item)),
        questions: newQuestionList.length,
        progress: calculatePercent(allQuestions as unknown as question[]),
      });
      const newModule = {...module, questionList: newQuestionList};
      const newModuleList = modules.map((m: any) => m.$id === newModule.$id ? newModule : m);
      saveModulesToMMKV(newModuleList);
    }
      */
    saveQuestionsToMMKV(moduleID, allQuestions);
    const savedQuestions = getQuestionsFromMMKV(moduleID);
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
    fetchAllQuestions(module.questionList, module.$id);
  }, [refreshing]);

  async function fetchQuestions(sessionID: string) {
    /*
    let sessionQuestions = await getSessionQuestions(sessionID);
    // Filter questions so only those in questionList are set
    const filteredQuestions = sessionQuestions.filter(q =>
      module.questionList.some((mq: string) => {
        try {
          return JSON.parse(mq).id === q.$id;
        } catch {
          return false;
        }
      })
    );
    setQuestionLoadedSessions([...questionLoadedSessions, sessionID]);
    
    const percent = calculatePercent(filteredQuestions as unknown as question[]);
    await updateSessionData(sessionID, percent, filteredQuestions.length);
    */

    const notes = await getSessionNotes(sessionID);
    const documents = await getAllDocuments(sessionID);
   
    if (notes) {
      setNotes(notes as unknown as Note[]);
      saveNotesToMMKV(sessionID, notes as unknown as note[])
    }
    if (documents) {
      setDocuments(documents as unknown as AppwriteDocument[]);
    }
  }

  async function checkForUpdates() {
    const moduledata = await loadModule(module.$id);
    if (moduledata) {
      setModule(moduledata);
    }

    let sessionQuestions = await getSessionQuestions(sessions[selectedSession].id);
    // Filter questions so only those in questionList are set
    const filteredQuestions = sessionQuestions.filter(q =>
      module.questionList.some((mq: string) => {
        try {
          return JSON.parse(mq).id === q.$id;
        } catch {
          return false;
        }
      })
    );
    const notes = await getSessionNotes(sessions[selectedSession].id);
    const documents = await getAllDocuments(sessions[selectedSession].id);
    if (notes) {
      setNotes(notes as unknown as Note[]);
    }
    if (documents) {
      setDocuments(documents as unknown as AppwriteDocument[]);
    }
    const percent = calculatePercent(filteredQuestions as unknown as question[]);
    setSessions((prevSessions: Session[]) => {
      return prevSessions.map((session) => {
        if (session.id === sessions[selectedSession].id) {
          return {
            ...session,
            percent: percent,
            questions: filteredQuestions.length,
          };
        }
        return session;
      });
    });
  }

  //This effect causes Questions to render
  useEffect(() => {
    if (sessions == undefined || selectedSession > sessions.length) {
      if (selectedSession > sessions.length) {
        for (let i = 0; i < sessions.length; i++) {
          if (!questionLoadedSessions.includes(sessions[i].id)) {
            fetchQuestions(sessions[i].id);
            setQuestionLoadedSessions([
              ...questionLoadedSessions,
              sessions[i].id,
            ]);
          }
        }
      }
    } else {
      if (sessions[selectedSession])
        fetchQuestions(sessions[selectedSession].id);
    }
    setLoading(false);
  }, [sessions, selectedSession, refreshing]);

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
        alert(t(""));
        return;
      }
      const doc = {
        title: file.name,
        subjectID: module.$id,
        sessionID: sessions[selectedSession].id,
        id: uuid.v4(),
        type: file.mimeType || "application/octet-stream",
        uploaded: false,
      };

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
        const final = await updateDocumentConfig(appwriteRes);
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
      } else if (type === "question") {
        const updatedQuestions = questions.filter(
          (q: question | null) => q && q.$id !== id
        );
        setQuestions(updatedQuestions.filter((q): q is question => q !== null));
        const parsedList = reverseToManyStringifyActions(module.questionList);
        const updatedQuestionList = parsedList.filter((q) => q.id !== id);
        const res = await updateModuleData(module.$id, {
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
  const [showSessionList, setShowSessionList] = useState(false);

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
              moduleUsers={module.tags}
              moduleID={module.$id}
              moduleName={module.name}
              texts={texts}
              selectedLanguage={selectedLanguage}
              setIsVisibleNewQuestion={() =>
                bottomSheetRef.current?.openSheet(0)
              }
              moduleSessions={sessions}
              questions={questions}
              setSelectedScreen={setSelectedScreen}
              selected={selectedSession}
              sessions={sessions}
              modules={modules}
              setModules={setModules}
              moduleDescription={module.description}
              openQuizSheet={() =>
                startQuizBottomSheetRef.current?.openSheet(0)
              }
              openSessionSheet={() =>
                sessionSelectionBottomSheetRef.current?.openSheet(0)
              }
              setSelectedModule={() => {}} // Add this line or pass the actual function if available
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
                    moduleSessions={sessions}
                    selected={selectedSession}
                    setSelected={setSelectedSession}
                    questions={questions}
                    currentModule={module}
                    moduleDescription={moduleEntry.description}
                  />
                </View>
              ) : null}
              {isVertical || tab == 1 ? (
                <View className="p-4 flex-1">
                  
                  <Data
                    selectAi={() => aiBottomSheetRef.current?.openSheet(1)}
                    setQuestions={setQuestions}
                    setQuestionToEdit={setQuestionToEdit}
                    isVisibleEditQuestion={isVisibleEditQuestion}
                    setIsVisibleEditQuestion={setIsVisibleEditQuestion}
                    setIsVisibleNewQuestion={() =>
                bottomSheetRef.current?.openSheet(0)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    texts={texts}
                    selectedLanguage={selectedLanguage}
                    SwichToEditNote={SwichToEditNote}
                    setIsVisibleAI={setIsVisibleAI}
                    addDocument={addDocument}
                    deleteDocument={deleteDocument}
                    moduleSessions={sessions}
                    selected={selectedSession}
                    questions={questions.filter(q => {
                      if (selectedSession > sessions.length) return true;
                      if (sessions[selectedSession].id === q.sessionID) return true;
                      return false;
                    })}
                    notes={notes}
                    documents={documents}
                    module={module}
                    setSelectedScreen={setSelectedScreen}
                    selectedSessionID={
                      sessions[selectedSession]
                        ? sessions[selectedSession].id
                        : "ALL"
                    }
                    setModule={setModule}
                  />
                </View>
              ) : null}
              {isVertical ? (
                <View
                  className="h-full flex-1 border-gray-600 border-l-[1px] p-4 max-w-[500px]"
                  style={{
                    maxWidth: 400,
                  }}
                >
                  <RoadMap
                    moduleDescription={moduleEntry.description}
                    moduleSessions={sessions}
                    selected={selectedSession}
                    setSelected={setSelectedSession}
                    questions={questions}
                    currentModule={module}
                  />
                </View>
              ) : null}
            </View>
          </View>
        )}
      </View>
       
        
        
{/*______________________Modals_____________________ */}
      <ModalNewQuestion
        setQuestionToEdit={setQuestionToEdit}
        setIsVisibleEditQuestion={setIsVisibleEditQuestion}
        texts={texts}
        selectedLanguage={selectedLanguage}
        SwichToEditNote={SwichToEditNote}
        addDocument={addDocument}
        module={module}
        isVisible={isVisibleNewQuestion}
        setIsVisible={setIsVisibleNewQuestion}
        selectAi={() => {
          setIsVisibleNewQuestion(false);
          setIsVisibleAI(true);
        }}
      />

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
        questions={questions}
        setQuestions={setQuestions}
        setSessions={setSessions}
        sessions={sessions}
      />
      <SessionListSheet
        sheetRef={sessionSelectionBottomSheetRef}
        sessions={sessions}
        setSessions={setSessions}
      />

      <StartQuizSheet
        sheetRef={startQuizBottomSheetRef}
        moduleID={module.$id}
        sessionID={
          sessions[selectedSession] ? sessions[selectedSession].id : "ALL"
        }
        maxQuestions={questions ? questions.length : 0}
        questions={questions}
      />
    </View>
  );
};

export default SingleModule;
