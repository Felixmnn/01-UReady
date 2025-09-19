import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

const ErrorModal = ({
  isError,
  setIsError,
  success,
  successMessage,
  setSuccess,
  errorMessage,
}: {
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  successMessage: string | null;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string | null;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isError || success}
      onRequestClose={() => {
        setIsError(!isError);
      }}
    >
      <TouchableOpacity
        className="flex-1 justify-start pt-5 items-center"
        onPress={() => {
          setIsError(false);
          setSuccess(false);
        }}
      >
        <View
          className="red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700"
          style={{
            backgroundColor: success ? "green" : "#ff4d4d",
            borderColor: success ? "green" : "#ff4d4d",
          }}
        >
          <Text className="text-white">
            {successMessage ? successMessage : errorMessage}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ErrorModal;
