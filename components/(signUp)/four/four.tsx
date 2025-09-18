import {  useWindowDimensions } from 'react-native'
import React, {  useState } from 'react'
import School from './school';
import University from './university';
import Education from './education';
import { useTranslation } from 'react-i18next';


/** 
 * Depending on the previous choice the user continues with SCHOOL, UNIVERSITY or EDUCATION
 * 1. SCHOOL -> User picks Region and School Type
 * 2. UNIVERSITY -> User picks University
 * 3. EDUCATION -> User picks Education Kathegory
 **/
const StepFour = ({
    selectedLanguage,
    schoolListDeutschland, 
    universityListDeutschland, 
    ausbildungsTypen, 
    setUserData, 
    userData, 
    languages, 
    selectedKathegorie, 
    setSchool, 
    setAusbildungKathegorie, 
    setSelectedUniversity, 
     }:{
    selectedLanguage: number | null,
    schoolListDeutschland: any, 
    universityListDeutschland: any,
    ausbildungsTypen: any,
    setUserData: (data: any) => void, 
    userData: any,
    languages: any,
    selectedKathegorie: string | null,
    setSchool: (school: any) => void,
    setAusbildungKathegorie: (kathegorie: any) => void,
    setSelectedUniversity: (university: any) => void,
    }) => {
   const { t } = useTranslation();
    const {width} = useWindowDimensions()
    const numColumns = width < 400 ? 2 : 3;
    const [isActive, setIsActive] = useState(false) 
    const Sonstige ={name:"Sonstige", id:"4058177f-0cd4-4820-8f71-5dsfsf57c4b27dd42", klassenstufen: [1,2,3,4,5,6,7,8,9,10,11,12,13] }
    const [universityFilter, setUniversityFilter] = useState("")

    const chunkArray = (arr: any[], size: number) => {
        const chunked = [];
        for (let i = 0; i < arr.length; i += size) {
          chunked.push(arr.slice(i, i + size));
        }
        return chunked;
      };

    const schoolOptions = t("school.type", { returnObjects: true });
    console.log("schoolOptions", JSON.stringify(schoolOptions))
    const keys = Object.keys(schoolOptions);
    const keyToObject = keys.map(key => ({
        id: key,
        name: schoolOptions[key].title,
        icon: schoolOptions[key].icon,
        grades: schoolOptions[key].grades,
    }));
    const formated = [...keyToObject];
    console.log("formated", JSON.stringify(formated))

    const groupedDataEdu = chunkArray(ausbildungsTypen, numColumns);

    if (selectedKathegorie == "SCHOOL") {
        return <School
                    userData={userData}
                    setUserData={setUserData}
                    setSchool={setSchool}
                    Sonstige={Sonstige}
                    groupedData={formated}
                />
    } else if (selectedKathegorie == "UNIVERSITY") {
        return <University
            userData={userData}
            setUserData={setUserData}
            universityListDeutschland={universityListDeutschland}
            setSelectedUniversity={setSelectedUniversity}
            universityFilter={universityFilter}
            setUniversityFilter={setUniversityFilter}
        />
} else if ( selectedKathegorie == "EDUCATION" ) {
        const [ isVisible, setIsVisible ] = useState(true)
        return <Education
            selectedLanguage={selectedLanguage} 
            setUserData={setUserData}
            userData={userData}
            languages={languages}
            setAusbildungKathegorie={setAusbildungKathegorie}
            groupedDataEdu={groupedDataEdu}
        />
    }
}

export default StepFour