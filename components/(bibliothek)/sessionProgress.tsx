import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SessionProgress = ({
  size = 70, // Standardgröße
  progress = 50, // Fortschritt in %
  progressr,
  progressy,
  progressg,
  progressb,
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
  const progressOffsetRed = circumference - (progressr / 100) * circumference; // Fortschrittsberechnung
  const progressOffsetYellow = circumference - (progressy / 100) * circumference; // Fortschrittsberechnung
  const progressOffsetGreen = circumference - (progressg / 100) * circumference; // Fortschrittsberechnung
  const progressOffsetBlue = circumference - (progressb / 100) * circumference; // Fortschrittsberechnung
  console.log(progressr,progressy,progressg,progressb)
  console.log(progressOffsetRed,progressOffsetYellow,progressOffsetGreen,progressOffsetBlue)
  return (
    <View className="items-center">
        {!first ? <View className="border-gray-500 pt-4 border-l-[5px]"></View> : null}
    <TouchableOpacity onPress={setSelected} className={`relative flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-600 rounded-full ${selected ? "opacity-100" : "opacity-30"} ${className}`} style={{ width: size, height: size }}>
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
       <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"yellow"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffsetYellow}
          strokeLinecap="butt"
          rotation={`${-90 + progressr * 3.6  }`}
          origin={`${size / 2}, ${size / 2}`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"green"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffsetGreen}
          strokeLinecap="butt"
          rotation={`${-90 + progressr * 3.6 + progressy * 3.6  }`}
          origin={`${size / 2}, ${size / 2}`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={"blue"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffsetBlue}
          strokeLinecap="butt"
          rotation={`${-90 + progressr * 3.6 + progressy * 3.6 + progressg * 3.6 }`}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Inhalt im Kreis */}
      <View className="absolute">{children}</View>
    </TouchableOpacity>
    </View>
  );
};

export default SessionProgress;
