import { client,databases,config, storage } from './appwrite';

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