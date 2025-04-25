import { View, Text, Image, ScrollView, Platform } from 'react-native'
import React, { useEffect } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Battery from '@/components/tokens/battery'
import RadioactiveCharege from '@/components/tokens/radioactivecharege'
import MikroChip from '@/components/tokens/mikroChip'
import Supercharge from '@/components/tokens/supercharge'
import Fusioncharge from '@/components/tokens/fusioncharge'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'

const shop = () => {
  const {user, isLoggedIn,isLoading } = useGlobalContext();
    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);

  const Banner = ({title}) => {
    return (
      <View className='flex-1 p-2 items-center justify-center m-2 bg-blue-500 rounded-[5px]'
      style={{
        borderColor: "#51bbfe",
        shadowColor: "#51bbfe", // Grau-Blauer Glow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Für Android
      }}
      >
        <Text className='text-xl font-bold text-white text-center '>{title}</Text>
      </View> 
    )
  }
  
  const ShopItem = ({price, name, amount, type, currency}) => {
    return (
      <View className='p-2 rounded-[10px] bg-gray-800 m-2 items-center justify-center'
      style={{
        
        width:100,
        height: 150,
        hadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10, // Für Android
      }}
      >
        
        <View className=' rounded-[10px] m-2 p-2 items-center '
          >
            <Text className='text-white font-semibold text-[12px]'>
              {amount}
            </Text>
            <View>
              {type == "chip" ? <MikroChip/> : null}
              {type =="battery" ? <Battery charge={5}/> : null}
              {type =="radioactive" ? <RadioactiveCharege/> : null}
              {type == "supercharge" ? <Supercharge/> : null}
              {type == "fusion" ? <Fusioncharge/> : null}
            </View>
        </View>
        <Text className='text-white font-semibold text-[13px] text-center'>
          {name}
        </Text>
        <Text className='text-gray-300 text-center  text-[12px]'>
          {currency == "euro" ? (`${Math.floor(price / 100)}.${(price % 100).toString().padStart(2, '0')} €`) : null}
          {currency == "chips" ? (`${price} Chips`) : null}
        </Text>
      </View>
    )
  }
 
  return (
    <Tabbar content={()=> { return( 
      <View className='flex-1 items-center justify-center bg-[#0c111e]'>
        <Image source={require("../../assets/gift.png")} style={{
          height: 200,
          width: 200,
        }}/>
        <Text className='text-white font-bold text-2xl'>Danke fürs Mitentwickeln!</Text>
        <Text className='text-gray-300 font-semibold text-[15px]'>🎉 Alle Features sind in der Beta gratis.</Text>
      </View>
      
  )}} page={"Home"} hide={false}/>
  )
  }


export default shop