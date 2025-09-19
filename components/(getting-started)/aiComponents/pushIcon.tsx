import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

/**
 * Tocuhable Opacity zum hinzufügen eines Themas oder eines Textes
 */
const PlusIcon = ({
  typeText = true,
  newitem,
  addItem,
  handleFileUpload,
}: {
  typeText?: boolean;
  newitem: {
    type: "TOPIC" | "PEN" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  };
  addItem: () => void;
  handleFileUpload: () => Promise<void>;
}) => {
  return (
    <TouchableOpacity
      disabled={newitem.content.length < 2 && typeText}
      onPress={async () => {
        if (newitem.type == "FILE") {
          await handleFileUpload();
        } else {
          addItem();
        }
      }}
      className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
      style={{ height: 34, width: 34, marginBottom: 5 }}
    >
      <Icon name="plus" size={15} color="#4B5563" />
    </TouchableOpacity>
  );
};

export default PlusIcon;
