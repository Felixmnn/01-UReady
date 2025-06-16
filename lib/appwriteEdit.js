import { client,databases,config, storage } from './appwrite';

export const updateDocument = async (data) => {
    
    try {
        const updatedData = {
            aiGenerated: data.aiGenerated? data.aiGenerated : false,
            answerIndex: data.answerIndex,
            answers: data.answers,
            "public": data.public,
            question: data.question,
            sessionID: data.sessionID,
            status: data.status,
            subjectID: data.subjectID,
            tags: data.tags
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.questionCollectionId,
            data.$id,
            updatedData

        );

    } catch (error){
        console.error("❌Error while updating Document oder so", error.message);
    }
}

export const updateModule = async (data) => {
    
    try {
        const updatedData = {
            name: data.name,
            subject: data.subject,
            questions: data.questions,
            notes: data.notes,
            documents: data.documents,
            "public": data.public,
            progress: data.progress,
            creator: data.creator,
            color: data.color,
            sessions: data.sessions,
            tags: data.tags
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            data.$id,
            updatedData

        );
        return response;
    } catch (error){
        console.error("❌Error while creating Module", error.message);
    }
}


export async function testAppwrite() {
    try {
        // Absichtlich falsche Datenbank-ID
        const response = await databases.listDocuments("INVALID_DATABASE_ID", "INVALID_COLLECTION_ID");
    } catch (error) {
        console.error("❌ Appwrite-Fehler:", error.message);
    }
}

export async function removeQuestion(id){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.questionCollectionId,
            id
        );

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function removeNote(id){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.noteCollectionId,
            id
        );
    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addQUestion(newQuestion){
    const data = newQuestion;
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.questionCollectionId,
            "unique()",
            data
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Question", error.message);
    }
}

export async function addNote(newNote){
    const data = newNote;
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.noteCollectionId,
            "unique()",
            data
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Note", error.message);
        return null;
    }
}

export async function updateNote (data){
    try {
        const updatedData = {
            title: data.title,
            notiz: data.notiz,
            sessionID: data.sessionID,
            "public": data.public ? data.public : false,
            subjectID: data.subjectID,
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.noteCollectionId,
            data.$id,
            updatedData

        );

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addDocumentConfig(data) {
    const newConfig = {
        title: data.title,
        subjectID: data.subjectID,
        sessionID: data.sessionID,
        databucketID: data.id,
        fileType: data.type,
        uploaded:false,
    };
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.documentCollectionId,
            "unique()",
            newConfig
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Note", error.message);
        return null;
    }
}

export async function addDocumentToBucketWeb(data){
    try {
        const response = await storage.createFile(config.documentsBucketId, data.id, data.file);
        return response;
    } catch (error){
        console.error("❌Error while creating a new Document", error.message);
        return null;
    }
}

export async function addDocumentToBucket(data,fileData){
    try {
        const response = await storage.createFile(
            config.documentsBucketId, 
            "unique()", 
            {
                name: fileData.name,
                type: fileData.type,
                size: fileData.size,
                uri: fileData.uri,
            }
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Document", error.message);
        return null;
    }
}

export async function updateDocumentConfig(data){
    try {
        const updatedData = {
            title: data.title,
            subjectID: data.subjectID,
            sessionID: data.sessionID,
            databucketID: data.databucketID,
            fileType: data.fileType,
            uploaded: data.uploaded,
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.documentCollectionId,
            data.$id,
            updatedData

        );
        return response;
    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function removeDocumentConfig(id){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.documentCollectionId,
            id
        );

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function setUserData(id,newUSerData){
    try {
        const updatedData = {
            name: newUSerData.name,
            email: newUSerData.email,
            password: newUSerData.password,
            profilePic: newUSerData.profilePic,
            "public": newUSerData.public,
            role: newUSerData.role,
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            id,
            updatedData

        );

    } catch (error){
        console.error("❌Error while updating User Data", error.message);
    }
}

export async function setUserDataSetup(id){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            { signInProcessStep: 'DONE' }

        );
        return res;
    } catch (error){
        console.error("❌Error while updating User Data ", error.message);
    }
}

export async function setColorMode(id,colorMod){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            { darkmode: colorMod }

        );

    } catch (error){
        console.error("❌Error ", error.message);
    }
}

export async function setLanguage(id,newLanguage){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            { language: newLanguage })
    } catch (error){
        console.error("❌Error", error.message);
    }

}

