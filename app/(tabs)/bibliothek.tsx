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
  

  const { selectedModuleIndex } = useLocalSearchParams();
  useEffect(() => {
    if (typeof selectedModuleIndex == "string") {
      const index = parseInt(selectedModuleIndex);
      setSelectedModule(index);
      setSelected("SingleModule");
    }
  }, [selectedModuleIndex]);
  

  const [selected, setSelected] = useState<ScreenType>("AllModules");
  const [modules, setModules] = useState<module[] | []>(getModulesFromMMKV());
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    saveCompleatlyUnsavedModules();
    saveUnsavedQuestions();
  }, []);


  async function saveCompleatlyUnsavedModules(){
    let compleatlyUnsavedModules = getCompleatlyUnsavedModulesFromMMKV()
    
    if (compleatlyUnsavedModules.length === 0) return;
    for (let i = 0; i < compleatlyUnsavedModules.length; i++) {
      const id = compleatlyUnsavedModules[i].$id!;
      await addNewModule(compleatlyUnsavedModules[i],user.$id);
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
    const modulesLoaded = await getModules(user.$id);
    const unsavedQuestionLists = getUnsavedModulesFromMMKV();

    if (modulesLoaded as any === "404") {
      const locallyUpdatedModules = getModulesFromMMKV();
      if (unsavedQuestionLists.length > 0) {
  const newModules = locallyUpdatedModules?.map((module) => {
    const unsavedModule = unsavedQuestionLists.find(
      (unsaved) => unsaved.moduleID === module.$id
    );

    if (unsavedModule) {
      const repairedQuestionList = module.questionList.map((q) => {
        const question = JSON.parse(q);
        const matchingItem = unsavedModule.items.find((item) => item.id === question.id);

        return JSON.stringify({
          ...question,
          status: matchingItem ? matchingItem.status : question.status, // Behalte den ursprünglichen Status bei, wenn keine Übereinstimmung gefunden wird
        });
      });
      module.questionList = repairedQuestionList;
    }

    return module; // Stelle sicher, dass das Modul zurückgegeben wird
  });

  if (newModules) {
    saveModulesToMMKV(newModules as unknown as module[]);
    setModules(newModules as unknown as module[]);
  } else {
    console.error("Error: No modules to save after repair.");
  }

  setLoading(false); // Ladezustand zurücksetzen
  return;
      } else {
        if (locallyUpdatedModules) {
          setModules(locallyUpdatedModules);
        } else {
          console.error("Error: No locally stored modules found.");
        }
        setLoading(false); // Ladezustand zurücksetzen
      }
      setLoading(false);
      return;
    }; // No internet connection
    
    let newModules = null;
    if (unsavedQuestionLists.length > 0) {
    newModules  = modulesLoaded?.forEach((module) => {
        const unsavedModule = unsavedQuestionLists.find(
          (unsaved) => unsaved.moduleID === module.$id
        );
        if (unsavedModule) {
          const repairedQuestionList = module.questionList.map((q:any) => {
            const question = JSON.parse(q);
            const matchingItem = unsavedModule.items.find((item) => item.id === question.id);

            return JSON.stringify({
              ...question,
              status: matchingItem ? matchingItem.status : question.status, // Behalte den ursprünglichen Status bei, wenn keine Übereinstimmung gefunden wird
            });
          });
          module.questionList = repairedQuestionList;
        }
      });
    }
    
    resetUnsavedModulesInMMKV();
    saveModulesToMMKV(modulesLoaded as unknown as module[]);
    if (modulesLoaded) {
      setModules(modulesLoaded ? (modulesLoaded as unknown as module[]) : []);
    }
    if (newModules) {
      setModules(newModules as unknown as module[]);
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
