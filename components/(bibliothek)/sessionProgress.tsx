import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SessionProgress = ({
  size = 85,
  progressr,
  backgroundColor = "rgba(255,255,255,0.2)", // Hintergrundfarbe für den leeren Bereich
  strokeWidth = 6,
  children,
  className = "",
  selected,
  strokeColor = "red",
}: {
  size?: number;
  progressr: number;
  backgroundColor?: string;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
  selected: boolean;
  strokeColor?: string;
}) => {
  const radius = (size - strokeWidth) / 2; // Berechnung des Radius
  const circumference = 2 * Math.PI * radius; // Umfang des Kreises
  const progressOffsetRed = circumference - progressr * 2; // Fortschrittsberechnung
  return (
    <View className="items-center ">
      <View
        className={`my-1 relative flex items-center justify-center  rounded-full ${selected ? "opacity-100" : "opacity-30"} ${className}`}
        style={{ width: size, height: size }}
      >
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
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffsetRed ? progressOffsetRed : 0}
            strokeLinecap="round"
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
