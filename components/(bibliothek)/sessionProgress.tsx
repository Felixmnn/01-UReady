import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SessionProgress = ({
  size = 85, // Standardgröße
  progress = 50, // Fortschritt in %
  progressr,
  
  color = "#2958ec", // Standardfarbe
  backgroundColor = "rgba(255,255,255,0.2)", // Hintergrundfarbe für den leeren Bereich
  strokeWidth = 6, // Dicke des Fortschrittsbalkens
  children, // Inhalt des Kreises (z. B. Text)
  className = "", // Tailwind-Klassen
  first,
  last,
  handlePress,
  selected,
  setSelected
}) => {
  const radius = (size - strokeWidth) / 2; // Berechnung des Radius
  const circumference = 2 * Math.PI * radius; // Umfang des Kreises
  const progressOffsetRed = circumference - (progressr * 2 ); // Fortschrittsberechnung
  
  console.log(progressr)
  return (
    <View className="items-center ">
    <View className={`my-1 relative flex items-center justify-center  rounded-full ${selected ? "opacity-100" : "opacity-30"} ${className}`} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Hintergrund-Kreis */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fortschritts-Kreis */}
       
        
         <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"red"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffsetRed}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
       
      </Svg>
      {/* Inhalt im Kreis */}
      <View className="absolute">{children}</View>
    </View>
    </View>
  );
};

export default SessionProgress;
