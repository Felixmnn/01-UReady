import React, { useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function KaTeXExample({ formula, fontSize = 16 }) {
  const [webViewHeight, setWebViewHeight] = useState(40);

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <style>
          body { margin:0; padding:0; }
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
    <View style={{ height: 80, width: '100%' }}>
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