import React from "react";
import { useWindowDimensions } from "react-native";
import University from "./university";
import Education from "./education";
import School from "./school";

const StepFive = ({
  setDegree,
  ausbildungKathegorie,
  setSelectedKathegorie,
  school,
  userData,
  setUserData,
  selectedLanguage,
  saveUserData,
  setClass,
  selectedSubjects,
  setSelectedSubjects,
}: {
  setDegree: React.Dispatch<
    React.SetStateAction<{ name: string; icon: string } | null>
  >;
  ausbildungKathegorie: { id: string; name: { [key: string]: string } } | null;
  setSelectedKathegorie: string;
  school: {
    id: string;
    name: string;
    icon?: string;
    image?: string;
    klassenstufen: string[];
  } | null;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  selectedLanguage: number | null;
  setClass: React.Dispatch<React.SetStateAction<string | null>>;
  saveUserData: () => Promise<void>;
  selectedSubjects: { name: string; icon: string }[];
  setSelectedSubjects: React.Dispatch<
    React.SetStateAction<{ name: string; icon: string }[]>
  >;
}) => {
  const { width } = useWindowDimensions();
  const numColumns = width < 400 ? 2 : 3;

  const subjectSelection = (item: { name: string; icon: string }) => {
    if (selectedSubjects.some((i) => i.name == item.name)) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects([item]);
    }
  };

  if ("UNIVERSITY" == setSelectedKathegorie) {
    return (
      <University
        userData={userData}
        setUserData={setUserData}
        setDegree={setDegree}
      />
    );
  } else if (setSelectedKathegorie == "EDUCATION") {
    const [subjectFilter, setSubjectFilter] = React.useState<string>("");
    return (
      <Education
        setUserData={setUserData}
        userData={userData}
        ausbildungKathegorie={ausbildungKathegorie ? ausbildungKathegorie : { id: "IT", name: { de: "IT" } }}
        selectedSubjects={selectedSubjects}
        saveUserData={saveUserData}
        subjectSelection={subjectSelection}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
      />
    );
  } else if (setSelectedKathegorie == "SCHOOL") {
    if (!school) return null;
    return (
      <School
        userData={userData}
        setUserData={setUserData}
        school={school}
        setClass={setClass}
        numColumns={numColumns}
      />
    );
  }
};

export default StepFive;
