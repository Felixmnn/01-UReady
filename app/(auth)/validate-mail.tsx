import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { enterResponse } from '@/lib/appwrite';

const ValidMail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get('secret');
    const userId = urlParams.get('userId');

    if (!secret || !userId) {
      setError(true);
      setLoading(false);
      return;
    }

    async function validateMail() {
      try {
        const response = await enterResponse(secret, userId);
        console.log('response', response);

        if (response) {
          console.log('Mail validated successfully');
        } else {
          console.warn('Validation failed');
        }

        window.location.href = '/profil';
      } catch (err) {
        console.error('Validation error:', err);
        setError(true);
        setLoading(false);
      }
    }

    validateMail();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0c111d]">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Validating Mail...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0c111d]">
        <Text className="text-red-500">Fehler bei der Mail-Verifizierung</Text>
      </View>
    );
  }

  return null; // Optional, da du ohnehin weiterleitest
};

export default ValidMail;
