import { client,databases,config } from './appwrite';

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

