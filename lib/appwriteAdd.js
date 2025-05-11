import profil from '@/app/(tabs)/profil';
import { client,databases,config, storage } from './appwrite';

export async function addNewModule(data) {
    try {
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            "unique()",
            data
        );
        return newModule;
    } catch (error) {
        console.error("❌Error while creating a Module", error.message);
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
                profilePicture:"DEFAULT",
                birthday:null,
                signInProcessStep:"ZERO",
                country:null,
                university:null,
                city:"",
            }
        );
        return newUserConfig;
    } catch (error) {
        console.error("❌Error while creating User Data Config", error.message);
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

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addUserUsage(id, newUserUsageData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            newUserUsageData
        );
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function addDocumentJob(job){
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.jobCollectionId,
            "unique()",
            job
        )
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

