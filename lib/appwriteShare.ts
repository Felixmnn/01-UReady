import { Query } from "appwrite";
import { databases, config } from "./appwrite";
import { adddModule } from "./appwriteAdd";
import { repairAndParseJSONStringsSessions, repairQuestionList } from "@/functions/(entdecken)/transformData";

export type OrigninalModule = {
    name: string;
    subject: string;
    questionList: string[];
    notes: number;
    documents:number
    color: string;
    sessions: string[];
    tags: string[];
    description: string;
    qualityScore: number;
    kategoryType?: string;
}

/**
 * Copies an existing module and creates a new one with the same data.
 * This function ensures that the copied module is private and includes
 * repaired session and question data.
 */
export async function copyModule(originalModule: OrigninalModule, user:any){
    try {
        if (!originalModule) {
            return "Not found";
        }
        else {
           const res = adddModule({
                name: originalModule.name + " (Kopie)",
                subject: originalModule.subject,
                questions: originalModule.questionList.length,
                notes: originalModule.notes,
                documents: originalModule.documents,
                publicAcess: false,
                progress: 0,
                creator: user.$id,
                color: originalModule.color,
                sessions: repairAndParseJSONStringsSessions(originalModule.sessions).map(s=> JSON.stringify(s)),
                tags: originalModule.tags,
                description: originalModule.description,
                releaseDate: new Date(),
                connectedModules: [],
                qualityScore: originalModule.qualityScore,
                copy: true,
                synchronization: false,
                questionList: repairQuestionList(originalModule.questionList).map(q => JSON.stringify(q)),
                kategoryType: originalModule.kategoryType ?? "DEFAULT"
            })
            return res;
        }
    } catch (error) {
        if (__DEV__) {
            console.error("Error copying module:", error);
        }
        return "Error";
    }


}

export async function getSpecificModule(moduleID:string){
    try {
        // Fetch the original module data
        const originalModule = await databases.getDocument(
            config.databaseId,
            config.moduleCollectionId,
            moduleID
        ); 
        return originalModule;
    } catch (error) {
        if (__DEV__) {
            console.error("Error fetching module:", error);
        }
        return null;
    }
}

