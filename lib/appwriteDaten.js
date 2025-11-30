import { client,databases,config, storage,users } from './appwrite';
import { getUserDataConfigFromMMKV, getUserKategorieFromMMKV, getUserUsageFromMMKV, setUserDataConfigInMMKV } from './mmkvFunctions';



export const loadModule = async (moduleId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.moduleCollectionId, moduleId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting the Documents",error)
        }
        return null;
    }
}


export const loadUserData = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userDataCollectionId, userId);
        setUserDataConfigInMMKV(response)
        return response; 
    } catch (error) {
        const response = getUserDataConfigFromMMKV()
        if (__DEV__ && !response) {
        console.log("Error while getting the UserData config",error)
        }
        return response
    }
}

export const loadUserDataKathegory = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userKathegoryCollectionId, userId);
        return response;
    } catch (error) {
        const response = getUserKategorieFromMMKV();
        if (__DEV__ && !response) {
        
            console.log("Error while getting the User Kathegory",error,JSON.stringify(response))
        }
        return response;

    }
}

export const loadUserUsage = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userUsageCollectionId, userId);
        return response;
    } catch (error) {
        const response = getUserUsageFromMMKV()
        if (__DEV__ && !response) {
        console.log("Es existieren keine daten",error)
        }
        return response;
    }
}



export async function loadAllModules() {
    try {
        const response = await databases.listDocuments(config.databaseId, config.moduleCollectionId);
        return {modules: response.documents, total: response.total};
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting all Modules", error);
        }
    }
}

export async function  loadAproved(){
    try {
        const response = await databases.getDocument(
            config.databaseId, 
            "rewaredaproved", 
            '68d79d1f0007b127b2b1'
        );
        console.log("Aproved status:", response.aproved);
        return response.aproved;
    } catch (error) {
        console.log("Error while getting the rewared aproved", error);
        return false;
    }
}
