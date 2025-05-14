import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Battery from '@/components/tokens/battery'
import RadioactiveCharege from '@/components/tokens/radioactivecharege'
import Supercharge from '@/components/tokens/supercharge'
import Fusioncharge from '@/components/tokens/fusioncharge'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { addUserUsage } from '@/lib/appwriteAdd'
import { loadUserUsage } from '@/lib/appwriteDaten'

const shop = () => {
  const {user, isLoggedIn,isLoading, userUsage, setUserUsage } = useGlobalContext();
  useEffect(() => {
      if (!user) return;
      async function fetchUserData() {
        try {
          const res = await loadUserUsage(user.$id)
          if (res) {
            setUserUsage({
              ...res, 
              lastModules: res.lastModules.map((item) => JSON.parse(item)),
              lastSessions: res.lastSessions.map((item) => JSON.parse(item)),
            })
          } else {
            const res = await addUserUsage(user.$id,userUsage)
            setUserUsage(res);
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Nutzerdaten:", error);
        }
      }
      fetchUserData();
    },[user])

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
      <View className='flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]'>
        <View className='w-full flex-row justify-between'>
            <TouchableOpacity className='flex-row m-2 p-5' >
              <Icon name="fire" size={20} color={"white"}/>
              <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.streak}</Text>
            </TouchableOpacity>
  
            <View className='flex-row m-2 p-5' >
              <TouchableOpacity className='flex-row mx-5' onPress={()=> router.push("/shop")} >
                <Icon name="microchip" size={20} color={"white"}/>
                <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.microchip}</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex-row' onPress={()=> router.push("/shop")}
              >
                <Icon name="bolt" size={20} color={"white"}/>
                <Text className='text-white font-bold text-[15px] ml-2'>{userUsage?.boostActive ? "∞" : userUsage?.energy}</Text>
              </TouchableOpacity>
            </View>
  
        </View>
        <View className='flex-1 items-center justify-center'>
          <Image source={require("../../assets/gift.png")} style={{
            height: 200,
            width: 200,
          }}/>
          <Text className='text-white font-bold text-2xl'>Danke fürs Mitentwickeln!</Text>
          <Text className='text-gray-300 font-semibold text-[15px]'>🎉 Alle Features sind in der Beta gratis.</Text>
        </View>
        <View/>
      </View>
      
  )}} page={"Shop"} hide={false}/>
  )
  }


export default shop