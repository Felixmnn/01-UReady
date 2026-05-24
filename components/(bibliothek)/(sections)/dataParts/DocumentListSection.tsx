import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { sendTextExtractionRequest } from "@/lib/appwriteFunctions";

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

type DocumentListSectionProps = {
  t: (key: string) => string;
  selectedS: string;
  filteredDocuments: AppwriteDocument[];
  documents: AppwriteDocument[];
  width: number;
  setSelectedFile: React.Dispatch<React.SetStateAction<AppwriteDocument | null>>;
  addDocumentJobSheetRef: React.RefObject<any>;
  deleteDocument: (id: string, type?: "question" | "note" | "document") => Promise<void>;
  addDocument: () => void;
};

const CounterText = ({ title, count }: { title: string; count: number }) => {
  return (
    <View className="flex-row justify-start items-center ">
      <Text className="text-white my-2">{title}</Text>
      <Text className="ml-1 text-white text-[12px] px-1 rounded-[5px] bg-gray-700">{count}</Text>
    </View>
  );
};

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

const DocumentListSection = ({
  t,
  selectedS,
  filteredDocuments,
  documents,
  width,
  setSelectedFile,
  addDocumentJobSheetRef,
  deleteDocument,
  addDocument,
}: DocumentListSectionProps) => {
  return (
    <View className="w-full" style={{ minHeight: 130 }}>
      {filteredDocuments.length === 0 && selectedS == "ALL" ? null : (
        <CounterText title={t("data.file")} count={filteredDocuments.length} />
      )}
      {documents ? (
        <View className="w-full">
          {filteredDocuments.map((item, index) => (
            <TouchableOpacity
              key={`${item.$id}-${index}`}
              onPress={() => {
                setSelectedFile(item);
                if (item.status === "EXTRACTED") {
                  addDocumentJobSheetRef.current?.openSheet(0);
                } else {
                  sendTextExtractionRequest(item?.$id);
                }
              }}
              className={`w-full flex-row justify-between p-2 ${
                filteredDocuments.length - 1 == index ? null : "border-b-[1px] border-gray-600"
              }`}
            >
              <View className="flex-row items-start justify-start">
                <Icon name="file" size={40} color="white" />
                <Text className="text-white mx-2 font-bold text-[14px]" style={{ maxWidth: width - 120 }}>
                  {item.title
                    ? item.title.length > 30
                      ? `${item.title.slice(0, 30)}...${item.title.slice(-5)}`
                      : item.title
                    : t("data.unnamed")}
                </Text>
              </View>
              <View className="flex-row items-center justify-center">
                <View className="flex-row items-center justify-between mr-2">
                  {item.status === "PENDING" && (
                    <View className="px-2 py-0.5 rounded-full bg-yellow-100">
                      <Text className="text-yellow-700 text-xs font-medium">Processing</Text>
                    </View>
                  )}

                  {item.status === "EXTRACTED" && (
                    <View className="px-2 py-0.5 rounded-full bg-green-100">
                      <Text className="text-green-700 text-xs font-medium">Ready</Text>
                    </View>
                  )}

                  {item.status === "EXTRACTIONFAILED" && (
                    <TouchableOpacity
                      className="px-2 py-0.5 rounded-full bg-red-100"
                      onPress={async () => {
                        await sendTextExtractionRequest(item.$id);
                      }}
                    >
                      <Text className="text-red-700 text-xs font-semibold">Retry</Text>
                    </TouchableOpacity>
                  )}

                  {item.status === "STATUS_EXTRACTION_NOT_POSSIBLE" && (
                    <View className="px-2 py-0.5 rounded-full bg-gray-100">
                      <Text className="text-gray-500 text-xs font-medium">Broken file</Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center justify-between">
                  {item.uploaded ? null : <ActivityIndicator size="small" color="#1E90ff" />}
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
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : selectedS == "ALL" ? null : (
        <AddData title={t("data.fileH")} subTitle={t("data.fileSH")} button={t("data.fileBtn")} />
      )}
      {filteredDocuments.length == 0 ? (
        selectedS == "ALL" ? null : (
          <AddData
            title={t("data.fileH")}
            subTitle={t("data.fileSH")}
            button={t("data.fileBtn")}
            handlePress={() => addDocument()}
          />
        )
      ) : null}
    </View>
  );
};

export default DocumentListSection;
