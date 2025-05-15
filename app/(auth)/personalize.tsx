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
import { getCountryList } from '@/lib/appwritePersonalize';
import { schoolListDeutschland, universityListDeutschland, ausbildungsTypen,countryList,ausbildungsListDeutschland,LeibnizSubjects } from '@/assets/exapleData/countryList';


const personalize = () => {

    const { user } = useGlobalContext();
    const [userData, setUserData] = useState(null);
    const [ userDataKathegory, setUserDataKathegory] = useState(null);
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
    const [ countryListAppwrite, setCountryListAppwrite] = useState(null);

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
    const textsThree = {
        "buttons" : [
            { "DE": "Schule", "GB": "School", "US": "School", "AU": "School", "ES": "Escuela" },
            { "DE": "Universität", "GB": "University", "US": "College", "AU": "Uni", "ES": "Universidad" },
            { "DE": "Ausbildung", "GB": "Apprenticeship", "US": "Apprenticeship", "AU": "Apprenticeship", "ES": "Educación" },
            { "DE": "Sonstiges", "GB": "Other", "US": "Other", "AU": "Other", "ES": "Otro" }
        ],
        "robotMessage": {
            "DE": "Gehst du zur Schule, an die Uni oder machst eine Ausbildung?",
            "GB": "Are you going to school, university, or doing an apprenticeship?",
            "US": "Are you in school, college, or doing an apprenticeship?",
            "AU": "Are you at school, uni, or doing an apprenticeship?",
            "ES": "¿Vas al colegio, a la universidad o estás haciendo una formación?",
        }
    }
    const textsFour = {
        "robotMessageUniversity": {
            "DE": "Perfekt! An welcher Uni bist du?",
            "GB": "Perfect! Which university are you at?",
            "US": "Perfect! What college are you at?",
            "AU": "Perfect! Which uni ya at?",
            "ES": "¡Perfecto! ¿En qué universidad estás?",
        },
        "robotMessageSchool": {
            "DE": "An welcher Schule bist du?",
            "GB": "Which school do you go to?",
            "US": "Which school are you attending?",
            "AU": "Which school are you at?",
            "ES": "¿A qué escuela vas?",
        },
        "robotMessageEducation": {
            "DE": "Perfekt! In welchem Bereich machst du deine Ausbildung?",
            "GB": "Perfect! In which field are you doing your apprenticeship?",
            "US": "Perfect! What field is your trade school or apprenticeship in?",
            "AU": "Perfect! What field’s your apprenticeship in?",
            "ES": "¡Perfecto! ¿En qué área estás haciendo tu formación profesional?",
        }
    }

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
    const textsSix = {
        "robotMessageSchool": {
            "DE":"Nur noch eins: Welche Fächer darf ich für dich eintragen?",
            "GB": "Just one more thing: Which subjects should I add for you?",
            "US": "Just one more thing: Which subjects would you like me to add for you?",
            "AU": "Just one more thing: Which subjects do you want me to add for you?",
            "ES": "Solo una cosa más: ¿Qué asignaturas quieres que añada para ti?",
        },
        "continueMessage": {
            "DE":"Los geht’s!“",
            "GB":"Let's go!",
            "US":"Let's go!",
            "AU":"Let's go!",
            "ES":"¡Vamos!"
        },
        "robotMessageUniversity": {
            "DE":"Fast geschafft! Was genau studierst du?",
            "GB":"Just one last thing before we finish! What’s your program or field of study?",
            "US":"Almost there! What’s your major or area of study?",
            "AU":"You're almost done! What’s your course or field of study?",
            "ES":"¡Casi terminado! ¿En qué programa o área estás estudiando?",
        }

    }

    useEffect(() => {
        async function fetchCountryList() {
                const response = await getCountryList();
                console.log("Country List", response);
                if (response) {
                    setCountryListAppwrite(response);
                }
        }
        fetchCountryList();
    }
    , []);

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
        {userData !== null && userData.signInProcessStep == "TWO" ? <StepTwo robotMessage={textsTwo.robotMessage} continueButtonText={textsTwo.continueButtonText} name={name} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} languages={languages} userData={userData} setUserData={setUserData}/> : null}
        {userData !== null && userData.signInProcessStep == "THREE" ? <StepThree robotMessage={textsThree.robotMessage} buttons={textsThree.buttons} userData={userData} setUserData={setUserData} setSelectedKathegorie={setSelectedKathegorie} selectedLanguage={selectedLanguage} languages={languages} name={name} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} countryList={countryList}/> : null}
        {userData !== null && userData.signInProcessStep == "FOUR" ? <StepFour schoolListDeutschland={schoolListDeutschland} universityListDeutschland={universityListDeutschland} ausbildungsTypen={ausbildungsTypen} message={textsFour} selectedUniversity={selectedUniversity} setSelectedUniversity={setSelectedUniversity} ausbildungKathegorie={ausbildungKathegorie} setAusbildungKathegorie={setAusbildungKathegorie} school={school} setSchool={setSchool} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} selectedKathegorie={selectedKathegorie} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} setUserData={setUserData} userData={userData} languages={languages}/> : null}
        {userData !== null && userData.signInProcessStep == "FIVE" ? <StepFive ausbildungsListDeutschland={ausbildungsListDeutschland} message={textsFive} languages={languages} setClass={setClassNumber} setSelectedKathegorie={selectedKathegorie} setSelectedAusbildung={setSelectedAusbildung} setDegree={setDegree}  selectedLanguage={selectedLanguage} userData={userData} setUserData={setUserData} selectedUniversity={selectedUniversity} school={school} ausbildungKathegorie={ausbildungKathegorie}/> : null}
        {userData !== null && userData.signInProcessStep == "SIX" ? <StepSix LeibnizSubjects={LeibnizSubjects} schoolListDeutschland={schoolListDeutschland}  message={textsSix} selectedField={selectedField} setSelectedField={setSelectedField} selectedDegree={degree} selectedSubjects={selectedSubjects} setSelectedSubjects={setSelectedSubjects} userData={userData} setUserData={setUserData} selectedKathegorie={selectedKathegorie} languages={languages} selectedLanguage={selectedLanguage}/> : null}
        {userData !== null && userData.signInProcessStep == "SEVEN" ? <StepSeven userDataKathegory={userDataKathegory} saveUserData={saveUserData}  languages={languages} setUserData={setUserData} userData={userData} selectedField={selectedField} selectedSubjects={selectedSubjects} classNumber={classNumber}  selectedAusbildung={selectedAusbildung}  degree={degree} selectedUniversity={selectedUniversity} ausbildungKathegorie={ausbildungKathegorie} school={school} name={name} selectedCountry={selectedCountry} selectedLanguage={selectedLanguage} selectedKathegorie={selectedKathegorie} selectedRegion={selectedRegion}   /> : null}

    </SafeAreaView>
  )
}

export default personalize 