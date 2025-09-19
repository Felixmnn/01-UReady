import {
  Text,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import React from "react";

const LoginButton = ({
  title,
  handlePress,
  isSubmitting,
  isReady = true,
}: {
  title: string;
  handlePress: () => void;
  isSubmitting: boolean;
  isReady?: boolean;
}) => {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      disabled={isSubmitting}
      className=" p-2 w-full rounded-[10px] mt-2 items-center justify-center"
      style={{
        width: Platform.OS === "web" ? null : width - 60,
        height: 50,
        backgroundColor: "#1e3a8a",
        opacity: isReady ? 1 : 0.5,
      }}
      onPress={handlePress}
    >
      {isSubmitting ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text className="text-white font-bold text-xl">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default LoginButton;
