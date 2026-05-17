import React, { use } from "react";
import { View, Platform, useWindowDimensions } from "react-native";
import Katex from "react-native-katex";
import { getHeight } from "@/functions/editQuestion";

export default function KaTeXExample({
  formula,
  fontSize,
  height,
}: {
  formula: string;
  fontSize?: number;
  height?: number;
}) {
  // Entferne interne Suffix-Kommandos
  const cleaned = formula.replace(
    /(HEIGHT_NEUTRAL|HEIGHT_SMALL|HEIGHT_MEDIUM|HEIGHT_LARGE|ZOOM_IN_[123]|ZOOM_OUT_[123]|ZOOM_NEUTRAL)+$/,
    ""
  );

  const widthScreen = useWindowDimensions().width;
  const heightScreen = useWindowDimensions().height;

  function isIpad() {
    return (
      (Platform.OS === "ios" && Platform.isPad) ||  (Platform.OS === "android" && (widthScreen >= 768 && heightScreen >= 768))
    )
    }

const isIPad = isIpad();
  const ipadScale = 0.75; // vorher 0.8


  // Für iPad etwas kleiner rechnen
  const effectiveFontSize =
    fontSize != null ? (isIPad ? fontSize * ipadScale : fontSize) : undefined;

  const heightS = height ?? getHeight(formula);
  const effectiveHeight = isIPad ? (heightS ?? 100) * ipadScale : (heightS ?? 100);

  let sizeCommand = "\\normalsize";
  if (effectiveFontSize) {
    if (effectiveFontSize <= 8) sizeCommand = "\\small";
    else if (effectiveFontSize <= 10) sizeCommand = "\\normalsize";
    else if (effectiveFontSize <= 12) sizeCommand = "\\large";
    else if (effectiveFontSize <= 16) sizeCommand = "\\Large";
    else if (effectiveFontSize <= 18) sizeCommand = "\\LARGE";
    else if (effectiveFontSize <= 20) sizeCommand = "\\huge";
    else sizeCommand = "\\Huge";
  }

  // iPad: eine Stufe kleiner
  if (isIPad) {
    sizeCommand = "\\small";
  }

  // Wichtig: NICHT mehr hart auf \Huge setzen
  const formulaWithStyle = `\\color{white} ${sizeCommand} ${cleaned}`;

  return (
    <View style={{ width: "100%", minHeight: effectiveHeight }}>
      <Katex
        expression={formulaWithStyle}
        displayMode
        throwOnError={false}
        style={{ backgroundColor: "transparent" }}
      />
    </View>
  );
}