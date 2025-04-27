import { View, Text, Modal,TouchableOpacity, Image,ScrollView } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";

import { useWindowDimensions } from 'react-native';
const ModalStreak = ({isVisible=false, setIsVisible,tage, days}) => {
  const { width } = useWindowDimensions();
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
      <TouchableOpacity className="absolute top-0 left-0 w-full h-full justify-center items-center " onPress={()=> setIsVisible(false)}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dunkler Hintergrund
      }}
        >
        <View className="bg-gray-900 border-gray-700 border-[1px] p-3 rounded-xl items-center"
       style={{
        shadowRadius: 10, // Größe des Glows
        shadowOpacity: 0.9, // Sichtbarkeit des Glows
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
        shadowColor: "#FFA500", // Orange Glow (Hex für Orange)
      }}
      
        >
          <Image
                     source={require("../../assets/Black Minimalist Letter R Monogram Logo (2).gif")}
                     style={{ width:50, height:50}}
                    />
        <Text className='text-white font-bold text-[18px]'>{tage ? tage : 0} Tage Streak </Text>
        <View className='  rounded-xl border-[1px] border-gray-700  items-center my-3 '>
            <ScrollView horizontal={true} >
              <View className='flex-row'
              style={{
                width: width > 600 ? 500 : width - 60,
              }}
              >
                <DaySelect day={"Mo"} status={"fire"}/>
                <DaySelect day={"Di"} status={"fire"}/>
                <DaySelect day={"Mi"} status={"fire"}/>
                <DaySelect day={"Do"} status={"fire"}/>
                <DaySelect day={"Fr"} status={"fire"}/>
                <DaySelect day={"Sa"} status={"open"}/>
                <DaySelect day={"So"} status={"open"}/>
              </View>
            </ScrollView>
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