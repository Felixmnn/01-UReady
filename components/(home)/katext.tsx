import { getHeight, getZoom } from '@/functions/editQuestion';
import React from 'react';
import { Platform } from 'react-native';
import katexWeb from "./katex.web";
import katexNative from "./katex.native";

export default function KaTeXExample({ formula, fontSize, height }: {
  formula: string;
  fontSize?: number;
  height?: number;
}) {
  if (Platform.OS === 'web') {
    return katexWeb({ formula, fontSize, height });
  }
  return katexNative({ formula, fontSize, height });
}