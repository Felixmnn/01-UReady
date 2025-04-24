import { Query } from "appwrite";
import { databases, config } from "./appwrite";

export async function getSepcificModules2(){
    console.log("Ich werde gestartet")
    const response = await databases.listDocuments(
        config.databaseId,
        config.moduleCollectionId,
        [
            Query.equal('name', ['Algorythmen',"Statistik","Gesellschaft"]),
        ]
    );
    console.log("Response Response Response",response.documents)
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


   try {
        let res = []
        if (userData.kategoryType === "UNIVERSITY") {
            const entries = Object.entries(uniQuery);
            let i = entries.length;
            while ( i > 0 ) {
                try {
                    const partialEntries = entries.slice(0, i);
                    const partialQuery = Object.fromEntries(partialEntries);
                    res = await universityQuery(partialQuery)
                    console.log("Die Responce",res , "bei der Anfrage",partialQuery)
                    if (res.documents > 0) {
                        res = res.documents;
                        break;
                    }
                } catch (error) {
                    console.log("Fehler bei der Anfrage", error)
                }
                i--;
            }
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