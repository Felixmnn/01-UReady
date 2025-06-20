import { View, Text, TouchableOpacity, Modal,ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import InfoModule from '../(tabs)/infoModule';
import OptionSelector from '../(tabs)/optionSelector';
import { useWindowDimensions } from 'react-native';
import SettingsOption from '../(tabs)/settingsOption';
import { useState } from 'react';
import CustomButton from '../(general)/customButton';
import {  updateUserEmail, updateUserName, validateEmail } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';
import CustomTextInput1 from '../(general)/customTextInput1';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import { setColorMode, setLanguage } from '@/lib/appwriteEdit';
import  languages  from '@/assets/exapleData/languageTabs.json';
import SkeletonListProfile from '../(general)/(skeleton)/skeletonListProfile';
import { TextInput } from 'react-native-gesture-handler';
import { useActionCode } from '@/lib/appwriteShop';
const ProfileSettings = () => {
    const {user, language,setNewLanguage, userUsage, setUserUsage } = useGlobalContext() 
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])



    const [userData, setUserData] = useState(null)
    const [ userDataKathegory, setUserDataKathegory] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [selectedColorMode, setSelectedColorMode] = useState("Darstellung");
    const texts = languages.profileSettings;
   

    useEffect(() => {
      if (user === null || user === undefined) return ;
      async function fetchUserData() {
        let userData = await loadUserData(user.$id);
        setSelectedColorMode(userData.darkmode ? texts[selectedLanguage].dunkel : texts[selectedLanguage].darkmode)
        setUserData(userData)
        const userDataKathegory = await loadUserDataKathegory(user.$id);
        setSelectedLanguage(  userDataKathegory.language === "DEUTSCH" ||
                              userDataKathegory.language === "ENGLISH(US)" || 
                              userDataKathegory.language === "ENGLISH(UK)" || 
                              userDataKathegory.language === "AUSTRALIAN" || 
                              userDataKathegory.language === "SPANISH" ? userDataKathegory.language : "DEUTSCH"  )
        setUserDataKathegory(userDataKathegory)
        setLoading(false)
      }
      fetchUserData();
    },[user])
  
    const [modalVisible, setModalVisible] = useState(false);
    
    const personalInput = (value, title,onChange,text=false) => {
      return (
        <TouchableOpacity className="flex-1 w-full mt-2">

          <Text className="text-gray-300 font-bold text-[13px] m-2">{title}</Text>
          { 
            text ?
            <View className='m-1'>
              <Text className='text-gray-300 font-bold text-[13px] ml-3'>{value}</Text>
            </View>
            :
            <CustomTextInput1 value={value} onChange={onChange} />
          }
        </TouchableOpacity>
      )
    } 
    
    const [ actioncode, setActionCode ] = useState("")
    async function toggleModal(code) {
      const res = await useActionCode(actioncode);

      if (res && res != null) {
        setUserUsage((prev) => {
          if (prev.purcharses.length != 0 && prev.purcharses.includes(actioncode)) {
            setIsError(true);
            setErrorMessage("You already used this action code :(");
            setModalVisible(!modalVisible);
            return prev; // keine Änderung
          }

          // Aktionen ausführen
          let updated = { ...prev };

          if (res.item.includes("10ENERGY")) {
            updated.energy += 10;
          } else if (res.item.includes("100CHIPS")) {
            updated.chips += 100;
          }
          if (updated.purcharses.length == 0) {
            updated.purcharses = [actioncode];
          } else {
          updated.purcharses = [...updated.purcharses, actioncode];
          }
          setSuccessMessage("Successfully applied action code");
          setIsSccess(true);

          return updated;
        });
      } else {
        setErrorMessage(actioncode + " is not a valid action code :(");
        setIsError(true);
      }

      setModalVisible(!modalVisible);
    }

    const modal = () => {
      return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={()=> setModalVisible(false)}
        >
          <View className='flex-1 items-center justify-center p-2' >
            <View className='w-full max-w-[300px] items-center bg-gray-800 p-4 rounded-[10px] border border-[1px] border-gray-600'
            style={{
              height: 200,
            }}
            >
              <Text className='text-white font-bold text-[15px] my-3'>{texts[selectedLanguage].actioncodeText}</Text>
              <TextInput
                className='w-full bg-gray-700 text-gray-300 p-2 rounded-[10px] border border-gray-500'
                placeholderTextColor="#808080"
                value={actioncode}
                onChangeText={(text) => setActionCode(text)}
              />
              <View className='flex-1 flex-row items-center justify-center'>
                <CustomButton title={texts[selectedLanguage].cancel} handlePress={() => setModalVisible(false)} containerStyles={"w-[50%] bg-gray-800 mx-1 border-w-[1px] border-gray-500"}/>
                <CustomButton title={texts[selectedLanguage].ok} handlePress={toggleModal} containerStyles={!isFocused && firstFocus && text == "" ? "w-[50%] bg-gray-700 mx-1 border-gray-700" :"w-[50%] bg-blue-500 mx-1"} textStyles={"text-gray-300"} disabled={!isFocused && firstFocus && text == ""}/>
              </View>
            </View>
          </View>
        </Modal>
      )
    }
    const [ isError, setIsError ] = useState(false)
    const [ isSuccess, setIsSccess ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ successMessage, setSuccessMessage ] = useState("");
    const ErrorModal = () => {
          return (
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isError || isSuccess}
                  onRequestClose={() => {
                    setIsError(!isError);
                  }}
              >
                  <TouchableOpacity className='flex-1 justify-start pt-5 items-center' onPress={()=> {setIsError(false); setIsSccess(false)} }
                    >
                      <View className='red border-red-600 border-[1px] rounded-[10px] p-5 bg-red-700'
                        style={{
                            backgroundColor: isSuccess ? 'green' : '#ff4d4d',
                            borderColor: isSuccess ? 'green' : '#ff4d4d',
                        }}
                      >
                          <Text className='text-white font-bold text-gray-300'>{
                          isSuccess  ? "Successfully applied action code" 
                          : errorMessage == "You already used this action code :(" 
                          ? "You already used this action code :(" 
                          : actioncode + " is not a valid action code :("}
                          </Text>
                      </View>
                  </TouchableOpacity>
              </Modal>
          )
      }
    
    const [isFocused, setFocused] = useState(false);
    const [firstFocus, setFirstFocus] = useState(false)
    const [text, setText]=useState("")
   
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
  const languageoptions = [
    { label: "Deutsch", value: "DE" },
    { label: "English(UK)", value: "GB" },
    { label: "English(US)", value: "US" },
    { label: "Spanish", value: "ES" },
    { label: "Australian", value: "AU" },
  ];
  const colorOptions = [
    //{ label: texts[selectedLanguage].hell, value: "light" },
    { label: texts[selectedLanguage].dunkel, value: "dark" }
  ]
  
  async function updateLanguage (text) {
    setSelectedLanguage(text.toUpperCase())
    setNewLanguage(text.toUpperCase())
    await setLanguage(user.$id, text.toUpperCase())

  }
  async function updateColorMode (text) {
    setSelectedColorMode(text)
    await setColorMode(user.$id, text == "Hell" ? false : true)
  }


  return (
    <View className='flex-1 items-center '>
      { !loading?
      <View className='flex-1 w-full items-center'>
          <ErrorModal/>
        <View className={`flex-1 w-full  rounded-[10px] bg-gray-900 ${isVertical ? "border-gray-500 border-[1px]" :null} `}>
      <View className='mt-2'/>
        <ScrollView
        className='bg-gray-900'
        style={{
          scrollbarWidth: 'thin', // Dünne Scrollbar
          scrollbarColor: 'gray transparent',
          
        }}
        >
      <InfoModule content={()=> {
                return(
                    <View className='flex-1 items-center '>
                        <View className='bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center'><Text className='text-2xl text-gray-300 font-bold'>{user.name[0]}</Text></View>
                        {personalInput(user.name,texts[selectedLanguage].vorname, (text) => updateUserName(text))}
                        {personalInput(user.email,texts[selectedLanguage].email, (text) => updateUserEmail(text),true) }
                        {
                            !user.emailVerification ?
                            <View className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}>
                                <Text className='text-red-300 font-bold text-[12px]'>{texts[selectedLanguage].emailvalid}</Text>
                                <TouchableOpacity className='py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]'
                                 onPress={
                                  ()=> {validateEmail()}
                                 }
                                >
                                  <Text className='text-gray-300 font-bold text-[12px]'>{texts[selectedLanguage].emailrenew}</Text>
                                </TouchableOpacity>
                            </View>

                            : 

                            <View className='w-full m-2 px-2'>
                            <Text>
                                <Text className='text-green-300 font-bold text-[12px]'>{texts[selectedLanguage].emailvalid2}</Text>
                            </Text>
                            </View>
                        }
                        
                        <View className='justify-start w-full'>
                          {
                            userDataKathegory.kategoryType == "UNIVERSITY" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].university}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.university}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].faculty}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.faculty}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].studiengang}</Text>
                              <View>
                                {
                                  userDataKathegory.studiengang.map((studiengang, index) => {
                                    return(
                                      <Text key={index} className='font-semibold text-white ml-2'>{studiengang}</Text>
                                    )
                                  })
                                }
                              </View>
                            </View>
                            : userDataKathegory.kategoryType == "SCHOOL" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schooltype}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolType}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schoolgrade}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.schoolGrade}</Text> 
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].schoolsubjects}</Text>
                              <View>
                                {
                                  userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                                    return(
                                      <Text key={index} className='font-semibold text-white ml-2'>{schoolSubjects}</Text>
                                    )
                                  })
                                }
                              </View>
                            </View>
                            : userDataKathegory.kategoryType == "EDUCATION" ?
                            <View className='w-full'>
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].educationKathegory}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationKathegory}</Text> 
                              
                              <Text className='font-semibold text-white text-gray-500  '
                              style={{
                                color: "#808080",
                              }}
                              >{texts[selectedLanguage].educationSubject}</Text>
                              <Text className='font-semibold text-white ml-2'>{userDataKathegory.educationSubject}</Text> 
                              
                            </View>
                            :<View className='w-full'>
                            
                            <Text className='font-semibold text-white text-gray-500  '
                            style={{
                              color: "#808080",
                            }}
                            >{texts[selectedLanguage].schoolSubjects}</Text>
                            <View>
                              {
                                userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                                  return(
                                    <Text key={index} className='font-semibold text-white ml-2'>{schoolSubjects}</Text>
                                  )
                                })
                              }
                            </View>
                          </View>
                          }
                        
                        
                        </View>
                        



                    </View>
                )
            }} hideHead={true}/>
      <InfoModule content={()=> { return(
              <View className={`flex-1  ${isVertical ? "flex-row justify-start  items-center" : "items-start"}`}>
                <OptionSelector title={texts[selectedLanguage].colorMode} options={colorOptions} selectedValue={selectedColorMode} setSelectedValue={setSelectedColorMode} onChangeItem={updateColorMode}/>
                <OptionSelector title={texts[selectedLanguage].language} options={languageoptions} selectedValue={selectedLanguage} setSelectedValue={setSelectedLanguage} onChangeItem={updateLanguage}/>
              </View>
              )}} hideHead = {true} infoStyles="z-20"/> 
      <InfoModule content={()=> { return(
        <View>
          <SettingsOption title={texts[selectedLanguage].help} iconName={"life-ring"} handlePress={()=> router.push("/contact") }/> 
          <SettingsOption title={texts[selectedLanguage].policys} iconName={"shield"} handlePress={()=> router.push("/policys") }/>
          <SettingsOption title={texts[selectedLanguage].actioncode} iconName={"bolt"} item={modal()} handlePress={()=> setModalVisible(true)}/>  
          <SettingsOption title={texts[selectedLanguage].logout} iconName={"sign-out"} handlePress={ ()=>    router.push("/sign-out")}/>
          <SettingsOption title={texts[selectedLanguage].deleteAccount} iconName="trash" bottom={"true"} handlePress={ ()=>    router.push("/delete-account")}/>
  
  
        </View>
      )}} hideHead = {true}/> 
      </ScrollView>
    </View>
    </View>

    : <SkeletonListProfile/>
    }
    </View>
  )
}

export default ProfileSettings