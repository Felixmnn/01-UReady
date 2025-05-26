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
import SkeletonList from '@/components/(general)/(skeleton)/skeletonList'
import SkeletonListShop from '@/components/(general)/(skeleton)/skeletonListShop'

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
    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);

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
                <SkeletonListShop />
              </View>
              :
              <View className='w-full items-center'>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "ENERGY" )} title='Recharges' userUsage={userUsage} purcharses={userUsage?.purcharses}/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "CHIPS" )} title='Chips' userUsage={userUsage} purcharses={userUsage?.purcharses}/>
                <Cardcombination cards={[shopItemsA.filter(item => item.kathegory == "RECHARGESBOOSTS" )[0]]} title='Boosts' userUsage={userUsage} purcharses={userUsage?.purcharses}/>
                <Cardcombination cards={shopItemsA.filter(item => item.kathegory == "FREEITEM" )} title='Free Items' userUsage={userUsage} purcharses={userUsage?.purcharses}/>
              </View> 
            }
        </ScrollView>
      </View>
      
  )}} page={"Shop"} hide={false}/>
  )
  }


export default shop