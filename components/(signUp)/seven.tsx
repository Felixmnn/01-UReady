import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'

const StepSeven = ({userDataKathegory, saveUserData, languages, userData, setUserData, selectedField,selectedSubjects,classNumber,selectedAusbildung,degree,selectedUniversity,ausbildungKathegorie,school,selectedRegion,selectedKathegorie,selectedLanguage,name,selectedCountry}) => {
    useEffect(() => {
      if (userDataKathegory != null) {
        router.push("/getting-started")
      }
      saveUserData();
      router.push("/getting-started")
    }, []);
  return (
      <View className='h-full w-full justify-between items-center py-5'>
      </View>
    ) 

}

export default StepSeven