import { View, Text,TouchableOpacity, SafeAreaView,TextInput, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { Image } from 'react-native';
import SlowDeveloper from '@/components/(general)/slowDeveloper';
import CustomTextInput1 from '@/components/(general)/customTextInput1';
import { Alert } from 'react-native';
import {router} from 'expo-router';
import { signIn, createUser } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addNewUserConfig } from '@/lib/appwriteAdd';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';

const SignIn = () => {
  console.log("Der Nutzer Landet hier")
  const { setIsLoggedIn,setUser } = useGlobalContext();
  const [ isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");
  const { width } = useWindowDimensions();
  const isVertical = width > 700;
  const tools = [
      "Karteikarten",
      "Lernpläne",
      "QUizzes",
      "Spaced Repetition",
      "In einer App"
    ]
    const [isVisible, setIsVisible] = useState(false)
    const [selectedOption, setSelectedOption] = useState(0)
    const [form, setForm] = useState({
        email: "",
        password: "",
      });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitSignIn = async () => {
      if (form.email.length < 5) {
        setErrorMessage("Bitte eine gültige E-Mail Adresse eingeben")
        setIsError(true)
        return;
      } else if (form.password.length > 8) {
        setErrorMessage("Bitte ein gültiges Passwort eingeben")
        setIsError(true)
        return;
      } else {
          setIsSubmitting(true);
          try {
            const user = await signIn(form.email, form.password);
            if (user.success === false) {
              setErrorMessage(user.error)
              setIsError(true)
              return;
            } else {
              console.log("User", user);
              setUser(user.data);
              setIsLoggedIn(true);
              console.log("Success", "You have successfully signed in");
              router.push("/home");
              return;
            }
          } catch (error) {
            console.log("Error", error);
            setErrorMessage(error.message)
            setIsError(true)
          } finally {
            setIsSubmitting(false);
          
        }}
      };
      const LogInOption = ({iconName, title, bgColor, handlePress}) => {
        return (
          <TouchableOpacity onPress={()=>{
              if (handlePress){
                  handlePress()
              } else {
                  setIsVisible(true)
              }
          }} className={`flex-1 p-2 w-full flex-row items-center justify-center bg-blue-900 rounded-[10px] mx-2 my-1 ${bgColor}`}>
            <Icon name={iconName} size={20} color="#fff" />
            <Text className="ml-2 text-white font-bold">{title}</Text>
          </TouchableOpacity>
        )
      }
    const NotSelected = () => {
        return (
            <View className="flex-1 items-center justify-center "
            style={{
              width:300
            }}
            >
                <LogInOption iconName="google" title="Weiter mit Google" bgColor="bg-[#4285F4]"    />
                <LogInOption iconName={"apple"} title="Weiter mit Apple" bgColor="bg-gray-500"  />
                <LogInOption iconName={"envelope"} title="Mit E-Mail registrieren" bgColor="bg-[#4285F4]" handlePress={()=> setSelectedOption(3)} />
                <TouchableOpacity onPress={()=> setSelectedOption(4)} className={`flex-1 p-2 flex-row items-center justify-center bg-gray-900 rounded-full `}>
                    <Text className="ml-2 text-gray-600 font-bold tex-[10px] ">Ich habe bereits einen Account</Text>
                </TouchableOpacity>
            </View> 
        )
    }
    
    const [ signUpForm, setSignUpForm] = useState({
      email: "",
      password: "",
      passwordConfirm: "",
      username: ""
    });

    return (
      <SafeAreaView className="flex-1  items-center justify-center bg-[#0c111d]"
     
      >
        <ErrorPopup isError={isError} setIsError={setIsError} errorMessage={errorMessage} />
        <View className="items-center jusitfy-center">
          <View className="items-center justify-center flex-row">
            <Icon name="trophy" size={50} color="#fff" />
            <View className="items-center justify-center mx-4">
              <Text className="text-white font-bold">7</Text>
              <Text className="text-white font-bold">Nutzer</Text>
              <Text className="text-white font-bold">Weltweit</Text>
            </View>
            <Icon name="trophy" size={50} color="#fff" />
          </View>
          <View className="rounded-[10px] mt-2 border-gray-500 border-[1px]">
          <View className={` ${isVertical ? "flex-row" : null} items-center justify-center`}>
            {
              isVertical ? (
                <View className="min-h-[300px]  min-w-[300px] h-full rounded-l-[10px] bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center p-4">
                  <Image source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")} style={{ width: 100, height: 100 }} />
                  <Text className="font-bold text-3xl max-w-[300px] text-center text-white"> Alle Tools für den Lernerfolg.</Text>
                  <Text className="text-blue-500 text-center font-bold text-2xl">{tools[0]}</Text>
                </View>
              ) : null
            }
            <View className={` min-h-[300px]  min-w-[300px] bg-gray-900 items-center justify-center p-4 ${isVertical ? "rounded-r-[10px]" : "rounded-[10px] "}`}>
            {
                selectedOption === 0 ? (<NotSelected/>) : null
            }
            {
                selectedOption === 4 ? (<View className="w-full items-center justify-center">
                  <Text className='text-white font-bold text-xl'>Sign In</Text>
                  <CustomTextInput1 value={form.email} inputStyles="mt-2 text-white p-2 rounded-[10px] w-full" onChange={(value) =>{ setForm(prevForm => ({ ...prevForm, email: value })) }}  />
                  <CustomTextInput1 value={form.password} inputStyles="mt-2 text-white p-2 rounded-[10px] w-full" password={true} onChange={(value) => {setForm(prevForm => ({ ...prevForm, password: value }))}}/>
                  <TouchableOpacity className={`bg-blue-500 p-2 w-full rounded-[10px] mt-2 items-center justify-center`} disabled={isSubmitting} onPress={()=> submitSignIn()}>
                      {
                          isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Sign In</Text>
                      }
                      
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> setSelectedOption(3)} className="mt-2 items-center justify-center">
                      <Text className="text-blue-500">Registrieren</Text>
                  </TouchableOpacity>
              </View>) : null
            }
            {
                selectedOption === 3 ? (<View className="w-full  justify-center"
                style={{

                }}
                >
                <Text className='w-full text-white font-bold text-xl'>Sign Up</Text>
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
                <TouchableOpacity className="bg-blue-500 p-2 w-full rounded-[10px] mt-2 items-center justify-center"
                  style={{
                    width: Platform.OS === 'web' ? null : width - 60, 
                    height: 40
                  }}
                  onPress={async () => {
                    
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
                        console.log("Success", "You have successfully signed up");
                        router.push("/personalize");
                      }
                      
                    } catch (error) {
                      setErrorMessage(error.message)
                      setIsError(true)
                    } 
                  }}}
                >
                    <Text className="text-white">Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> setSelectedOption(4)} className="mt-2 items-center justify-center">
                    <Text className="text-blue-500">Anmelden</Text>
                </TouchableOpacity>
            </View>) : null
            }
            </View>
          </View>
  
          </View>
        </View>
        <SlowDeveloper isVisible={isVisible} setIsVisible={setIsVisible}/>
      </SafeAreaView>
    );
  
}

export default SignIn