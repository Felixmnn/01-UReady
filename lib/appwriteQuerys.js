import { Query } from "appwrite";
import { databases, config } from "./appwrite";

export async function getSepcificModules(){
    console.log("Ich werde gestartet")
    const response = await databases.listDocuments(
        config.databaseId,
        config.moduleCollectionId,
        [
            Query.equal('name', ['Algorythmen',"Statistik","Gesellschaft"]),
        ]
    );
    console.log("Response Response Response",response.documents)
    return response.documents;
}