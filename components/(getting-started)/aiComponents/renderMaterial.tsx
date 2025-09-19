import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import SubHeader from "./subHeader";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Session } from "@/types/moduleTypes";
type MaterialType = "TOPIC" | "PEN" | "FILE" | "QUESTION";

const RenderMaterial = ({
  items,
  selectedSession,
  setNewItem,
  newitem,
}: {
  items: any[];
  selectedSession: Session | null;
  setNewItem: React.Dispatch<
    React.SetStateAction<{
      type: MaterialType;
      content: string;
      uri: string | null;
      sessionID: string;
      id: string | null;
    }>
  >;
  newitem: {
    type: MaterialType;
    content: string;
    uri: string | null;
    sessionID: string;
    id: string | null;
  };
}) => {
  const { t } = useTranslation();
  return (
    <View>
      <SubHeader title={t("createModule.materials")} />
      <View className="w-full flex-row flex-wrap justify-start items-center my-2 ">
        {selectedSession &&
        items.filter((item) => item.sessionID == selectedSession.id).length >
          0 ? (
          items
            .filter((item) => item.sessionID == selectedSession.id)
            .map((item, index) => {
              const iconMap = {
                TOPIC: "layer-group",
                PEN: "pen",
                FILE: "file",
              };
              return (
                <TouchableOpacity
                  key={index}
                  className="bg-[#0c111d] px-2 flex-row border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
                  style={{ height: 30 }}
                  onPress={() => {
                    setNewItem({
                      ...newitem,
                      content: item.content,
                      type: item.type,
                      uri: item.uri,
                      sessionID: item.sessionID,
                      id: item.id,
                    });
                  }}
                >
                  <Icon
                    name={iconMap[item.type as "TOPIC" | "PEN" | "FILE"]}
                    size={15}
                    color="#4B5563"
                  />
                  <Text className="text-gray-300 font-semibold text-[12px] flex-wrap ml-2">
                    {item.content.length > 20
                      ? item.content.substring(0, 100) + "..."
                      : item.content}
                  </Text>
                </TouchableOpacity>
              );
            })
        ) : (
          <TouchableOpacity className="bg-[#0c111d] flex-row p-2 mt-4  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg">
            <Text className=" text-gray-300 flex-wrap font-semibold text-[12px]  ml-1">
              {t("createModule.noMaterialAdded")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RenderMaterial;
