import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import SelectMaterialType from "./selectedMaterialType";
import { useTranslation } from "react-i18next";
import PlusIcon from "./pushIcon";
import TrashIcon from "./trashIcon";
import Icon from "react-native-vector-icons/FontAwesome5";
import { uuid } from "expo-modules-core";

const MaterialInput = ({
  selectedMaterialType,
  setSelectedMaterialType,
  newitem,
  setNewItem,
  addItem,
  handleFileUpload,
  handleDeleteItem,
  items,
  fileList,
  setItems,
  selectedSession,
}: {
  selectedMaterialType: "TOPIC" | "PEN" | "FILE" | "QUESTION";
  setSelectedMaterialType: React.Dispatch<
    React.SetStateAction<"TOPIC" | "PEN" | "FILE" | "QUESTION">
  >;
  newitem: {
    type: "TOPIC" | "PEN" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  };
 setNewItem: React.Dispatch<
    React.SetStateAction<{
      type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
      content: string;
      uri: string | null;
      sessionID: string;
      id: string | null;
    }>
  >;
  addItem: () => void;
  handleFileUpload: () => Promise<void>;
  handleDeleteItem: (id: string | null) => void;
  items: {
    type: "TOPIC" | "PEN" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  }[];
  fileList: {
    title: string;
    id: string;
  }[];
  setItems: React.Dispatch<
    React.SetStateAction<
      {
        type: "TOPIC" | "PEN" | "FILE" | "QUESTION";
        content: string;
        uri: string | null;
        sessionID: string | null; // <-- changed from string | null to string
        id: string | null;
      }[]
    >
  >;
  selectedSession: {
    id: string;
    title: string;
    description: string;
    moduleID: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}) => {
  const { t } = useTranslation();

  return (
    <View>
      <View className="flex-row justify-between items-center">
        <View className="w-full flex-row rounded-full items-center justify-between bg-[#0c111d] border-gray-800 border-[1px] shadow-lg">
          <SelectMaterialType
            iconName="pen"
            type="PEN"
            handlePress={() =>
              setNewItem({
                type: "PEN",
                content: "",
                uri: null,
                sessionID: uuid.v4() ?? "",
                id: null,
              })
            }
            text={t("createModule.questionsTopic")}
            selectedMaterialType={selectedMaterialType}
            setSelectedMaterialType={setSelectedMaterialType}
          />
          <SelectMaterialType
            iconName="layer-group"
            type="TOPIC"
            handlePress={() =>
              setNewItem({
                type: "TOPIC",
                content: "",
                uri: null,
                sessionID: uuid.v4() ?? "",
                id: null,
              })
            }
            text={t("createModule.questionsInfo")}
            selectedMaterialType={selectedMaterialType}
            setSelectedMaterialType={setSelectedMaterialType}
          />
          <SelectMaterialType
            iconName="check-square"
            type="QUESTION"
            handlePress={() =>
              setNewItem({
                type: "QUESTION",
                content: "",
                uri: null,
                sessionID: uuid.v4() ?? "",
                id: null,
              })
            }
            text={t("createModule.transformData")}
            selectedMaterialType={selectedMaterialType}
            setSelectedMaterialType={setSelectedMaterialType}
          />
          {/*
            In der ersten Version deaktiviert da der Server noch nicht zuverlässig mit Dateien arbeitet
            <SelectMaterialType
            iconName="file"
            type="FILE"
            handlePress={() => setNewItem({ type: 'FILE', content: '', uri: null, sessionID:null, id:null })}
            text={t("createModule.questionFile")}
            selectedMaterialType={selectedMaterialType}
            setSelectedMaterialType={setSelectedMaterialType}
            />
            */}
        </View>
      </View>
      {/* Section containing inputs relvant for creating a Topic */}
      {selectedMaterialType === "TOPIC" && (
        <View className="flex-row items-center justify-start">
          <View className="items-center justify-between mt-2 mb-2 ml-2">
            <PlusIcon
              typeText={true}
              newitem={newitem}
              addItem={addItem}
              handleFileUpload={handleFileUpload}
            />
            <TrashIcon
              handlePress={() => handleDeleteItem(newitem.id)}
              newitem={newitem}
            />
          </View>
          <TextInput
            maxLength={2000}
            onChangeText={(text) =>
              setNewItem({
                ...newitem,
                content: text,
                sessionID: newitem.sessionID ?? "",
              })
            }
            value={newitem.content}
            placeholder={t("createModule.aNewKathegorie")}
            className="flex-1 text-white  bg-[#0c111d] p-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] ml-2"
            placeholderTextColor={"#AAAAAA"}
            textAlignVertical="top"
            multiline={true}
            style={{
              height: 75,
              textAlign: "left",
              textAlignVertical: "top",
              justifyContent: "flex-start",
            }}
          />
        </View>
      )}

      {/* Section containing inputs for text based creation */}
      {selectedMaterialType === "PEN" && (
        <View className="flex-row items-start ">
          <View className="items-center justify-between mt-2 mb-2 ml-2">
            <PlusIcon
              typeText={true}
              newitem={newitem}
              addItem={addItem}
              handleFileUpload={handleFileUpload}
            />
            <TrashIcon
              handlePress={() => handleDeleteItem(newitem.id)}
              newitem={newitem}
            />
          </View>
          <TextInput
            multiline
            numberOfLines={5}
            maxLength={2000}
            onChangeText={(text) =>
              setNewItem({
                ...newitem,
                content: text,
                sessionID: newitem.sessionID ?? "",
              })
            }
            value={newitem.content}
            className="flex-1 text-white bg-[#0c111d] p-2 m-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
            placeholderTextColor={"#AAAAAA"}
            placeholder={t("createModule.aNewText")}
            style={{
              height: 75,
              textAlign: "left",
              textAlignVertical: "top",
              justifyContent: "flex-start",
            }}
          />
        </View>
      )}

      {/* Fragen aus Fragen */}
      {selectedMaterialType === "QUESTION" && (
        <View className="flex-row w-full items-start ">
          <View className="items-center justify-between mt-2 mb-2 ml-2">
            <PlusIcon
              typeText={true}
              newitem={newitem}
              addItem={addItem}
              handleFileUpload={handleFileUpload}
            />
            <TrashIcon
              handlePress={() => handleDeleteItem(newitem.id)}
              newitem={newitem}
            />
          </View>
          <TextInput
            maxLength={2000}
            onChangeText={(text) =>
              setNewItem({
                ...newitem,
                content: text,
                sessionID: newitem.sessionID ?? "",
              })
            }
            value={newitem.content}
            placeholder={t("createModule.existingQuestions")}
            className="flex-1 text-white ml-2 mt-2 bg-[#0c111d] p-2 border-gray-800 border-[1px] shadow-lg rounded-[10px] "
            placeholderTextColor={"#AAAAAA"}
            textAlignVertical="top"
            multiline={true}
            style={{
              height: 75,
              textAlign: "left",
              textAlignVertical: "top",
              justifyContent: "flex-start",
            }}
          />
        </View>
      )}

      {/* FILE hinzufügen */}
      {selectedMaterialType === "FILE" && (
        <View className="flex-row items-center justify-start">
          <View className="items-center justify-between mt-2 mb-2 ml-2">
            <PlusIcon
              typeText={true}
              newitem={newitem}
              addItem={addItem}
              handleFileUpload={handleFileUpload}
            />
            <TrashIcon
              handlePress={() => handleDeleteItem(newitem.id)}
              newitem={newitem}
            />
          </View>
          {fileList && fileList.length == 0 && (
            <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1 p-3">
              {t("createModule.addAFile")}
            </Text>
          )}
          <ScrollView style={{ width: "100%" }} horizontal={true}>
            {fileList.map((file, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-[#0c111d] flex-row p-2 m-1 border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: items.some((item) => item.id == file.id)
                      ? "#0000ac"
                      : undefined,
                    height: 73,
                  }}
                  onPress={() => {
                    if (items.some((item) => item.id == file.id)) {
                      handleDeleteItem(file.id);
                    } else {
                      setItems([
                        ...items,
                        {
                          type: "FILE",
                          content: file.title,
                          uri: null,
                          sessionID: selectedSession?.id || "",
                          id: file.id,
                        },
                      ]);
                    }
                  }}
                >
                  <Text className="text-gray-300 font-semibold text-[12px] mb-[1px] ml-1 p-3">
                    {file && file.title.length > 20
                      ? file.title.substring(0, 20) + "..."
                      : file.title}
                  </Text>
                  <Text>
                    {items.some((item) => item.id == file.id) ? (
                      <Icon name="check" size={15} color="#4B5563" />
                    ) : (
                      <Icon name="plus" size={15} color="#4B5563" />
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MaterialInput;
