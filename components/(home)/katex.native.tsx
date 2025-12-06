import React from "react";
import { View } from "react-native";
import Katex from "react-native-katex";
import { getHeight, getZoom } from "@/functions/editQuestion";

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

  const heightS = height ?? getHeight(formula);
  // Mappe fontSize auf KaTeX LaTeX-Größenbefehle
  let sizeCommand = "\\normalsize";
  if (fontSize) {
    if (fontSize <= 8) sizeCommand = "\\small";
    else if (fontSize <= 10) sizeCommand = "\\normalsize";
    else if (fontSize <= 12) sizeCommand = "\\large";
    else if (fontSize <= 16) sizeCommand = "\\Large";
    else if (fontSize <= 18) sizeCommand = "\\LARGE";
    else if (fontSize <= 20) sizeCommand = "\\huge";
    else sizeCommand = "\\Huge";
  }

  // Weißen Text setzen
  const formulaWithStyle = `\\color{white} ${sizeCommand} ${cleaned}`;

  return (
    <View style={{ width: "100%", minHeight: heightS }}>
      <Katex
        expression={formulaWithStyle}
        displayMode
        throwOnError={false}
        style={{ backgroundColor: "transparent" }}
      />
    </View>
  );
}
