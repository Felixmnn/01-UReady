import { databases,config, functions } from './appwrite';


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
