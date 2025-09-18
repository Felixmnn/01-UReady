import { SafeAreaView, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { loadUserData, loadUserDataKathegory } from '@/lib/appwriteDaten';
import { router } from 'expo-router';
import StepZero from '@/components/(signUp)/zero';
import StepOne from '@/components/(signUp)/one';
import StepTwo from '@/components/(signUp)/two';
import StepFour from '@/components/(signUp)/four/four';
import StepThree from '@/components/(signUp)/three';
import StepFive from '@/components/(signUp)/five/five';
import StepSix from '@/components/(signUp)/six/six';
import StepSeven from '@/components/(signUp)/seven';
import { addNewUserConfig, addUserDatakathegory, updateUserDatakathegory } from '@/lib/appwriteAdd';
import { updateUserData } from '@/lib/appwriteUpdate';
import { getCountryList, getEducationList, getEducationSubjects, getSchoolList, getUniversityList, getUniversitySubjects } from '@/lib/appwritePersonalize';
import {schoolListDeutschland, 
        universityListDeutschland, 
        ausbildungsTypen,
        countryList,
        ausbildungsListDeutschland,
 } from '@/assets/exapleData/countryList';
import { useTranslation } from 'react-i18next';
import { userData } from '@/types/moduleTypes';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import CustomButton from '@/components/(general)/customButton';


const personalize = () => {
    const { t } = useTranslation();

    const { editEducationGoals } = useLocalSearchParams()


    const { user } = useGlobalContext();
    const [userData, setUserData] = useState<any>();
    const [ userDataKathegory, setUserDataKathegory] = useState<any>(null);
    const [ name, setName] = useState("");
    const [ selectedCountry, setSelectedCountry ] = useState( {name:"Deutschland",
                                                                code:"DE", 
                                                                id:"4058177f-0cd4-4820-8f71-557c4b27dd42",
                                                                schoolListID:"68258dbd00191adc1197" ,
                                                                universityListID:"68258531000478d62d95",
                                                                educationListID:"68258892003985a9f425",
                                                                educationSubjectListID:"8339653e-1288-4b55-83ed-dff8d2a74002"

                                                            });
    const [ selectedLanguage, setSelectedLanguage] = useState<number | null>(0);
    const [ selectedKathegorie, setSelectedKathegorie] = useState<string>("");
    const [ selectedRegion, setSelectedRegion] = useState(null);
    const [ school, setSchool] = useState<{ id: string; name: string; icon?: string; image?: string; klassenstufen: string[] } | null>(null);
    const [ ausbildungKathegorie, setAusbildungKathegorie] = useState<{ id: string; name: { [key: string]: string } } | null>(null);
    const [ selectedUniversity, setSelectedUniversity] = useState<{ name: string } | null>(null);
    const [ degree, setDegree] = useState<{ name: string; icon: string; } | null>(null);
    const [ selectedAusbildung, setSelectedAusbildung ] = useState<{ name: string } | null>(null);
    const [ classNumber, setClassNumber ] = useState<string | null>(null);
    const [ selectedSubjects, setSelectedSubjects ] = useState<{ name: string; icon: string }[]>([]);
    const [ selectedField, setSelectedField ] = useState<{ faculty?: string; name?: string; kathegory?: string }[]>([]);

    const [ countryListA, setCountryListA ] = useState(countryList);
    const [ schoolList, setSchoolList ] = useState(schoolListDeutschland);
    const [ universityList, setUniversityList ] = useState(universityListDeutschland);
    const [ educationList, setEducationList ] = useState(ausbildungsListDeutschland);
    const [ educationSubjectList, setEducationSubjectList ] = useState([]);


    

    const languages = [
        {name:"Deutsch", enum:"DEUTSCH", code:"DE"},
        {name:"English", enum:"ENGLISH(UK)", code:"GB"},
        {name:"English", enum:"ENGLISH(US)", code:"US"},
        {name:"Spanish", enum:"SPANISH", code:"ES"},
        {name:"Australian", enum:"AUSTRALIAN", code:"AU"},
    ] 

   
    // Allgemeiner Funktion
    useEffect(() => {
        async function fetchCountryList() {
                const response = await getCountryList();
                if (response) {
                    setCountryListA(
                        response.map((item: any) => ({
                            name: item.name,
                            code: item.code,
                            id: item.id,
                            schoolListID: item.schoolListID,
                            universityListID: item.universityListID,
                            educationListID: item.educationListID,
                        }))
                    );
                }
        }
        fetchCountryList();
    }
    , []);


    //Funktion für Schul / Uni / Ausbildungsliste
    useEffect(() => {
        async function fetchList() {
            if (selectedKathegorie === "SCHOOL" || selectedKathegorie === "OTHER") {
                const res = await  getSchoolList(selectedCountry.schoolListID);
                if (res) {
                    setSchoolList({
                        regions: res.regions.map((item: string) => JSON.parse(item) ),
                        schoolStages: res.schoolStages.map((item: string) => JSON.parse(item) ),
                        schoolTypes: res.schoolTypes.map((item: string) => JSON.parse(item) ),
                        schoolSubjects: res.schoolSubjects.map((item: string) => JSON.parse(item) ),
                    });
                }
            } else if (selectedKathegorie === "UNIVERSITY") {
                const res = await getUniversityList(selectedCountry.universityListID);
                if (res) {
                    setUniversityList(res.list.map((item:string) => JSON.parse(item)));
                }
            } else if (selectedKathegorie === "EDUCATION") {
                const res = await getEducationList(selectedCountry.educationListID);
                const res2 = await getEducationSubjects(selectedCountry.educationSubjectListID);
                const listI18n = t("educationSelection.ausbildungslistDeutschland", { returnObjects: true });

                if (listI18n) {
                    const eduList = listI18n as Record<string, any>;
                    setEducationList({
                        "Bau & Handwerk": eduList["Bau & Handwerk"],
                        "Gastronomie & Tourismus": eduList["Gastronomie & Tourismus"],
                        "Gesundheit & Pflege": eduList["Gesundheit & Pflege"],
                        "IT & Medien": eduList["IT & Medien"],
                        "Kunst & Gestaltung": eduList["Kunst & Gestaltung"],
                        "Metall & Technik": eduList["Metall & Technik"],
                        "Produktion & Logistik": eduList["Produktion & Logistik"],
                        "Umwelt & Natur": eduList["Umwelt & Natur"],
                        "Wirtschaft & Verwaltung": eduList["Wirtschaft & Verwaltung"],
                    });
                }
                /*
                if (res && res2) {
                    setEducationList(
                        {
                            "Bau & Handwerk": res2["BauHandwerk"] ? res2["BauHandwerk"].map((item: string) => JSON.parse(item)) : [],
                            "Gastronomie & Tourismus": res2["GastronomieTourismus"] ? res2["GastronomieTourismus"].map((item: string) => JSON.parse(item)) : [],
                            "Gesundheit & Pflege": res2["GesundheitPflege"] ? res2["GesundheitPflege"].map((item: string) => JSON.parse(item)) : [],
                            "IT & Medien": res2["ITMedien"] ? res2["ITMedien"].map((item: string) => JSON.parse(item)) : [],
                            "Kunst & Gestaltung": res2["KunstGestaltung"] ? res2["KunstGestaltung"].map((item: string) => JSON.parse(item)) : [],
                            "Metall & Technik": res2["MetallTechnik"] ? res2["MetallTechnik"].map((item: string) => JSON.parse(item)) : [],
                            "Produktion & Logistik": res2["ProduktionLogistik"] ? res2["ProduktionLogistik"].map((item: string) => JSON.parse(item)) : [],
                            "Umwelt & Natur": res2["UmweltNatur"] ? res2["UmweltNatur"].map((item: string) => JSON.parse(item)) : [],
                            "Wirtschaft & Verwaltung": res2["WirtschaftVerwaltung"] ? res2["WirtschaftVerwaltung"].map((item: string) => JSON.parse(item)) : [],
                        }
                    );
                }
                    */
            }       
    }
        fetchList();
    }, [selectedKathegorie]);

    //Funktion für Ausbildungskategorien
    useEffect(() => {
        async function fetchEducationSubjects() {
            if (ausbildungKathegorie) {
                const res = await getEducationSubjects(selectedCountry.educationSubjectListID);
                if (res) {
                    setEducationSubjectList(res[ausbildungKathegorie.name.DE.replaceAll(" & ","")].map((item: string) => JSON.parse(item)));
                }
            }
        }
        fetchEducationSubjects();
    },[ausbildungKathegorie]);

    // Delay
    function someDelayOrRefetch() {
        return new Promise((resolve) => {
        setTimeout(() => {
            resolve(undefined);
        }, 1000);
        });
    }

    // Navigation & User Data
    useEffect(() => {
        if (userData?.signInProcessStep === "SEVEN" && !editEducationGoals) {
            saveUserData();
            router.push("/getting-started")
        } else if (userData?.signInProcessStep === "FINISHED" && !editEducationGoals) {
            router.push("/getting-started");
        }
    }, [userData])

    useEffect(() => {
              if (user === null ) return;
              async function fetchUserData() {
                  try {
                    console.log("USer", user);
                      let userD = await loadUserData(user.$id);
                        console.log("Loaded user data:", userD);
                      const mapToUserData = (doc: any): userData => ({
                        $id: doc?.$id ?? "",
                        tutorialCompleted: doc?.tutorialCompleted ?? false,
                        createdAt: doc?.createdAt ?? "",
                        updatedAt: doc?.updatedAt ?? "",
                        country: doc?.country ?? null,
                        language: doc?.language ?? null,
                        university: doc?.university ?? null,
                        signInProcessStep: doc?.signInProcessStep ?? "ZERO",
                        // Add other required fields from userData type here, with sensible defaults if needed
                        studiengangZiel: doc?.studiengangZiel ?? null,
                        region: doc?.region ?? null,
                        kategoryType: doc?.kategoryType ?? null,
                        faculty: doc?.faculty ?? null,
                        studiengang: doc?.studiengang ?? null,
                        studiengangKathegory: doc?.studiengangKathegory ?? null,
                        schoolType: doc?.schoolType ?? null,
                        schoolGrade: doc?.schoolGrade ?? null,
                        schoolSubjects: doc?.schoolSubjects ?? null,
                        educationSubject: doc?.educationSubject ?? null,
                        educationKathegory: doc?.educationKathegory ?? null,
                      });

                      if (!userD) {
                        userD = await addNewUserConfig(user.$id);
                        await someDelayOrRefetch(); // Warte kurz oder rufe loadUserData erneut auf
                        userD = await loadUserData(user.$id);
                        setUserData(userD ? mapToUserData(userD) : undefined);
                        } else {
                        setUserData(userD ? mapToUserData(userD) : undefined);
                      }
                      if (userD?.signInProcessStep == "FINISHED" || userD?.signInProcessStep == "DONE") {
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
                                    signInProcessStep: editEducationGoals ? "THREE" : userD.signInProcessStep,
                                })
                                console.log("SignInProcessStep", editEducationGoals, editEducationGoals ? "FOUR" : userD.signInProcessStep);
                            } catch (error) {
                                if (__DEV__) {
                                console.log("Error loading user data kathegory", error);
                                }
                            }
                      } else if (userD?.signInProcessStep == "DONE" && user.$id) {
                        console.log("Das sollte nicht passieren, aber wenn doch, dann ab hier");
                            router.push("/home")
                      }
                  } catch (error) {
                    if (__DEV__) {
                      console.log(error);
                    }
                  } 
              }
              fetchUserData();
          }, [user]);

    const saveUserData = async () => {
        console.log("Ausbildungskathegorie: ", ausbildungKathegorie);
        const newUserData = {
            country:                            selectedCountry ? selectedCountry.name.toUpperCase() : null,
            region:                             "",
            kategoryType:                       selectedKathegorie ? selectedKathegorie : null, // Kategorytype steht für wahl ob School, University, Education
            language :                          selectedLanguage ? languages[selectedLanguage].enum : languages[0].enum,

            //University
            university:                         "",
            faculty:                            [""],
            studiengang:                        [""],
            studiengangZiel:                    selectedKathegorie == "UNIVERSITY" && degree ? degree.id.toUpperCase() : null,
            studiengangKathegory:               selectedKathegorie == "UNIVERSITY" && selectedSubjects ? selectedSubjects.map(item => item.id) : null,

            //School
            schoolType:                         selectedKathegorie == "SCHOOL" && school ? school.id.toUpperCase() : null, 
            schoolGrade:                        selectedKathegorie == "SCHOOL" && classNumber ? classNumber : null,
            schoolSubjects:                     (selectedKathegorie == "SCHOOL" || selectedKathegorie == "OTHER" || selectedKathegorie == "UNIVERSITY") && selectedSubjects ? selectedSubjects.map(item => item.id) : null, // Wird auch bei Other genutzt

            //Education
            educationSubject:                   selectedKathegorie == "EDUCATION" && selectedSubjects  ? selectedSubjects[0].id : null,
            educationKathegory:                 selectedKathegorie == "EDUCATION" && ausbildungKathegorie ? ausbildungKathegorie.id : null,

        }

        console.log("New User Data to save: ", newUserData.educationKathegory);
        try {
            await addUserDatakathegory(user.$id,newUserData);
            const updatedUserData = {
                    birthday:userData?.birthday,
                    city:userData?.city,
                    country:userData?.country,
                    darkmode:userData?.darkmode,
                    language:userData?.language,
                    profilePicture:userData?.profilePicture,
                    subscription:userData?.subscription,
                    uid:userData?.uid,
                    university:userData?.university,
                    signInProcessStep:"FINISHED",
                    
            }
            await updateUserData(user.$id, updatedUserData);
           if (editEducationGoals) router.replace("/profil");
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
        {userData !== null && userData?.signInProcessStep == "ZERO" ? <StepZero 
                                                                        userData={userData} 
                                                                        setUserData={setUserData}/> 
                                                                        : null}
        {userData !== null && userData?.signInProcessStep == "ONE" ? <StepOne 
                                                                        name={name} 
                                                                        setName={setName} 
                                                                        userData={userData} 
                                                                        setUserData={setUserData}
                                                                    /> : null}
        {userData !== null && userData?.signInProcessStep == "TWO" ?     <StepTwo 
                                                                            name={name} 
                                                                            selectedLanguage={selectedLanguage} 
                                                                            languages={languages} 
                                                                            userData={userData} 
                                                                            setUserData={setUserData}
                                                                            setSelectedLanguage={setSelectedLanguage}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "THREE" ?   <StepThree 
                                                                            userData={userData} 
                                                                            setUserData={setUserData} 
                                                                            setSelectedKathegorie={setSelectedKathegorie} 
                                                                            selectedCountry={selectedCountry} 
                                                                            setSelectedCountry={setSelectedCountry} 
                                                                            countryList={countryListA? countryListA : countryList}
                                                                            editing={editEducationGoals ? true : false}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "FOUR"?    <StepFour 
                                                                            schoolListDeutschland={schoolList? schoolList : schoolListDeutschland} 
                                                                            universityListDeutschland={universityList? universityList :universityListDeutschland} 
                                                                            ausbildungsTypen={ausbildungsTypen? ausbildungsTypen : ausbildungsListDeutschland} 
                                                                            setSelectedUniversity={setSelectedUniversity} 
                                                                            setAusbildungKathegorie={setAusbildungKathegorie} 
                                                                            setSchool={setSchool} 
                                                                            selectedKathegorie={selectedKathegorie} 
                                                                            selectedLanguage={selectedLanguage} 
                                                                            setUserData={setUserData} 
                                                                            userData={userData} 
                                                                            languages={languages}
                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "FIVE" ?    <StepFive 
                                                                            ausbildungsListDeutschland={educationList ? educationList : ausbildungsListDeutschland} 
                                                                            setClass={setClassNumber} 
                                                                            setSelectedKathegorie={selectedKathegorie} 
                                                                            setSelectedAusbildung={setSelectedAusbildung} 
                                                                            setDegree={setDegree}  
                                                                            selectedLanguage={selectedLanguage} 
                                                                            userData={userData} 
                                                                            setUserData={setUserData} 
                                                                            school={school} 
                                                                            ausbildungKathegorie={ausbildungKathegorie}
                                                                            selectedSubjects={selectedSubjects}
                                                                            setSelectedSubjects={setSelectedSubjects}
                                                                                                                                                        saveUserData={saveUserData}

                                                                        /> : null}
        {userData !== null && userData?.signInProcessStep == "SIX" ?     <StepSix 
                                                                            selectedSubjects={selectedSubjects} 
                                                                            setSelectedSubjects={setSelectedSubjects} 
                                                                            userData={userData} setUserData={setUserData} 
                                                                            selectedKathegorie={selectedKathegorie} 
                                                                            saveUserData={saveUserData}
                                                                        /> : null}
        {userData == null || userData?.signInProcessStep == "SEVEN" ?   <StepSeven /> : null}
    </SafeAreaView>
  )
}

export default personalize 