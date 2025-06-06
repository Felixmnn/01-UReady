import { View, Text, Image, TouchableOpacity,ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import images from '@/assets/shopItems/itemConfig'
import Cardcombination from '@/components/(shop)/cardcombination'
import TokenHeader from '@/components/(general)/tokenHeader'
import { loadShopItems } from '@/lib/appwriteShop';
import SkeletonListShop from '@/components/(general)/(skeleton)/skeletonListShop'
import { loadComercials } from '@/lib/appwriteDaten'

const shop = () => {
  const {user, isLoggedIn,isLoading, userUsage } = useGlobalContext();
  const [ shopItemsA, setShopItemsA ] = useState(null);
  const [comercials, setComercials] = useState([]);
  


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

  useEffect(() => {
    if (!userUsage) return;
    async function fetchComercials(){
      const response = await loadComercials();
      console.log("response 🐋", response);
      if (response) {
        setComercials(response.length > 0 ? response : []);
      }
    }
    fetchComercials();
  }, [userUsage]);

    useEffect(() => {
      if (!isLoading && (!user || !isLoggedIn)) {
        router.replace("/"); // oder "/sign-in"
      }
    }, [user, isLoggedIn, isLoading]);

    function calculateCommercialAmount(){
      const amountComercials = comercials.filter(c => c.type == "VIDEO").length;
      const commercialsAvailable = comercials.filter(c => c.type == "VIDEO" && !userUsage?.watchedComercials?.includes(c.$id));
      const commercialsToday = userUsage?.purcharses.filter(p => p.includes("VIDEO"))
      if (amountComercials == 0 || commercialsAvailable.length == 0) return "0/0";
      const amoutGT3 = amountComercials > 3 ? 3 : amountComercials; 
      if (commercialsToday.length > 0) return `${amoutGT3 - commercialsToday.length < 0 ? 0 : amoutGT3 - commercialsToday.length }/${amoutGT3}`;
      if (amountComercials > 0) return `${amoutGT3}/${amoutGT3}`;
      return "0/0"
    }

  return (
    <Tabbar content={()=> { return( 
      <View className='flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]'>
        
        <TokenHeader userUsage={userUsage}/>
        <ScrollView classNawme='w-full'
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
                <Cardcombination  commercialsAvailable={comercials.filter(c =>
                                                        !userUsage?.watchedComercials.some(wC => c.$id === wC))} 
                                  amountVideos={calculateCommercialAmount()} amountQuestionarys={"3/3"} cards={shopItemsA.filter(item => item.kathegory == "FREEITEM" )} title='Free Items' userUsage={userUsage} purcharses={userUsage?.purcharses} />
              </View> 
            }
        </ScrollView>
      </View>
      
  )}} page={"Shop"} hide={false}/>
  )
  }


export default shop