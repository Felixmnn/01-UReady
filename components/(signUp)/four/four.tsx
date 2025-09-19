import React from "react";
import School from "./school";
import Education from "./education";
import { useTranslation } from "react-i18next";

/**
 * Depending on the previous choice the user continues with SCHOOL, UNIVERSITY or EDUCATION
 * 1. SCHOOL -> User picks Region and School Type
 * 2. UNIVERSITY -> User picks University
 * 3. EDUCATION -> User picks Education Kathegory
 **/
const StepFour = ({
  setUserData,
  userData,
  selectedKathegorie,
  setSchool,
  setAusbildungKathegorie,
}: {
  setUserData: (data: any) => void;
  userData: any;
  selectedKathegorie: string | null;
  setSchool: (school: any) => void;
  setAusbildungKathegorie: (kathegorie: any) => void;
}) => {
  const { t } = useTranslation();
  const Sonstige = {
    name: "Sonstige",
    id: "4058177f-0cd4-4820-8f71-5dsfsf57c4b27dd42",
    klassenstufen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  };

  const schoolOptions = t("school.type", { returnObjects: true }) as Record<string, { title: string; icon: string; grades: number[] }>;
  const keys = Object.keys(schoolOptions);
  const keyToObject = keys.map((key) => ({
    id: key,
    name: schoolOptions[key].title,
    icon: schoolOptions[key].icon,
    grades: schoolOptions[key].grades,
  }));
  const formated = [...keyToObject];

  if (selectedKathegorie == "SCHOOL") {
    return (
      <School
        userData={userData}
        setUserData={setUserData}
        setSchool={setSchool}
        Sonstige={Sonstige}
        groupedData={formated}
      />
    );
  } else if (selectedKathegorie == "EDUCATION") {
    return (
      <Education
        setUserData={setUserData}
        userData={userData}
        setAusbildungKathegorie={setAusbildungKathegorie}
      />
    );
  }
};

export default StepFour;
