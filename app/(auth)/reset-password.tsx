import { View, Text, Platform, TextInput, useWindowDimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';
import { resetPassword, updatePassword } from '@/lib/appwrite';
import { router } from 'expo-router';
import LoginButton from '@/components/(auth)/loginButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import  languages  from '@/assets/exapleData/languageTabs.json';


const ResetPassword = () => {
    const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.auth;
    useEffect(() => {
        if(language) {
        setSelectedLanguage(language)
        }
    }, [language])

    const [secret, setSecret] =  useState(new URLSearchParams(window.location.search).get('secret'))
    const [userId, setUserId] =  useState(new URLSearchParams(window.location.search).get('userId'))
    const { width } = useWindowDimensions();
    const [ recoveryMail, setRecoveryMail] = useState("");
    const [ newPassword, setNewPassword] = useState({
        password: "",
        passwordConfirm: ""
    });
    const [ isError, setIsError] = useState(false);
    const [ errorMessage, setErrorMessage] = useState(texts[selectedLanguage].error);
    const [ mailSent, setMailSent] = useState(false);
    const [ successFull, setSuccessFull] = useState(false);

    async function requestPasswordReset() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(recoveryMail)) {
            setErrorMessage(texts[selectedLanguage].pleaseValidMail)
            setIsError(true)
            return;
        } else {
            setMailSent(true)
            
            await resetPassword(recoveryMail)
        }
    }

    async function resetPasswordRequest() {
        if (newPassword.password.length < 8) {
            setErrorMessage(texts[selectedLanguage].passwordLength)
            setIsError(true)
            return;
        } else if (newPassword.password !== newPassword.passwordConfirm) {
            setErrorMessage(texts[selectedLanguage].passwordMatch)
            setIsError(true)
            return;
        } else {
            const res = await updatePassword(userId, secret, newPassword.password);
            if (!res ) {
                setErrorMessage(`${res}:${texts[selectedLanguage].tryAgain}`)
                setIsError(true)
                setSecret(null)
                setUserId(null)
                return;
            } else {
                setSuccessFull(true);
            }
        }
    }

    const handleAppRedirect = () => {
        if (Platform.OS === 'web') {
        alert(texts[selectedLanguage].pleaseGoToAppToSignIn);
        } else {
        Linking.openURL('exp://10.0.10.209:8081/'); 
        }
    };

    
  return (
    <SafeAreaView className="flex-1 p-4 items-center justify-center bg-[#0c111d] ">
        <ErrorPopup
            isError={isError} setIsError={setIsError} errorMessage={errorMessage}
            />
        <View className='w-full h-full   rounded-[10px] mt-2  p-2 '
            style={{
                maxWidth: 300,
                maxHeight: 300,
            }}
        >
        {
            successFull ? 
                <View className='flex-1 items-center justify-center bg-[#0c111d] rounded-[10px] m-2'>
                    <Text className='text-white font-bold text-xl'>{texts[selectedLanguage].successMessage}</Text>

                    <TouchableOpacity onPress={handleAppRedirect}>
                        <Text className='text-blue-500 font-bold text-lg mt-2'>{texts[selectedLanguage].backToLoginApp}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/sign-in')}>
                        <Text className='text-blue-500 font-bold text-lg mt-2'>{texts[selectedLanguage].backToLoginWeb}</Text>
                    </TouchableOpacity>
                </View>

             :
            secret && userId ? (
                <View className='flex-1 items-center justify-center bg-[#0c111d] rounded-[10px]'>
                    <Text className='text-white'>{texts[selectedLanguage].resetPassword}</Text>
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                            height: 50,
                            borderColor: newPassword.password.length > 7 ? "#1e3a8a" : "gray",
                            borderWidth: 2
                        }}
                        placeholder={texts[selectedLanguage].password}
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={newPassword.password}
                        onChangeText={(text) => setNewPassword({ ...newPassword, password: text })}
                    />
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                            height: 50,
                            borderColor: newPassword.passwordConfirm.length > 7 ? "#1e3a8a" : "gray",
                            borderWidth: 2
                        }}
                        placeholder={texts[selectedLanguage].confirmPassword}
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={newPassword.passwordConfirm}
                        onChangeText={(text) => setNewPassword({ ...newPassword, passwordConfirm: text })}
                    />
                    <LoginButton
                        title={texts[selectedLanguage].resetPassword}
                        handlePress={async () => await resetPasswordRequest()}
                        isSubmitting={false}
                        isReady={newPassword.password.length > 7 && newPassword.passwordConfirm.length > 7 ? true : false}
                    />
                </View>
            ) : (
                <View className='flex-1 items-center justify-center bg-[#0c111d] rounded-[10px] m-2'>
                    <Text className='text-white font-bold text-xl'>{texts[selectedLanguage].resetPassword}</Text>
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                            height: 50,
                            borderColor: recoveryMail.length > 7 ? "#1e3a8a" : "gray",
                            borderWidth: 2
                        }}
                        placeholder={texts[selectedLanguage].passwordRecoveryMail}
                        placeholderTextColor="#fff"
                        value={recoveryMail}
                        onChangeText={(text) => setRecoveryMail( text )}
                    />
                    {
                        mailSent ? (
                            <View className='items-center justify-center bg-[#0c111d] rounded-[10px] m-2'>
                                <Text className='text-green-500 font-bold text-[15px] mt-3 '>{texts[selectedLanguage].mailHasBeenSent}</Text>
                                <Text className='text-white font-bold text-[15px] mt-3 '>{texts[selectedLanguage].pleaseCheckYourPostfach}</Text>
                            </View>
                        ) : 
                        <LoginButton
                            title={texts[selectedLanguage].passwordRecoveryMail}
                            handlePress={async ()=> await requestPasswordReset()}
                            isSubmitting={false}
                            isReady={recoveryMail.length > 7 ? true : false}
                        />
                    }
                    
                </View>
            )
        }
        </View>
    </SafeAreaView>
  )
}

export default ResetPassword