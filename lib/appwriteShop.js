import { databases,config } from './appwrite';

export async function loadShopItems() {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.shopCollectionId
        );
        return response.documents;
    } catch (error) {
        console.error("❌Error", error.message);
    }
}