import { View, Text } from "react-native";
import React from "react";
import Svg, { Circle } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome5";
import { returnColor } from "@/functions/returnColor";

const VektorCircle = ({
  color,
  percentage,
  icon,
  strokeColor,
  sizeMultiplier = 1,
}: {
  color: string;
  percentage: number;
  icon: string;
  strokeColor: string;
  sizeMultiplier?: number;
}) => {
  const baseRadius = 15;
  const baseStroke = 3;
  const baseSize = 40;
  const baseIconSize = 12;

  const radius = baseRadius * sizeMultiplier;
  const strokeWidth = baseStroke * sizeMultiplier;
  const size = baseSize * sizeMultiplier;
  const iconSize = baseIconSize * sizeMultiplier;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  const angle = (percentage / 100) * 360 - 90;
  const radians = (angle * Math.PI) / 180;

  const dotX = center + radius * Math.cos(radians);
  const dotY = center + radius * Math.sin(radians);

  const betterColor = color.includes("#") ? color : returnColor(color, strokeColor);
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Hintergrundkreis */}
        <Circle
          cx={Number.isNaN(center) ? 0 : center}
          cy={Number.isNaN(center) ? 0 : center}
          r={radius}
          stroke={betterColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Fortschrittsbalken */}
        <Circle
          cx={Number.isNaN(center) ? 0 : center}
          cy={Number.isNaN(center) ? 0 : center}
          r={radius}
          stroke={betterColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={
            Number.isNaN(circumference - progress)
              ? 0
              : circumference - progress
          }
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Roter Punkt */}
        { percentage < 100 && (
        <Circle
          cx={Number.isNaN(dotX) ? 0 : dotX}
          cy={Number.isNaN(dotY) ? 0 : dotY}
          r={5 * sizeMultiplier}
          fill={betterColor}
        />
        )}
      </Svg>

      {/* Icon in der Mitte */}
      <View
        style={{
          position: "absolute",
          top: size / 2 - iconSize / 2,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        {
          percentage >= 100 ? (
          <Icon name={"check"} size={iconSize} color={betterColor} />  
          ) : (
        <Text
          style={{
            fontSize: 10 * sizeMultiplier,
            color: betterColor,
            fontWeight: "bold",
            
          }}
        >
         {typeof percentage === "number" ?
          percentage > 100 ? 100 : percentage < 0 ? 0 : percentage : 
          0}
        </Text>
          )
        }
      </View>
    </View>
  );
}

export default VektorCircle;
