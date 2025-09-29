import { getHeight, getZoom } from '@/functions/editQuestion';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function KaTeXExample({ formula, fontSize, height }:{
  formula: string;
  fontSize?: number;
  height?: number;
}) {
  const [webViewHeight, setWebViewHeight] = useState(40);
  console.log("Rendering formula:", formula);
const justLatex = JSON.stringify(formula.replace(/(HEIGHT_NEUTRAL|HEIGHT_SMALL|HEIGHT_MEDIUM|HEIGHT_LARGE|ZOOM_IN_[123]|ZOOM_OUT_[123]|ZOOM_NEUTRAL)+$/, ''))
  console.log("Extracted LaTeX:", justLatex); 
  const fontS = fontSize ?  fontSize : getZoom(formula);
  const heightS = height ? height : getHeight(formula);
  console.log("Calculated font size:", fontS, fontSize);
  console.log("Calculated height size:", heightS, height);

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <style>
          body { margin:0; padding:0; }
          .formula { font-size: ${fontS}px; color: white; }
        </style>
      </head>
      <body>
        <div class="formula" id="formula"></div>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
        <script>
          try {
            const tex = ${justLatex};
            const formulaDiv = document.getElementById('formula');
            katex.render(tex, formulaDiv, { throwOnError: false, displayMode: true });
            setTimeout(function() {
              window.ReactNativeWebView.postMessage(formulaDiv.offsetHeight);
            }, 100);
          } catch (e) {
            document.getElementById('formula').textContent = 'KaTeX render error: ' + e.message;
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ height: heightS, width: '100%' }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ height: webViewHeight, width: '100%', backgroundColor: 'transparent' }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={event => {
          const height = Number(event.nativeEvent.data);
          if (height > 0) setWebViewHeight(height + 20);
        }}
      />
    </View>
  );
}