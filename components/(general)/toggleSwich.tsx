import React, { useState, useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";

const ToggleSwitch = ({
  onToggle,
  isOn = false,
}: {
  onToggle?: (newValue: boolean) => void;
  isOn?: boolean;
}) => {
  const [toggled, setToggled] = useState(isOn);
  const translateX = useRef(new Animated.Value(isOn ? 14 : 0)).current; // Halbe Verschiebung (24 → 14)

  const toggleSwitch = () => {
    const newValue = !toggled;
    setToggled(newValue);
    onToggle?.(newValue);

    Animated.timing(translateX, {
      toValue: newValue ? 14 : 0, // Halbe Strecke (24 → 14)
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      activeOpacity={0.7}
      style={{
        width: 30, // Halbe Breite
        height: 16, // Halbe Höhe
        borderRadius: 8, // Angepasst für runde Ecken
        padding: 2, // Kleineres Padding
        backgroundColor: toggled ? "#10B981" : "red",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          width: 12, // Halber Knopf
          height: 12,
          borderRadius: 6,
          backgroundColor: "#FFFFFF",
          transform: [{ translateX }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 1,
        }}
      />
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
