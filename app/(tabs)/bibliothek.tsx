import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Tabbar from "@/components/(tabs)/tabbar";
import AllModules from "@/components/(bibliothek)/(pages)/allModules";
import SingleModule from "@/components/(bibliothek)/(pages)/singleModule";
import { getModules } from "@/lib/appwriteQuerys";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router, useLocalSearchParams } from "expo-router";
import SkeletonListBibliothek from "@/components/(general)/(skeleton)/skeletonListBibliothek";
import { getCompleatlyUnsavedModulesFromMMKV, getModulesFromMMKV, getUnsavedModulesFromMMKV, getUnsavedQuestionsFromMMKV, removeCompleatlyUnsavedModulesFrommMMKV, removeSpecificCompleatlyUnsavedModule, removeSpecificModuleFromMMKV, removeTmpModulesFromMMKV, resetUnsavedModulesInMMKV, resetUnsavedQuestionsInMMKV, saveModulesToMMKV } from "@/lib/mmkvFunctions";
import { updateQuestion } from "@/lib/appwriteEdit";
import { addNewModule } from "@/lib/appwriteAdd";
import { module, question } from "@/types/appwriteTypes";

type ScreenType =
  | "CreateQuestion"
  | "CreateNote"
  | "Data"
  | "AllModules"
  | "SingleModule"
  | "CreateModule"
  | "AiModule"
  | "AiQuiz";

const Bibliothek = () => {
  const { user, isLoggedIn, isLoading, reloadNeeded } = useGlobalContext();
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selected, setSelected] = useState<ScreenType>("AllModules");
  const [modules, setModules] = useState<module[] | []>(getModulesFromMMKV());
  const [loading, setLoading] = useState(true);
  const MAX_LOADING_TIME = 3000;

  const { selectedModuleId } = useLocalSearchParams();
  useEffect(() => {
    if (typeof selectedModuleId !== "string" || !selectedModuleId) return;
    const index = modules.findIndex((item) => item.$id === selectedModuleId);
    if (index !== -1) {
      setSelectedModule(index);
      setSelected("SingleModule");
    }
  }, [selectedModuleId, modules]);

  useEffect(() => {
    const locallyUpdatedModules = getModulesFromMMKV();
    console.log("Local Modules:", locallyUpdatedModules.map(mod => mod.name));
    setModules(locallyUpdatedModules);
  }, [selectedModuleId]);

 
  useEffect(() => {
    saveCompleatlyUnsavedModules();
    saveUnsavedQuestions();
  }, []);


  async function saveCompleatlyUnsavedModules(){
    let compleatlyUnsavedModules = getCompleatlyUnsavedModulesFromMMKV()
    
    if (compleatlyUnsavedModules.length === 0) return;
    for (let i = 0; i < compleatlyUnsavedModules.length; i++) {
      const id = compleatlyUnsavedModules[i].$id!;
      await addNewModule(compleatlyUnsavedModules[i],user?.$id);
      compleatlyUnsavedModules = compleatlyUnsavedModules.filter(mod => mod.$id !== id);
      if (compleatlyUnsavedModules.length == 1) {
        compleatlyUnsavedModules = [];
      } else {
        compleatlyUnsavedModules = compleatlyUnsavedModules.slice(1)
      }
      removeSpecificCompleatlyUnsavedModule(id);
    }
    if (compleatlyUnsavedModules.length === 0) {

      removeCompleatlyUnsavedModulesFrommMMKV();
    }

    //Wichtig das muss ich gleich anpassen aktuell werden so die offline Module glöscht
    const compleatlyUnsavedModulesR = getCompleatlyUnsavedModulesFromMMKV()

  }

  async function saveUnsavedQuestions(){
    const unsavedQuestionLists = getUnsavedQuestionsFromMMKV();
    if (unsavedQuestionLists.length === 0) return;
    for (let i = 0; i < unsavedQuestionLists.length; i++) {
      const unsavedQuestion = unsavedQuestionLists[i];
      await updateQuestion(unsavedQuestion );
    }
    resetUnsavedQuestionsInMMKV();
  }
 
  const fetchModules = async () => {
  if (!user) return;

  setLoading(true);

  const loadOfflineModules = () => {
    const locallyUpdatedModules = getModulesFromMMKV();
    const unsavedModuleLists = getUnsavedModulesFromMMKV();

    if (unsavedModuleLists.length > 0) {
      const repairedModules = locallyUpdatedModules.map((module) => {
        const unsavedModule = unsavedModuleLists.find(
          (unsaved) => unsaved.moduleID === module.$id
        );

        if (!unsavedModule) return module;

        const repairedQuestionList = module.questionList.map((q) => {
          const question = JSON.parse(q);
          const matchingItem = unsavedModule.items.find(
            (item) => item.id === question.id
          );

          return JSON.stringify({
            ...question,
            status: matchingItem ? matchingItem.status : question.status,
          });
        });

        return {
          ...module,
          questionList: repairedQuestionList,
        };
      });

      saveModulesToMMKV(repairedModules as module[]);
      setModules(repairedModules as module[]);
    } else {
      setModules(locallyUpdatedModules ?? []);
    }
  };

  try {
    const modulesLoaded = await Promise.race([
      getModules(user.$id),
      new Promise<"TIMEOUT">((resolve) =>
        setTimeout(() => resolve("TIMEOUT"), MAX_LOADING_TIME)
      ),
    ]);

    if (modulesLoaded === "TIMEOUT" || (modulesLoaded as any) === "404") {
      loadOfflineModules();
      return;
    }

    const unsavedModuleLists = getUnsavedModulesFromMMKV();

    let finalModules = modulesLoaded as unknown as module[];

    if (unsavedModuleLists.length > 0) {
      finalModules = finalModules.map((module) => {
        const unsavedModule = unsavedModuleLists.find(
          (unsaved) => unsaved.moduleID === module.$id
        );

        if (!unsavedModule) return module;

        const repairedQuestionList = module.questionList.map((q: any) => {
          const question = JSON.parse(q);
          const matchingItem = unsavedModule.items.find(
            (item) => item.id === question.id
          );

          return JSON.stringify({
            ...question,
            status: matchingItem ? matchingItem.status : question.status,
          });
        });

        return {
          ...module,
          questionList: repairedQuestionList,
        };
      });

      resetUnsavedModulesInMMKV();
    }

    saveModulesToMMKV(finalModules);
    setModules(finalModules);
  } catch (err) {
    console.error("fetchModules error:", err);
    loadOfflineModules();
  } finally {
    setLoading(false);
  }
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
    if (!user ) return;
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
