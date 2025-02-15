import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useWindowDimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';
import CustomTextInput1 from '../(tabs)/customTextInput1';


const HomeChat = ({setSelectedPage}) => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const TouchableIcon = ({iconName, handlePress}) => {
        return (
            <TouchableOpacity onPress={handlePress} className='mx-3'>
                <Icon name={iconName} size={15}  color={"gray"}/>
            </TouchableOpacity>
        )
    }
  return (
    <View className='flex-1 items-center '>
        {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70 border-t-[1px] border-gray-700'></View> : null }
        <View className='flex-1 w-full bg-gradient-to-b from-[#001450] to-[#0c111e] rounded-[10px] border-gray-700 border-[1px]'>
            <View className='flex-row w-full justify-between rounded-[10px] bg-[#09162f] items-center p-4'>
                <View className='flex-row items-center'>
                    <Image
                               source={require("../../assets/Black Minimalist Letter R Monogram Logo.gif")}
                               style={{ width:50, height:50}}
                              />
                    <View className='m-2'>
                        <View className='flex-row items-center'>
                            <Text className='font-bold text-white mr-1'>Assistent</Text>
                            <Text className='bg-gray-700 items-center justify-center h-[14px] px-[1px] rounded-full text-gray-300 text-[10px]'>BETA</Text>
                        </View>
                        <Text className='text-[10px] text-gray-500'>Aktiv</Text>
                    </View>
                </View>
                <View className='flex-row'>
                    <TouchableIcon iconName={"undo"}/>
                    <TouchableIcon iconName={"chevron-down"} handlePress={()=> setSelectedPage("HomeGeneral")}/>

                </View>
            </View>
            <View className='flex-1'>

            </View>
            <View className='flex-row p-3 items-center'>
                <TouchableOpacity className='rounded-full h-[40px] w-[40px] bg-gray-900 items-center justify-center border-gray-700 border-[1px]' onPress={()=> setIsVisibleDataUpload(true)} >
                    <Icon name="paperclip" size={15} color="gray"/>
                </TouchableOpacity>
                <CustomTextInput1 inputStyles={"rounded-full m-2 h-[40px]"} value={"Frag mich was du wills..."} placeholderSize={15} placeholderBold={"400"}/>
            </View>
        </View>
    </View>
  )
}

export default HomeChat