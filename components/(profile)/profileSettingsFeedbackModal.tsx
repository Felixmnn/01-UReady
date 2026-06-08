import React from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import type { TFunction } from "i18next";

type ProfileSettingsFeedbackModalProps = {
  isError: boolean;
  isSuccess: boolean;
  setIsError: (value: boolean) => void;
  setIsSuccess: (value: boolean) => void;
  errorMessage: string | number;
  successMessage: string | number;
  t: TFunction;
};

const ProfileSettingsFeedbackModal = ({
  isError,
  isSuccess,
  setIsError,
  setIsSuccess,
  errorMessage,
  successMessage,
  t,
}: ProfileSettingsFeedbackModalProps) => {
  const codes = {
    100: t("passwordReset.100"),
    101: t("passwordReset.101"),
    102: t("passwordReset.102"),
    103: t("passwordReset.103"),
    500: t("passwordReset.500"),
    501: t("passwordReset.501"),
    502: t("passwordReset.502"),
    503: t("passwordReset.503"),
    504: t("passwordReset.504"),
    505: t("passwordReset.505"),
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isError || isSuccess}
      onRequestClose={() => {
        setIsError(!isError);
      }}
    >
      <TouchableOpacity
        className="flex-1 justify-start pt-5 items-center"
        onPress={() => {
          setIsError(false);
          setIsSuccess(false);
        }}
      >
        <View
          className="red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700"
          style={{
            backgroundColor: isSuccess ? "green" : "#ff4d4d",
            borderColor: isSuccess ? "green" : "#ff4d4d",
          }}
        >
          <Text className="text-white font-bold text-gray-300">
            {isSuccess && typeof successMessage === "number"
              ? codes[successMessage as keyof typeof codes]
              : isSuccess && typeof successMessage === "string"
                ? successMessage
                : isError && typeof errorMessage === "number"
                  ? codes[errorMessage as keyof typeof codes]
                  : isError && typeof errorMessage === "string"
                    ? errorMessage
                    : null}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfileSettingsFeedbackModal;
