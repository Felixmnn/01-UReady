import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import images from "@/assets/shopItems/itemConfig";
import TokenHeader from "@/components/(general)/tokenHeader";
import { setUserData } from "@/lib/appwriteEdit";
import RewardedAdScreen from "@/components/(shop)/add";
import SimpleStore from "@/components/(shop)/iap";
import { useTranslation } from "react-i18next";
import { loadAproved } from "@/lib/appwriteDaten";

const shop = () => {
  const { user, isLoggedIn, isLoading, userUsage } = useGlobalContext();
  const [ aproved, setAproved ] = React.useState(null);

  useEffect(() => {
    loadAproved().then((res) => setAproved(res)); 
  }, []);

  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);


  const { t } = useTranslation();


  const Header = ( {
    title}
    : { title: string
  }) => {
    return (<View className="relative w-full h-[60px] mt-1 items-center justify-center">
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
                  {title}
                </Text>
              </View>)
  }
  return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]">
            <TokenHeader/>
            <ScrollView className="w-full">
              <Header title={t("shop.buyEnergy")}/>
              <SimpleStore/>
              <Header title={t("shop.freeEnergy")}/>
              <View className="p-4">
                { aproved != null && <RewardedAdScreen aproved={aproved}/> }
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
