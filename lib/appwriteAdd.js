import { uuid } from 'expo-modules-core';
import { client,databases,config, storage } from './appwrite';
import { addCompleatlyUnsavedModuleToMMKV, addModuleToMMKV, addUnsavedModuleToMMKV } from './mmkvFunctions';

export async function addNewModule(data) {
    const dupDataID = data.$id;
    try {
        if (data.$id) {
            delete data.$id
        }
        let permissions = [
            `update('user:${data.creator}')`,
            `delete('user:${data.creator}')`,
            `write('user:${data.creator}')`
        ];
        if (data.public) permissions.push("read('any')");
        else permissions.push(`read('user:${data.creator}')`);
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            "unique()",
            data,
            permissions
            
        );
        addModuleToMMKV(newModule)

        return newModule;
    } catch (error) {
        if (dupDataID) {
            return {
                ...data,
                $id:dupDataID
            }
        }
        const tmpID = "tmp-"+uuid.v4()
        const newModule = {
            ...data,
            $id:tmpID
        }
        addUnsavedModuleToMMKV(newModule)
        addModuleToMMKV(newModule)
        return newModule

    }
}
export async function addNewModuleWithID(data, id) {
    try {
        let permissions = [
            `update('user:${data.creator}')`,
            `delete('user:${data.creator}')`,
            `write('user:${data.creator}')`
        ];
        if (data.public) permissions.push("read('any')");
        else permissions.push(`read('user:${data.creator}')`);
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            id,
            data,
            permissions
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
            },
            [
                `update('user:${id}')`,
                `delete('user:${id}')`,
                `write('user:${id}')`,
                `read('user:${id}')`
            ]
        );
        return newUserConfig;
    } catch (error) {
        console.error("❌Error while creating User Data Config", error.message);
    }
}


export async function addUserDatakathegory(id, newUserData) {
  try {
    // Versuche neues Dokument zu erstellen
    const response = await databases.createDocument(
      config.databaseId,
      config.userKathegoryCollectionId,
      id,
      newUserData,
        [
            `update('user:${id}')`,
            `delete('user:${id}')`,
            `write('user:${id}')`,
            `read('user:${id}')`
        ]

    );
    return response;
  } catch (error) {
    // Falls das Dokument schon existiert → update statt create
    if (error.code === 409) {
      try {
        const updateResponse = await databases.updateDocument(
          config.databaseId,
          config.userKathegoryCollectionId,
          id,
          newUserData
        );
        return updateResponse;

      } catch (updateError) {
        console.error("❌ Fehler beim Aktualisieren des Dokuments:", updateError.message);
      }
    }}
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
            newUserUsageData,
            [
                `update('user:${id}')`,
                `delete('user:${id}')`,
                `write('user:${id}')`,
                `read('user:${id}')`
            ]
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
/**
 * Fügt ein neues Modul in die Datenbank hinzu.
 * 
 * @param {Object} moduleData - Die Daten für das neue Modul.
 * @param {string} [moduleData.name="New Module"]
 * @param {string} [moduleData.subject="This is a template Module"]
 * @param {number} [moduleData.questions=0]
 * @param {number} [moduleData.notes=0]
 * @param {number} [moduleData.documents=0]
 * @param {number} [moduleData.progress=0]
 * @param {string} [moduleData.creator=""]
 * @param {string} [moduleData.color="BLUE"]
 * @param {string[]} [moduleData.sessions=[]]
 * @param {string[]} [moduleData.tags=[]]
 * @param {string} [moduleData.description=""]
 * @param {Date|null} [moduleData.releaseDate=null]
 * @param {string[]} [moduleData.connectedModules=[]]
 * @param {number} [moduleData.qualityScore=0]
 * @param {number} [moduleData.duration=0]
 * @param {number} [moduleData.upvotes=0]
 * @param {number} [moduleData.downVotes=0]
 * @param {boolean} [moduleData.copy=false]
 * @param {any[]} [moduleData.questionList=[]]
 * @param {boolean} [moduleData.synchronization=false]
 * @param {string|null} [moduleData.creationCountry=null]
 * @param {string|null} [moduleData.creationUniversity=null]
 * @param {string|null} [moduleData.creationUniversityProfession=null]
 * @param {string|null} [moduleData.creationRegion=null]
 * @param {string[]} [moduleData.creationUniversitySubject=[]]
 * @param {string[]} [moduleData.creationSubject=[]]
 * @param {string|null} [moduleData.creationEducationSubject=null]
 * @param {string[]} [moduleData.creationUniversityFaculty=[]]
 * @param {string|null} [moduleData.creationSchoolForm=null]
 * @param {number|null} [moduleData.creationKlassNumber=null]
 * @param {string|null} [moduleData.creationLanguage=null]
 * @param {string|null} [moduleData.creationEducationKathegory=null]
 * @param {string} [moduleData.id="unique()"]
 * @param {string} moduleData.kategoryType - Der Kategorietyp des Moduls.
 * @param {boolean} [moduleData.publicAcess=true] - Gibt an, ob das Modul öffentlich zugänglich ist.
 * 
 * @returns {Promise<Object>} Das erstellte Modul-Dokument.
 */
export async function adddModule({
    name= "New Module",
    subject= "This is a template Module",
    questions= 0,
    notes= 0,
    documents= 0,
    progress= 0,
    creator= "",
    color= "BLUE",
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
    id= "unique()",
    kategoryType,
    publicAcess = true
}) {
    const appwriteSafeModule ={
            name: name,
            subject: subject,
            questions: questions,
            notes: notes,
            documents: documents,
            "public": publicAcess,
            progress: progress,
            creator: creator,  // Color must beRED, BLUE, GREEN, PURPLE, YELLOW, ORANGE, PINK, EMERALD, CYAN
            color: color == "RED" || color == "BLUE" || color == "GREEN" || color == "PURPLE" || color == "YELLOW" ||
            color == "ORANGE" || color == "PINK" || color == "EMERALD" || color == "CYAN"
            ? color : "BLUE",
            sessions: sessions,
            tags: tags,
            description: description,
            releaseDate: releaseDate,
            connectedModules: connectedModules,
            qualityScore: qualityScore,
            duration: duration,
            upvotes: upvotes,
            downVotes: downVotes,
            creationCountry: creationCountry,   
            creationUniversity: creationUniversity,
            creationUniversityProfession: creationUniversityProfession == "MASTER" || creationUniversityProfession == "BACHELOR" ||
            creationUniversityProfession == "STAATSEXAMEN" || creationUniversityProfession == "DIPLOM" || 
            creationUniversityProfession == "PHD" || creationUniversityProfession == "OTHER"
            ? creationUniversityProfession : "NONE",
            creationRegion: creationRegion,
            creationUniversitySubject: creationUniversitySubject,
            creationSubject: creationSubject,
            creationEducationSubject: creationEducationSubject,
            creationUniversityFaculty: creationUniversityFaculty,
            creationSchoolForm: creationSchoolForm,
            creationKlassNumber: creationKlassNumber,
            creationLanguage: creationLanguage,
            creationEducationKathegory: creationEducationKathegory,
            copy: copy,
            questionList: questionList,
            synchronization: synchronization,
            kategoryType: kategoryType
        }
    try {
        console.log("Adding Module with ID:", creationUniversityProfession);
        let permissions = [
            `update('user:${creator}')`,
            `delete('user:${creator}')`,
            `write('user:${creator}')`
        ];
        if (publicAcess) permissions.push("read('any')");
        else permissions.push(`read('user:${creator}')`);
        const res = await databases.createDocument(
            config.databaseId,
            config.moduleCollectionId,
            id,
            appwriteSafeModule,
            permissions

        );
        addModuleToMMKV(res)
        return res;

    } catch (error) {

        console.error("❌Error but no Problem", error.message);
        const tmpID = "tmp-" + uuid.v4()
        console.log(tmpID)
        const newModule = {
            ...appwriteSafeModule,
            $id:tmpID
        }
        console.log("New Module", newModule)
        addCompleatlyUnsavedModuleToMMKV(newModule)
        addModuleToMMKV(newModule)
        return newModule

    }
}
