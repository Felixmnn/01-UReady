import { View, Text } from 'react-native'
import React from 'react'

const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("Adsense konnte nicht geladen werden", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-DEINE_ADSENSE_CLIENT_ID"
      data-ad-slot="DEIN_AD_SLOT"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}

export default AdBanner