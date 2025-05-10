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
        console.log("Userdaten",res); // Array mit allen Dokumenten
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
        console.log("Modul Daten",res); // Array mit allen Dokumenten
        return res;
    } catch (error) {
        console.error("❌Error while updating Module Data", error.message);
    }
        
}

export async function updateUserUsageSessions(id, newSession) {
    try {
        const oldUserUsage = await loadUserUsage(id);
        console.log("Old User Usage", oldUserUsage);
        const parsedOldSessions = oldUserUsage.lastSessions?.map((session) => (
            JSON.parse(session)
        ))
        console.log("Parsed Old Sessions", parsedOldSessions);
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
  
      console.log("✅ Userdaten aktualisiert:", res);
      return res;
    } catch (error) {
      console.error("❌ Fehler beim Update der User-Daten:", error.message);
    }
  }
  

  export async function updateUserUsageModules(id, newModule) {
    console.log("Update User Usage Modules 😁😁😁", id, newModule);
    try {
        const oldUserUsage = await loadUserUsage(id);
        console.log("Old User Usage", oldUserUsage);
        const lastModules = oldUserUsage.lastModules?.map((module) => (
            JSON.parse(module)
        ))
        console.log("Last Modules", lastModules);
        const noDublicates = lastModules.filter((module) => module.sessionID !== newModule.sessionID);

        console.log("No Duplicates", noDublicates);
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
        console.log("✅ Userdaten aktualisiert:", res);

      
    } catch (error) {
      console.error("❌ Error while updating User Data", error.message);
    }
  }
