import { client,databases,config, storage } from './appwrite';

export async function addNewModule(data) {
    try {
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            "unique()",
            data
        );
        return newModule;
    } catch (error) {
        console.error("❌Error while creating a Module", error.message);
    }
}
export async function addNewModuleWithID(data, id) {
    try {
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            id,
            data
        );
        return newModule;
    } catch (error) {
        console.error("❌Error while creating a Module", error.message);
    }
}


export async function addNewUserConfig(id){
    try {
        const newUserConfig = await databases.createDocument(
            config.databaseId,
            config.userDataCollectionId,
            id,
            {
                darkmode:false,
                language:null,
                uid:id,
                subscription:"NONE",
                profilePicture:"DEFAULT",
                birthday:null,
                signInProcessStep:"ZERO",
                country:null,
                university:null,
                city:"",
            }
        );
        return newUserConfig;
    } catch (error) {
        console.error("❌Error while creating User Data Config", error.message);
    }
}


export async function addUserDatakathegory(id,newUSerData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            newUSerData

        );

    } catch (error){
        console.error("❌Error", error.message);
    }
}
export async function updateUserDatakathegory(id,newUSerData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            newUSerData

        );

    } catch (error){
        console.error("❌Error", error.message);
    }
}

export async function addUserUsage(id, newUserUsageData) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            newUserUsageData
        );
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function addDocumentJob(job){
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.jobCollectionId,
            "unique()",
            job
        )
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function addContact(contact) {
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.contactCollectionId,
            "unique()",
            contact
        );
        return res;
    } catch (error) {
        console.error("❌Error", error.message);
    }
}

export async function reportModule(data) {
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.reportModuleCollectionId,
            "unique()",
            data
        );
        return res;
    } catch (error) {
        console.error("❌Error while reporting a Module", error.message);
    }
}

export async function adddModule({
    name= "New Module",
    subject= "This is a template Module",
    questions= 0,
    notes= 0,
    documents= 0,
    progress= 0,
    creator= "",
    color= null,
    sessions= [],
    tags= [],
    description= "",
    releaseDate= null,
    connectedModules= [],
    qualityScore= 0,
    duration= 0,
    upvotes= 0,
    downVotes= 0,
    copy= false,
    questionList= [],
    synchronization= false,
    creationCountry= null,
    creationUniversity= null,
    creationUniversityProfession= null,
    creationRegion= null,
    creationUniversitySubject= [],
    creationSubject= [],
    creationEducationSubject= null,
    creationUniversityFaculty= [],
    creationSchoolForm= null,
    creationKlassNumber= null,
    creationLanguage= null,
    creationEducationKathegory=null,
    id= "unique()"


}= {}){
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            {
                name,
                subject,
                questions,
                notes,
                documents,
                "public":true,
                progress,
                creator,
                color,
                sessions,
                tags,
                description,
                releaseDate,
                connectedModules,
                qualityScore,
                duration,
                upvotes,
                downVotes,
                creationCountry,
                creationUniversity,
                creationUniversityProfession,
                creationRegion,
                creationUniversitySubject,
                creationSubject,
                creationEducationSubject,
                creationUniversityFaculty,
                creationSchoolForm,
                creationKlassNumber,
                creationLanguage,
                creationEducationKathegory,
                copy,
                questionList,
                synchronization
            }
        );
        return res;

    } catch (error) {
        console.error("❌Error while adding a Module", error.message);
    }
}
