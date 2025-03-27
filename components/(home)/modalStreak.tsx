import { View, Text, Modal,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";


const ModalStreak = ({isVisible, setIsVisible,tage, days}) => {
    const t = new Date().getDay();
    const DaySelect = ({ day, status}) => {
        return (
        <TouchableOpacity className={`flex-1 m-1 ${false ? "flex-row p-3" : "p-2"} items-center justify-center rounded-[10px] ${days[t].sDay == day ? "border-orange-500 border-[2px] bg-orange-500 bg-opacity-30" : null} `}>
          
          { status == "fire" ? <View className='mx-2'><Icon name="fire" size={25} color="#f79009"/></View> : null}
          { status == "miss" ? <View className='mx-2 items-center justify-center rounded-full bg-gray-600 h-[25px] w-[25px]'><Icon name="times" size={15} color="gray" /></View> : null}
          { status == "pause" ? <View className='mx-2 items-center justify-center rounded-full bg-gray-600 h-[25px] w-[25px]'><Text className='text-white'>II</Text></View> : null}
          { status == "open" ? <View className={`mx-2 h-[25px] w-[25px] bg-gray-900 rounded-full border-dashed border-[1px] ${days[t].sDay == day ? "border-red-500" : "border-gray-500"}`}></View> : null}
          <View className={`${false ? "items-start" : "items-center"}`}> 
            <Text className='font-semibold text-gray-100'>{day}</Text>
          </View>
        </TouchableOpacity>
        )
      }

  return (
    <View>
    {
        isVisible ? 
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
      <TouchableOpacity className="absolute top-0 left-0 w-full h-full justify-center items-center " onPress={()=> setIsVisible(false)}>
        <View className="bg-gray-900 border-gray-700 border-[1px] p-5 rounded-xl items-center">
          <Image
                     source={require("../../assets/Black Minimalist Letter R Monogram Logo (2).gif")}
                     style={{ width:50, height:50}}
                    />
        <Text className='text-white font-bold text-[18px]'>{tage ? tage : 0} Tage Streak </Text>
        <View className='rounded-xl border-[1px] border-gray-700 items-center my-3 w-full'>
            <View className='flex-1 rounded-t-xl w-full flex-row bg-[#0c111d] p-3'>
                <DaySelect day={"Mo"} status={"fire"}/>
                <DaySelect day={"Di"} status={"fire"}/>
                <DaySelect day={"Mi"} status={"fire"}/>
                <DaySelect day={"Do"} status={"fire"}/>
                <DaySelect day={"Fr"} status={"fire"}/>
                <DaySelect day={"Sa"} status={"open"}/>
                <DaySelect day={"So"} status={"open"}/>

                
            </View>
            <View className='w-full border-t-[1px] border-gray-700'/>
            <Text className='text-white font-bold text-[15px] pt-3 pb-1'> Starte eine Quiz zu Algorythmen</Text>

            <TouchableOpacity 
                className="mt-1 bg-red-500 px-4 py-2 rounded-full bg-gradient-to-b from-[#300202] to-[#ed481c] mx-2 mb-2 w-[96%] items-center"
                onPress={() => setIsVisible(false)}
            >
                <Text className="text-gray-900 font-bold">{tage > 0 ? "Setze deine Streak fort" : "Starte deine Streak"}</Text>

            </TouchableOpacity>
        </View>
        </View>
      </TouchableOpacity>
    </Modal>
      :
      null
    }
    </View>
  )
}

export default ModalStreak