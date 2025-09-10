import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { enterResponse } from '@/lib/appwrite';
import { useTranslation } from 'react-i18next';

const ValidMail = () => {
  const { t } = useTranslation();
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
        <Text className="text-white mt-4">{t("validMail.validating")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0c111d]">
        <Text className="text-red-500">{t("validMail.validationFailed")}</Text>
      </View>
    );
  }

  return null; 
};

export default ValidMail;
