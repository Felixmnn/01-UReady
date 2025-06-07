import { SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import { router } from 'expo-router';
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
import { getCountryList, getEducationList, getEducationSubjects, getSchoolList, getUniversityList, getUniversitySubjects } from '@/lib/appwritePersonalize';
import {schoolListDeutschland, 
        universityListDeutschland, 
        ausbildungsTypen,
        countryList,
        ausbildungsListDeutschland,
        LeibnizSubjects } from '@/assets/exapleData/countryList';
import language from '@/assets/exapleData/languageTabs.json';
import { useRoute } from '@react-navigation/native';

const personalize = () => {
    const route = useRoute();
    console.log("Ich bin die Personalize Seite 🐋🐋🐋");
    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null);

    const [ userDataKathegory, setUserDataKathegory] = useState(null);
    const [ name, setName] = useState("");
    const [ selectedCountry, setSelectedCountry ] = useState( {name:"Deutschland",
                                                                code:"DE", 
                                                                id:"4058177f-0cd4-4820-8f71-557c4b27dd42",
                                                                schoolListID:"68258dbd00191adc1197" ,
                                                                universityListID:"68258531000478d62d95",
                                                                educationListID:"68258892003985a9f425",
                                                                educationSubjectListID:"8339653e-1288-4b55-83ed-dff8d2a74002"

                                                            });
    const [ selectedLanguage, setSelectedLanguage] = useState(0);
    const [ selectedKathegorie, setSelectedKathegorie] = useState(null);
    const [ selectedRegion, setSelectedRegion] = useState(null);
    const [ school, setSchool] = useState(null);
    const [ ausbildungKathegorie, setAusbildungKathegorie] = useState(null);
    const [ selectedUniversity, setSelectedUniversity] = useState(null);
    const [ degree, setDegree] = useState("Bachelor");
    const [ selectedAusbildung, setSelectedAusbildung ] = useState(null);
    const [ classNumber, setClassNumber ] = useState(null);
    const [ selectedSubjects, setSelectedSubjects ] = useState([]);
    const [ selectedField, setSelectedField ] = useState([]);

    const [ countryListA, setCountryListA ] = useState(countryList);
    const [ schoolList, setSchoolList ] = useState(schoolListDeutschland);
    const [ universityList, setUniversityList ] = useState(universityListDeutschland);
    const [ educationList, setEducationList ] = useState(ausbildungsListDeutschland);
    const [ universitySubjectList, setUniversitySubjectList ] = useState([]);
    const [ educationSubjectList, setEducationSubjectList ] = useState([]);


    

    const languages = [
        {name:"Deutsch", enum:"DEUTSCH", code:"DE"},
        {name:"English", enum:"ENGLISH(UK)", code:"GB"},
        {name:"English", enum:"ENGLISH(US)", code:"US"},
        {name:"Spanish", enum:"SPANISH", code:"ES"},
        {name:"Australian", enum:"AUSTRALIAN", code:"AU"},
    ] 

    const textsTwo = {
        "continueButtonText": {
            "DE": "Weiter gehts",
            "GB": "Let's carry on!",
            "US": "Let's move on!",
            "AU": "Let’s keep moving!",
            "ES": "Vamos",
        },
        "robotMessage": {
            "DE": `Freut mich, dich kennenzulernen ${name}. In welcher Sprache wollen wir uns unterhalten?`,
            "GB": `Nice to meet you, ${name}. Which language would you like to speak?`,
            "US": `Nice to meet you, ${name}. What language do you wanna talk in?`,
            "AU": `G’day ${name}! Which language ya keen to chat in?`,
            "ES": `Encantado de conocerte, ${name}. ¿En qué idioma quieres hablar?`,
        }
    }
    const textsThree = language.personalize.pageThree;
    const textsFour = language.personalize.pageFour;
    const textsFive = {
        "robotMessageUniversity": {
            "DE": "An welcher Uni bist du?",
            "GB": "Which university do you go to?",
            "US": "Which college are you attending?",
            "AU": "Which uni are ya at?",
            "ES": "¿A qué universidad vas?",
        },
        "robotMessageEducation": {
            "DE": "Ein interessantes Gebiet. Mal schauen ob wir deine Ausbildung finden.",
            "GB": "An interesting field. Let's see if we can find your apprenticeship.",
            "US": "An interesting field. Let's see if we can find your trade school or apprenticeship.",
            "AU": "An interesting field. Let's see if we can find your apprenticeship.",
            "ES": "Un campo interesante. Vamos a ver si podemos encontrar tu formación profesional.",
        },
        "robotMessageSchool": {
            "DE": `${school?.name === "Sonstige" ? "Interessant, du" : "Du"} gehst also auf ${school?.name === "Gymnasium" ? "ein" : "eine"} ${school?.name === "Sonstige" ? "Schulform, die nicht in der Liste war" : school?.name}. In welche Klasse gehst du dort?`,
            "GB": `${school?.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school?.name === "Gymnasium" ? "a" : "an"} ${school?.name === "Sonstige" ? "education type not listed" : school?.name}. What year are you in?`,
            "US": `${school?.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school?.name === "Gymnasium" ? "a" : "an"} ${school?.name === "Sonstige" ? "school type that's not listed" : school?.name}. What grade are you in?`,
            "AU": `${school?.name === "Sonstige" ? "Interesting, you" : "So, you're at"} ${school?.name === "Gymnasium" ? "a" : "an"} ${school?.name === "Sonstige" ? "school type not listed" : school?.name}. What year level are you in?`,
            "ES": `${school?.name === "Sonstige" ? "Interesante, tú" : "Entonces, estás en"} ${school?.name === "Gymnasium" ? "un" : "una"} ${school?.name === "Sonstige" ? "tipo de escuela no listado" : school?.name}. ¿En qué curso estás?`,
        }
    }
    const textsSix = language.personalize.PageSix;

    useEffect(() => {
        async function fetchCountryList() {
                const response = await getCountryList();
                if (response) {
                    setCountryListA(response);
                }
        }
        fetchCountryList();
    }
    , []);

    useEffect(() => {
        async function fetchList() {
            if (selectedKathegorie === "SCHOOL" || selectedKathegorie === "OTHER") {
                const res = await  getSchoolList(selectedCountry.schoolListID);
                if (res) {
                    setSchoolList({
                        regions: res.regions.map((item) => JSON.parse(item)),
                        schoolStages: res.schoolStages.map((item) => JSON.parse(item)),
                        schoolTypes: res.schoolTypes.map((item) => JSON.parse(item)),
                        schoolSubjects: res.schoolSubjects.map((item) => JSON.parse(item)),
                    });
                }
            } else if (selectedKathegorie === "UNIVERSITY") {
                const res = await getUniversityList(selectedCountry.universityListID);
                console.log("University List", res);
                if (res) {
                    setUniversityList(res.list.map(item => JSON.parse(item)));
                }
            } else if (selectedKathegorie === "EDUCATION") {
                const res = await getEducationList(selectedCountry.educationListID);
                const res2 = await getEducationSubjects(selectedCountry.educationSubjectListID);
                console.log("School List", res);
                console.log("Education List", res2);
                if (res && res2) {
                    setEducationList(
                        {
                            "Bau & Handwerk": res2["BauHandwerk"] ? res2["BauHandwerk"].map(item => JSON.parse(item)) : [],
                            "Gastronomie & Tourismus": res2["GastronomieTourismus"] ? res2["GastronomieTourismus"].map(item => JSON.parse(item)) : [],
                            "Gesundheit & Pflege": res2["GesundheitPflege"] ? res2["GesundheitPflege"].map(item => JSON.parse(item)) : [],
                            "IT & Medien": res2["ITMedien"] ? res2["ITMedien"].map(item => JSON.parse(item)) : [],
                            "Kunst & Gestaltung": res2["KunstGestaltung"] ? res2["KunstGestaltung"].map(item => JSON.parse(item)) : [],
                            "Metall & Technik": res2["MetallTechnik"] ? res2["MetallTechnik"].map(item => JSON.parse(item)) : [],
                            "Produktion & Logistik": res2["ProduktionLogistik"] ? res2["ProduktionLogistik"].map(item => JSON.parse(item)) : [],
                            "Umwelt & Natur": res2["UmweltNatur"] ? res2["UmweltNatur"].map(item => JSON.parse(item)) : [],
                            "Wirtschaft & Verwaltung": res2["WirtschaftVerwaltung"] ? res2["WirtschaftVerwaltung"].map(item => JSON.parse(item)) : [],
                        }
                    );
                }
            }       
    }
        fetchList();
    }, [selectedKathegorie]);

    useEffect(() => {
        async function fetchUniversitySubjects() {
            if (selectedUniversity) {
                console.log("Selected University", selectedUniversity);
                const res = await getUniversitySubjects(selectedUniversity?.fakultyListID);
                console.log("Uni List", res);
                if (res) {
                    setUniversitySubjectList(
                        [
                        {
                            "Bachelor": res["Bachelor"] ? res["Bachelor"].map(item => JSON.parse(item)) : [],
                            "Master": res["Master"] ? res["Master"].map(item => JSON.parse(item)) : [],
                            "Staatsexamen": res["Staatsexamen"] ? res["Staatsexamen"].map(item => JSON.parse(item)) : [],
                            "Diplom": res["Diplom"] ? res["Diplom"].map(item => JSON.parse(item)) : [],
                            "Magister": res["Magister"] ? res["Magister"].map(item => JSON.parse(item)) : [],
                            "Others": res["Others"] ? res["Others"].map(item => JSON.parse(item)) : [],
                        }])}
                    else {
                        setUniversitySubjectList([
                            {
                                "Bachelor": [],
                                "Master": [],
                                "Staatsexamen": [],
                                "Diplom": [],
                                "Magister": [],
                                "Others": [],
                            }
                        ]);
                    }
                    }}
                fetchUniversitySubjects();
        }, [selectedUniversity]);

    useEffect(() => {
        async function fetchEducationSubjects() {
            if (ausbildungKathegorie) {
                const res = await getEducationSubjects(selectedCountry.educationSubjectListID);
                if (res) {
                    setEducationSubjectList(res[ausbildungKathegorie.name.DE.replaceAll(" & ","")].map(item => JSON.parse(item)));
                }
            }
        }
        fetchEducationSubjects();
    },[ausbildungKathegorie]);

    function someDelayOrRefetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}
    useEffect(() => {
        if (userData?.signInProcessStep === "SEVEN") {
            saveUserData();
            router.push("/getting-started")
        } else if (userData?.signInProcessStep === "FINISHED") {
            router.push("/getting-started");
        }
    }, [userData])

    useEffect(() => {
              if (user === null ) return;
              async function fetchUserData() {
                  try {
                      let userD = await loadUserData(user.$id);
                        console.log("User Data", userD);
                      if (!userD) {
                        userD = await addNewUserConfig(user.$id);
                        await someDelayOrRefetch(); // Warte kurz oder rufe loadUserData erneut auf
                        userD = await loadUserData(user.$id);
                        setUserData(userD);
                        } else {
                        console.log("Success", userD);
                        setUserData(userD);
                      }
                      console.log("User Data", userD);
                      if (userD?.signInProcessStep == "FINISHED") {
                            try {
                                const userDK = await loadUserDataKathegory(user.$id);
                                console.log("User Data Kathegory", userDK);
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
                      } else if (userD?.signInProcessStep == "DONE"){
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
            studiengangZiel:                    degree && degree != "Bachelor" ? degree.name.toUpperCase() : null,
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
        {userData !== null && userData?.signInProcessStep == "ZERO" ? <StepZero userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData?.signInProcessStep == "ONE" ? <StepOne 
                                                                                name={name} 
                                                                                setName={setName} 
                                                                                userData={userData} 
                                                                                setUserData={setUserData}
                                                                    /> : null}
        {userData !== null && userData?.signInProcessStep == "TWO" ?     <StepTwo 
                                                                            robotMessage={textsTwo.robotMessage} 
                                                                            continueButtonText={textsTwo.continueButtonText}
                                                                            name={name} 
                                                                            selectedLanguage={selectedLanguage} 
                                                                            setSelectedLanguage={setSelectedLanguage} 
                                                                            languages={languages} 
                                                                            userData={userData} 
                                                                            setUserData={setUserData}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "THREE" ?   <StepThree 
                                                                            robotMessage={textsThree.robotMessage} 
                                                                            buttons={textsThree.buttons} 
                                                                            userData={userData} 
                                                                            setUserData={setUserData} 
                                                                            setSelectedKathegorie={setSelectedKathegorie} 
                                                                            selectedLanguage={selectedLanguage} 
                                                                            languages={languages} 
                                                                            name={name} 
                                                                            selectedCountry={selectedCountry} 
                                                                            setSelectedCountry={setSelectedCountry} 
                                                                            countryList={countryListA? countryListA : countryList}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "FOUR" ?    <StepFour 
                                                                            schoolListDeutschland={schoolList? schoolList : schoolListDeutschland} 
                                                                            universityListDeutschland={universityList? universityList :universityListDeutschland} 
                                                                            ausbildungsTypen={ausbildungsTypen? ausbildungsTypen : ausbildungsListDeutschland} 
                                                                            message={textsFour} 
                                                                            selectedUniversity={selectedUniversity} 
                                                                            setSelectedUniversity={setSelectedUniversity} 
                                                                            ausbildungKathegorie={educationList ? educationList :ausbildungKathegorie} 
                                                                            setAusbildungKathegorie={setAusbildungKathegorie} 
                                                                            school={school} 
                                                                            setSchool={setSchool} 
                                                                            setSelectedRegion={setSelectedRegion} 
                                                                            selectedRegion={selectedRegion} 
                                                                            selectedKathegorie={selectedKathegorie} 
                                                                            selectedCountry={selectedCountry} 
                                                                            selectedLanguage={selectedLanguage} 
                                                                            setUserData={setUserData} 
                                                                            userData={userData} 
                                                                            languages={languages}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "FIVE" ?    <StepFive 
                                                                            ausbildungsListDeutschland={educationList ? educationList : ausbildungsListDeutschland} 
                                                                            message={textsFive} 
                                                                            languages={languages} 
                                                                            setClass={setClassNumber} 
                                                                            setSelectedKathegorie={selectedKathegorie} 
                                                                            setSelectedAusbildung={setSelectedAusbildung} 
                                                                            setDegree={setDegree}  
                                                                            selectedLanguage={selectedLanguage} 
                                                                            userData={userData} 
                                                                            setUserData={setUserData} 
                                                                            selectedUniversity={selectedUniversity} 
                                                                            school={school} 
                                                                            ausbildungKathegorie={ausbildungKathegorie}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "SIX" ?     <StepSix 
                                                                            LeibnizSubjects={universitySubjectList ? universitySubjectList :LeibnizSubjects} 
                                                                            schoolListDeutschland={schoolList ? schoolList :schoolListDeutschland }  
                                                                            message={textsSix} 
                                                                            selectedField={selectedField} 
                                                                            setSelectedField={setSelectedField} 
                                                                            selectedDegree={degree} 
                                                                            selectedSubjects={selectedSubjects} 
                                                                            setSelectedSubjects={setSelectedSubjects} 
                                                                            userData={userData} setUserData={setUserData} 
                                                                            selectedKathegorie={selectedKathegorie} 
                                                                            languages={languages} 
                                                                            selectedLanguage={selectedLanguage}
                                                                        /> : null}
        {userData == null || userData?.signInProcessStep == "SEVEN" ?   <StepSeven userDataKathegory={userDataKathegory} saveUserData={saveUserData}  languages={languages} setUserData={setUserData} userData={userData} selectedField={selectedField} selectedSubjects={selectedSubjects} classNumber={classNumber}  selectedAusbildung={selectedAusbildung}  degree={degree} selectedUniversity={selectedUniversity} ausbildungKathegorie={ausbildungKathegorie} school={school} name={name} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} selectedKathegorie={selectedKathegorie} selectedRegion={selectedRegion}   /> : null}

    </SafeAreaView>
  )
}

export default personalize 