import { client,databases,config, storage,users } from './appwrite';

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