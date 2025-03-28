import { View, Text, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
const StepSeven = ({languages, userData, setUserData, selectedField,selectedSubjects,classNumber,selectedAusbildung,degree,selectedUniversity,ausbildungKathegorie,school,selectedRegion,selectedKathegorie,selectedLanguage,name,selectedCountry}) => {
    
  return (
      <View className='h-full w-full justify-between items-center py-5'>
        <View className='w-full'>
            <View className='w-full'>
                    <View className='bg-gray-900 w-full rounded-[10px]' style={{height: 6}}>
              <View
                className='bg-blue-500 h-full w-[100%] rounded-full'
                style={{
                  width: '100%',
                  boxShadow: '0 0 15px rgba(0, 0, 255, 0.7)', 
                }}
              />
            </View>
            <TouchableOpacity onPress={()=> setUserData({...userData,signInProcessStep:"FIVE"})} className='m-2'>
                <Icon name="arrow-left" size={20} color="#4B5563" />
            </TouchableOpacity>
        </View>
                        <View className='flex-row p-4' style={{marginLeft:30}}>
                            <Image source={require('../../assets/Check.gif')}  style={{height:150, width:150}}/> 
        
                                <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]' style={{height:10, width:10, top:20, left:10}}/> 
                                <View className='absoloute rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 ' style={{height:15, width:15, top:12, left:10}}/>
                                <View className='w-full max-w-[360px] h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'
                                style={{maxWidth:360}}
                                >
                                <Text className='font-semibold text-[15px] text-gray-100 text-center'>{
                                    selectedLanguage == null || languages[selectedLanguage].code == "DE"
                                    ? "Perfekt! In welchem Bereich machst du deine Ausbildung?"
                                    : languages[selectedLanguage].code == "GB"
                                    ? "Perfect! In which field are you doing your apprenticeship?"
                                    : languages[selectedLanguage].code == "US"
                                    ? "Perfect! What field is your trade school or apprenticeship in?"
                                    : languages[selectedLanguage].code == "AU"
                                    ? "Perfect! What field’s your apprenticeship in?"
                                    : languages[selectedLanguage].code == "ES"
                                    ? "¡Perfecto! ¿En qué área estás haciendo tu formación profesional?"
                                    : "Perfekt! In welchem Bereich machst du deine Ausbildung?"
                                    }</Text>
                            </View>
                        </View>
                    </View>
      <View>
      <View className='flex-row'>
        <View className='rounded-[10px] bg-gray-900 p-5 items-start justify-start m-2 w-[300px] h-[300px]'>
          <Text className='text-white font-bold'>Schüler</Text>
          <Text className="text-gray-300">Name:                       {name}</Text>
          <Text className="text-gray-300">Ausgewähltes Land:          {selectedCountry.name}</Text>
          <Text className="text-gray-300">Ausgewählte Sprache:        {selectedLanguage}</Text>
          <Text className="text-gray-300">Ausgewählte Region:         {selectedRegion}</Text>
          <Text className="text-gray-300">Ausgewählte Schulform:      {school ? school.name : null}</Text>
          <Text className="text-gray-300">Ausgewählte Kalssenstufe:   {classNumber}</Text>
          <Text className="text-gray-300">Ausgewählte Fächer: </Text>
          {selectedSubjects.map((subject) => (
            <Text className='text-gray-300' key={subject}>{subject.name}</Text>
          ))}
        </View>
        <View className='rounded-[10px] bg-gray-900 p-5 items-start justify-start m-2 w-[300px] h-[300px]'>
          <Text className='text-white font-bold'>Student</Text>
          <Text className="text-gray-300">Name:                       {name}</Text>
          <Text className="text-gray-300">Ausgewähltes Land:          {selectedCountry.name}</Text>
          <Text className="text-gray-300">Ausgewählte Sprache:        {selectedLanguage}</Text>
          <Text className="text-gray-300">Ausgewählte Universität:    {selectedUniversity ? selectedUniversity.name : null}</Text>
          <Text className="text-gray-300">Ausgewählte Form:           {degree ? degree.name : null}</Text>
          {selectedField.map((subject) => (
            <Text className='text-gray-300' key={subject}>{subject.name}</Text>
          ))}
        </View>
      </View>
      <View className='flex-row'>
        <View className='rounded-[10px] bg-gray-900 p-5 items-start justify-start m-2 w-[300px] h-[300px]'>
          <Text className='text-white font-bold'>Ausbildung</Text>
          <Text className="text-gray-300">Name:                       {name}</Text>
          <Text className="text-gray-300">Ausgewähltes Land:          {selectedCountry.name}</Text>
          <Text className="text-gray-300">Ausgewählte Sprache:        {selectedLanguage}</Text>
          <Text className="text-gray-300">Ausgewählte Kathegorie:      {ausbildungKathegorie ? ausbildungKathegorie.name : null}</Text>
          <Text className="text-gray-300">Ausgewählte Ausbildung:     {selectedAusbildung ? selectedAusbildung.name : null}</Text>
        </View>
        <View className='rounded-[10px] bg-gray-900 p-5 items-start justify-start m-2 w-[300px] h-[300px]'>
          <Text className='text-white font-bold'>Other</Text>
          <Text className="text-gray-300">Name:                       {name}</Text>
          <Text className="text-gray-300">Ausgewähltes Land:          {selectedCountry.name}</Text>
          <Text className="text-gray-300">Ausgewählte Sprache:        {selectedLanguage}</Text>
          {selectedSubjects.map((subject) => (
            <Text className='text-gray-300' key={subject}>{subject.name}</Text>
          ))}
          </View>
        </View>
      </View>
      <GratisPremiumButton aditionalStyles={"rounded-full w-full "} >
                    <Text className='text-gray-100 font-semibold text-[15px]'>{
                        selectedLanguage == null || languages[selectedLanguage].code == "DE" ? "Weiter gehts":
                        languages[selectedLanguage].code == "GB" ? "Let's carry on!":
                        languages[selectedLanguage].code == "US" ? "Let's move on!":
                        languages[selectedLanguage].code == "AU" ? "Let’s keep moving!":
                        languages[selectedLanguage].code == "ES" ? "Vamos":
                        "Weiter gehts"
                        }</Text>
      </GratisPremiumButton>
      </View>
    ) 

}

export default StepSeven