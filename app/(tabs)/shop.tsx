import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Battery from '@/components/tokens/battery'
import RadioactiveCharege from '@/components/tokens/radioactivecharege'
import MikroChip from '@/components/tokens/mikroChip'
import Supercharge from '@/components/tokens/supercharge'
import Fusioncharge from '@/components/tokens/fusioncharge'

const shop = () => {

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
      <ScrollView  className='bg-[#0c111e]'
      style={{
        backgroundColor:"#0c111e"

      }}
      >
        
        <Banner title={"Energie aufüllen"}/>
        <View className="flex-row flex-wrap items-center justify-center">
          <ShopItem price={500} name={"Recharge"} type={"battery"} currency={"chips"} amount={"1"}/>  
          <ShopItem price={2500} name={"Recharge"} type={"battery"} currency={"chips"} amount={"5"}/>  
          <ShopItem price={5000} name={"Recharge"} type={"battery"} currency={"chips"} amount={"10"}/>  
        </View>
        <Banner title={"Unendlich Energie für 1 Stunde"}/>
        <View className="flex-row flex-wrap items-center justify-center">
          <ShopItem price={500} name={"Super Charge"} type={"supercharge"} currency={"chips"} amount={"1"}/>  
          <ShopItem price={2500} name={"Super Charge"} type={"supercharge"} currency={"chips"} amount={"3"}/>  
          <ShopItem price={5000} name={"Super Charge"} type={"supercharge"} currency={"chips"} amount={"5"}/>  
        </View>
        <Banner title={"Unendlich Energie für 1 Tag"}/>
        <View className="flex-row flex-wrap items-center justify-center">
          <ShopItem price={1099} name={"Radioactive Charge"} type={"radioactive"} currency={"euro"} amount={"1"}/>  
          <ShopItem price={4099} name={"Radioactive Charge"} type={"radioactive"} currency={"euro"} amount={"5"}/>  
          <ShopItem price={9999} name={"Radioactive Charge"} type={"radioactive"} currency={"euro"} amount={"10"}/>  
        </View>
        <View className="flex-row flex-wrap items-center justify-center">
        <Banner title={"Unendlich Energie für 1 Monat"}/>
        <View className='w-full items-center justify-center'>
          <ShopItem price={5999} name={"Fusion Charge"} type={"fusion"} currency={"euro"} amount={"1"}/>  
        </View>  
        </View>
        <Banner title={"Währung"}/>
        <View className="flex-row flex-wrap items-center justify-center">
          <ShopItem price={99} name={"Chips"} type={"chip"} currency={"euro"} amount={"100"}/>  
          <ShopItem price={599} name={"Chips"} type={"chip"} currency={"euro"} amount={"1.000"}/>  
          <ShopItem price={1099} name={"Chips"} type={"chip"} currency={"euro"} amount={"5.000"}/>  
        </View>
        <View className="flex-row flex-wrap items-center justify-center">
          <ShopItem price={2099} name={"Chips"} type={"chip"} currency={"euro"} amount={"20.000"}/>  
          <ShopItem price={5099} name={"Chips"} type={"chip"} currency={"euro"} amount={"50.000"}/>  
          <ShopItem price={9995} name={"Chips"} type={"chip"} currency={"euro"} amount={"100.000"}/>  
        </View>
      </ScrollView>
  )}} page={"Home"} hide={false}/>
  )
  }


export default shop