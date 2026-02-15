import React, { use, useEffect, useState } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import HomeGeneral from "@/components/(home)/homeGeneral";
import { View } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const home = () => {
  const [selected, setSelected] = useState("HomeGeneral");
  const { user, isLoggedIn, isLoading, userData, userUsage } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

   useEffect(() => {
    if(!userData) return;
    if (userData?.signInProcessStep === "DONE") return;
    if (userData?.signInProcessStep === "FINISHED") {
      router.replace("/getting-started");
    }
    }, [userData]);
 


      
    

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
