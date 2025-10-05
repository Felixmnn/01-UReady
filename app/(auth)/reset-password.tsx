import { View, Text, Platform, TextInput, useWindowDimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';
import { resetPassword, updatePassword } from '@/lib/appwrite';
import { router } from 'expo-router';
import LoginButton from '@/components/(auth)/loginButton';
import { useTranslation } from 'react-i18next';
import CustomButton from '@/components/(general)/customButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleValidationCode } from '@/lib/appwriteEmailValidation';

const ResetPassword = () => {
    const { t } = useTranslation(); 
    const [ codeRequested, setCodeRequested ] = useState(false);
    useEffect(() => {
        AsyncStorage.getItem('codeRequested').then(value => {
            if(value === 'true') {
                setCodeRequested(true);
            }
        });
    }, []);
    
    const [ recoveryMail, setRecoveryMail] = useState("");
    const [ newPassword, setNewPassword] = useState({
        password: "",
        passwordConfirm: ""
    });
    const [ isError, setIsError] = useState(false);
    const [ errorMessage, setErrorMessage] = useState(t("passwordReset.error"));
    const [ code, setCode ] = useState("");

    
    return (
        <SafeAreaView className="flex-1 p-4 items-center justify-start bg-[#0c111d] ">
            <ErrorPopup
                isError={isError} setIsError={setIsError} errorMessage={errorMessage}
            />
            <Text className="text-white font-bold text-2xl mb-4">{t("passwordReset.title") || "Password Reset"}</Text>
            <TextInput
                value={recoveryMail}
                onChangeText={setRecoveryMail}
                placeholder={t("passwordReset.passwordRecoveryMail") || "Password Recovery Email"}
                placeholderTextColor="#888"
                className="w-full p-3 mb-2 bg-gray-800 text-white rounded"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <CustomButton
                title='Request new Code'
                containerStyles="w-full my-2 bg-blue-600"
                disabled={!recoveryMail || !recoveryMail.includes('@')}
                handlePress={async() => {
                    try {
                        const res = await handleValidationCode(recoveryMail, undefined, undefined, true)
                        AsyncStorage.setItem('codeRequested', 'true');
                        setCodeRequested(true);
                    } catch (error) {
                        console.error("Error requesting code:", error);
                        setErrorMessage(t("passwordReset.errorRequestingCode") || "Error requesting code. Please try again.");
                        setIsError(true);
                    }
                }}
            />
            { codeRequested && 
            <View className='w-full'>
            <TextInput
                value={code}
                onChangeText={setCode}
                placeholder={t("passwordReset.codePlaceholder") || "Enter your code"}
                placeholderTextColor="#888"
                className="w-full p-3 mb-2 bg-gray-800 text-white rounded"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                value={newPassword.password}
                onChangeText={(text) => setNewPassword((prev) => ({...prev, password: text}))}
                placeholder={t("passwordReset.newPassordPlaceholder") || "New Password"}
                placeholderTextColor="#888"
                className="w-full p-3 mb-2 bg-gray-800 text-white rounded"
                secureTextEntry
            />
            <TextInput
                value={newPassword.passwordConfirm}
                onChangeText={(text) => setNewPassword((prev) => ({...prev, passwordConfirm: text}))}
                placeholder={t("passwordReset.confirmPasswordPlaceholder") || "Confirm New Password"}
                placeholderTextColor="#888"
                className="w-full p-3 mb-4 bg-gray-800 text-white rounded"
                secureTextEntry
            />
            <CustomButton
                title={t("passwordReset.resetPasswordButton")}
                
                containerStyles="w-full my-2 bg-blue-600"
                handlePress={async() => {
                    if(newPassword.password.length < 8) {
                        setErrorMessage(t("passwordReset.errorPasswordTooShort") || "Password must be at least 8 characters long.");
                        setIsError(true);
                        return;
                    }
                    if(newPassword.password !== newPassword.passwordConfirm) {
                        setErrorMessage(t("passwordReset.errorPasswordsNoMatch") || "Passwords do not match.");
                        setIsError(true);
                        return;
                    }
                    try {
                        await handleValidationCode(recoveryMail, code, undefined, true, newPassword.password, newPassword.passwordConfirm);
                        
                        router.push("/sign-in");
                    } catch (error) {
                        console.error("Error resetting password:", error);
                        setErrorMessage(t("passwordReset.errorResettingPassword") || "Error resetting password. Please try again.");
                        setIsError(true);
                    }
                }}
            />
            </View>
                }
            <TouchableOpacity
                onPress={() => router.push("/sign-in")}
                className="mt-4"
            >
                <Text className="text-blue-500">{t("passwordReset.backToLogin") || "Back to Login"}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default ResetPassword