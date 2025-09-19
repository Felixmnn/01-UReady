import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import images from "@/assets/shopItems/itemConfig";
import TokenHeader from "@/components/(general)/tokenHeader";
import { setUserData } from "@/lib/appwriteEdit";

const shop = () => {
  const { user, isLoggedIn, isLoading, userUsage } = useGlobalContext();

  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);


  const BuyEnergy = ({
    price,
    amount
  }:{
    price?: number,
    amount?: number
  }) => {
    return (
      <View className="flex-1 h-20 bg-gray-800 rounded-[10px] p-2 flex-row items-center mb-2"
        style={{
          backgroundColor: "#0560a5",
        }}
      >
        <Image
          source={images.bolt}
          style={{
            height: 50,
            width: 50,
            resizeMode: "contain",
            marginRight: 10,
          }}  
        />
        <View className="flex-1">
          <Text className="text-white font-bold">Refill {amount} Energy</Text>
          <Text className="text-gray-400">Get {amount} energy for {price}€</Text>
        </View>
        <TouchableOpacity className="bg-blue-900 px-4 py-2 rounded-[10px]" onPress={() => {
          console.log("Buying Energy");
        }}> 
          <Text className="text-white font-bold">Buy</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const WatchAdd = () => {
    return (
      <View className="flex-1 h-20 bg-[#294a67] rounded-[10px] p-2 flex-row items-center mb-2"
        style={{
          backgroundColor: "#294a67",
        }}
      >
        <Image
          source={images.COMERCIAL}
          style={{
            height: 50,
            width: 50,
            resizeMode: "contain",
            marginRight: 10,
          }}
        />
        <View className="flex-1">
          <Text className="text-white font-bold">Watch Ad</Text>
          <Text className="text-gray-400">Get 5 energy for free</Text>
        </View>
        <TouchableOpacity className="bg-blue-900 px-4 py-2 rounded-[10px]" onPress={() => {
          console.log("Watching Ad");
        }}>
          <Text className="text-white font-bold">Watch</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]">
            <TokenHeader userUsage={userUsage} />
            <ScrollView className="w-full">
              <View className="relative w-full h-[60px] mt-1 items-center justify-center">
                <Image
                  source={images.head}
                  style={{
                    width: 350,
                    resizeMode: "contain",
                    marginTop: 5,
                  }}
                />
                <Text
                  className="absolute text-white text-2xl font-bold pt-2"
                  style={{
                    color: "#a6b4c1ff",
                  }}
                >
                  {"Buy Energy"}
                </Text>
              </View>
              <View className="p-4">
                <BuyEnergy amount={5} price={0.99}/>
                <BuyEnergy amount={15} price={2.99}/>
                <BuyEnergy amount={50} price={7.99}/>
              </View>
              <View className="relative w-full h-[60px] mt-1 items-center justify-center">
                <Image
                  source={images.head}
                  style={{
                    width: 350,
                    resizeMode: "contain",
                    marginTop: 5,
                  }}
                />
                <Text
                  className="absolute text-white text-2xl font-bold pt-2"
                  style={{
                    color: "#a6b4c1ff",
                  }}
                >
                  {"Watch Ad for Energy"}
                </Text>
              </View>
              <View className="p-4">
                <WatchAdd/>
              </View>

            </ScrollView>
          </View>
        );
      }}
      page={"Shop"}
      hide={false}
    />
  );
};

export default shop;
