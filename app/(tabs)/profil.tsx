import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Tabbar from "@/components/(tabs)/tabbar";
import { useGlobalContext } from "@/context/GlobalProvider";
import ProfileSettings from "@/components/(profile)/profileSettings";
import SkeletonListProfile from "@/components/(general)/(skeleton)/skeletonListProfile";

const profil = () => {
  const { user, isLoggedIn, isLoading } = useGlobalContext();
  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  const [page, setPage] = useState("profil-settings");

  return (
    <Tabbar
      content={() => {
        return user ? (
          <ProfileSettings />
        ) : (
          <View className="flex-1 bg-[#0c111d] rounded-[10px] p-2 border-gray-500 border-[1px]">
            <Text>{JSON.stringify(user)}</Text>
            <SkeletonListProfile />
          </View>
        );
      }}
      page={"Profil"}
      hide={true}
    />
  );
};

export default profil;
