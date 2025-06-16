import { View, Text, TextInput, TouchableOpacity, Platform, ActivityIndicator, useWindowDimensions, SafeAreaView, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import { createUser, loginWithGoogle } from '@/lib/appwrite';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';
import { loginWithOAuth } from '@/lib/appwriteOAuth';
import Policys from '../(about)/policys';

const SingnUp = () => {
    const { setIsLoggedIn,setUser, setUserData } = useGlobalContext();

    const { width } = useWindowDimensions();
    const isVertical = width > 700;
    const [ isError, setIsError] = useState(false);
    const [ isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ policysVisible, setPolicysVisible ] = useState(false);
      const [ consetGiven, setConsetGiven] = useState(false)
    
    const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");

    const PolicyModal = () => {
      return (
        <Modal
          transparent={true}
          visible={policysVisible}
          animationType="slide"
          onRequestClose={() => setPolicysVisible(false)}
        >
          <View className="flex-1 bg-black bg-opacity-50 items-center justify-center">
            <View className="bg-gray-900 rounded-lg p-4 w-11/12 max-w-md">
        <Policys/>
            <TouchableOpacity
              className="mt-4 bg-blue-500 p-2 rounded-lg"
              onPress={() => setPolicysVisible(false)}
            >
              <Text className="text-white text-center">Schließen</Text>
            </TouchableOpacity>
          </View>
          </View>
        </Modal>
      )
    }

    function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(email)) {
      return true;
    } else {
      return false;
  }
}
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
          } else if (!consetGiven) {
            setErrorMessage("Bitte den AGB zustimmen")
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
                  <TouchableOpacity className=" p-2 w-full rounded-[10px] mt-2 items-center justify-center"
                    style={{
                      width: Platform.OS === 'web' ? null : width - 60, 
                      height: 50,
                      backgroundColor: "#1e3a8a",
                      opacity: isSubmitting || !signUpForm.username || !signUpForm.email || !signUpForm.password || !signUpForm.passwordConfirm || signUpForm.password !== signUpForm.passwordConfirm || signUpForm.username.length < 3 || !isValidEmail(signUpForm.email) ? 0.5 : 1
                    }}
                    onPress={handlePress}
                    disabled={isSubmitting || !signUpForm.username || !signUpForm.email || !signUpForm.password || !signUpForm.passwordConfirm || signUpForm.password !== signUpForm.passwordConfirm || signUpForm.username.length < 3 || !isValidEmail(signUpForm.email) ? true : false}
                    >

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
                    Platform.OS === "web" || true ?
                  <TouchableOpacity onPress={()=>{
                    if (!consetGiven) {
                      setErrorMessage("Bitte den AGB zustimmen")
                      setIsError(true)
                      return;
                    }
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
            <PolicyModal />
            <ErrorPopup isError={isError} setIsError={setIsError} errorMessage={errorMessage} />
            <View className={`rounded-[10px] mt-2 ${isVertical ? "border-gray-500 border-[1px]" : "" }  `}
                        
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
            

            <Text className='text-white font-bold text-3xl'>Sign Up</Text>
            <TextInput
                className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800 "
                style={{
                    width: Platform.OS === 'web' ? null : width - 60,
                    height: 50,
                    borderColor: signUpForm.username.length > 4 ? "#1e3a8a" : "gray",
                    borderWidth: 2
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
                    height: 50,
                    borderColor: isValidEmail(signUpForm.email) ? "#1e3a8a" : "gray",
                    borderWidth: 2
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
                    height: 50,
                    borderColor: signUpForm.password.length > 7 ? "#1e3a8a" : "gray",
                    borderWidth: 2
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
                    height: 50,
                    borderColor: signUpForm.passwordConfirm.length > 7 && signUpForm.passwordConfirm === signUpForm.password ? "#1e3a8a" : "gray",
                    borderWidth: 2
                }}
                placeholder="Password bestätigen"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                value={signUpForm.passwordConfirm}
                onChangeText={(text) => setSignUpForm({ ...signUpForm, passwordConfirm: text })}
            />
            <View className="flex-row items-center space-x-2 mt-2 mb-2">
                <TouchableOpacity
                  onPress={() => setConsetGiven(!consetGiven)}
                  className={`w-5 h-5 rounded border-[1px] ${consetGiven ? 'bg-blue-600 border-blue-600' : 'border-gray-400'} justify-center items-center`}
                >
                  {consetGiven && (
                    <Icon name="check" size={12} color="#fff" />
                  )}
                </TouchableOpacity>
                <Text className="text-gray-300 text-sm">
                  Ich stimme den{' '}
                  <Text className="text-blue-400 underline" onPress={() => setPolicysVisible(true)}>
                    AGB
                  </Text>{' '}
                  zu.
                </Text>
              </View>
            <LoginButton title="Registrieren" handlePress={() => {signUp()}} />
            <LogInOption iconName="google" title="Weiter mit Google" bgColor="bg-[#4285F4]" handlePress={() => {
                                    if ( Platform.OS === "web") {
                                      loginWithGoogle()}
                                    else {
                                      loginWithOAuth({setUserData,setUser})
                                    }
                                      }}/>

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