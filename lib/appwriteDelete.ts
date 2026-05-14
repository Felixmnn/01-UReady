import { databases,config, storage } from './appwrite';
import { getModules } from './appwriteQuerys';

export async function deleteDocument(documentId:string) {
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.moduleCollectionId,
            documentId
        );
    } catch (error) {
        console.error("Error while deleting document:", error instanceof Error ? error.message : String(error));
    }
}

export async function deleteAllModules(id:string) {
    try {
        const modulesLoaded = await getModules(id);
        
        if (modulesLoaded.length > 0) {
            for (const module of modulesLoaded) {
                await deleteDocument(module.$id);
            }
        }
    } catch (error) {
        console.error("Error while deleting all modules:", error instanceof Error ? error.message : String(error));
    }
}

export async function deleteUserUsage(userId:string) {
    try {
       await databases.deleteDocument(
            config.databaseId,
            config.userUsageCollectionId,
            userId
        );
        
    } catch (error) {
        console.error("Error while deleting user usage:", error instanceof Error ? error.message : String(error));
    }
}

export async function deleteUserData(userId: string) {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.userDataCollectionId,
            userId
        );
    } catch (error) {
        console.error("Error while deleting user data:", error instanceof Error ? error.message : String(error));
    }
}

export async function deleteUserDataKathegory(userId: string) {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            userId
        );
    } catch (error) {
        console.error("Error while deleting user category data:", error instanceof Error ? error.message : String(error));
    }
}

export async function deleteFile(fileId: string) {
    try {
        //This needs to be implemented in Appwrite Console - Permissions - Allow file deletion by anyone with file ID
        await storage.deleteFile("67dc11e000003ae76023",fileId);
    } catch (error) {
        console.error("Error while deleting file:", error instanceof Error ? error.message : String(error));
        return false
    }
}

export async function deleteDocumentConfig(documentId: string) {
    try {
        await databases.deleteDocument(
            config.databaseId,
            config.documentCollectionId,
            documentId
        );
    } catch (error) {
        console.error("Error while deleting document config:", error instanceof Error ? error.message : String(error));
    }
}