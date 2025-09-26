import React, { use, useEffect, useState } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import HomeGeneral from "@/components/(home)/homeGeneral";
import { View } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { updateUserUsage } from "@/functions/(userUsage)/updateUserUsage";
import { loadUserUsage } from "@/lib/appwriteDaten";
import * as Updates from "expo-updates";

const home = () => {
  const [selected, setSelected] = useState("HomeGeneral");
  const { user, isLoggedIn, isLoading, userUsage, setUserUsage } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  


      
    


  return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1 rounded-[10px] bg-[#0c111d]">
            {selected == "HomeGeneral" ? <HomeGeneral /> : null}
          </View>
        );
      }}
      page={"Home"}
      hide={selected == "HomeChat" ? true : false}
    />
  );
};

export default home;
