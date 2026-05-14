import { databases,config } from './appwrite';


export async function useActionCode(actionCodeID:string){
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
