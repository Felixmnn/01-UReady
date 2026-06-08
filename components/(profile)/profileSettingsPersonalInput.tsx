import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import CustomTextInput1 from "../(general)/customTextInput1";

type ProfileSettingsPersonalInputProps = {
  value: string;
  title: string;
  onChange: (text: string) => void;
  isOffline: boolean;
  text?: boolean;
};

const ProfileSettingsPersonalInput = ({
  value,
  title,
  onChange,
  isOffline,
  text = false,
}: ProfileSettingsPersonalInputProps) => {
  return (
    <TouchableOpacity className="flex-1 w-full mt-2">
      <Text className="text-gray-300 font-bold text-[13px] ">{title}</Text>
      {isOffline ? (
        <Text className="text-white font-bold mx-2">{value}</Text>
      ) : text ? (
        <View className="m-1">
          <Text className="text-gray-300 font-bold text-[13px] ml-3">{value}</Text>
        </View>
      ) : (
        <CustomTextInput1 value={value} onChange={onChange} />
      )}
    </TouchableOpacity>
  );
};

export default ProfileSettingsPersonalInput;
