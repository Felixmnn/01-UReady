import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import ColorPicker from "@/components/(general)/colorPicker";
import IconPicker from "@/components/(general)/iconPicker";
import { useTranslation } from "react-i18next";

const ModalEditSession = ({
  session,
  sessions,
  index,
  setSessions,
}: {
  session: any;
  sessions: any[];
  index: number;
  setSessions: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const [newTag, setNewTag] = useState(session);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    session.color || null
  );
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    session.iconName || null
  );

  function changeColor(newColor: string, index: number) {
    setSessions((prevSessions) =>
      prevSessions.map((s, i) => (i === index ? { ...s, color: newColor } : s))
    );
    setSelectedColor(newColor);
  }

  function changeIcon(newIcon: string, index: number) {
    setSessions((prevSessions) =>
      prevSessions.map((s, i) =>
        i === index ? { ...s, iconName: newIcon } : s
      )
    );
    setSelectedIcon(newIcon);
  }

  return (
    <View className="bg-gray-800  rounded-xl px-2 mt-2">
      <Text className="text-gray-400 font-bold text-[12px]">
        {t("editSession.name")}
      </Text>
      <TextInput
        className="text-white rounded-[10px] p-2 my-2 ml-2 border-blue-700 border-[1px] bg-[#0c111d]"
        style={{ height: 40 }}
        value={newTag?.title}
        maxLength={50}
        placeholder={t("editSession.placeholderSessions")}
        placeholderTextColor={"#9CA3AF"}
        onChangeText={(e) =>
          setSessions((prevSessions) =>
            prevSessions.map((s, i) => (i === index ? { ...s, title: e } : s))
          )
        }
      />

      <Text className="text-gray-400 font-bold text-[12px]">
        {t("editSession.description")}
      </Text>
      <TextInput
        value={newTag?.description}
        maxLength={150}
        placeholderTextColor={"#9CA3AF"}
        placeholder={t("editSession.placeholderDescription")}
        className="text-white rounded-[10px] p-2 my-2 ml-2 border-blue-700 border-[1px] bg-[#0c111d]"
        style={{ height: 40 }}
        onChangeText={(e) => {
          setNewTag((prev: any) => ({ ...prev, description: e }));
          setSessions((prevSessions) =>
            prevSessions.map((s, i) =>
              i === index ? { ...s, description: e } : s
            )
          );
        }}
      />

      <View style={{ width: width > 600 ? 500 : width - 60 }}>
        <ColorPicker
          selectedColor={selectedColor}
          changeColor={changeColor}
          title={t("editSession.color")}
          indexItem={index}
        />
        <IconPicker
          selectedIcon={selectedIcon}
          setSelectedIcon={changeIcon}
          title={t("editSession.icons")}
          selectedColor={selectedColor}
          indexItem={index}
        />
      </View>
    </View>
  );
};

export default ModalEditSession;
