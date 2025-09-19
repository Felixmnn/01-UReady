import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
  Image,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from "expo-router";
import Selectable from "../selectable";
import SmileyStatus from "../(components)/smileyStatus";
import { Session } from "@/types/moduleTypes";
import { module, question } from "@/types/appwriteTypes";
import { useTranslation } from "react-i18next";
type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";

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

const Data = ({
  setIsVisibleEditQuestion,
  isVisibleEditQuestion,
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
  setIsVisibleAI,
  SwichToEditNote,
  texts,
  selectedLanguage,
}: {
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
  notes: Note[];
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
  texts: { [key: string]: { [key: string]: string } };
  selectedLanguage: string;
}) => {
    const { t } = useTranslation();
  const [optionsVisible, setOptionsVisible] = useState<string[]>([]);
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
    } catch (e) {}
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
              (question as ParsedQuestion).id === item.$id
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

  /**
   * Header for Question, Note and Document List + Item Counter
   */
  const CounterText = ({ title, count }: { title: string; count: number }) => {
    return (
      <View className="flex-row justify-start items-center ">
        <Text className="text-white my-2">{title}</Text>
        <Text className="ml-1 text-white text-[12px] px-1 rounded-[5px] bg-gray-700">
          {count}
        </Text>
      </View>
    );
  };

  /**
   * This component enables to add new items of the type Question, Note, Document
   * @param handlePRess - This function contains the function to add either a new question, note or document
   * @param {title} button - Is the title of the touchable opacity
   * @returns
   */
  const AddData = ({
    title,
    subTitle,
    button,
    handlePress,
  }: {
    title: string;
    subTitle: string;
    button: string;
    handlePress?: () => void;
  }) => {
    return (
      <View className="flex-row p-2 bg-gray-800 rounded-[10px] items-start justify-start border-[1px] border-gray-500 border-dashed">
        <View className="items-center justify-center p-2">
          <Icon name="file" size={25} color="white" />
        </View>
        <View className="ml-2">
          <Text className="text-white">{title}</Text>
          <Text className="text-gray-300 text-[12px]">{subTitle}</Text>
          <TouchableOpacity
            onPress={handlePress}
            className="rounded-full p-2 bg-gray-800 flex-row items-center justify-center border-[1px] border-gray-600 mt-2"
          >
            <Icon name="plus" size={15} color="white" />
            <Text className="ml-2 text-gray-300 text-[12px]">{button}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              {texts[selectedLanguage].unsupported}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
  /**
   * Question Cards - Containing: AIGENERATED, QUESTION, STATUS
   */
  const QuestionList = () => {
    return (
      <View
        className="w-full "
        style={{
          maxHeight: filteredData.length > 0 ? 250 : 120,
          minHeight: moduleSessions[selected]?.tags?.includes("JOB-PENDING")
            ? 180
            : null,
        }}
      >
        <CounterText
          title={texts[selectedLanguage].questio}
          count={filteredData.length}
        />
        {filteredData ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.$id}-${index}`}
            style={{}}
            ListHeaderComponent={() => {
              return (
                <View className="h-full p-1  ">
                  {moduleSessions[selected]?.tags?.includes("JOB-PENDING") ? (
                    <View
                      className="flex-1  items-center justify-center p-2 bg-gray-800 rounded-[10px] border-[1px] border-gray-500 border-dashed"
                      style={{
                        height: 150,
                        width: 150,
                      }}
                    >
                      <Image
                        source={require("../../../assets/bot.png")}
                        tintColor={"#fff"}
                        style={{
                          height: 50,
                          width: 50,
                        }}
                      />
                      <Text className="text-white text-center">
                        {texts[selectedLanguage].pendingAI}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/quiz",
                      params: {
                        questions: JSON.stringify(filteredData),
                        moduleID: module.$id,
                      },
                    })
                  }
                  className="p-4 w-[180px] m-1 justify-between items-center p-4 border-[1px] border-gray-600 rounded-[10px] bg-gray-800"
                >
                  <View className="w-full justify-between flex-row items-center ">
                    {item.status !== null ? (
                      <SmileyStatus
                        status={
                          item.status === "BAD" ||
                          item.status === "OK" ||
                          item.status === "GOOD" ||
                          item.status === "GREAT"
                            ? item.status
                            : null
                        }
                      />
                    ) : null}

                    <Image
                      source={require("../../../assets/bot.png")}
                      tintColor={"#fff"}
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  </View>
                  <Text className="text-white">
                    {item.question.length < 150
                      ? item.question.slice(0, 80) + "..."
                      : item.question}{" "}
                  </Text>
                  <View className="border-b-[1px] border-gray-600 my-4 w-full" />
                  <View className="w-full flex-row justify-between items-center">
                    {optionsVisible.includes(item.$id ?? "") ? (
                      <View className="flex-row items-center justify-between">
                        <View className="mr-5">
                          <Icon
                            name="edit"
                            size={15}
                            color="white"
                            onPress={() => {
                              setQuestionToEdit(item);
                              setIsVisibleEditQuestion({
                                state: true,
                                status: "EDIT",
                              });
                              /*
                                        setSelectedScreen("CreateQuestion");
                                        handleOptionsVisibility(item.$id);
                                        */
                            }}
                          />
                        </View>
                        <Icon
                          name="trash"
                          size={15}
                          color="red"
                          onPress={async () => {
                            if (item.$id) {
                              await deleteDocument(item.$id, "question");
                              handleOptionsVisibility(item.$id);
                            }
                          }}
                        />
                      </View>
                    ) : null}
                    <View
                      className={` items-end pr-2 ${optionsVisible.includes(item.$id ?? "") ? "w-[50%]" : "w-full"}`}
                    >
                      <TouchableOpacity
                        className="p-2"
                        onPress={() => {
                          handleOptionsVisibility(item.$id);
                        }}
                      >
                        <Icon name="ellipsis-h" size={15} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            horizontal={true}
          />
        ) : null}
        {filteredData.length == 0 &&
        !moduleSessions[selected]?.tags?.includes("JOB-PENDING") ? (
          <AddData
            title={texts[selectedLanguage].questioH}
            subTitle={texts[selectedLanguage].questioSH}
            button={texts[selectedLanguage].questioBtn}
            handlePress={() => setIsVisibleNewQuestion(true)}
          />
        ) : null}
      </View>
    );
  };

  /**
   * File Cards - Containing: FILE, UPLOAD STATUS, DELETE-FILE
   */
  const DocumentList = () => {
    return (
      <View
        className="w-full"
        style={{
          minHeight: 130,
        }}
      >
        <CounterText
          title={texts[selectedLanguage].file}
          count={filteredDocuments.length}
        />
        {documents ? (
          <View className="w-full">
            {filteredDocuments.map((item, index) => (
              <TouchableOpacity
                key={`${item.$id}-${index}`}
                onPress={() => {}}
                className={`w-full flex-row justify-between p-2 ${filteredDocuments.length - 1 == index ? null : "border-b-[1px] border-gray-600"}`}
              >
                <View className="flex-row items-start justify-start">
                  <Icon name="file" size={40} color="white" />
                  <Text className="text-white mx-2 font-bold text-[14px]">
                    {item.title ? item.title : texts[selectedLanguage].unnamed}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  {item.uploaded ? null : (
                    <ActivityIndicator size="small" color="#1E90ff" />
                  )}
                  {item.uploaded ? (
                    <TouchableOpacity
                      className="mr-2"
                      onPress={() => {
                        deleteDocument(item.$id);
                      }}
                    >
                      <Icon name="trash" size={15} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="ml-2"
                      onPress={() => {
                        deleteDocument(item.$id);
                      }}
                    >
                      <Icon name="times" size={15} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <AddData
            title={texts[selectedLanguage].fileH}
            subTitle={texts[selectedLanguage].fileSH}
            button={texts[selectedLanguage].fileBtn}
          />
        )}
        {filteredDocuments.length == 0 ? (
          <AddData
            title={texts[selectedLanguage].fileH}
            subTitle={texts[selectedLanguage].fileSH}
            button={texts[selectedLanguage].fileBtn}
            handlePress={() => addDocument()}
          />
        ) : null}
      </View>
    );
  };

  /**
   * Note Cards - Containing: NOTE, EDIT-NOTE, DELETE-NOTE
   */
  const NoteList = () => {
    return (
      <View className="flex-1">
        <CounterText
          title={texts[selectedLanguage].note}
          count={filteredNotes.length}
        />
        {notes ? (
          <View className=" w-full">
            {filteredNotes.map((item, index) => (
              <TouchableOpacity
                key={item.$id}
                onPress={() =>
                  router.push({
                    pathname: "/editNote",
                    params: { note: JSON.stringify(item) },
                  })
                }
                className={`w-full flex-row justify-between p-2 ${filteredNotes.length - 1 == index ? null : "border-b-[1px] border-gray-600"} `}
              >
                <View className="flex-row items-start justify-start">
                  <Icon name="file" size={40} color="white" />
                  <Text className="text-white mx-2 font-bold text-[14px]">
                    {item.title ? item.title : texts[selectedLanguage].unnamed}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <AddData
            title={texts[selectedLanguage].noteH}
            subTitle={texts[selectedLanguage].noteSH}
            button={texts[selectedLanguage].noteBtn}
            handlePress={() => SwichToEditNote(null)}
          />
        )}
        {filteredNotes.length == 0 ? (
          <AddData
            handlePress={() => SwichToEditNote(null)}
            title={texts[selectedLanguage].noteH}
            subTitle={texts[selectedLanguage].noteSH}
            button={texts[selectedLanguage].noteBtn}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View className="flex-1">
      <NichtUnterstuzterDateityp />
      {filteredData.length == 0 &&
      filteredDocuments.length == 0 &&
      filteredNotes.length == 0 ? (
        <ScrollView>
          <View className="flex-1">
            <Selectable
              icon={"robot"}
              iconColor={"#7a5af8"}
              bgColor={"bg-[#372292]"}
              title={texts[selectedLanguage].aiQuiz}
              empfolen={true}
              handlePress={() => setIsVisibleAI(true)}
            />
            {/* <Selectable texts={texts} selectedLanguage={selectedLanguage} icon={"file-pdf"} iconColor={"#004eea"} bgColor={"bg-[#00359e]"} title={texts[selectedLanguage].dokUpload} empfolen={false} handlePress={()=> {addDocument()}}/>*/}
            <Selectable
              icon={"file-alt"}
              iconColor={"#004eea"}
              bgColor={"bg-[#00359e]"}
              title={texts[selectedLanguage].crtQuestio}
              empfolen={false}
              handlePress={() => {
                setIsVisibleEditQuestion({
                  state: true,
                  status: "ADD",
                });
              }}
            />
            <Selectable
              icon={"sticky-note"}
              iconColor={"#15b79e"}
              bgColor={"bg-[#134e48]"}
              title={texts[selectedLanguage].crtNote}
              empfolen={false}
              handlePress={() => {
                SwichToEditNote(null);
              }}
            />
          </View>
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
            <QuestionList />
            {/*<DocumentList/>*/}
            <NoteList />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Data;
