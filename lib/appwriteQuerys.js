import { Query } from "appwrite";
import { databases, config } from "./appwrite";

export async function getSepcificModules2(){
    const response = await databases.listDocuments(
        config.databaseId,
        config.moduleCollectionId,
        [
            Query.equal('name', ['Algorythmen',"Statistik","Gesellschaft"]),
        ]
    );
    return response.documents;
}

export async function getBestMatchingModules(prevStep, userData) {
    const response = await databases.listDocuments(
        config.databaseId,
        config.moduleCollectionId,
        [
            Query.equal('name', ['Algorythmen',"Statistik","Gesellschaft"]),
            Query.equal('step', prevStep),
            Query.equal('userData', userData)
        ]
    );
    return response.documents;
}

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
                    console.log("Fehler bei der Anfrage", error)
                }
                i--;
            }
        return res;
   } catch (error) {
        console.log("Fehler bei der Anfrage", error)
    }
}




export async function getQuestions(id) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.questionCollectionId,
            [
                Query.equal("sessionID", id),
            ]
        );
        return response;
    } catch (error) {
        console.log(error)
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
        return response;
    } catch (error) {
        console.log(error)
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
        console.log("Fehler bei der Anfrage",error)
    }
}


export async function dynamicQuery(queryFilterList) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            [
                Query.and(queryFilterList)
            ]
        );
        return response.documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage",error)
    }
}

 
export async function universityQuery(userData) {
    const fields = [
        "creationCountry",
        "creationUniversity",
        "creationUniversityFaculty",
        "creationUniversitySubject",
    ];

    const queryFilters = fields
        .filter((key) => {
            const val = userData[key];
            return Array.isArray(val) ? val.length > 0 : !!val;
        })
        .map((key) => Query.equal(key, userData[key]));
        
    if (userData.searchBarText && userData.searchBarText.trim() !== "") {
            queryFilters.push(
                Query.startsWith('moduleName', userData.searchBarText.trim())
            );
        }

    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            queryFilters
        );
        return response.documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
    }
}

export async function schoolQuery(userData) {
    const fields = [
        "creationCountry",
        "region",
        "creationSchoolForm",
        "creationKlassNumber",
        "creationSubject",
    ];

    const queryFilters = fields
        .filter((key) => {
            const val = userData[key];
            return Array.isArray(val) ? val.length > 0 : !!val;
        })
        .map((key) => Query.equal(key, userData[key]));

    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            queryFilters
        );
        return response.documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
    }
}

export async function educationQuery(userData) {
    const fields = [
        "creationCountry",
        "creationEducationKathegory",
        "creationEducationSubject",
    ];

    const queryFilters = fields
        .filter((key) => {
            const val = userData[key];
            return Array.isArray(val) ? val.length > 0 : !!val;
        })
        .map((key) => Query.equal(key, userData[key]));

    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            queryFilters
        );
        return response.documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
    }
}

export async function otherQuery(userData) {
    const fields = [
        "creationCountry",
        "creationSubject",
    ];

    const queryFilters = fields
        .filter((key) => {
            const val = userData[key];
            return Array.isArray(val) ? val.length > 0 : !!val;
        })
        .map((key) => Query.equal(key, userData[key]));

    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.moduleCollectionId,
            queryFilters
        );
        return response.documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
    }
}

export async function getModuleAmout(subjectID) {
    const aspects = {
        "questions": 0,
        "notes": 0,
    }
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.questionCollectionId,
            [
                Query.equal("subjectID", subjectID),
            ],
            0,
            0
        );
        const response2 = await databases.listDocuments(
            config.databaseId,
            config.noteCollectionId,
            [
                Query.equal("subjectID", subjectID),
            ],
            0,
            0
        );
        aspects.notes = response2.total;
        aspects.questions = response.total;
        return aspects;

        
    } catch (error) {
        console.log("Fehler bei der Anfrage", error)
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
        console.log("😶‍🌫️😶‍🌫️Anzahl der Dokumente:", documents.length, documents);
        return documents;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
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
        console.log("Fehler bei der Anfrage", error);
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
        console.log("Fehler bei der Anfrage", error);
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
        console.log("Anzahl der Dokumente:", allDocuments.length);
        return allDocuments;
    } catch (error) {
        console.log("Fehler bei der Anfrage", error);
        return [];
    }
}

