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

export async function useActionCode(actionCodeID){
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.aktionsCodesCollectionId,
            actionCodeID
        );
        return response;
    } catch (error) {
        return null;
    }
}

export async function loadQuizzes (){
    try {
        const res = await databases.listDocuments(
            config.databaseId,
            config.surveyCollectionId
        )
        return res;
    } catch (e) {
        console.log("Error",e)
    }
}