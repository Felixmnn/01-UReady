import { client,databases,config, storage,users } from './appwrite';
import { getModules } from './appwriteQuerys';

export async function deleteDocument(documentId) {
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.moduleCollectionId,
            documentId
        );
    } catch (error) {
        console.error("Error while deleting document:", error.message);
    }
}

export async function deleteAllModules(id) {
    try {
        const modulesLoaded = await getModules(id);
        if (modulesLoaded.length > 0) {
            for (const module of modulesLoaded) {
                await deleteDocument(module.$id);
            }
        }
    } catch (error) {
        console.error("Error while deleting all modules:", error.message);
    }
}

export async function deleteUserUsage(userId) {
    try {
       await databases.deleteDocument(
            config.databaseId,
            config.userUsageCollectionId,
            userId
        );
        
    } catch (error) {
        console.error("Error while deleting user usage:", error.message);
    }
}

export async function deleteUserData(userId) {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.userDataCollectionId,
            userId
        );
    } catch (error) {
        console.error("Error while deleting user data:", error.message);
    }
}

export async function deleteUserDataKathegory(userId) {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            userId
        );
    } catch (error) {
        console.error("Error while deleting user category data:", error.message);
    }
}