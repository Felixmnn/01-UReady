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
import CustomButton from "@/components/(general)/customButton";

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

  // Draft state: collect changes locally and commit on button press
  const [drafts, setDrafts] = React.useState<Record<string, {
    title: string;
    description: string;
    color: string | null;
    iconName: string;
  }>>({});

  // Initialize drafts when sessions change
  React.useEffect(() => {
    const next: Record<string, {
      title: string;
      description: string;
      color: string | null;
      iconName: string;
    }> = {};
    sessions?.forEach((s, i) => {
      const key = (s?.id ? String(s.id) : String(i));
      next[key] = {
        title: s?.title ?? "",
        description: s?.description ?? "",
        color: (s?.color ?? null) as string | null,
        iconName: s?.iconName ?? "question",
      };
    });
    setDrafts(next);
  }, [sessions]);

  return (
    <CustomBottomSheet ref={sheetRef}>
      {isOffline ? <Offline /> :
      <View
        className="flex-1 justify-center items-center p-2"
        style={{ backgroundColor: "rgba(17, 24, 39,0.7)" }}
      >
        <View className="rounded-xl w-full">
          {sessions?.map((session, index) => {
            const itemKey = (session?.id ? String(session.id) : String(index));
            const draft = drafts[itemKey];
            return (
            <View
              key={itemKey}
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
                    value={draft?.title ?? session.title ?? ""}
                    maxLength={50}
                    placeholder={t("editSession.placeholderSessions")}
                    placeholderTextColor={"#9CA3AF"}
                    onChangeText={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [itemKey]: { ...(prev[itemKey] ?? drafts[itemKey] ?? {}), title: e },
                      }))
                    }
                  />

                  {/* Beschreibung */}
                  <Text className="text-gray-400 font-bold text-[12px]">
                    {t("editSession.description")}
                  </Text>
                  <TextInput
                    value={draft?.description ?? session.description ?? ""}
                    maxLength={150}
                    placeholderTextColor={"#9CA3AF"}
                    placeholder={t("editSession.placeholderDescription")}
                    className="text-white rounded-[10px] p-2 my-2 ml-2 border-blue-700 border-[1px] bg-[#0c111d]"
                    style={{ height: 40 }}
                    onChangeText={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [itemKey]: { ...(prev[itemKey] ?? drafts[itemKey] ?? {}), description: e },
                      }))
                    }
                  />

                  {/* Color & Icon Picker */}
                  <View style={{ width: width > 600 ? 500 : width - 60 }}>
                    <ColorPicker
                      selectedColor={draft?.color ?? session.color}
                      changeColor={(newColor) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [itemKey]: { ...(prev[itemKey] ?? drafts[itemKey] ?? {}), color: newColor },
                        }))
                      }
                      title={t("editSession.color")}
                      indexItem={index}
                    />
                    <IconPicker
                      selectedIcon={draft?.iconName ?? session.iconName}
                      setSelectedIcon={(newIcon) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [itemKey]: { ...(prev[itemKey] ?? drafts[itemKey] ?? {}), iconName: newIcon },
                        }))
                      }
                      title={t("editSession.icons")}
                      selectedColor={draft?.color ?? session.color}
                      indexItem={index}
                    />
                    
                      <TouchableOpacity
                        onPress={() => {
                        const d = drafts[itemKey];
                        if (!d) return;
                        setSessions((prev) => {
                          const updated = [...prev];
                          updated[index] = {
                            ...updated[index],
                            title: d.title,
                            description: d.description,
                            color: d.color,
                            iconName: d.iconName,
                          };
                          return updated;
                        });
                      }}
                        className="flex-row items-center justify-center p-2 mb-2 border-blue-600 bg-blue-700 border-[1px] rounded-xl mt-2"
                      >
                        <Text className="text-white">{t("deleteModule.saveChanges")}</Text>
                      </TouchableOpacity>
                  </View>
                 
                </View>
              )}
              
            </View>
          )})}

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
