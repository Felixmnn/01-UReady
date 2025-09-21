import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { loadUserData, loadUserDataKathegory } from "@/lib/appwriteDaten";
import { router } from "expo-router";
import StepZero from "@/components/(signUp)/zero";
import StepOne from "@/components/(signUp)/one";
import StepTwo from "@/components/(signUp)/two";
import StepFour from "@/components/(signUp)/four/four";
import StepThree from "@/components/(signUp)/three";
import StepFive from "@/components/(signUp)/five/five";
import StepSix from "@/components/(signUp)/six/six";
import StepSeven from "@/components/(signUp)/seven";
import {
  addNewUserConfig,
  addUserDatakathegory,
  updateUserDatakathegory,
} from "@/lib/appwriteAdd";
import { updateUserData } from "@/lib/appwriteUpdate";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { userDataKathegory, userData } from "@/types/appwriteTypes";


const personalize = () => {
  const { t } = useTranslation();

  const { editEducationGoals } = useLocalSearchParams();

  const { user } = useGlobalContext();
  const [userData, setUserData] = useState<userData>();
  const [userDataKathegory, setUserDataKathegory] =
    useState<userDataKathegory | null>(null);
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Deutschland",
    code: "DE",
    id: "4058177f-0cd4-4820-8f71-557c4b27dd42",
    schoolListID: "68258dbd00191adc1197",
    universityListID: "68258531000478d62d95",
    educationListID: "68258892003985a9f425",
    educationSubjectListID: "8339653e-1288-4b55-83ed-dff8d2a74002",
  });
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(0);
  const [selectedKathegorie, setSelectedKathegorie] = useState<string>("");
  const [school, setSchool] = useState<{
    id: string;
    name: string;
    icon?: string;
    image?: string;
    klassenstufen: string[];
  } | null>(null);
  const [ausbildungKathegorie, setAusbildungKathegorie] = useState<{
    id: string;
    name: { [key: string]: string };
  } | null>(null);
  const [degree, setDegree] = useState<{
    name: string;
    icon: string;
    id?: string;
  } | null>(null);
  const [classNumber, setClassNumber] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<
    { name: string; icon: string; id?: string }[]
  >([]);

  const [countryList, setCountryList] = useState([
    {
      name: "Deutschland",
      code: "DE",
      id: "4058177f-0cd4-4820-8f71-557c4b27dd42",
      schoolListID: "68258dbd00191adc1197",
      universityListID: "68258531000478d62d95",
      educationListID: "68258892003985a9f425",
      educationSubjectListID: "8339653e-1288-4b55-83ed-dff8d2a74002",
    },
  ]);

  const languages = [
    { label: "Deutsch", value: "de", enum: "DEUTSCH" },
    { label: "English", value: "en" ,  enum: "ENGLISH(US)" },
    { label: "Spanish", value: "es", enum: "SPANISH" },
    { label: "Français", value: "fra", enum: "FRENCH" },
  ];

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
      router.push("/getting-started");
    } else if (
      userData?.signInProcessStep === "FINISHED" &&
      !editEducationGoals
    ) {
      router.push("/getting-started");
    }
  }, [userData]);

  useEffect(() => {
    if (user === null) return;
    async function fetchUserData() {
      try {
        let userD = await loadUserData(user.$id);
        const mapToUserData = (doc: any): userData => ({
          birthday: doc?.birthday ?? "",
          city: doc?.city ?? "",
          country: doc?.country ?? "",
          darkmode: doc?.darkmode ?? false,
          language: doc?.language ?? "",
          profilePicture: doc?.profilePicture ?? "",
          subscription: doc?.subscription ?? "",
          uid: doc?.uid ?? "",
          university: doc?.university ?? "",
          signInProcessStep: doc?.signInProcessStep ?? "ZERO",
        });

        if (!userD) {
          userD = await addNewUserConfig(user.$id);
          await someDelayOrRefetch(); // Warte kurz oder rufe loadUserData erneut auf
          userD = await loadUserData(user.$id);
          setUserData(userD ? mapToUserData(userD) : undefined);
        } else {
          setUserData(userD ? mapToUserData(userD) : undefined);
        }
        if (
          userD?.signInProcessStep == "FINISHED" ||
          userD?.signInProcessStep == "DONE"
        ) {
          try {
            const userDK = await loadUserDataKathegory(user.$id);
            const userDKTyped = {
              country: userDK?.country ?? null,
              university: userDK?.university ?? null,
              region: userDK?.region ?? null,
              studiengangZiel: userDK?.studiengangZiel ?? null,
              schoolType: userDK?.schoolType ?? null,
              kategoryType: userDK?.kategoryType ?? null,
              schoolSubjects: userDK?.schoolSubjects ?? [],
              schoolGrade: userDK?.schoolGrade ?? null,
              educationSubject: userDK?.educationSubject ?? null,
              educationKathegory: userDK?.educationKathegory ?? "",
              language: userDK?.language ?? "",
              faculty: userDK?.faculty ?? [],
              studiengang: userDK?.studiengang ?? [],
              studiengangKathegory: userDK?.studiengangKathegory ?? [],
            };
            setUserDataKathegory(userDKTyped);
            setUserData({
              birthday: userD.birthday,
              city: userD.city,
              country: userD.country,
              darkmode: userD.darkmode,
              language: userD.language,
              profilePicture: userD.profilePicture,
              subscription: userD.subscription,
              uid: userD.uid,
              university: userD.university,
              signInProcessStep: editEducationGoals
                ? "THREE"
                : userD.signInProcessStep,
            });
          } catch (error) {
            if (__DEV__) {
              console.log("Error loading user data kathegory", error);
            }
          }
        } else if (userD?.signInProcessStep == "DONE" && user.$id) {
          router.push("/home");
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
    const newUserData = {
      country: selectedCountry ? selectedCountry.code.toUpperCase() : "DE",
      region: "",
      kategoryType: selectedKathegorie ? selectedKathegorie : null, // Kategorytype steht für wahl ob School, University, Education
      language: selectedLanguage
        ? languages[selectedLanguage].value
        : languages[0].value,

      //University
      university: "NONE",
      faculty: [""],
      studiengang: [""],
      studiengangZiel:
        selectedKathegorie == "UNIVERSITY" && degree && degree.id
          ? degree.id.toUpperCase()
          : null,
      studiengangKathegory:
        selectedKathegorie == "UNIVERSITY" && selectedSubjects
          ? selectedSubjects.map((item) => item.id)
          : null,

      //School
      schoolType:
        selectedKathegorie == "SCHOOL" && school
          ? school.id.toUpperCase()
          : null,
      schoolGrade:
        selectedKathegorie == "SCHOOL" && classNumber ? classNumber : null,
      schoolSubjects:
        (selectedKathegorie == "SCHOOL" ||
          selectedKathegorie == "OTHER" ||
          selectedKathegorie == "UNIVERSITY") &&
        selectedSubjects
          ? selectedSubjects.map((item) => item.id)
          : null, // Wird auch bei Other genutzt

      //Education
      educationSubject:
        selectedKathegorie == "EDUCATION" && selectedSubjects
          ? selectedSubjects[0].id
          : null,
      educationKathegory:
        selectedKathegorie == "EDUCATION" && ausbildungKathegorie
          ? ausbildungKathegorie.id
          : null,
    };

    try {
      await addUserDatakathegory(user.$id, newUserData);
      const updatedUserData = {
        birthday: userData?.birthday,
        city: userData?.city,
        country: selectedCountry ? selectedCountry.code.toUpperCase() : "DE",
        darkmode: userData?.darkmode,
        language: userData?.language,
        profilePicture: userData?.profilePicture,
        subscription: userData?.subscription,
        uid: userData?.uid,
        university: "NONE",
        signInProcessStep: "FINISHED",
      };
      await updateUserData(user.$id, updatedUserData);
      if (editEducationGoals) router.replace("/profil");
    } catch (error) {
      console.warn("Adding user data failed, trying update...", error);

      try {
        await updateUserDatakathegory(user.$id, newUserData);
      } catch (error) {
        console.error("Error saving user data", error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4  bg-gradient-to-b from-blue-900 to-[#0c111d] bg-[#0c111d] items-center justify-center">
      {userData !== null && userData?.signInProcessStep == "ZERO" ? (
        <StepZero userData={userData} setUserData={setUserData} />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "ONE" ? (
        <StepOne
          name={name}
          setName={setName}
          userData={userData}
          setUserData={setUserData}
        />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "TWO" ? (
        <StepTwo
          name={name}
          selectedLanguage={selectedLanguage}
          languages={languages}
          userData={userData}
          setUserData={setUserData}
          setSelectedLanguage={setSelectedLanguage}
        />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "THREE" ? (
        <StepThree
          userData={userData}
          setUserData={setUserData}
          setSelectedKathegorie={setSelectedKathegorie}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countryList={countryList}
          editing={editEducationGoals ? true : false}
        />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "FOUR" ? (
        <StepFour
          setAusbildungKathegorie={setAusbildungKathegorie}
          setSchool={setSchool}
          selectedKathegorie={selectedKathegorie}
          setUserData={setUserData}
          userData={userData}
        />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "FIVE" ? (
        <StepFive
          setClass={setClassNumber}
          setSelectedKathegorie={selectedKathegorie}
          setDegree={setDegree}
          selectedLanguage={selectedLanguage}
          userData={userData}
          setUserData={setUserData}
          school={school}
          ausbildungKathegorie={ausbildungKathegorie}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          saveUserData={saveUserData}
        />
      ) : null}
      {userData !== null && userData?.signInProcessStep == "SIX" ? (
        <StepSix
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          userData={userData}
          setUserData={setUserData}
          selectedKathegorie={selectedKathegorie}
          saveUserData={saveUserData}
        />
      ) : null}
      {userData == null || userData?.signInProcessStep == "SEVEN" ? (
        <StepSeven />
      ) : null}
    </SafeAreaView>
  );
};

export default personalize;
