import { client,databases,config, storage } from './appwrite';
import { loadUserUsage } from './appwriteDaten';
import { addUnsavedModuleToMMKV, saveUserUsageToMMKV, updateModuleInMMKV, updateModuleQuestionListInMMKV } from './mmkvFunctions';

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
        const res = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            data
        )
        return res;
    } catch (error) {
        if (__DEV__) {
        console.error("❌Error while updating Module Data", error.message);
        }
    }
        
}

export async function updateModuleQuestionList (id, data) {
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            {
                questionList: data.map((q)=> JSON.stringify(q) )
            }
        )
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
        console.log("Updating UserUsage data:", userUsage);
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
