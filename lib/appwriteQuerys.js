import { Query } from "appwrite";
import { databases, config } from "./appwrite";




export async function getSepcificModules(userData) {
    const uniQuery = {
        creationCountry: userData.country,
        creationUniversity: userData.university,
        creationUniversityFaculty: userData.faculty,
        creationUniversitySubject: userData.studiengang
    }
    const schoolQuery = {
        creationCountry: userData.country,
        region: userData.region,
        creationSchoolForm: userData.schoolForm,
        creationKlassNumber: userData.klassNumber,
        creationSubject: userData.subject
    }
    const educationQuery = {
        creationCountry: userData.country,
        creationEducationKathegory: userData.educationKathegory,
        creationEducationSubject: userData.educationSubject
    }
    const otherQuery = {
        creationCountry: userData.country,
        creationSubject: userData.subject
    }
   try {
        let res = []
        let query ;
        if (userData.kategoryType === "UNIVERSITY") {
            query = uniQuery;
        } else if (userData.kategoryType === "SCHOOL") {
            query = schoolQuery;
        } else if (userData.kategoryType === "EDUCATION") {
            query = educationQuery;
        } else {
            query = otherQuery;
        } 
            const entries = Object.entries(query);
            let i = entries.length;
            while ( i > 0 ) {
                try {
                    const partialEntries = entries.slice(0, i);
                    const partialQuery = Object.fromEntries(partialEntries);
                    if (userData.kategoryType === "UNIVERSITY") {
                        res = await universityQuery(partialQuery)
                    } else if (userData.kategoryType === "SCHOOL") {
                        res = await schoolQuery(partialQuery)
                    } else if (userData.kategoryType === "EDUCATION") {
                        res = await educationQuery(partialQuery)
                    } else {
                        res = await otherQuery(partialQuery)
                    }
                    if (res.documents > 0) {
                        res = res.documents;
                        break;
                    }
                } catch (error) {
                    if (__DEV__) {
                    console.log("Fehler bei der Anfrage", error)
                    }
                }
                i--;
            }
        return res;
   } catch (error) {
    if (__DEV__) {
        console.log("Fehler bei der Anfrage", error)
    }
    }
}


export async function getModules(id) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            [
                Query.equal("creator", id),
            ]
        );
        return response.documents;
    } catch (error) {
        if (__DEV__) {
        console.log(error)
        }
        return null;
    }
}

export async function getAllQuestions(id) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.questionCollectionId,
            [
                    Query.equal("subjectID", id),
            ]
        );
        return response;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage",error)
        }
    }
}



export async function getSessionQuestions(sessionID) {
    try {
        const firstResponse = await databases.listDocuments(
            config.databaseId,
            config.questionCollectionId,
            [
                Query.equal("sessionID", sessionID),
                Query.limit(100), 
            ]
        );

        const total = firstResponse.total;
        const documents = [...firstResponse.documents];
        if (documents.length < total) {
            const secondResponse = await databases.listDocuments(
                config.databaseId,
                config.questionCollectionId,
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

export async function getSessionNotes(sessionID) {
    try {
        const firstResponse = await databases.listDocuments(
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
            const secondResponse = await databases.listDocuments(
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
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
        return [];
    }
}

export async function getAllDocuments(sessionID) {
    try {
        const firstResponse = await databases.listDocuments(
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
            const secondResponse = await databases.listDocuments(
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


export async function getAllQuestionsByIds(ids) {
    if (!ids || ids.length === 0) {
        return [];
    }
    const idsFiltered = ids.filter(id => id !== null && id !== undefined);
    const amount = idsFiltered.length / 20;
    const chunkSize = 20; // maximale Anzahl pro Anfrage
    let allDocuments = [];
    const chunk = idsFiltered.slice(0, chunkSize);
    try {
        for (let i = 0 ; i < amount; i++) {
            const chunk = idsFiltered.slice(i * chunkSize, (i + 1) * chunkSize);
            if (chunk.length === 0) {
                break; // Keine weiteren IDs zu verarbeiten
            }
            const response = await databases.listDocuments(
                config.databaseId,
                config.questionCollectionId,
                [
                    Query.contains("$id", chunk),
                ]
            );
            allDocuments.push(...response.documents);
        }
        return allDocuments;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
        return [];
    }
}

export async function getAllQuestionsBySessionId(sessionID) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.questionCollectionId,
            [
                Query.equal("sessionID", sessionID),
            ]
        );
        console.log("Questions for session", sessionID, ":", response.documents)
        return response.documents;
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler bei der Anfrage", error);
        }
    }}
