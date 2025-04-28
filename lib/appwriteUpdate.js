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


export async function updateUserUsageSessions (id, newSession) {
    try {
        const oldUserUsage = await loadUserUsage(id)
        const filteredSessions = oldUserUsage.lastSessions.filter((session) => {
            const parsedSession = JSON.parse(session);
            return parsedSession.$id == newSession.$id;
        });
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastSessions: [
                   
                    JSON.stringify(newSession),
                    ...filteredSessions
                ]
            }
        )
        console.log("Userdaten ❤️❤️❤️",res); // Array mit allen Dokumenten
        return res;
    } catch (error) {
        console.error("❌Error while updating User Data", error.message);
    }
        
}

export async function updateUserUsageModules (id, newModules) {
    console.log("Userdaten ❤️❤️❤️"); // Array mit allen Dokumenten

    try {
        const oldUserUsage = await loadUserUsage(id)
        const filteredModules = oldUserUsage.lastModules.filter((module) => {
            const parsedModule = JSON.parse(module);
            return parsedModule.$id == newModules.$id;
        });
        console.log("Userdaten ❤️❤️❤️",oldUserUsage); // Array mit allen Dokumenten
        const res = await databases.updateDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastModules: [
                    
                    JSON.stringify(newModules),
                    ...filteredModules
                ]
            }
        )
        console.log("Userdaten ❤️❤️❤️",res); // Array mit allen Dokumenten
        return res;
    } catch (error) {
        console.error("❌Error while updating User Data", error.message);
    }
        
}