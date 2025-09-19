import { View, Text,TouchableOpacity , Image} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'

const ContinueBox = ({
  colorBorder, 
  colorBG, 
  iconName, 
  handlePress, 
  text, 
  selected, 
  horizontal=false
}:{
  colorBorder: string,
  colorBG: string,
  iconName: string,
  handlePress: () => void,
  text: string,
  selected: boolean,
  horizontal?: boolean
  

}) => {
  return (
    <TouchableOpacity
                    className={`flex-1 rounded-[10px] bg-[#0c111d] border-gray-800 border-[1px] p-2 m-2 items-center justify-start shadow-lg ${horizontal ? "flex-row " :"w-full"}`}
                    onPress={handlePress}
                    style={{
                      borderColor: colorBorder,
                      shadowColor: selected ? colorBorder : undefined, // Grau-Blauer Glow
                      shadowRadius: selected ? 10 : 0, // Größe des Glows
                      shadowOpacity: selected ? 0.8 : 0, // Sichtbarkeit des Glows
                      maxWidth: horizontal ? null : 300,
                      maxHeight: horizontal ? null : 150,
                      shadowOffset: { width: 0, height: 0 },
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
                      tintColor={colorBorder}
                      style={{
                        height: 40, 
                        width: 40, 
                      }} 
                    />
                    : 
                    <Icon name={iconName} size={30} color={colorBorder}/>
                
                    } 
                    </TouchableOpacity>
                    
                  <View className='flex-1 pr-2 p-1'>
                    <Text className={`${horizontal ? "text-start" : "text-center"} text-gray-300 font-semibold text-[15px]`}
                    >
                      {text}
                    </Text>
                  </View>
                  </TouchableOpacity>
  )
}

export default ContinueBox