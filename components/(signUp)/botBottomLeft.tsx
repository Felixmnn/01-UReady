import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

const BotBottomLeft = ({
  message = "",
  isVisible,
  setIsVisible,
}:{
  message: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const TypewriterText = ({ text, speed = 50 }:{
    text: string;
    speed?: number;
  }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
      let index = 0;
      let isCancelled = false;

      const typeNext = () => {
        if (index < text.length - 1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
          setTimeout(typeNext, speed);
        }
      };

      setDisplayedText(""); // Reset text when `text` prop changes
      typeNext();

      return () => {
        isCancelled = true;
      };
    }, [text]);

    return (
      <Text style={{ color: "white", fontSize: 18 }}>{displayedText}</Text>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
    >
      <TouchableOpacity
        className="flex-1 justify-end items-center"
        onPress={() => setIsVisible(false)}
      >
        <View className="absolute bottom-0 left-0 right-0 p-4 rounded-t-lg  items-start">
          <View
            className="bg-blue-500 p-4 rounded-lg shadow-lg"
            style={{
              maxWidth: 200,
              borderRadius: 15,
              position: "relative",
              left: 80,
              top: 15,
            }}
          >
            <TypewriterText text={message = message[0] + message} speed={40} />
            <View
              style={{
                position: "absolute",
                bottom: -10,
                left: 20,
                width: 0,
                height: 0,
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopWidth: 10,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "#3B82F6",
              }}
            />
          </View>
          <Image
            source={require("../../assets/Check.gif")}
            className="w-full"
            style={{ height: 180, width: 150 }}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default BotBottomLeft;
