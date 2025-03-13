import { client,databases,config } from './appwrite';

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