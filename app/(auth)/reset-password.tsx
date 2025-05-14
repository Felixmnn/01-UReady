import { View, Text, Platform, TextInput, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';
import { resetPassword, updatePassword } from '@/lib/appwrite';
import { router } from 'expo-router';


const ResetPassword = () => {
    const [secret, setSecret] =  useState(new URLSearchParams(window.location.search).get('secret'))
    const [userId, setUserId] =  useState(new URLSearchParams(window.location.search).get('userId'))
    const { width } = useWindowDimensions();
    const [ recoveryMail, setRecoveryMail] = useState("");
    const [ newPassword, setNewPassword] = useState({
        password: "",
        passwordConfirm: ""
    });
    const [ isError, setIsError] = useState(false);
    const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");
    const [ mailSent, setMailSent] = useState(false);


    async function requestPasswordReset() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(recoveryMail)) {
            setErrorMessage("Bitte eine gültige E-Mail Adresse eingeben")
            setIsError(true)
            return;
        } else {
            setMailSent(true)
            
            await resetPassword(recoveryMail)
        }
    }

    async function resetPasswordRequest() {
        if (newPassword.password.length < 8) {
            setErrorMessage("Passwort muss mindestens 8 Zeichen lang sein")
            setIsError(true)
            return;
        } else if (newPassword.password !== newPassword.passwordConfirm) {
            setErrorMessage("Passwörter stimmen nicht überein")
            setIsError(true)
            return;
        } else {
            const res = await updatePassword(userId, secret, newPassword.password);
            console.log("Die Password Update Resonse", newPassword.password)
            if (!res ) {
                setErrorMessage(`${res}:Try again`)
                setIsError(true)
                setSecret(null)
                setUserId(null)
                return;
            } else {
                console.log("New Password", newPassword.password)
                router.push("/sign-in");
            }
        }
    }


    
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
            secret && userId ? (
                <View className='flex-1 items-center justify-center bg-[#0c111d] rounded-[10px]'>
                    <Text className='text-white'>Reset Password</Text>
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                            height: 40
                        }}
                        placeholder="Password"
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={newPassword.password}
                        onChangeText={(text) => setNewPassword({ ...newPassword, password: text })}
                    />
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                            height: 40
                        }}
                        placeholder="Password bestätigen"
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={newPassword.passwordConfirm}
                        onChangeText={(text) => setNewPassword({ ...newPassword, passwordConfirm: text })}
                    />
                    <TouchableOpacity
                        className="bg-blue-500 p-2 items-center rounded-full  mt-3"
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60, 
                        }}
                        onPress={async() => {
                            await resetPasswordRequest()
                        }}
                        >
                        <Text className="text-white font-semibold">Passwort zurücksetzen</Text>
                    </TouchableOpacity>

                </View>
            ) : (
                <View className='flex-1 items-center justify-center bg-[#0c111d] rounded-[10px] m-2'>
                    <Text className='text-white font-bold text-xl'>Reset Password</Text>
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800 "
                        style={{
                            width: Platform.OS === 'web' ? null : width - 60,
                            height: 40
                        }}
                        placeholder="Password recovery E-Mail"
                        placeholderTextColor="#fff"
                        value={recoveryMail}
                        onChangeText={(text) => setRecoveryMail( text )}
                    />
                    {
                        mailSent ? (
                                <Text className='text-green-500 font-bold text-[15px] mt-3 '>E-Mail wurde gesendet</Text>
                        ) : 
                        <TouchableOpacity
                            className="bg-blue-500 p-2 items-center rounded-full  mt-3"
                            style={{
                                width: Platform.OS === 'web' ? null : width - 60, 
                            }}
                            onPress={async() => {
                                await requestPasswordReset()
                            }}
                        >
                            <Text className="text-white font-semibold">Send recovery mail</Text>
                        </TouchableOpacity>
                    }
                    
                </View>
            )
        }
        </View>
    </SafeAreaView>
  )
}

export default ResetPassword