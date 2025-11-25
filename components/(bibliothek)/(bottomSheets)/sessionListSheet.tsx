import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React from "react";
import CustomBottomSheet from "./customBottomSheet";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import { uuid } from "expo-modules-core";
import ColorPicker from "@/components/(general)/colorPicker";
import IconPicker from "@/components/(general)/iconPicker";
import { useGlobalContext } from "@/context/GlobalProvider";
import Offline from "@/components/(general)/offline";

const SessionListSheet = ({
  sheetRef,
  sessions,
  setSessions,
}: {
  sheetRef: React.RefObject<any>;
  sessions: any[];
  setSessions: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { width } = useWindowDimensions();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const { t } = useTranslation();
  const { isOffline } = useGlobalContext();

  return (
    <CustomBottomSheet ref={sheetRef}>
      {isOffline ? <Offline /> :
      <View
        className="flex-1 justify-center items-center p-2"
        style={{ backgroundColor: "rgba(17, 24, 39,0.7)" }}
      >
        <View className="rounded-xl w-full">
          {sessions?.map((session, index) => (
            <View
              key={session.id || index}
              className="mt-2 bg-gray-900 rounded-xl border-gray-600 border-[1px]"
            >
              {/* Session Header */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="flex-row items-center bg-gray-900 justify-between p-2 rounded-xl"
              >
                <Text className="text-white flex-1">{session.title}</Text>
                <Text className="text-white ml-2 flex-1">
                  {session.percent}%
                </Text>

                <View
                  className="w-[25px] h-[25px] rounded-full border-[1px] border-gray-500 mx-2 items-center justify-center"
                  style={{
                    backgroundColor:
                      session.color === "red"
                        ? "#DC2626"
                        : session.color === "blue"
                        ? "#2563EB"
                        : session.color === "green"
                        ? "#059669"
                        : session.color === "yellow"
                        ? "#CA8A04"
                        : session.color === "orange"
                        ? "#C2410C"
                        : session.color === "purple"
                        ? "#7C3AED"
                        : session.color === "pink"
                        ? "#DB2777"
                        : session.color === "emerald"
                        ? "#059669"
                        : session.color === "cyan"
                        ? "#0891B2"
                        : "#1F2937",
                  }}
                >
                  <Icon name={session.iconName} size={15} color="white" />
                </View>

                {/* Sort Buttons */}
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSessions((prev) => {
                        const updated = [...prev];
                        const temp = updated[index - 1];
                        updated[index - 1] = updated[index];
                        updated[index] = temp;
                        return updated;
                      });
                    }}
                    className="justify-center items-center h-[30px] w-[30px] rounded-full bg-gray-700"
                  >
                    <Icon name="arrow-up" size={15} color="white" />
                  </TouchableOpacity>
                )}
                {index < sessions.length - 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSessions((prev) => {
                        const updated = [...prev];
                        const temp = updated[index + 1];
                        updated[index + 1] = updated[index];
                        updated[index] = temp;
                        return updated;
                      });
                    }}
                    className="ml-1 justify-center items-center h-[30px] w-[30px] rounded-full bg-gray-700"
                  >
                    <Icon name="arrow-down" size={15} color="white" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Inline Edit Bereich */}
              {expandedIndex === index && (
                <View className="bg-gray-900 rounded-xl px-2 mt-2">
                  {/* Titel */}
                  <Text className="text-gray-400 font-bold text-[12px]">
                    {t("editSession.name")}
                  </Text>
                  <TextInput
                    className="text-white rounded-[10px] p-2 my-2 ml-2 border-blue-700 border-[1px] bg-[#0c111d]"
                    style={{ height: 40 }}
                    value={session.title}
                    maxLength={50}
                    placeholder={t("editSession.placeholderSessions")}
                    placeholderTextColor={"#9CA3AF"}
                    onChangeText={(e) =>
                      setSessions((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], title: e };
                        return updated;
                      })
                    }
                  />

                  {/* Beschreibung */}
                  <Text className="text-gray-400 font-bold text-[12px]">
                    {t("editSession.description")}
                  </Text>
                  <TextInput
                    value={session.description}
                    maxLength={150}
                    placeholderTextColor={"#9CA3AF"}
                    placeholder={t("editSession.placeholderDescription")}
                    className="text-white rounded-[10px] p-2 my-2 ml-2 border-blue-700 border-[1px] bg-[#0c111d]"
                    style={{ height: 40 }}
                    onChangeText={(e) =>
                      setSessions((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], description: e };
                        return updated;
                      })
                    }
                  />

                  {/* Color & Icon Picker */}
                  <View style={{ width: width > 600 ? 500 : width - 60 }}>
                    <ColorPicker
                      selectedColor={session.color}
                      changeColor={(newColor) =>
                        setSessions((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            ...updated[index],
                            color: newColor,
                          };
                          return updated;
                        })
                      }
                      title={t("editSession.color")}
                      indexItem={index}
                    />
                    <IconPicker
                      selectedIcon={session.iconName}
                      setSelectedIcon={(newIcon) =>
                        setSessions((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            ...updated[index],
                            iconName: newIcon,
                          };
                          return updated;
                        })
                      }
                      title={t("editSession.icons")}
                      selectedColor={session.color}
                      indexItem={index}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Neue Session hinzufügen */}
          <TouchableOpacity
            onPress={() => {
              setSessions([
                ...sessions,
                {
                  title: "Neue Session",
                  percent: 0,
                  color: null,
                  iconName: "question",
                  questions: 0,
                  description: "",
                  tags: [],
                  id: uuid.v4(),
                  generating: false,
                },
              ]);
            }}
            className="flex-row items-center justify-center p-2 border-blue-600 bg-blue-700 border-[1px] rounded-xl mt-2"
          >
            <Text className="text-white">{t("sessionList.addSession")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      }
    </CustomBottomSheet>
  );
};

export default SessionListSheet;
