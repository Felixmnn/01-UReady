import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";

const Selectable = ({
  icon,
  bgColor,
  iconColor,
  empfolen,
  title,
  handlePress,
}: {
  icon: string;
  bgColor: string;
  iconColor: string;
  empfolen: boolean;
  title: string;
  handlePress: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-full justify-between p-3 rounded-10px border-gray-600 border-[1px] rounded-[10px] my-2"
    >
      <View
        className={`h-[45px] w-[45px] ${bgColor} items-center justify-center rounded-full`}
      >
        {icon === "robot" ? (
          <Image
            tintColor={iconColor}
            source={require("../../assets/bot.png")}
            style={{
              height: 30,
              width: 30,
            }}
          />
        ) : (
          <Icon name={icon} size={20} color={iconColor} />
        )}
      </View>
      {empfolen ? (
        <View
          className="items-center justify-center border-[1px] border-green-500 bg-green-700 bg-opacity-10 rounded-[5px]  my-1"
          style={{ maxWidth: 70 }}
        >
          <Text className="text-green-500 text-[10px]">
            {t("singleModule.recommended")}
          </Text>
        </View>
      ) : null}
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-200 font-bold text-[15px] pr-2">
          {title}
        </Text>
        <Icon name="chevron-right" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );
};

export default Selectable;
