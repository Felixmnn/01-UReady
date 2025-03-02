import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";
import VektorCircle from '@/components/(karteimodul)/vektorCircle';
import { useWindowDimensions } from 'react-native';
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import AllModules from '@/components/(bibliothek)/allModules';
import SingleModule from '@/components/(bibliothek)/singleModule';

const Bibliothek = () => {
  const [last7Hidden, setLast7Hidden ] = useState(true)
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    const [selected, setSelected] = useState("AllModules")
    

  return (
      <Tabbar content={()=> { return(
        <View className='flex-1'>
        {selected == "AllModules" ? <AllModules setSelected={setSelected}/> : null}
        {selected == "SingleModule" ? <SingleModule setSelected2={setSelected}/> : null}
        </View>
    )}} page={"Bibliothek"} hide={selected == "SingleModule" ? true : false}/>
  )
}

export default Bibliothek