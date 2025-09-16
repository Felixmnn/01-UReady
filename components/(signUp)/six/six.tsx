import React from 'react'
import School from './school'
import University from './university'

const StepSix = ({
        selectedKathegorie,
        userData, 
        setUserData, 
        setSelectedSubjects, 
        selectedSubjects, 
        saveUserData
      }:{
        selectedKathegorie: string,
        userData: any,
        setUserData: React.Dispatch<React.SetStateAction<any>>,
        setSelectedSubjects: React.Dispatch<React.SetStateAction<{ name: string; icon: string }[]>>,
        selectedSubjects: { name: string; icon: string }[],
        saveUserData: () => Promise<void>;
      }) => {
    
      const subjectSelection = (item: { name: string; icon: string }) => {
        if (selectedSubjects.some((i)=> i.name == item.name)) {
            setSelectedSubjects(selectedSubjects.filter((subject) => subject.name !== item.name))
        }
        else {
            setSelectedSubjects([...selectedSubjects, item])
        }
    }

    if (selectedKathegorie === "SCHOOL" || selectedKathegorie === "OTHER") {
       return <School
            userData={userData}
            setUserData={setUserData}   
            selectedSubjects={selectedSubjects}
            selectedKathegorie={selectedKathegorie}
            handleItemPress={subjectSelection}
            saveUserData={saveUserData}
        />
    }   
    
    else if (selectedKathegorie === "UNIVERSITY") {
        return <University
            userData={userData}
            setUserData={setUserData}
            selectedSubjects={selectedSubjects}
            handleItemPress={subjectSelection}
            saveUserData={saveUserData}
        />
    }    
}

export default StepSix