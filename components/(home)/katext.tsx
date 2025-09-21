import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

interface KaTeXExampleProps {
  formula: string;
  fontSize?: number;
}

export default function KaTeXExample({ formula, fontSize = 16 }: KaTeXExampleProps) {
  // HTML Template für sichere KaTeX-Darstellung
  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
      <style>
        body { display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
        .formula { font-size: ${fontSize}px; color: white; }
      </style>
    </head>
    <body>
      <div class="formula" id="formula"></div>

      <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
      <script>
        try {
          const tex = ${JSON.stringify(formula)};
          const formulaDiv = document.getElementById('formula');
          // Sicheres Rendern, kein innerHTML
          katex.render(tex, formulaDiv, { throwOnError: false, displayMode: true });
        } catch (e) {
          document.getElementById('formula').textContent = 'KaTeX render error: ' + e.message;
        }
      </script>
    </body>
  </html>
  `;

  return (
      <View style={{ height: 220 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ height: 220, width: '100%', backgroundColor: 'transparent' }}
        javaScriptEnabled
        domStorageEnabled
      />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1, backgroundColor: 'transparent' },
});