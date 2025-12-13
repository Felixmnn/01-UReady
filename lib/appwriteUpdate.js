import { compareModules } from '@/functions/checkDataIntegrity';
import { client,databases,config, storage } from './appwrite';
import { loadModule, loadUserUsage } from './appwriteDaten';
import { addUnsavedModuleToMMKV, saveModulesToMMKV, saveUserUsageToMMKV, updateModuleInMMKV, updateModuleQuestionListInMMKV } from './mmkvFunctions';

export async function updateUserData (id, data) {
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            data
        )
        return res;
    } catch (error) {
        if (__DEV__) {
        console.error("❌Error while updating User Data updateUserData()", error.message);
        }
    }
        
}

export async function updateModuleData (id, data) {
    try {
        console.log("Data to update:", data);
        console.log("Updating Module Data for moduleID:", id);
        const currentSate = await loadModule(id)

        const comparedModule = compareModules(data, currentSate);
        console.log("Compared Module Data:", comparedModule);
        const res = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            comparedModule
        )
        updateModuleInMMKV(res)
        return res;
    } catch (error) {
        if (__DEV__) {
        console.error("❌Error while updating Module compleatly ", error.message);
        }
    }
        
}

export async function updateModuleQuestionList (id, data) {
    try {
        console.log("Updating Module Question List for moduleID:", id);
        const currentState = await loadModule(id)
        const mergedQuestionList = [
            ...currentState.questionList,
            ...data
        ];
        const mergedNoDuplicates = mergedQuestionList.filter((item, index) => {
            return mergedQuestionList.indexOf(item) === index;
        });
        console.log("Updating Module Question List with data:", mergedNoDuplicates);
        const res = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            {
                questionList: mergedNoDuplicates.map((q)=> JSON.stringify(q) )
            }
        )
        updateModuleQuestionListInMMKV(id, mergedNoDuplicates);
        console.log("✅ Successfully updated Module Question List in Appwrite for moduleID:", id);
        return true;
    } catch (error) {
        if (__DEV__) {
        console.log("❌Error while updating Module Data", error.message);
        }
        //HINWEIS AN MICH:
        //Das Problem ensteht beim MMKV Updaten
        updateModuleQuestionListInMMKV(id, data);        
        addUnsavedModuleToMMKV({
            moduleID: id,
            items: data
        });

        return true;
    }
        
}

export async function updateUserUsageData (data) {
    const userUsage =  {
               boostActivation: data.boostActivation,
                boostActive: data.boostActive,
                boostType: data.boostType,
                energy: data.energy,
                lastModules: data?.lastModules,
                lastSessions: data.lastSessions,
                microchip: data.microchip,
                recharges: data.recharges,
                streak: data.streak,
                streakActive: data.streakActive,
                streakLastUpdate:data.streakLastUpdate,
                supercharges: data.supercharges,
                watchedComercials: data.watchedComericals,
                purcharses: data.purcharses,
                streakUpdate: data.streakUpdate,
                watchedComercials: data.watchedComercials,
            }
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            data.$id,
            userUsage
        )
        return res;
    } catch (error) {
        saveUserUsageToMMKV(userUsage)
        if (__DEV__) {
        console.log("❌Error while updating User Data uodateUserUsageData()", error.message);
        }
    }
        
}

export async function updateUserUsageSessions(id, newSession) {
    try {
        const oldUserUsage = await loadUserUsage(id);
        const parsedOldSessions = oldUserUsage.lastSessions?.map((session) => (
            JSON.parse(session)
        ))
        const noDublicates = parsedOldSessions.filter((session) => session.sessionID !== newSession.sessionID);
        const updatedSessions = [
            newSession,
            ...noDublicates
        ]
        const parsedSessions = updatedSessions.map((session) => (
            JSON.stringify(session)
        ))
        console.log("Updating UserUsage sessions:", parsedSessions);
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastSessions: parsedSessions
            }
        )
      return res;
    } catch (error) {
        if (__DEV__) {
      console.error("❌ Fehler beim Update der User-Daten:", error.message);
        }
    }
  }
  

  export async function updateUserUsageModules(id, newModule) {
    try {
        console.log("Updating UserUsage modules with new module:", newModule);
        const oldUserUsage = await loadUserUsage(id);
        const lastModules = oldUserUsage.lastModules?.map((module) => (
            JSON.parse(module)
        ))
        const noDublicates = lastModules.filter((module) => module.sessionID !== newModule.sessionID);
        const updatedModules = [
            newModule,
            ...noDublicates
        ]
        const parsedModules = updatedModules.map((module) => (
            JSON.stringify(module)
        ))
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastModules: parsedModules
            }
        )

      
    } catch (error) {
        if (__DEV__) {
      console.error("❌ Error while updating User Data updateUserUsageModules()", error.message);
        }
    }
  }
