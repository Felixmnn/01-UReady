import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from "expo-router";
import { note } from "@/types/appwriteTypes";

type NoteListSectionProps = {
  t: (key: string) => string;
  selectedS: string;
  filteredNotes: note[];
  notes: note[];
  SwichToEditNote: (noteID: string | null) => void;
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

const NoteListSection = ({ t, selectedS, filteredNotes, notes, SwichToEditNote }: NoteListSectionProps) => {
  return (
    <View className="flex-1">
      {filteredNotes.length === 0 && selectedS == "ALL" ? null : (
        <CounterText title={t("data.note")} count={filteredNotes.length} />
      )}
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
              className={`w-full flex-row justify-between p-2 ${
                filteredNotes.length - 1 == index ? null : "border-b-[1px] border-gray-600"
              } `}
            >
              <View className="flex-row items-start justify-start">
                <Icon name="file" size={40} color="white" />
                <Text className="text-white mx-2 font-bold text-[14px]">
                  {item.title ? item.title : t("data.unnamed")}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : selectedS == "ALL" ? null : (
        <AddData
          title={t("data.noteH")}
          subTitle={t("data.noteSH")}
          button={t("data.noteBtn")}
          handlePress={() => SwichToEditNote(null)}
        />
      )}
      {filteredNotes.length == 0 ? (
        selectedS == "ALL" ? null : (
          <AddData
            handlePress={() => SwichToEditNote(null)}
            title={t("data.noteH")}
            subTitle={t("data.noteSH")}
            button={t("data.noteBtn")}
          />
        )
      ) : null}
    </View>
  );
};

export default NoteListSection;
