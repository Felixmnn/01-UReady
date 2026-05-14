import { AppwriteModule, AppwriteUserData, AppwriteUserKategorie, AppwriteUserUsage, documentJob } from '@/types/appwriteTypes';
import { databases,config } from './appwrite';
import { getUserDataConfigFromMMKV, getUserKategorieFromMMKV, getUserUsageFromMMKV, setUserDataConfigInMMKV, updateModuleInMMKV } from './mmkvFunctions';



export const loadModule = async (moduleId:string):Promise<AppwriteModule | null> => {
    try {
        const response = await databases.getDocument<AppwriteModule>(config.databaseId, config.moduleCollectionId, moduleId);
        updateModuleInMMKV(response)
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting the Documents",error)
        }
        return null;
    }
}


export const loadUserData = async (userId:string):Promise<AppwriteUserData | null> => {
    try {
        const response = await databases.getDocument<AppwriteUserData>(config.databaseId, config.userDataCollectionId, userId);
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

export const loadUserDataKathegory = async (userId:string):Promise<AppwriteUserKategorie | null> => {
    try {
        const response = await databases.getDocument<AppwriteUserKategorie>(config.databaseId, config.userKathegoryCollectionId, userId);
        
        return response;
    } catch (error) {
        const response = getUserKategorieFromMMKV();
        if (__DEV__ && !response) {
        
            console.log("Error while getting the User Kathegory",error,JSON.stringify(response))
        }
        return response;

    }
}

export const loadUserUsage = async (userId:string):Promise<AppwriteUserUsage | null> => {
    try {
        const response = await databases.getDocument<AppwriteUserUsage>(config.databaseId, config.userUsageCollectionId, userId);
        return response;
    } catch (error) {
        const response = getUserUsageFromMMKV()
        if (__DEV__ && !response) {
        console.log("Es existieren keine daten",error)
        }
        return response;
    }
}

export async function loadAllModules(): Promise<{modules: AppwriteModule[], total: number} | null | undefined> {
    try {
        const response = await databases.listDocuments<AppwriteModule>(config.databaseId, config.moduleCollectionId);
        return {modules: response.documents, total: response.total};
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting all Modules", error);
        }
    }
}

export async function getUserSubscriptionStatus(userId: string) {
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.subscriptionsCollectionId,
            userId
        );
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error fetching subscription status:", error);
        }
        return null; 
    }}

export async function addDocumentJob(documentJob:documentJob) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            "681dd825000e6990368a",
            "unique()",
            documentJob
        );
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error adding document job:", error);
        }
        return null;
    }
}
