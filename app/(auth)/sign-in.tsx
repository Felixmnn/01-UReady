import { View, Text,TouchableOpacity, SafeAreaView,TextInput, ActivityIndicator, Platform } from 'react-native'
import React, {  useState } from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { Image } from 'react-native';
import SlowDeveloper from '@/components/(general)/slowDeveloper';
import {router} from 'expo-router';
import { signIn, createUser, loginWithGoogle } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addNewUserConfig } from '@/lib/appwriteAdd';
import ErrorPopup from '@/components/(general)/(modal)/errorPopup';


const SignIn = () => {
  const { setIsLoggedIn,setUser } = useGlobalContext();
  const [ isError, setIsError] = useState(false);
  const [ errorMessage, setErrorMessage] = useState("Fehler aufgetreten");
  const { width } = useWindowDimensions();
  const isVertical = width > 700;
  const [isVisible, setIsVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(3)
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


    return (
      <SafeAreaView className="flex-1 p-4 items-center justify-center bg-[#0c111d] ">
        <ErrorPopup isError={isError} setIsError={setIsError} errorMessage={errorMessage} />
            <View className="bg-gray-900 rounded-[10px] mt-2 border-gray-500 border-[1px] "
            
            >
              <View className={` ${isVertical ? "flex-row" : null} items-center justify-center`}>
                {
                  isVertical ? (
                    <View className="min-h-[300px] max-w-[300px] h-full rounded-l-[10px] bg-gradient-to-b from-blue-900 to-[#0c111d] items-center justify-center p-4">
                      <Image source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")} style={{ width: 100, height: 100 }} />
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
                      <Text className='text-white font-bold text-xl'>Sign In</Text>
                      <TextInput
                        className="text-white p-2 rounded-[10px] w-full mt-2 bg-gray-800 "
                        style={{
                          width: Platform.OS === 'web' ? null : width - 60,
                          height: 40
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
                          height: 40
                        }}
                        placeholder="Passwort"
                        placeholderTextColor="#fff"
                        secureTextEntry={true}
                        value={form.password}
                        onChangeText={(value) => {setForm(prevForm => ({ ...prevForm, password: value }))}}
                    />
                      
                      <LoginButton title="Sign In" handlePress={()=> submitSignIn()} />
                      <LogInOption iconName="google" title="Weiter mit Google" bgColor="bg-[#4285F4]" handlePress={() => {
                        if ( Platform.OS === "web") {
                          loginWithGoogle()}}}/>
                      <TouchableOpacity onPress={()=> router.push("/sign-up")} className="mt-2 items-center justify-center">
                          <Text className="text-blue-500">Registrieren</Text>
                      </TouchableOpacity>
                      
                  </View>
              </View>
            </View>
          </View>
        <SlowDeveloper isVisible={isVisible} setIsVisible={setIsVisible}/>
      </SafeAreaView>
    );
  
}

export default SignIn