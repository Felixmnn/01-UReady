import { uuid } from 'expo-modules-core';
import { databases,config, storage, account } from './appwrite';
import { addQuestionToMMKV, addUnsavedNote, addUnsavedQuestionToMMKV, deleteNoteFromMMKV, getSessionFromMMKV, saveNoteToMMKV, setSessionInMMKV, updateUnsavedNote } from './mmkvFunctions';
import { Permission } from 'react-native-appwrite';
import { Role } from 'appwrite';
import { AppwriteModule, AppwriteNote, AppwriteQuestion, module, note, question } from '@/types/appwriteTypes';

type DocumentConfigInput = {
    title: string;
    subjectID: string;
    sessionID: string;
    id: string;
    type: string;
    uploaded?: boolean;
    status?: string;
};

type WebBucketInput = {
    id: string;
    file: Blob;
};

type NativeFileInput = {
    name: string;
    type: string;
    size: number;
    uri: string;
};

type NativeFileInputLike = {
    name: string;
    type: string;
    size?: number;
    uri: string;
};

type LegacyBucketInput = {
    fileID: string;
    fileBlob: Blob | NativeFileInputLike;
};

type UpdateDocumentConfigInput = {
    $id: string;
    title?: string;
    subjectID?: string;
    sessionID?: string;
    databucketID?: string;
    fileType?: string;
    type?: string;
    uploaded?: boolean;
    status?: string;
};

type UserDataUpdateInput = {
    name: string;
    email: string;
    password: string;
    profilePic: string | null;
    public: boolean;
    role: string;
};

type AddNoteInput = {
    $id?: string;
    notiz: string;
    subjectID: string | null;
    sessionID: string | null;
    title: string | null;
    public?: boolean;
};

const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);

const isNativeFileInputLike = (file: Blob | NativeFileInputLike): file is NativeFileInputLike =>
    typeof file === "object" &&
    file !== null &&
    "uri" in file &&
    "name" in file &&
    "type" in file &&
    !("arrayBuffer" in file);

const toStorageFileInput = (fileId: string, file: Blob | NativeFileInputLike): { file: NativeFileInput; objectUrl?: string } => {
    if (isNativeFileInputLike(file)) {
        return {
            file: {
                ...file,
                size: file.size ?? 0,
            },
        };
    }

    if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
        throw new Error("Blob upload requires URL.createObjectURL support");
    }

    const objectUrl = URL.createObjectURL(file);
    return {
        file: {
            name: `${fileId}.pdf`,
            type: file.type || "application/pdf",
            size: file.size ?? 0,
            uri: objectUrl,
        },
        objectUrl,
    };
};

/*
Missleading name since a question is updated
*/
export const updateDocument = async (data:AppwriteQuestion) => {
    
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
        return response;
    } catch (error){
        console.error("❌Error while updating Document oder so", error instanceof Error ? error.message : String(error));
        return null;
    }
}

export async function updateQuestion(data:AppwriteQuestion){
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
        console.error("❌Error while updating Question", error instanceof Error ? error.message : String(error));
    }
}

export const updateModule = async (data:AppwriteModule) => {
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
        console.error("❌Error while creating Module", error instanceof Error ? error.message : String(error));
    }
}


export async function removeQuestion(id:string){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.questionCollectionId,
            id
        );

    } catch (error){
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function removeNote(note:AppwriteNote){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.noteCollectionId,
            note.$id
        );
        if (!note.sessionID) return;
        deleteNoteFromMMKV(note.sessionID, note.$id)
    } catch (error){
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function addQUestion(newQuestion:AppwriteQuestion){
    let user = getSessionFromMMKV()
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
        if (!user || !user.$id) {
            const session = await account.get();
            setSessionInMMKV(session);
            user = session;
        }
        
        const response = await databases.createDocument<AppwriteQuestion>(
            config.databaseId,
            config.questionCollectionId,
            "unique()",
            {
                ...data
                ,answers: newQuestion.answers.filter(answer => answer.trim() !== ""),
            },
            [
                Permission.delete(Role.user(user.$id)), 
                Permission.update(Role.user(user.$id)),
                Permission.write(Role.user(user.$id)),
                Permission.read(Role.any())
            ]
        );
        if (typeof newQuestion.subjectID === "string") addQuestionToMMKV(newQuestion.subjectID, response)
        return response;
    } catch (error){
        console.error("❌Error while creating a new Question", error instanceof Error ? error.message : String(error));
        const tempID = "tmp-" + uuid.v4();
        if (typeof newQuestion.subjectID === "string") addQuestionToMMKV(newQuestion.subjectID,{
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

export async function addNote(newNote:AddNoteInput) :Promise<AppwriteNote | note>{
    const data: note = {
        ...newNote,
        public: newNote.public ?? false,
    };
    try {
        
        const response = await databases.createDocument<AppwriteNote>(
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
        console.error("❌Error while creating a new Note", error instanceof Error ? error.message : String(error));
        if (newNote.$id) {
            updateUnsavedNote(data)
            return data
        } else {
            return addUnsavedNote(data) as note
        }
    }
}

export async function updateNote (data:AppwriteNote){
    if (data.sessionID) saveNoteToMMKV(data.sessionID,data)

    try {
        if (data.$id.includes("tmp-")){
            const res = await addNote(data);
            
            if (res.sessionID) saveNoteToMMKV(res.sessionID, res)
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
        console.error("❌Error", (error as Error).message);
    }
}

export async function addDocumentConfig(data: DocumentConfigInput) {
    const user = getSessionFromMMKV()
    const newConfig = {
        title: data.title,
        subjectID: data.subjectID,
        sessionID: data.sessionID,
        databucketID: data.id,
        fileType: data.type,
        uploaded:false,
        creator: user?.$id ?? "",
        status: "PENDING",
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
        console.error("❌Error while creating a new Note", getErrorMessage(error));
        return null;
    }
}

export async function addDocumentToBucketWeb(data: WebBucketInput){
    let objectUrl: string | undefined;
    try {
        const normalized = toStorageFileInput(data.id, data.file);
        objectUrl = normalized.objectUrl;
        const response = await storage.createFile(config.documentsBucketId, data.id, normalized.file);
        return response;
    } catch (error){
        console.error("❌Error while creating a new Document", getErrorMessage(error));
        return null;
    } finally {
        if (objectUrl && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
            URL.revokeObjectURL(objectUrl);
        }
    }
}

export async function addDocumentToBucket(data: string | LegacyBucketInput, fileData?: NativeFileInputLike){
    let objectUrl: string | undefined;
    try {
        const fileId = typeof data === "string" ? data : data.fileID;
        const filePayload = fileData ?? (typeof data === "string" ? null : data.fileBlob);

        if (!filePayload) {
            throw new Error("Missing file payload for bucket upload");
        }

        const normalized = toStorageFileInput(fileId, filePayload);
        objectUrl = normalized.objectUrl;

        const response = await storage.createFile(
            config.documentsBucketId, 
            fileId,
            normalized.file
        );
        return response;
    } catch (error){
        console.error("❌Error while creating a new Document", getErrorMessage(error));
        return null;
    } finally {
        if (objectUrl && typeof URL !== "undefined" && typeof URL.revokeObjectURL === "function") {
            URL.revokeObjectURL(objectUrl);
        }
    }
}

export async function updateDocumentConfig(data: UpdateDocumentConfigInput){
    try {
        const user = getSessionFromMMKV()
        const updatedData = {
            title: data.title ?? "",
            subjectID: data.subjectID ?? "",
            sessionID: data.sessionID ?? "",
            databucketID: data.databucketID,
            fileType: data.fileType ?? data.type ?? "",
            uploaded: data.uploaded ?? false,
            creator: user?.$id ?? "",
        };
        const response = await databases.updateDocument(
            config.databaseId,
            config.documentCollectionId,
            data.$id,
            updatedData

        );
        return response;
    } catch (error){
        console.error("❌Error", getErrorMessage(error));
    }
}

export async function removeDocumentConfig(id: string){
    try {
        const response = await databases.deleteDocument(
            config.databaseId,
            config.documentCollectionId,
            id
        );

    } catch (error){
        console.error("❌Error", getErrorMessage(error));
    }
}

export async function setUserData(id: string, newUSerData: UserDataUpdateInput){
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
        console.error("❌Error while updating User Data setUserData()", getErrorMessage(error));
    }
}

export async function setUserDataSetup(id: string){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            { signInProcessStep: 'DONE' }

        );
        return res;
    } catch (error){
        console.error("❌Error while updating User Data  setUserDataSetup()", getErrorMessage(error));
    }
}

export async function setColorMode(id: string,colorMod: boolean){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            { darkmode: colorMod }

        );

    } catch (error){
        console.error("❌Error ", getErrorMessage(error));
    }
}

export async function setLanguage(id: string,newLanguage: string){
    try {
        const res = await databases.updateDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            { language: newLanguage })
    } catch (error){
        console.log("❌Error", getErrorMessage(error));
    }

}

