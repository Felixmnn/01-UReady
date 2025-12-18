import { Query } from "appwrite";
import { databases, config } from "./appwrite";
import { getImageConfigsFromMMKV, getModulesFromMMKV, getNotesFromMMKV, setImageConfigsToMMKV } from "./mmkvFunctions";
import germanTranslation from "@/assets/languages/locales/de/translation.json"




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
/**
 * Function returns all Modules for User Id
 * 404 means, no Internet Connection
 */
export async function getModules(id) {
    const LIMIT = 100; // Appwrite max
    let offset = 0;
    let allModules = [];

    try {
        while (true) {
            const response = await databases.listDocuments(
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
        const response = getNotesFromMMKV(sessionID);
        if (__DEV__ && !response) {
        console.log("Fehler bei der Anfrage", error);
        }
        return response;
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
/**
 * Errorcode 404 means, no Internet Connection
 * Errorcode 401 means, that the document does not exist
 * Errorcode 400 means, that the id is not valid
 */
export async function getAllQuestionsByIds(ids) {
  if (!ids || ids.length === 0) return "400";
 
  const idsFiltered = ids.filter(Boolean);

  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.questionCollectionId,
      [
        Query.contains("$id", idsFiltered),
        Query.limit(idsFiltered.length), // damit nichts abgeschnitten wird
      ]
    );
    
    return response.documents;
  } catch (e) {
    if (__DEV__) console.log("Fehler bei Anfrage", e);
    return "404";
  }
}




export async function getAllImageConfigs(userId) {
    try {
        const response = await databases.listDocuments(
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

export async function getUserSubscriptionStatus(userId) {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.subscriptionsCollectionId,
            [
                Query.equal("userID", userId),
            ]
        );
        return response.documents[0];
    } catch (error) {
        if (__DEV__) {
        console.log("Error fetching subscription status:", error);
        }
    }
}

export async function getMatchingModulesForGettingStarted(userKategory) {
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
                    query.push(Query.contains("subject", germanTranslation["universityCategories"]["universitySubjects"][studiengaenge[0]].name));
                } else {
                const orQuery = []
                for (let i = 0; i < studiengaenge.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation["universityCategories"]["universitySubjects"][studiengaenge[i]].name));
                }
                query.push(Query.or(orQuery));
                }
                
            }
            const res = await databases.listDocuments(
                config.databaseId,
                config.moduleCollectionId,
                query
            )
            return res.documents;

        } else if (userKategory.kategoryType === "SCHOOL") {
            const language = userKategory.language || "en";
            const schoolForm = userKategory.schoolForm || "GYMNASIUM"; 
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
                    query.push(Query.contains("subject", germanTranslation.school.subjects[subject[0]].name));
                } else {
                const orQuery = []
                for (let i = 0; i < subject.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation.school.subjects[subject[i]].name));
                }
                query.push(Query.or(orQuery));
            }
            }
            const res = await databases.listDocuments(
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

            const res = await databases.listDocuments(
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
                Query.equal("kategoryType", "OTHER"),
            ]
            if (subject.length > 0) {
                if (subject.length === 1) {
                     query.push(Query.contains("subject", germanTranslation["otherCategories"]["otherSubjects"][subject[0]].name));
                } else {
                const orQuery = []
                for (let i = 0; i < subject.length; i++) {
                    orQuery.push(Query.contains("subject", germanTranslation["otherCategories"]["otherSubjects"][subject[i]].name));
                }
                query.push(Query.or(orQuery));
            }
            }
            const res = await databases.listDocuments(
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
    }

}