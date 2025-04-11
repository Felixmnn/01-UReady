import { View, Text, Image, TextInput,TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions} from 'react-native'
import React from 'react'
import GratisPremiumButton from '../(general)/gratisPremiumButton'
import Icon from 'react-native-vector-icons/FontAwesome5'
import ProgressBar from './(components)/progressBar'
const StepOne = ({name, setName, userData, setUserData}) => {
    const {height} = useWindowDimensions()
    return (
        
        <View className='h-full  w-full justify-between items-center py-5'
        style={{height:height,

        }}
        >   
        
            <ProgressBar percent={20} handlePress={()=> setUserData({...userData,signInProcessStep:"ZERO"})}/>
                <View className='items-center justiy-center'
                
                >
                    <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                        <Text className='font-semibold text-[15px] text-gray-100 text-center'>Wie heißt du eigentlich</Text>
                    </View>
                        <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
                        <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
                        <Image source={require('../../assets/Frage.gif')}  style={{height:150, width:150}}/>
                        
                        <TextInput
                                className={`text-white  rounded-[10px] p-1 bg-[#0c111d] text-center p-2 my-1 mx-2 border-blue-700 border-[1px]  `} 
                                style={{width:200, color: 'white'}}
                                value={name}
                                onChangeText={(text) => setName(text)}
                                placeholder="Dein Vorname"
                                placeholderTextColor="#AAAAAA" // 👈 Farbe vom Placeholder

                            />
                </View>
            <View className=' max-w-[200px]'
            style={{width:200}}
            >
                <GratisPremiumButton aditionalStyles={"rounded-full w-full bg-blue-500 "} handlePress={()=> setUserData({...userData,signInProcessStep:"TWO"})}>
                    <Text className='text-gray-100 font-semibold text-[15px]'>Weiter gehts</Text>
                </GratisPremiumButton>
            </View>
        </View>
    )
}

export default StepOne