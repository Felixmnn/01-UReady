import { client,databases,config, storage } from './appwrite';

export const loadModules = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.collectionId);
        console.log("Die Module",response.documents); // Array mit allen Dokumenten
        return response;
    } catch (error) {
        console.log(error)
    }
}
export const loadQuestions = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.questionCollectionId);
        console.log("Die Fragen",response.documents); // Array mit allen Dokumenten
        return response;
    } catch (error) {
        console.log(error)
    }
} 
export const loadNotes = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.noteCollectionId);
        console.log("Die Notizen",response.documents); // Array mit allen Dokumenten
        return response;
    } catch (error) {
        console.log(error)
    }
}
export const loadDocuments = async () => {
    try {
        const response = await databases.listDocuments(config.databaseId, config.documentCollectionId);
        console.log("Die Dokumente",response.documents); // Array mit allen Dokumenten
        return response;
    } catch (error) {
        console.log(error)
    }
}
export const loadDocument = async (documentId) => {
    try {
        // Korrekte Methode für das Anzeigen der Datei
        const fileUrl = storage.getFileView(config.documentsBucketId, documentId);
        
        console.log("Datei-URL:", fileUrl);
        return fileUrl;
    } catch (error) {
        console.error("Fehler beim Laden der Datei:", error);
    }
};

export const loadUserData = async (userId) => {
    try {
        const response = await databases.getDocument(config.databaseId, config.userDataCollectionId, userId);
        console.log("Userdaten",response); // Array mit allen Dokumenten
        return response;
    } catch (error) {
        console.log("Es existieren keine daten",error)
    }
}


