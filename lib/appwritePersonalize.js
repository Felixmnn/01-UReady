import { Client,Account,ID, Avatars, Databases,Query, Storage,Functions  } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.uready",
    projectId: "682571d0000d0ecc9c2e",
    databaseId : "682571eb00292e3ac406",
    countryListID : "6825722a0000812ca108",
    universityListID: "6825723e003d162228ec",
    educationListID:    "682572480003bed95076",
    schoolListID: "68257254000a4cb93c15",
    universitySubjectsID: "68257268001be394af72",
    educationSubjectsID: "68257275002976bb81dd",
    
};

const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const databases = new Databases (client);

export async function getCountryList() {
    try {
        const response = await databases.listDocuments(
            config.databaseId,
            config.countryListID,
            [
                Query.limit(100)
            ]
        );
        console.log("Country List: ", response.documents);
        return response.documents;
    } catch (error) {
        console.error("❌Error while fetching country list", error.message);
    }
}

export async function getUniversityList(id) {
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.universityListID,
            id
        );
        console.log("Country List: ", response);
        return response;
    } catch (error) {
        console.error("❌Error while fetching country list", error.message);
    }
}

export async function getEducationList(id) {
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.educationListID,
            id
        );
        console.log("Country List: ", response);
        return response;
    } catch (error) {
        console.error("❌Error while fetching country list", error.message);
    }
}

export async function getSchoolList(id) {
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.schoolListID,
            id
        );
        console.log("Country List: ", response);
        return response;
    } catch (error) {
        console.error("❌Error while fetching country list", error.message);
    }
}

export async function getUniversitySubjects(id){
    console.log("ID: ", id);
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.universitySubjectsID,
            id
        );
        return response;
    } catch (error) {
        console.error("❌Error while fetching university subjects", error.message);
    }
}
export async function getEducationSubjects(id){
    try {
        const response = await databases.getDocument(
            config.databaseId,
            config.educationSubjectsID,
            id
        );
        return response;
    } catch (error) {
        console.error("❌Error while fetching education subjects", error.message);
    }
}

