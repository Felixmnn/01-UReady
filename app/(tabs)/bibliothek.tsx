import { View, FlatList, Animated } from "react-native";
import React, { use, useEffect, useState } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import AllModules from "@/components/(bibliothek)/(pages)/allModules";
import SingleModule from "@/components/(bibliothek)/(pages)/singleModule";
import { getModules } from "@/lib/appwriteQuerys";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useLocalSearchParams } from "expo-router";
import SkeletonListBibliothek from "@/components/(general)/(skeleton)/skeletonListBibliothek";
import { module } from "@/types/appwriteTypes";
import { copyModule } from "@/lib/appwriteShare";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Bibliothek = () => {
  const { user, isLoggedIn, isLoading, reloadNeeded } = useGlobalContext();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  

  const { selectedModuleIndex } = useLocalSearchParams();
  useEffect(() => {
    if (typeof selectedModuleIndex == "string") {
      const index = parseInt(selectedModuleIndex);
      setSelectedModule(index);
      setSelected("SingleModule");
    }
  }, [selectedModuleIndex]);
  

  const [selected, setSelected] = useState("AllModules");
  const [modules, setModules] = useState<module[] | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchModules = async () => {
    if (user == null) return;
    setLoading(true);
    const modulesLoaded = await getModules(user.$id);
    if (modulesLoaded) {
      setModules(modulesLoaded ? (modulesLoaded as unknown as module[]) : null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading && (!user || !isLoggedIn)) {
      router.replace("/"); // oder "/sign-in"
    }
  }, [user, isLoggedIn, isLoading]);

  useEffect(() => {
    fetchModules();
  }, [reloadNeeded]);

  useEffect(() => {
    if (user === null) return;
    fetchModules();
  }, [user]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchModules();
    setRefreshing(false);
  };

  return (
    <Tabbar
      content={() => {
        return (
          <View className="flex-1 ">
            {loading ? (
              <SkeletonListBibliothek />
            ) : (
              <View className="flex-1 rounded-[10px] ">
                {selected == "AllModules" ? (
                  <AllModules
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    setSelected={setSelected}
                    modules={modules}
                    setSelectedModule={setSelectedModule}
                    setModules={setModules}
                  />
                ) : null}
                {selected == "SingleModule" ? (
                  <SingleModule
                    setSelectedScreen={setSelected}
                    moduleEntry={modules && typeof selectedModule == "number" ? modules[selectedModule] : []}
                    modules={modules}
                    setModules={setModules}
                  />
                ) : null}
              </View>
            )}
          </View>
        );
      }}
      page={"Bibliothek"}
      hide={
        selected == "SingleModule" || selected == "CreateQuestion"
          ? true
          : false
      }
    />  
  );
};

export default Bibliothek;
