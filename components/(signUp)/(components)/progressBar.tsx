import { View, TouchableOpacity, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

const ProgressBar = ({
  handlePress,
  percent,
  hideGoBack = false,
}: {
  hideGoBack?: boolean;
  handlePress: () => void;
  percent: number;
}) => {
  const normalizedPercent = Math.max(0, Math.min(100, percent));
  const animatedPercent = useRef(new Animated.Value(normalizedPercent)).current;
  const previousPercentRef = useRef(normalizedPercent);

  useEffect(() => {
    Animated.timing(animatedPercent, {
      toValue: normalizedPercent,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    previousPercentRef.current = normalizedPercent;
  }, [animatedPercent, normalizedPercent]);

  const animatedWidth = animatedPercent.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="w-full flex-row items-center justify-between mb-4">
      {!hideGoBack && (
        <TouchableOpacity onPress={handlePress} className="mr-2">
          <Icon name="arrow-left" size={20} color="#4B5563" />
        </TouchableOpacity>
      )}
      <View
        className="bg-gray-900 flex-1 rounded-[10px] "
        style={{ height: 6 }}
      >
        <Animated.View
          className="bg-blue-500 h-full rounded-full"
          style={{ width: animatedWidth }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
