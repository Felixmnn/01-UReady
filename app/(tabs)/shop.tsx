import { View, Text, Image, ScrollView, TouchableOpacity, Platform, Linking } from "react-native";
import React, { use, useEffect } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import images from "@/assets/shopItems/itemConfig";
import TokenHeader from "@/components/(general)/tokenHeader";
import RewardedAdScreen from "@/components/(shop)/add";
import SimpleStore from "@/components/(shop)/iap";
import { useTranslation } from "react-i18next";
import Offline from "@/components/(general)/offline";
import IapAbo from "@/components/(shop)/iapAbo";
import { checkAprovedAdd } from "@/lib/appwriteDaten";

const shop = () => {
  
  const { user, isLoggedIn, isLoading, userUsage, isOffline, subscriptionStatus } = useGlobalContext();

 

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

  const [aprovedAdd, setAprovedAdd] = React.useState(false);

  useEffect(() => {
    checkAprovedAdd().then((res) => {
      setAprovedAdd(res);
    });
  }, []);
  



    return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1 items-center justify-between bg-[#0c111e] rounded-[10px]">
            <TokenHeader/>
            { isOffline ? <Offline/> :

            <ScrollView className="w-full">
              <Header title={t("shop.buyEnergy")}/>
              <SimpleStore/>
              <Header title={t("shop.freeEnergy")}/>
              <View className="flex-1 p-4">
                <RewardedAdScreen
                  aproved={aprovedAdd}
                 />
              </View>
             
              <View>
                <Header title={t("shop.removeAds")}
                />
                <IapAbo/>
                {
                  (Platform.OS === "ios" ) &&
                  <TouchableOpacity onPress={async() => {
                    const res = await Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
                  }}>
                    <Text className="text-center text-blue-300 italic mb-4">
                      EULA
                    </Text>
                  </TouchableOpacity>
                }
              </View>
             
            </ScrollView>
      }
          </View>
        );
      }}
      page={"Shop"}
      hide={false}
    />
  );
};

export default shop;
