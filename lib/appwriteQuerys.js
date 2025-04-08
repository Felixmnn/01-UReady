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

    {/* Universität Abfrage */}
    const uniFilters = [
    { key: "studiengangKathegory", value: userData.studiengangKathegory, type: "contains" },
    { key: "creationCountry", value: userData.country, type: "equal" },
    { key: "creationUniversity", value: userData.university, type: "equal" },
    { key: "creationUniversityFaculty", value: userData.faculty, type: "contains" },
    { key: "creationUniversitySubject", value: userData.studiengang, type: "contains" }
    ];

    {/* Schule Abfrage */}
    const schoolFilters = [
        { key: "creationCountry", value: userData.country, type: "equal" },
        { key: "creationEducationSubject", value: userData.schoolSubjects, type: "contains" },
        { key: "region", value: userData.schoolType, type: "equal" },
        { key: "creationSchoolForm", value: userData.schoolType, type: "equal" },
        { key: "creationKlassNumber", value: userData.schoolGrade, type: "contains" },
    ]
    
    {/* Ausbildung Abfrage */}
    const apprenticeshipFilters = [
        { key: "creationCountry", value: userData.country, type: "equal" },
        { key: "creationLanguage", value: userData.language, type: "equal" },
        { key: "creationEducationKathegory", value: userData.educationKathegory, type: "equal" },
        { key: "creationEducationSubject", value: userData.educationSubject, type: "equal" },
    ]

    {/* Allgemeine Abfrage */}
    const generalFilters = [
        { key: "creationCountry", value: userData.country, type: "equal" },
        { key: "creationLanguage", value: userData.language, type: "equal" },
        { key: "creationEducationSubject", value: userData.schoolSubjects, type: "contains" },
    ]

    const queryTypeMapping = {
        "equal": (key, value) => Query.equal(key, value),
        "contains": (key, value) => Query.contains(key, value),
    };
    
    const applyFilters = (filters) => {
        return filters.map(filter => queryTypeMapping[filter.type](filter.key, filter.value));
    };

    async function getResponseWithFilters(filters) {
        console.log("Filters 🔵🔵🔵", filters)
        let response = null;
        let i = filters.length;
        while (i > 0) {
            const currentFilters = applyFilters(filters.slice(0, i));  
            response = await databases.listDocuments(
                config.databaseId,
                config.moduleCollectionId,
                [
                    Query.and(currentFilters)
                ]
            );
            if (response.documents.length > 0) {
                return response;  
            }
            i--;
        }
        return response;
    }
    
    try {
    if (userData.kategoryType === "UNIVERSITY") {
            const response = await getResponseWithFilters(uniFilters);
            return response.documents;
        }
     else if (userData.kategoryType === "SCHOOL") {
            const response = await getResponseWithFilters(schoolFilters);
            return response.documents;
        }
     else if (userData.kategoryType === "EDUCATION") {
            const response = await getResponseWithFilters(apprenticeshipFilters);
            return response.documents;
        }
     else {
            const response = await getResponseWithFilters(generalFilters);
            return response.documents;
        }
    
    } catch (error) {
        console.error("Error fetching documents:", error);
    }
}