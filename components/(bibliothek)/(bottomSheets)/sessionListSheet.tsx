import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import CustomBottomSheet from "./customBottomSheet";
import Icon from "react-native-vector-icons/FontAwesome5";
import ModalEditSession from "../(modals)/modalEditSession";
import { useTranslation } from "react-i18next";
import { uuid } from "expo-modules-core";

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
  return (
    <CustomBottomSheet ref={sheetRef}>
      <View
        className="flex-1 justify-center items-center p-2"
        style={{ backgroundColor: "rgba(17, 24, 39,0.7)" }}
      >
        <View
          className={`  rounded-xl ${width < 400 ? "w-full" : "w-[400px]"}`}
        >
          {sessions?.map((session, index) => (
            <View
              key={index}
              className="mt-2 bg-gray-800 rounded-xl border-gray-600 border-[1px]"
            >
              {/* Session Header */}
              <TouchableOpacity
                onPress={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="flex-row items-center bg-gray-800 justify-between p-2  rounded-xl"
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
                      setSessions((prevSessions) => {
                        const newSessions = [...prevSessions];
                        const temp = newSessions[index - 1];
                        newSessions[index - 1] = newSessions[index];
                        newSessions[index] = temp;
                        return newSessions;
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
                      setSessions((prevSessions) => {
                        const newSessions = [...prevSessions];
                        const temp = newSessions[index + 1];
                        newSessions[index + 1] = newSessions[index];
                        newSessions[index] = temp;
                        return newSessions;
                      });
                    }}
                    className="ml-1 justify-center items-center h-[30px] w-[30px] rounded-full bg-gray-700"
                  >
                    <Icon name="arrow-down" size={15} color="white" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Inline Edit Area */}
              {expandedIndex === index && (
                <ModalEditSession
                  session={session}
                  sessions={sessions}
                  index={index}
                  setSessions={setSessions}
                />
              )}
            </View>
          ))}

          {/* Add new session */}
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
    </CustomBottomSheet>
  );
};

export default SessionListSheet;
