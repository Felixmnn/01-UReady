import { View, Text,TouchableOpacity , Image} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

const ContinueBox = ({colorBorder, colorBG, iconName, handlePress, text}) => {
  return (
    <View
                    className="w-[200px] h-[200px] rounded-[10px] bg-[#0c111d] border-gray-800 border-[1px] p-2 m-2 items-center justify-center shadow-lg"
                    style={{
                      height: 200,
                      width: 200,
                      shadowColor: colorBorder, // Grau-Blauer Glow
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 10,
                      elevation: 10, // Für Android
                    }}
                  >
                    <TouchableOpacity onPress={handlePress} className=' rounded-full bg-gray-[#0d2d3a] items-center justify-center m-2'
                      style={{
                        height: 60,
                        width: 60,
                        backgroundColor: colorBG,
                        borderWidth: 1,
                        borderColor: colorBorder,
                      }} 
                    >
                    {
                        iconName == "bot" ? 
                    
                      <Image 
                      source={require('../../../assets/bot.png')} 
                      style={{
                        height: 40, 
                        width: 40, 
                        tintColor: colorBorder 
                      }} 
                    />
                    : 
                    <Icon name={iconName} size={30} color={colorBorder}/>
                
                    } 
                    </TouchableOpacity>
                    
    
                    <Text className="text-center text-gray-300 font-semibold text-[15px]">
                      {text}
                    </Text>
                  </View>
  )
}

export default ContinueBox