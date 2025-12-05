import { View, Text, TouchableOpacity } from "react-native";
import React, { use } from "react";
import CustomBottomSheet from "./customBottomSheet";
import Selectable from "../selectable";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "@/context/GlobalProvider";
import Offline from "@/components/(general)/offline";
type EditQuestionState = {
  state: boolean;
  status: "ADD" | "EDIT";
};

const NewQuestionSheet = ({
  setQuestionToEdit,
  isVisibleEditQuestion,
  setIsVisibleEditQuestion,
  setIsVisible,
  selectAi,
  module,
  SwichToEditNote,
  sheetRef,
  close,
  addDocument,
}: {
  isVisible: boolean;
  setQuestionToEdit: React.Dispatch<React.SetStateAction<any>>;
  isVisibleEditQuestion: { state: boolean; status: "ADD" | "EDIT" };
  setIsVisibleEditQuestion: React.Dispatch<React.SetStateAction<{ state: boolean; status: "ADD" | "EDIT" }>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectAi: () => void;
  module: any;
  SwichToEditNote: (noteID: string | null) => void;  selectedLanguage: string;
  openSheet: (index?: number) => void;
  sheetRef: React.RefObject<any>;
  close: () => void;
  addDocument: () => void;
}) => {
    const { t } = useTranslation();
    const { isOffline } = useGlobalContext();
  return (
    <CustomBottomSheet ref={sheetRef}>
      <TouchableOpacity
        className=" w-full h-full justify-center items-center"
        onPress={() => setIsVisible(false)}
      >
        <View className=" w-full  items-center justify-center bg-gray-900 rounded-xl">
          <View className="w-full p-2">
          {!isOffline &&
            <Selectable
              icon={"robot"}
              iconColor={"#7a5af8"}
              bgColor={"bg-[#372292]"}
              title={t("bibliothek.aiQuiz")}
              empfolen={true}
              handlePress={() => selectAi()}
            />
          }
          {!isOffline &&
            <Selectable
               icon={"file-pdf"} 
               iconColor={"#338723ff"} 
               bgColor={"bg-[#89ea00ff]"} 
               title={t("bibliothek.addDocument")} 
               empfolen={false} 
               handlePress={()=> {addDocument()}}/>
          }
            <Selectable
              icon={"file-alt"}
              iconColor={"#5178c7ff"}
              bgColor={"bg-[#00359e]"}
              title={t("bibliothek.crtQuestion")}
              empfolen={false}
              handlePress={() => {
                close();
                setQuestionToEdit({
                  $id: undefined,
                  question: "",
                  questionUrl: "",
                  questionLatex: "",
                  answers: [],
                  answerIndex: [],
                  tags: [],
                  public: false,
                  sessionID: null,
                  subjectID: module.$id,
                  aiGenerated: false,
                  status: null,
                });
                setIsVisibleEditQuestion({
                  state: true,
                  status: "ADD",
                });
                setIsVisible(false);
              }}
            />
            <Selectable
              icon={"sticky-note"}
              iconColor={"#15b79e"}
              bgColor={"bg-[#134e48]"}
              title={t("bibliothek.crtNote")}
              empfolen={false}
              handlePress={() => {
                SwichToEditNote(null);
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </CustomBottomSheet>
  );
};

export default NewQuestionSheet;
