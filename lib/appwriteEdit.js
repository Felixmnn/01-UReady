import { uuid } from 'expo-modules-core';
import { client,databases,config, storage } from './appwrite';
import { addQuestionsToMMKV, addQuestionToMMKV, addUnsavedNote, addUnsavedQuestionToMMKV, deleteNoteFromMMKV, saveNoteToMMKV, updateUnsavedNote } from './mmkvFunctions';

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
            tags: data.tags,
            questionUrl: data.questionUrl ? data.questionUrl : "",
            questionLatex: data.questionLatex ? data.questionLatex : "",
            questionSVG: data.questionSVG ? data.questionSVG : "",
            explaination: data.explaination ? data.explaination : "",
            hint: data.hint ? data.hint : "",
            
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

export async function updateQuestion(data){
    try {
        if (data.$id.includes("tmp-")){
            const res = await addQUestion(data);
            return res;
        }
        const updatedData = {
            aiGenerated: data.aiGenerated? data.aiGenerated : false,
            answerIndex: data.answerIndex,
            answers: data.answers,
            "public": data.public,
            question: data.question,
            sessionID: data.sessionID,
            status: data.status,
            subjectID: data.subjectID,
            tags: data.tags,
            questionUrl: data.questionUrl ? data.questionUrl : "",
            questionLatex: data.questionLatex ? data.questionLatex : "",
            questionSVG: data.questionSVG ? data.questionSVG : "",
            explaination: data.explaination ? data.explaination : "",
            hint: data.hint ? data.hint : "",
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.questionCollectionId,
            data.$id,
            updatedData
        );
        return response;
    } catch (error){
        console.error("❌Error while updating Question", error.message);
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
            tags: data.tags,
            questionList: data.questionList.map((q) => typeof q === "string" ? q : JSON.stringify(q)),

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

export async function removeNote(note){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.noteCollectionId,
            note.$id
        );
        deleteNoteFromMMKV(note.sessionID, note.$id)
    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addQUestion(newQuestion){
    console.log("Adding new Question with Expaination:", newQuestion.explaination);
    console.log("Adding new Question with Hint:", newQuestion);
    const data = {
        aiGenerated: newQuestion.aiGenerated ? newQuestion.aiGenerated : false,
        answerIndex: newQuestion.answerIndex,
        answers: newQuestion.answers,
        "public": newQuestion.public ? newQuestion.public : false,
        question: newQuestion.question,
        sessionID: newQuestion.sessionID,
        status: newQuestion.status ? newQuestion.status : "OK",
        subjectID: newQuestion.subjectID,
        tags: newQuestion.tags ? newQuestion.tags : [],
        questionUrl: newQuestion.questionUrl ? newQuestion.questionUrl : "",
        questionLatex: newQuestion.questionLatex ? newQuestion.questionLatex : "",
        questionSVG: newQuestion.questionSVG ? newQuestion.questionSVG : "",
        explaination: newQuestion.explanation ? newQuestion.explanation : "",
        hint: newQuestion.hint ? newQuestion.hint : "",

    };
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.questionCollectionId,
            "unique()",
            data
        );
        addQuestionToMMKV(newQuestion.subjectID, response)
        return response;
    } catch (error){
        const tempID = "tmp-" + uuid.v4();
        addQuestionToMMKV(newQuestion.subjectID,{
            ...data,
            $id:tempID
        })
        console.log("Entsteht der Fehler hier")
        addUnsavedQuestionToMMKV({
            ...data,
            $id: tempID
        })
        console.log("Oder hier")
        return {            
            ...data,
            $id: tempID
        }
    }
}

export async function addNote(newNote){
    const data = newNote;
    try {
        
        const response = await databases.createDocument(
            config.databaseId,
            config.noteCollectionId,
            "unique()",
            {
                notiz: data.notiz,
                subjectID: data.subjectID,
                sessionID: data.sessionID,
                title: data.title,
                public: data.public
            }
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Note", error.message);
        if (newNote.$id) {
            updateUnsavedNote(newNote)
            return newNote
        } else {
            return addUnsavedNote(newNote)
        }
    }
}

export async function updateNote (data){
    saveNoteToMMKV(data.sessionID,data)

    try {
        if (data.$id.includes("tmp-")){
            const res = await addNote(data);
            saveNoteToMMKV(res.sessionID, res)
            return;
        }
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
            config.userDataCollectionId,
            id,
            updatedData

        );

    } catch (error){
        console.error("❌Error while updating User Data setUserData()", error.message);
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
        console.error("❌Error while updating User Data  setUserDataSetup()", error.message);
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
        console.log("❌Error", error.message);
    }

}

