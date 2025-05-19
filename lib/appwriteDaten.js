import { client,databases,config, storage,users } from './appwrite';

export const loadModules = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.collectionId);
        return response;
    } catch (error) {
        console.log("Problem 🔴🔴🔴",error)
    }
}

export const loadModule = async (moduleId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.moduleCollectionId, moduleId);
        return response;
    } catch (error) {
        console.log("Problem 🔴🔴🔴",error)
    }
}

export const loadQuestions = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.questionCollectionId);
        return response;
    } catch (error) {
        console.log(error)
    }
} 


export const loadNotes = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.noteCollectionId);
        return response;
    } catch (error) {
        console.log(error)
    }
}
export const loadDocuments = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.documentCollectionId);
        return response;
    } catch (error) {
        console.log(error)
    }
}
export const loadDocument = async (documentId) => {
    try {
        // Korrekte Methode für das Anzeigen der Datei
        const fileUrl = storage.getFileView(config.documentsBucketId, documentId);
        
        return fileUrl;
    } catch (error) {
        console.error("Fehler beim Laden der Datei:", error);
    }
};

export const loadUserData = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userDataCollectionId, userId);
        return response; 
    } catch (error) {
        console.log("Es existieren keine daten",error)
    }
}

export const loadUserDataKathegory = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userKathegoryCollectionId, userId);
        return response;
    } catch (error) {
        console.log("Es existieren keine daten",error)
    }
}

export const loadUserUsage = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userUsageCollectionId, userId);
        return response;
    } catch (error) {
        console.log("Es existieren keine daten",error)
    }
}


