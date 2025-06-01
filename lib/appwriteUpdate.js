import { client,databases,config, storage } from './appwrite';
import { loadUserUsage } from './appwriteDaten';

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
        console.error("❌Error while updating User Data", error.message);
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
        console.log("🔷res", res) 
        return res;
    } catch (error) {
        console.error("❌Error while updating Module Data", error.message);
    }
        
}

export async function updateModuleQuestionList (id, data) {
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            {
                questionList: data
            }
        )
        return res;
    } catch (error) {
        console.error("❌Error while updating Module Data", error.message);
    }
        
}

export async function updateUserUsageData (data) {
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            data.$id,
            {
               boostActivation: data.boostActivation,
                boostActive: data.boostActive,
                boostType: data.boostType,
                energy: data.energy,
                lastModules: data.lastModules,
                lastSessions: data.lastSessions,
                microchip: data.microchip,
                recharges: data.recharges,
                streak: data.streak,
                streakActive: data.streakActive,
                streakLastUpdate: new Date(),
                supercharges: data.supercharges,
                watchedComercials: data.watchedComericals,
                purcharses: data.purcharses,
                streakUpdate: data.streakUpdate,
                watchedComercials: data.watchedComercials,
            }
        )
        return res;
    } catch (error) {
        console.error("❌Error while updating User Data", error.message);
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
      console.error("❌ Fehler beim Update der User-Daten:", error.message);
    }
  }
  

  export async function updateUserUsageModules(id, newModule) {
    try {
        const oldUserUsage = await loadUserUsage(id);
        const lastModules = oldUserUsage.lastModules?.map((module) => (
            JSON.parse(module)
        ))
        const noDublicates = lastModules.filter((module) => module.sessionID !== newModule.sessionID);
        console.log("noDublicates", newModule, lastModules)
        console.log("noDublicates", noDublicates)
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
      console.error("❌ Error while updating User Data", error.message);
    }
  }
