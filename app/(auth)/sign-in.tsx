import { View, Text,TouchableOpacity, SafeAreaView,TextInput, ActivityIndicator, Platform, Linking } from 'react-native'
import React, {  useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { Image } from 'react-native';
import {router} from 'expo-router';
import { signIn, loginWithGoogle } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';
import { loginWithOAuth } from '@/lib/appwriteOAuth';

const SignIn = () => {
  const { setUserData } = useGlobalContext();
  const { setIsLoggedIn,setUser } = useGlobalContext();
  const [ isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");
  const { width } = useWindowDimensions();
  const isVertical = width > 700;
  const [isVisible, setIsVisible] = useState(false)
  const [form, setForm] = useState({
        email: "",
        password: "",
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(email)) {
      return true;
    } else {
      return false;
  }
}


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
            console.log("Sign In User", user)
            if (user.success === false) {
              setErrorMessage(user.error)
              setIsError(true)
              return;
            } else {
              setUser(user.data);
              setIsLoggedIn(true);
              router.push("/home");
              return;
            }
          } catch (error) {
            setErrorMessage(error.message)
            setIsError(true)
          } finally {
            setIsSubmitting(false);
          
        }}
      };
  const LogInOption = ({iconName, title, bgColor, handlePress}) => {
        return (
          <View>
          {
            Platform.OS === "web" || true ?
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

    const LoginButton = ({title, handlePress}) => {
      return (
        <TouchableOpacity disabled={isSubmitting} className=" p-2 w-full rounded-[10px] mt-2 items-center justify-center"
          style={{
            width: Platform.OS === 'web' ? null : width - 60, 
            height: 50,
            backgroundColor: "#1e3a8a",
            opacity: isValidEmail(form.email) && form.password.length > 7 ? 1 : 0.5
          }}
          onPress={handlePress}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-xl">{title}</Text>)
            }
        </TouchableOpacity>
      )
    }


    return (
      <SafeAreaView className="flex-1 p-4 items-center justify-center bg-[#0c111d] ">
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

                    <View className="w-full items-center justify-center">
                      <Text className='text-white font-bold text-3xl'>Sign In</Text>
                      <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800  "
                        style={{
                          width: Platform.OS === 'web' ? null : width - 60,
                          height: 50,
                          borderColor: isValidEmail(form.email) ? "#1e3a8a" : "gray",
                          borderWidth: 2
                        }}
                        placeholder="E-Mail"
                        placeholderTextColor="#fff"
                        value={form.email}
                        onChangeText={(value) =>{ setForm(prevForm => ({ ...prevForm, email: value })) }}
                    />
                    <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800"
                        style={{
                          width: Platform.OS === 'web' ? null : width - 60, 
                          height: 50,
                          borderColor: form.password.length > 7 ? "#1e3a8a" : "gray",
                          borderWidth: 2
                        }}
                        placeholder="Passwort"
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => {setForm(prevForm => ({ ...prevForm, password: value }))}}
                    />
                    <TouchableOpacity onPress={()=> {
                      if (Platform.OS === "web") {
                      router.push("/reset-password")
                      } else {
                        Linking.openURL('http://10.0.10.209:8081/reset-password'); // ← Hier deine echte URL einsetzen
                      }

                    }} className="mt-2 items-center justify-center">
                        <Text className="text-white">Reset Password</Text>
                    </TouchableOpacity>
                      
                      <LoginButton title="Sign In" handlePress={()=> submitSignIn()} />
                      <LogInOption iconName="google" title="Weiter mit Google" bgColor="bg-[#4285F4]" handlePress={() => {
                        if ( Platform.OS === "web") {
                          loginWithGoogle()}
                        else {
                          loginWithOAuth({setUserData,setUser})
                        }
                          }}/>
                      <TouchableOpacity onPress={()=> router.push("/sign-up")} className="mt-2 items-center justify-center"
                        >
                          <Text className="text-blue-500"
                           
                          >Registrieren</Text>
                      </TouchableOpacity>
                      {/*
                      <TouchableOpacity onPress={async ()=> await loginWithOAuth({setUserData,setUser})} >
                        <Text className="text-gray-500 mt-2">Oauth</Text>
                      </TouchableOpacity>
                      */}
                  </View>
              </View>
            </View>
          </View>
      </SafeAreaView>
    );
  
}

export default SignIn