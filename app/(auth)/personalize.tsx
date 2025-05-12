import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import { router } from 'expo-router';
import { countryList, schoolListDeutschland } from '@/assets/exapleData/countryList';
import StepZero from '@/components/(signUp)/zero';
import StepOne from '@/components/(signUp)/one';
import StepTwo from '@/components/(signUp)/two';
import StepFour from '@/components/(signUp)/four';
import StepThree from '@/components/(signUp)/three';
import StepFive from '@/components/(signUp)/five';
import StepSix from '@/components/(signUp)/six';
import StepSeven from '@/components/(signUp)/seven';
import { addNewUserConfig, addUserDatakathegory, updateUserDatakathegory } from '@/lib/appwriteAdd';
import { updateUserData } from '@/lib/appwriteUpdate';

const personalize = () => {

    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null);
    const [ userDataKathegory, setUserDataKathegory] = useState(null);
    const languages = [
        {name:"Deutsch", enum:"DEUTSCH", code:"DE"},
        {name:"English", enum:"ENGLISH(UK)", code:"GB"},
        {name:"English", enum:"ENGLISH(US)", code:"US"},
        {name:"Spanish", enum:"SPANISH", code:"ES"},
        {name:"Australian", enum:"AUSTRALIAN", code:"AU"},
    ] 
    const [ name, setName] = useState("");
    const [ selectedCountry, setSelectedCountry ] = useState( {name:"Deutschland",code:"DE", id:"4058177f-0cd4-4820-8f71-557c4b27dd42" });
    const [ selectedLanguage, setSelectedLanguage] = useState(0);
    const [ selectedKathegorie, setSelectedKathegorie] = useState(null);
    const [ selectedRegion, setSelectedRegion] = useState(null);
    const [ school, setSchool] = useState(null);
    const [ ausbildungKathegorie, setAusbildungKathegorie] = useState(null);
    const [ selectedUniversity, setSelectedUniversity] = useState(null);
    const [ degree, setDegree] = useState(null);
    const [ selectedAusbildung, setSelectedAusbildung ] = useState(null);
    const [ classNumber, setClassNumber ] = useState(null);
    const [ selectedSubjects, setSelectedSubjects ] = useState([]);
    const [ selectedField, setSelectedField ] = useState([]);

    useEffect(() => {
              if (user === null ) return;
              async function fetchUserData() {
                  try {
                      let userD = await loadUserData(user.$id);
                      if (!userD) {
                         userD = await addNewUserConfig(user.$id);
                        setUserData(userD);
                      } else {
                        setUserData(userD);
                      }
                      if (userD?.signInProcessStep == "FINISHED") {
                            try {
                                const userDK = await loadUserDataKathegory(user.$id);
                                
                                setUserDataKathegory(userDK);
                                setUserData({
                                    birthday:userD.birthday,
                                    city:userD.city,
                                    country:userD.country,
                                    darkmode:userD.darkmode,
                                    language:userD.language,
                                    profilePicture:userD.profilePicture,
                                    subscription:userD.subscription,
                                    uid:userD.uid,
                                    university:userD.university,
                                    signInProcessStep:"SEVEN",
                                })
                            } catch (error) {
                                console.log("Error loading user data kathegory", error);
                            }
                      } else if (userD.signInProcessStep == "DONE"){
                            router.push("/home")
                      }
                  } catch (error) {
                      console.log(error);
                  } 
              }
              fetchUserData();
          }, [user]);
    
    const saveUserData = async () => {
        const newUserData = {
            country:                            selectedCountry ? selectedCountry.name.toUpperCase() : null,
            university:                         selectedUniversity ? selectedUniversity.name : null,
            faculty:                            selectedField ? selectedField.map(item => item.faculty) : null,
            studiengang:                        selectedField ? selectedField.map(item => item.name) : null,
            region:                             selectedRegion ? schoolListDeutschland.regions[selectedRegion].name : null,
            studiengangZiel:                    degree ? degree.name.toUpperCase() : null,
            schoolType:                         school ? school.name.toUpperCase() : null,
            kategoryType:                       selectedKathegorie ? selectedKathegorie : null,
            schoolSubjects:                     selectedSubjects ? selectedSubjects.map(item => item.name) : null,
            schoolGrade:                        classNumber ? classNumber : null,
            educationSubject:                   selectedAusbildung ? selectedAusbildung.name : null,
            educationKathegory:                 ausbildungKathegorie ? ausbildungKathegorie.name.DE.toUpperCase().replace(/\s+/g, '') : null,
            language :                          selectedLanguage ? languages[selectedLanguage].enum : languages[0].enum,
            studiengangKathegory:               selectedField ? selectedField.map(item => item.kathegory) : null,
        }
        try {
            await addUserDatakathegory(user.$id,newUserData);
            const updatedUserData = {
                    birthday:userData.birthday,
                    city:userData.city,
                    country:userData.country,
                    darkmode:userData.darkmode,
                    language:userData.language,
                    profilePicture:userData.profilePicture,
                    subscription:userData.subscription,
                    uid:userData.uid,
                    university:userData.university,
                    signInProcessStep:"FINISHED",
                    
            }
            await updateUserData(user.$id, updatedUserData);
        }
        catch (error) {
            console.warn("Adding user data failed, trying update...", error);

            try {
                await updateUserDatakathegory(user.$id,newUserData);
            }
            catch (error) {
                console.error("Error saving user data", error);
            }
    }}


  return (
    <SafeAreaView className="flex-1 p-4  bg-gradient-to-b from-blue-900 to-[#0c111d] bg-[#0c111d] items-center justify-center">
        {userData !== null && userData.signInProcessStep == "ZERO" ? <StepZero userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "ONE" ? <StepOne name={name} setName={setName} userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "TWO" ? <StepTwo name={name} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languages={languages} userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "THREE" ? <StepThree userData={userData} setUserData={setUserData} setSelectedKathegorie={setSelectedKathegorie} selectedLanguage={selectedLanguage} languages={languages} name={name} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} countryList={countryList}/> : null}
        {userData !== null && userData.signInProcessStep == "FOUR" ? <StepFour selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} ausbildungKathegorie={ausbildungKathegorie} setAusbildungKathegorie={setAusbildungKathegorie} school={school} setSchool={setSchool} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} selectedKathegorie={selectedKathegorie} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} setUserData={setUserData} userData={userData} languages={languages}/> : null}
        {userData !== null && userData.signInProcessStep == "FIVE" ? <StepFive languages={languages} setClass={setClassNumber} setSelectedKathegorie={selectedKathegorie} setSelectedAusbildung={setSelectedAusbildung} setDegree={setDegree}  selectedLanguage={selectedLanguage} userData={userData} setUserData={setUserData} selectedUniversity={selectedUniversity} school={school} ausbildungKathegorie={ausbildungKathegorie}/> : null}
        {userData !== null && userData.signInProcessStep == "SIX" ? <StepSix selectedField={selectedField} setSelectedField={setSelectedField} selectedDegree={degree} selectedSubjects={selectedSubjects} setSelectedSubjects={setSelectedSubjects} userData={userData} setUserData={setUserData} selectedKathegorie={selectedKathegorie} languages={languages} selectedLanguage={selectedLanguage}/> : null}
        {userData !== null && userData.signInProcessStep == "SEVEN" ? <StepSeven userDataKathegory={userDataKathegory} saveUserData={saveUserData}  languages={languages} setUserData={setUserData} userData={userData} selectedField={selectedField} selectedSubjects={selectedSubjects} classNumber={classNumber}  selectedAusbildung={selectedAusbildung}  degree={degree} selectedUniversity={selectedUniversity} ausbildungKathegorie={ausbildungKathegorie} school={school} name={name} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} selectedKathegorie={selectedKathegorie} selectedRegion={selectedRegion}   /> : null}

    </SafeAreaView>
  )
}

export default personalize 