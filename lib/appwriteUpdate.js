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
        console.error("❌Error", error.message);
    }
        
}