import { Query } from "appwrite";
import { databases, config } from "./appwrite";
import { getImageConfigsFromMMKV, getModulesFromMMKV, getNotesFromMMKV, setImageConfigsToMMKV } from "./mmkvFunctions";
import germanTranslation from "@/assets/languages/locales/de/translation.json"
import { AppwriteDocument, AppwriteDocumentConfig, AppwriteModule, AppwriteNote, AppwriteQuestion, module, note, question, userDataKathegory } from "@/types/appwriteTypes";



/**
 * Function returns all Modules for User Id
 * 404 means, no Internet Connection
 */
export async function getModules(id:string): Promise<AppwriteModule[]> {
    const LIMIT = 100; // Appwrite max
    let offset = 0;
    let allModules = <AppwriteModule[]>[];

    try {
        while (true) {
            const response = await databases.listDocuments<AppwriteModule>(
                config.databaseId,
                config.moduleCollectionId,
                [
                    Query.equal("creator", id),
                    Query.limit(LIMIT),
                    Query.offset(offset),
                ]
            );

            allModules = allModules.concat(response.documents);

            // Wenn weniger als LIMIT zurückkommt → keine weiteren Seiten
            if (response.documents.length < LIMIT) {
                break;
            }

            offset += LIMIT;
        }

        return allModules;
    } catch (error) {
        const modules = getModulesFromMMKV();
        if (__DEV__ && !modules) {
            console.log(error);
        }
        return modules;
    }
}



export async function getSessionNotes(sessionID:string): Promise<note[]> {
    try {
        const firstResponse = await databases.listDocuments<AppwriteNote>(
            config.databaseId,
            config.noteCollectionId,
            [
                Query.equal("sessionID", sessionID),
                Query.limit(100), 
            ]
        );
        
        const total = firstResponse.total;
        const documents = [...firstResponse.documents];
        if (documents.length < total) {
            const secondResponse = await databases.listDocuments<AppwriteNote>(
                config.databaseId,
                config.noteCollectionId,
                [
                    Query.equal("sessionID", sessionID),
                    Query.limit(100),
                    Query.offset(documents.length),
                ]
            );

            documents.push(...secondResponse.documents);
        }
        return documents;
    } catch (error) {
        const response = getNotesFromMMKV(sessionID);
        if (__DEV__ && !response) {
        console.log("Fehler bei der Anfrage", error);
        }
        return response;
    }
}

export async function getAllDocuments(sessionID:string): Promise<AppwriteDocument[]> {
    try {
        const firstResponse = await databases.listDocuments<AppwriteDocument>(
            config.databaseId,
            config.documentCollectionId,
            [
                Query.equal("sessionID", sessionID),
                Query.limit(100), 
            ]
        );

        const total = firstResponse.total;
        const documents = [...firstResponse.documents];
        if (documents.length < total) {
            const secondResponse = await databases.listDocuments<AppwriteDocument>(
                config.databaseId,
                config.documentCollectionId,
                [
                    Query.equal("sessionID", sessionID),
                    Query.limit(100),
                    Query.offset(documents.length),
                ]
            );

            documents.push(...secondResponse.documents);
        }
        return documents;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
        return [];
    }
    
}

export async function getSpecificDocument(documentID:string): Promise<AppwriteDocument | null> {
    try {
        const response = await databases.getDocument<AppwriteDocument>(
            config.databaseId,
            config.documentCollectionId,
            documentID
        );
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
        return null;
    }}

/**
 * Errorcode 404 means, no Internet Connection
 * Errorcode 401 means, that the document does not exist
 * Errorcode 400 means, that the id is not valid
 */
export async function getAllQuestionsByIds(ids:string[]): Promise<question[] | "400" | "404"> {
  if (!ids || ids.length === 0) return "400";
 console.log("IDS at 0", ids[0]);
  const idsFiltered = ids.filter(Boolean);

    const CHUNK_SIZE = 40;

    try {
        let allDocuments = [] as question[];
        console.log("Total IDs to fetch:", idsFiltered.length);
        for (let i = 0; i < idsFiltered.length; i += CHUNK_SIZE) {
            console.log("Starting")
            const chunk = idsFiltered.slice(i, i + CHUNK_SIZE);
            const response = await databases.listDocuments<AppwriteQuestion>(
                config.databaseId,
                config.questionCollectionId,
                [
                    Query.contains("$id", chunk),
                    Query.limit(chunk.length),
                ]
            );
            if (response && Array.isArray(response.documents) && response.documents.length) {
                allDocuments = allDocuments.concat(response.documents);
            }
        }

        // Deduplicate by $id in case of overlapping inputs
        const seen = new Set();
        const deduped = [];
        for (const doc of allDocuments) {
            const docId = doc.$id || doc.$id;
            if (!seen.has(docId)) {
                seen.add(docId);
                deduped.push(doc);
            }
        }

        return deduped;
    } catch (e) {
        if (__DEV__) console.log("Fehler bei Anfrage", e);
        return "404";
    }
}




export async function getAllImageConfigs(userId:string): Promise<AppwriteDocumentConfig[]> {
    try {
        const response = await databases.listDocuments<AppwriteDocumentConfig>(
            config.databaseId,
            config.documentCollectionId,
            [
                Query.equal("creator", userId),
                Query.equal("fileType", "jpg"),
                Query.limit(55)
            ]
        );
        setImageConfigsToMMKV(response.documents);
        return response.documents;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
        return getImageConfigsFromMMKV();
    }
}

export async function getUserSubscriptionStatus(userId:string): Promise<string | undefined> {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.subscriptionsCollectionId,
            [
                Query.equal("userID", userId),
            ]
        );
        return response.documents[0]?.status;
    } catch (error) {
        if (__DEV__) {
        console.log("Error fetching subscription status:", error);
        }
    }
}

export async function getMatchingModulesForGettingStarted(userKategory:userDataKathegory): Promise<AppwriteModule[]> {
    try {
        console.log("User Kategory:", userKategory);
        /*
        $id?: string;
        country: string | null;
        university: string | null;
        region: string | null;
        studiengangZiel: string | null;
        schoolType: string | null;
        kategoryType: string | null;
        schoolSubjects: string[];
        schoolGrade: number | null;
        educationSubject: string | null;
        educationKathegory: string;
        language: string | null;
        faculty: string[];
        studiengang: string[];
        studiengangKathegory: string;
        1. Determine if UNIVERSITY, SCHOOL, EDUCATION or OTHER

        1.U -> studiengang, language, bildungsziel
        2.S -> language, schoolForm, subject, schoolKlass
        3.E -> language, educationKathegory, educationSubject
        4.O -> language, subject

        */

        if (userKategory.kategoryType === "UNIVERSITY") {
            const language = userKategory.language || "EN"; 
            //const bildungsziel = "BACHELOR"; //Wird bei Master keine Ergebnisse liefern erstmal auf Bachelor setzen
            const studiengaenge = userKategory.schoolSubjects || []; //Das sind 1-x studiengänge
            let query = [
                Query.equal("creationLanguage", language.toUpperCase()),
                Query.equal("kategoryType", "UNIVERSITY"),                
            ]
            if (studiengaenge.length > 0) {
                console.log("Studiengänge length:", studiengaenge.length);
                if (studiengaenge.length === 1) {
                    query.push(Query.contains("subject", germanTranslation["universityCategories"]["universitySubjects"][studiengaenge[0] as keyof typeof germanTranslation["universityCategories"]["universitySubjects"]].name));
                } else {
                const orQuery = []
                for (let i = 0; i < studiengaenge.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation["universityCategories"]["universitySubjects"][studiengaenge[i] as keyof typeof germanTranslation["universityCategories"]["universitySubjects"]].name));
                }
                query.push(Query.or(orQuery));
                }
                
            }
            const res = await databases.listDocuments<AppwriteModule>(
                config.databaseId,
                config.moduleCollectionId,
                query
            )
            return res.documents;

        } else if (userKategory.kategoryType === "SCHOOL") {
            const language = userKategory.language || "en";
            const schoolForm = userKategory.schoolType || "GYMNASIUM"; 
            const subject = userKategory.schoolSubjects || [];
            const schoolKlass = userKategory.schoolGrade || 10;

            let query = [
                Query.equal("creationLanguage", language.toUpperCase()),
                Query.equal("creationSchoolForm", schoolForm.toUpperCase()),
                Query.equal("creationKlassNumber", schoolKlass),
                Query.equal("kategoryType", "SCHOOL"),
            ]

            if (subject.length > 0) {
                if (subject.length === 1) {
                    query.push(Query.contains("subject", germanTranslation.school.subjects[subject[0] as keyof typeof germanTranslation.school.subjects].name));
                } else {
                const orQuery = []
                for (let i = 0; i < subject.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation.school.subjects[subject[i] as keyof typeof germanTranslation.school.subjects].name));
                }
                query.push(Query.or(orQuery));
            }
            }
            const res = await databases.listDocuments<AppwriteModule>(
                config.databaseId,
                config.moduleCollectionId,
                query
            )
            return res.documents;

        } else if (userKategory.kategoryType === "EDUCATION") {
            const language = userKategory.language || "en";
            const educationKathegory = userKategory.educationKathegory || "VOCATIONAL"; //Ist nur ein Eintrag
            const educationSubject = userKategory.educationSubject || "BUSINESS"; //Ist nur ein Eintrag

            let query = [
                Query.equal("creationLanguage", language.toUpperCase()),
                Query.equal("creationEducationKathegory", educationKathegory),
                Query.equal("creationEducationSubject", educationSubject),
            ]

            const res = await databases.listDocuments<AppwriteModule>(
                config.databaseId,
                config.moduleCollectionId,
                query
            )
            return res.documents;

            

        } else {
            const language = userKategory.language || "en";
            const subject = userKategory.schoolSubjects || []; //Das sind 1-x Fächer
            let query = [
                Query.equal("creationLanguage", language.toUpperCase()),
            ]
            if (subject.length > 0) {
                if (subject.length === 1) {
                     query.push(Query.contains("subject", germanTranslation.school.subjects[subject[0] as keyof typeof germanTranslation.school.subjects].name));
                } else {
                const orQuery = []
                for (let i = 0; i < subject.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation.school.subjects[subject[i] as keyof typeof germanTranslation.school.subjects].name));
                }
                query.push(Query.or(orQuery));
            }
            }
            const res = await databases.listDocuments<AppwriteModule>(
                config.databaseId,
                config.moduleCollectionId,
                query
            )
            return res.documents;
        }
        return [];
    } catch (error) {
        if (__DEV__) {
            console.log("Error fetching modules for getting started:", error);
        }
        return [];
    }

}