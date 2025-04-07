import { client,databases,config, storage } from './appwrite';

export const updateDocument = async (data) => {
    try {
        const updatedData = {
            aiGenerated: data.aiGenerated,
            answerIndex: data.answerIndex,
            answers: data.answers,
            public: data.public,
            question: data.question,
            sessionID: data.sessionID,
            status: data.status,
            subjectID: data.subjectID,
            tags: data.tags
        };
        console.log("Dokument",data)
        const response = await databases.updateDocument(
            config.databaseId,
            config.questionCollectionId,
            data.$id,
            updatedData

        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export const updateModule = async (data) => {
    console.log("Data", data)
    try {
        const updatedData = {
            name: data.name,
            subject: data.subject,
            questions: data.questions,
            notes: data.notes,
            documents: data.documents,
            public: data.public,
            progress: data.progress,
            creator: data.creator,
            color: data.color,
            sessions: data.sessions,
            tags: data.tags
        };
        console.log("Dokument",data)
        const response = await databases.updateDocument(
            config.databaseId,
            config.moduleCollectionId,
            data.$id,
            updatedData

        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}


export async function testAppwrite() {
    try {
        // Absichtlich falsche Datenbank-ID
        const response = await databases.listDocuments("INVALID_DATABASE_ID", "INVALID_COLLECTION_ID");
        console.log("✅ Server läuft, aber API gibt keine Fehler zurück!", response);
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
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addQUestion(newQuestion){
    console.log("✅ Data", newQuestion)
    const data = newQuestion;
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.questionCollectionId,
            "unique()",
            data
        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error while creating a new Question", error.message);
    }
}

export async function addNote(newNote){
    console.log("✅ Data", newNote)
    const data = newNote;
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.noteCollectionId,
            "unique()",
            data
        );
        console.log("Respone Respone Respone Repsone ", response)
        return response;
    } catch (error){
        console.error("❌Error while creating a new Note", error.message);
        return null;
    }
}

export async function updateNote (data){
    console.log("✅ Data", data)
    console.log("Data ID", data.$id)
    try {
        const updatedData = {
            title: data.title,
            notiz: data.notiz,
            sessionID: data.sessionID,
            public: data.public ? data.public : false,
            subjectID: data.subjectID,
        };
        console.log("Dokument",data)
        const response = await databases.updateDocument(
            config.databaseId,
            config.noteCollectionId,
            data.$id,
            updatedData

        );
        console.log("Respone Respone Respone Repsone ", response)

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
        console.log("Respone Respone Respone Repsone ", response)
        return response;
    } catch (error){
        console.error("❌Error while creating a new Note", error.message);
        return null;
    }
}

export async function addDocumentToBucket(data){
    try {
        const response = await storage.createFile(config.documentsBucketId, data.fileID, data.fileBlob);
        console.log("Respone Respone Respone Repsone ", response)
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
        console.log("Dokument",data)
        const response = await databases.updateDocument(
            config.databaseId,
            config.documentCollectionId,
            data.$id,
            updatedData

        );
        console.log("Respone Respone Respone Repsone ", response)

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
        console.log("Respone Respone Respone Repsone ", response)

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
            public: newUSerData.public,
            role: newUSerData.role,
        };
        console.log("Dokument",newUSerData)
        const response = await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            id,
            updatedData

        );
        console.log("Respone Respone Respone Repsone ", response)

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function setUserDataSetup(id){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userCollectionId,
            id,
            { signInProcessStep: 'DONE' }

        );
    } catch (error){
        console.error("❌Error", error.message);
    }
}
