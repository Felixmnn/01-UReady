import { View, Text, TextInput, TouchableOpacity, Platform, ActivityIndicator, useWindowDimensions, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { addNewUserConfig } from '@/lib/appwriteAdd';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { createUser, loginWithGoogle } from '@/lib/appwrite';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';

const SingnUp = () => {
    const { setIsLoggedIn,setUser } = useGlobalContext();

    const { width } = useWindowDimensions();
    const isVertical = width > 700;
    const [ isError, setIsError] = useState(false);
    const [ isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");
    
    const [ signUpForm, setSignUpForm] = useState({
          email: "",
          password: "",
          passwordConfirm: "",
          username: ""
        });
    async function signUp() { 
          if (signUpForm.username.length < 3) {
            setErrorMessage("Bitte einen Benutzernamen eingeben")
            setIsError(true)
            return;
          } else if (signUpForm.email.length < 5) {
            setErrorMessage("Bitte eine gültige E-Mail Adresse eingeben")
            setIsError(true)
            return;
          } else if (signUpForm.password.length < 8) {
            setErrorMessage("Passwort muss mindestens 8 Zeichen lang sein")
            setIsError(true)
            return;
          }  else if (signUpForm.password !== signUpForm.passwordConfirm) {
            setErrorMessage("Passwörter stimmen nicht überein")
            setIsError(true)
            return;
          } else {
          try {
            const user = await createUser(signUpForm.email, signUpForm.password, signUpForm.username);
            if (user.success === false) {
              setErrorMessage(user.error)
              setIsError(true)
              return;
            } else { 
              const userData = await addNewUserConfig(user.data.$id);
              setUser(user.data);
              setIsLoggedIn(true);
              router.push("/personalize");
            }
            
          } catch (error) {
            setErrorMessage(error.message)
            setIsError(true)
          } }}

          const LoginButton = ({title, handlePress}) => {
                return (
                  <TouchableOpacity disabled={isSubmitting} className=" p-2 w-full rounded-[10px] mt-2 items-center justify-center"
                    style={{
                      width: Platform.OS === 'web' ? null : width - 60, 
                      height: 40,
                      backgroundColor: "#1e3a8a"
                    }}
                    onPress={handlePress}>
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text className="text-white">{title}</Text>)
                      }
                  </TouchableOpacity>
                )
              }

        const LogInOption = ({iconName, title, bgColor, handlePress}) => {
                return (
                  <View>
                  {
                    Platform.OS === "web" ?
                  <TouchableOpacity onPress={()=>{
                      if (handlePress){
                          handlePress()
                      } else {
                          setIsVisible(true)
                      }
                  }} className={` p-2 flex-row items-center justify-center bg-blue-900 rounded-full mx-2 mt-2 `}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#1e3a8a"
        
                  }}
                  >
                    <Icon name={iconName} size={20} color="#fff" />
                  </TouchableOpacity>
                  : null
                }
                </View>
                )
              }

  return (

      <SafeAreaView className="flex-1 p-4 items-center justify-center bg-[#0c111d] ">
            <ErrorPopup isError={isError} setIsError={setIsError} errorMessage={errorMessage} />
            <View className="bg-gray-900 rounded-[10px] mt-2 border-gray-500 border-[1px] "
                        
                        >
                          <View className={` ${isVertical ? "flex-row" : null} items-center justify-center`}>
                            {
                              isVertical ? (
                                <View className="min-h-[300px] max-w-[300px] h-full rounded-l-[10px] bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center p-4">
                                  <Image source={require("../../assets/Check.gif")} style={{ width: 100, height: 100 }} />
                                  <Text className="font-bold text-3xl max-w-[300px] text-center text-white"> Alle Tools für den Lernerfolg.</Text>
                                </View>
                              ) : null
                            }
                            <View className={` min-h-[300px] max-w-[300px]  m-2 items-center justify-center p-4 ${isVertical ? "w-[300px] rounded-r-[10px]" : " rounded-[10px]  "}`}
                            style={{
                              width: 300
                            }}
                            >
            

            <Text className='text-white font-bold text-xl'>Sign Up</Text>
            <TextInput
                className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800 "
                style={{
                    width: Platform.OS === 'web' ? null : width - 60,
                    height: 40
                }}
                placeholder="Username"
                placeholderTextColor="#fff"
                value={signUpForm.username}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, username: text })}
            />
            <TextInput
                className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                style={{
                    width: Platform.OS === 'web' ? null : width - 60, 
                    height: 40
                }}
                placeholder="E-Mail"
                placeholderTextColor="#fff"
                value={signUpForm.email}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, email: text })}
            />
            <TextInput
                className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                style={{
                    width: Platform.OS === 'web' ? null : width - 60, 
                    height: 40
                }}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                value={signUpForm.password}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, password: text })}
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
                value={signUpForm.passwordConfirm}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, passwordConfirm: text })}
            />
            <LoginButton title="Registrieren" handlePress={() => {signUp()}} />
            <LogInOption iconName="google" title="Weiter mit Google" bgColor="bg-[#4285F4]" handlePress={() => { if ( Platform.OS === "web") {
                loginWithGoogle()}}}/>

            <TouchableOpacity onPress={()=> router.push("/sign-in")} className="mt-2 items-center justify-center">
                <Text className="text-blue-500">Anmelden</Text>
            </TouchableOpacity>
            
            </ View>
            </View>
            </View>
    </SafeAreaView>
  )
}

export default SingnUp