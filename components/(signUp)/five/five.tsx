import React from 'react'
import { useWindowDimensions } from 'react-native';
import University from './university';
import Education from './education';
import School from './school';

const StepFive = (
    {   setDegree,
        ausbildungKathegorie,
        setSelectedKathegorie, 
        ausbildungsListDeutschland, 
        school, 
        userData, 
        setUserData, 
        selectedLanguage, 
        setSelectedAusbildung, 
        
        setClass}:{

        setDegree: React.Dispatch<React.SetStateAction<{name: string, icon: string} | null>>,
        ausbildungKathegorie: { id: string; name: { [key: string]: string; }; } | null,
        setSelectedKathegorie: string,
        ausbildungsListDeutschland: any,
        school: {id: string, name: string, icon?: string, image?: string, klassenstufen: string[]} | null,
        userData: any,
        setUserData: React.Dispatch<React.SetStateAction<any>>,
        selectedLanguage: number | null,
        setSelectedAusbildung: React.Dispatch<React.SetStateAction<any>>,
        setClass: React.Dispatch<React.SetStateAction<string | null>>;
    }
        
) => {
    const { width } = useWindowDimensions();
    const numColumns = width < 400 ? 2 : 3;

    const chunkArray = <T,>(arr: T[], size: number): T[][] => {
        const chunked: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
            chunked.push(arr.slice(i, i + size));
        }
        return chunked;
        };


  if ("UNIVERSITY" == setSelectedKathegorie) {
    return <University
        userData={userData}
        setUserData={setUserData}
        setDegree={setDegree}
    />
    }
 else if (setSelectedKathegorie == "EDUCATION") { 
   return  <Education
        selectedLanguage={selectedLanguage}
        setUserData={setUserData}
        userData={userData} 
        ausbildungsListDeutschland={ausbildungsListDeutschland}
        ausbildungKathegorie={ausbildungKathegorie}
        setSelectedAusbildung={setSelectedAusbildung}
    />
    }
        
     else if (setSelectedKathegorie == "SCHOOL") {
        return <School
            userData={userData}
            setUserData={setUserData}
            school={school}
            setClass={setClass}
            chunkArray={chunkArray}
            numColumns={numColumns}
        />
    }
}

export default StepFive