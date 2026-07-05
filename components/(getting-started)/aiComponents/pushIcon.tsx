import { TouchableOpacity, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

/**
 * Tocuhable Opacity zum hinzufügen eines Themas oder eines Textes
 */
const PlusIcon = ({
  typeText = true,
  newitem,
  addItem,
  handleFileUpload,
  readyToPress = false,
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
  readyToPress?: boolean;
}) => {
  const colorProgress = useRef(new Animated.Value(readyToPress ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(colorProgress, {
      toValue: readyToPress ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [colorProgress, readyToPress]);

  const borderColor = colorProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4B5563", "#3b82f6"],
  });

  const iconColor = colorProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#4B5563", "#3b82f6"],
  });

  return (
    <AnimatedTouchableOpacity
      disabled={(newitem.content.length < 2 && typeText ) }
      onPress={async () => {
        if (newitem.type == "FILE") {
          await handleFileUpload();
        } else {
          addItem();
        }
      }}
      className="bg-[#0c111d] flex-row p-2  border-gray-800 border-[1px] rounded-[10px] items-center justify-center shadow-lg"
      style={{ height: 34, width: 34, marginBottom: 5, borderColor }}
    >
      <AnimatedIcon name="plus" size={15} style={{ color: iconColor }} />
    </AnimatedTouchableOpacity>
  );
};

export default PlusIcon;
