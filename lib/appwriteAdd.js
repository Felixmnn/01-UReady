import profil from '@/app/(tabs)/profil';
import { client,databases,config, storage } from './appwrite';

export async function addNewModule(data) {
    try {
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            "unique()",
            {
                name: data.name,
                subject: data.subject,
                questions: data.questions,
                notes: data.notes,
                documents: data.documents,
                public: data.public,
                progress: data.progress,
                creator: data.creator,
                color: data.color == 
                "red" ? "RED" : 
                "blue" ? "BLUE" :
                "green" ? "GREEN" :
                "purple" ? "PURPLE" :
                "RED",
                sessions: data.sessions,
                tags: data.tags
            }
        );
        console.log("Neues Modul", newModule);
        return newModule;
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function addNewUserConfig(id){
    try {
        const newUserConfig = await databases.createDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            {
                darkmode:false,
                language:null,
                uid:id,
                subscription:"NONE",
                mayor:null,
                profilePicture:"DEFAULT",
                birthday:null,
                signInProcessStep:"ONE",
                country:null,
                university:null,
                city:"",
            }
        );
        console.log("Neue UserConfig", newUserConfig);
        return newUserConfig;
    } catch (error) {
        console.error("❌Error", error.message);
    }
}


export async function addUserDatakathegory(id,newUSerData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            newUSerData

        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}
export async function updateUserDatakathegory(id,newUSerData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            newUSerData

        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}


