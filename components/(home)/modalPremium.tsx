import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState} from 'react';

const ModalPremium = ({isVisible, setIsVisible}) => {

    {/*Abo Option*/}
    const [option, setOption] = useState(0)
    const Option = ({ title, subTitle, value}) => {
        return (
        <TouchableOpacity onPress={()=> setOption(value)} className={`flex-1 flex-row items-center justify-between p-2 rounded-[10px] ${value == option ? "border-[2px] border-blue-500" : "border-gray-700 border-[1px]"}`}>
            <View className=''>
                <Text className='font-semibold text-[15px] text-white'>{title}</Text>
                <Text className='font-semibold text-[10px] text-white'>{subTitle}</Text>

            </View>
            <View className={`items-center justify-center border-[1px] rounded-full h-[25px] w-[25px] ${value == option  ?  "border-blue-500" : "border-gray-700"} `}>
                <Icon name="check" size={12} color={value == option ?  "#458bff" : "white" }/>
            </View>
        </TouchableOpacity>
        )
    }

    {/*Toggle Swich*/}
    const [selected, setSelected] = useState(false)
    const ToggleSwitch = () => {
        return(
        <TouchableOpacity className={`h-[24px] w-[45px] p-[1px] rounded-full border-gray-700 border-[1px] justify-center my-2 ${!selected ? "items-start bg-green-600" : "items-end bg-gray-700" }`} onPress={()=> setSelected(!selected)}>
            <View className='bg-white rounded-full pb-[1px]' style={{height:22, width:22}}></View>
        </TouchableOpacity>
        ) 
      };
    



  return (
    <View>
        {
            isVisible ? 
            <Modal 
            animationType="fade"
            transparent={true}
            visible={isVisible}
        >
          <View className="absolute top-0 left-0 w-full h-full justify-center items-center ">
            <View className='rounded-xl bg-gray-800 border-[1px] border-gray-700' style={{minWidth:400}}>
            <View className='bg-gradient-to-b from-blue-500 to-blue-800 p-3 rounded-t-xl w-full'>
                <View className='flex-row justify-between w-full'>
                    <View className='h-[40px] w-[40px] bg-blue-900 rounded-full'/>
                    <TouchableOpacity className='h-[40px] w-[40px] border-[1px] border-white rounded-full items-center justify-center pt-[1px] pl-[1px]' onPress={()=> setIsVisible(false)}>
                        <Icon name="times" size={25} color="white"/>
                    </TouchableOpacity>
                    
                </View>
                <View className='h-[200px] w-full'>

                    </View>
            </View>
            <View className='p-3'>
                <Text className='font-bold text-blue-500'>Wähle deine Testversion</Text>
                <View className='flex-row my-2'>
                <Option title={"Kostenlos"} subTitle={"für 7 Tage"} value={0}/>
                <View className='m-1'></View>
                <Option title={"4.99€"} subTitle={"für 7 Tage"} value={1}/>
                </View>
                <View className='flex-row items-center justify-between'>
                    <Text className='text-white font-semibold text-[13px]'>Erinnere mich, bevor meine Tesphase endet</Text>
                    <ToggleSwitch/>
                </View>
                <TouchableOpacity className='rounded-full bg-white p-3 w-full items-center my-2'>
                    <Text className='font-bold'> {option == 0 ? "7 Tage starten für 0.00€" : "1 Monat für 4.99€ starten"}</Text>
                </TouchableOpacity>
                <Text className='font-bold text-white text-center mt-1'>{option == 0 ? "7 Tage Kostenlos, dann 69,99€ pro Jahr" : "4.99€ für 1 Monat, dann 69.99€ pro Jahr"}</Text>
                <Text className='text-[12px] text-gray-300 text-center mt-1'>Jederzeit Kündbar</Text>
            </View>
            </View>
          </View>
        </Modal>
          :
          null
        }
        </View>
  )
}

export default ModalPremium