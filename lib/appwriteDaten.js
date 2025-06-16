import { client,databases,config, storage,users } from './appwrite';

export const loadModules = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.collectionId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting the Modules",error)
        }
    }
}

export const loadModule = async (moduleId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.moduleCollectionId, moduleId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting a single Module",error)
        }
    }
}


export const loadDocument = async (documentId) => {
    try {
        const fileUrl = storage.getFileView(config.documentsBucketId, documentId);
        return fileUrl;
    } catch (error) {
        if (__DEV__) {
        console.error("Error while getting a single File", error);
        }
    }
};

export const loadUserData = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userDataCollectionId, userId);
        return response; 
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting the UserData config",error)
        }
    }
}

export const loadUserDataKathegory = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userKathegoryCollectionId, userId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Error while getting the User Kathegory",error)
        }

    }
}

export const loadUserUsage = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userUsageCollectionId, userId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Es existieren keine daten",error)
        }
    }
}


export async function loadComercials() {
    try {
        const response = await databases.listDocuments(config.databaseId, config.commercialCollectionId);
        return response.documents;
    } catch (error) {
        if (__DEV__) {
            console.log("Problem beim Laden der Werbungen 🔴🔴🔴", error);
        }
    }
}

export async function loadSurvey() {
    try {
        const response = await databases.listDocuments(config.databaseId, config.surveyCollectionId);
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Problem beim Laden der Umfrage 🔴🔴🔴", error);
        }
    }
}


