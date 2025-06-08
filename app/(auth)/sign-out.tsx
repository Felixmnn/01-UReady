import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { signOut } from '@/lib/appwrite';
import languages from '@/assets/exapleData/languageTabs.json';
import * as Updates from 'expo-updates';

const SignOut = () => {
  const { setUser, setIsLoggedIn, setIsLoading, language } = useGlobalContext();
  const [selectedLanguage, setSelectedLanguage] = useState('DEUTSCH');
  const texts = languages.signout;

  // Set language
  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
    }
  }, [language]);

  // Do sign-out once on mount
  useEffect(() => {
    const signOutUser = async () => {
      setIsLoading(true);
      try {
        await signOut(); // Logout from Appwrite
        setUser(undefined);
        setIsLoggedIn(false);
      } catch (err) {
        console.error('Sign out failed', err);
      } finally {
        setIsLoading(false);
        await Updates.reloadAsync();
      }
    };

    signOutUser();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-gray-100 font-semibold text-[15px] mt-2">
        {texts[selectedLanguage]?.signingOut || 'Signing out...'}
      </Text>
    </View>
  );
};

export default SignOut;
