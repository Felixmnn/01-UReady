import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import CustomButton from "../(general)/customButton";
import Offline from "../(general)/offline";
import type { TFunction } from "i18next";

type ProfileSettingsActionCodeModalProps = {
  visible: boolean;
  onClose: () => void;
  isOffline: boolean;
  t: TFunction;
  actioncode: string;
  setActionCode: (text: string) => void;
  onConfirm: () => void;
  isFocused: boolean;
  firstFocus: boolean;
  text: string;
};

const ProfileSettingsActionCodeModal = ({
  visible,
  onClose,
  isOffline,
  t,
  actioncode,
  setActionCode,
  onConfirm,
  isFocused,
  firstFocus,
  text,
}: ProfileSettingsActionCodeModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center p-2">
        <View
          className="w-full max-w-[300px] items-center bg-gray-800 p-4 rounded-[10px] border border-[1px] border-gray-600"
          style={{ height: 200 }}
        >
          {isOffline ? (
            <TouchableOpacity className="flex-1 " onPress={onClose}>
              <Offline />
            </TouchableOpacity>
          ) : (
            <View className="flex-1 w-full">
              <Text className="text-white font-bold text-[15px] my-3">
                {t("profileSettings.actioncodeText")}
              </Text>
              <TextInput
                className="w-full bg-gray-700 text-gray-300 p-2 rounded-[10px] border border-gray-500"
                placeholderTextColor="#808080"
                value={actioncode}
                onChangeText={setActionCode}
              />
              <View className="flex-1 flex-row items-center justify-center">
                <CustomButton
                  title={t("profileSettings.cancel")}
                  handlePress={onClose}
                  containerStyles={
                    "w-[50%] bg-gray-800 mx-1 border-w-[1px] border-gray-500"
                  }
                />
                <CustomButton
                  title={t("profileSettings.ok")}
                  handlePress={onConfirm}
                  containerStyles={
                    !isFocused && firstFocus && text == ""
                      ? "w-[50%] bg-gray-700 mx-1 border-gray-700"
                      : "w-[50%] bg-blue-500 mx-1"
                  }
                  textStyles={"text-gray-300"}
                  disabled={!isFocused && firstFocus && text == ""}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProfileSettingsActionCodeModal;
