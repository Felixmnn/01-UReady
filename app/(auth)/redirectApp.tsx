import { View, Text, Linking, Button } from 'react-native';
import React, { useEffect, useState } from 'react';

const RedirectApp = () => {
    const [parse, setParse] = useState('');
    const [parsedUrl, setParsedUrl] = useState(null);
    const [fragment, setFragment] = useState(null);
    const [ userId, setUserId] = useState(null);
    const [ secret, setSecret] = useState(null);
    
  const redirectToApp = async () => {
    try {
      const url = await Linking.getInitialURL();
      setParsedUrl(url); // für Debugging
      if (!url) return;
    
      let userId = null;
      let secret = null;

      // Prüfen, ob Fragment oder Query-Parameter
      if (url.includes('?')) {
        const query = url.split('?')[1];
        const params = new URLSearchParams(query);
        userId = params.get('userId') || '';
        secret = params.get('secret') || '';
    
      }
    
      setUserId(userId); // für Debugging
      setSecret(secret); // für Debugging
      setParse(`userId: ${userId}, secret: ${secret}`); // für Debugging

      if (!userId || !secret) {
        console.warn('Fehlende Parameter.');
        return;
      }

      const targetUrl = `exp://10.0.10.209:8081/?userId=${userId}&secret=${secret}`;
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        Linking.openURL(targetUrl);
      } else {
        console.warn('URL-Scheme wird nicht unterstützt:', targetUrl);
      }
    } catch (err) {
      console.error('Fehler beim Redirect:', err);
    }
  };

  useEffect(() => {
    redirectToApp(); // automatisch beim Laden
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Wird weitergeleitet...</Text>
      <Button title="Manuell weiterleiten" onPress={redirectToApp} />
        <Text className='text-start'>User ID: {userId}</Text>
        <Text className='text-start'>Secret: {secret}</Text>
      
    </View>
  );
};

export default RedirectApp;
