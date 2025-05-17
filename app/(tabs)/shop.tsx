import { View, Text, Image, TouchableOpacity,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Battery from '@/components/tokens/battery'
import RadioactiveCharege from '@/components/tokens/radioactivecharege'
import Supercharge from '@/components/tokens/supercharge'
import Fusioncharge from '@/components/tokens/fusioncharge'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import images from '@/assets/shopItems/itemConfig'
import Cardcombination from '@/components/(shop)/cardcombination'
import TokenHeader from '@/components/(general)/tokenHeader'
import { loadShopItems } from '@/lib/appwriteShop';

const shop = () => {
  const {user, isLoggedIn,isLoading, userUsage } = useGlobalContext();
  const [ shopItemsA, setShopItemsA ] = useState(null);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const items = await loadShopItems();
        
        setShopItemsA(items);

      } catch (error) {
        console.error("Error loading shop items:", error);
      }
    };

    fetchShopItems();
  },[]);

  const imageSource = {
    "1CHARGE": images.charge,
    "3CHARGE": images.charge3,
    "10CHARGE": images.charge10,
    "100CHIPS": images.chips,
    "550CHIPS": images.chips2,
    "1200CHIPS": images.chip3,
    "SUPERCHARGE": images.supercharge,
    "SUPERBUNDLE": images.questionary,
    "CHARGEBUNDLE": images.bundle2,
    "VIDEO": images.video,
    "QUESTIONARY": images.bundle1,
  }

  const shopItems = [
    { currency: "", price: "Free", backgroundColor: "#644f0b", textbackgroundColor: "#373225", borderColor: "#644f0b", textColor: "#bc8e00", title: "1 Charge", imageSource: images.charge },
    { currency: "", price: "Free", backgroundColor: "#644f0b", textbackgroundColor: "#373225", borderColor: "#644f0b", textColor: "#bc8e00", title: "3 Charges", imageSource: images.charge3 },
    { currency: "", price: "Free", backgroundColor: "#644f0b", textbackgroundColor: "#373225", borderColor: "#644f0b", textColor: "#bc8e00", title: "10 Charges", imageSource: images.charge10 },
  ]
  const shopItems2 = [
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "100 Chips", imageSource: images.chips },
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "550 Chips", imageSource: images.chips2 },
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "1200 Chips", imageSource: images.chip3 },
  ]
  const shopItems3 = [
    { currency: "", price: "Free", backgroundColor: "#1f3f5d", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "Supercharge", imageSource: images.supercharge },
    { currency: "", price: "Free", backgroundColor: "#1f3f5d", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "Supercharge 2", imageSource: images.supercharge },
    { currency: "", price: "Free", backgroundColor: "#1f3f5d", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "Supercharge 3", imageSource: images.supercharge },   
  ]
  const shopItems4 = [
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "Fusioncharge", imageSource: images.questionary, width: 170 },
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "Fusioncharge 2", imageSource: images.bundle2, width: 170 },
    ]
  const shopItems5 = [
    { currency: "", price: "Free", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "", imageSource: images.video, width: 120 },
    { currency: "", price: "2 Free Charges", backgroundColor: "#294a67", textbackgroundColor: "#222534", borderColor: "#42b5e4", textColor: "#42b5e4", title: "", imageSource: images.bundle1, width: 220 },
    ]
  
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
        <TokenHeader userUsage={userUsage}/>
        <ScrollView className='w-full'
          style={{
            scrollbarWidth: 'thin', // Dünne Scrollbar
            scrollbarColor: 'gray transparent',
          }}
        >
            {
              !shopItemsA ?
              <View className='flex-1 items-center justify-center'>
                <Text className='text-white font-bold text-xl'>Loading...</Text>
              </View>
              :
              <View className='w-full items-center'>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "ENERGY" )} title='Recharges'/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "CHIPS" )} title='Chips'/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "RECHARGESBOOSTS" )} title='Chips'/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "SPECIALOFFERS" )} title='Chips'/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "FREEITEM" )} title='Chips'/>
              </View>
            }
        </ScrollView>
      </View>
      
  )}} page={"Shop"} hide={false}/>
  )
  }


export default shop