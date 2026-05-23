import { uuid } from 'expo-modules-core';
import { databases,config } from './appwrite';
import { addCompleatlyUnsavedModuleToMMKV, addModuleToMMKV, addUnsavedModuleToMMKV, getSessionFromMMKV, saveUserKategorieToMMKV } from './mmkvFunctions';
import { Permission, Role } from 'appwrite';
import { AppwriteContact, AppwriteModule, AppwriteReport, AppwriteUserKategorie, contact, documentConfig, module, report, userData, UserUsage } from '@/types/appwriteTypes';

type UserKategoriePayload = {
    country?: string | null;
    university?: string | null;
    region?: string | null;
    studiengangZiel?: string | null;
    schoolType?: string | null;
    kategoryType?: string | null;
    schoolSubjects?: Array<string | undefined> | null;
    schoolGrade?: number | string | null;
    educationSubject?: string | null;
    educationKathegory?: string | null;
    language?: string | null;
    faculty?: string[] | null;
    studiengang?: string[] | null;
    studiengangKathegory?: Array<string | undefined> | null;
};

const hasErrorCode = (error: unknown): error is { code: number } =>
    typeof error === 'object' && error !== null && 'code' in error;

export async function addNewModule(data:module,id:string) {
    try {
        if (data?.$id) {
            delete data.$id
        }
        let permissions = [
            Permission.delete(Role.user(id)), 
            Permission.update(Role.user(id)),
            Permission.write(Role.user(id)),
        ];
        if (data.public) permissions.push(
            Permission.read(Role.any())
        );
        else permissions.push(
            Permission.read(Role.user(id))
        );
        const newModule = await databases.createDocument<AppwriteModule>(
            config.databaseId,
            config.collectionId,
            "unique()",
            {
                ...data,
                studiengangKathegory: Array.isArray(data.creationEducationKathegory) ? data.creationEducationKathegory : [],
            },
            permissions
            
        );
        addModuleToMMKV(newModule)

        return newModule;
    } catch (error) {
        console.error("❌Error while creating a Module", error instanceof Error ? error.message : String(error));
        if (data?.$id) {
            return {
                ...data,
                $id:data.$id
            }
        }
        const tmpID = "tmp-"+uuid.v4()
        const newModule = {
            ...data,
            $id:tmpID
        }
        addModuleToMMKV(newModule)
        return newModule

    }
}
export async function addNewModuleWithID(data:module, id:string) {
    let user = getSessionFromMMKV()
    try {
        let userID = ""
        if (!user) {
            userID = data.creator
        } else {
            userID = user.$id
        }
        let permissions = [
            Permission.delete(Role.user(userID)), 
            Permission.update(Role.user(userID)),
            Permission.write(Role.user(userID)),
        ];
        if (!data.public) permissions.push(
            Permission.read(Role.user(userID))
        );
        const newModule = await databases.createDocument(
            config.databaseId,
            config.collectionId,
            id,
            {...data,
                kategoryType: "OTHER"
            },
            permissions
        );
        return newModule;
    } catch (error) {
        console.error("❌Error while creating a Module", error instanceof Error ? error.message : String(error));
    }
}

export async function addNewUserConfig(id:string) {
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
                Permission.delete(Role.user(id)), 
                Permission.update(Role.user(id)),
                Permission.write(Role.user(id)),
                Permission.read(Role.user(id))
            ]
        );
        return newUserConfig;
    } catch (error) {
        console.error("❌Error while creating User Data Config", error instanceof Error ? error.message : String(error));
    }
}

export async function addUserDatakathegory(id:string, newUserData:UserKategoriePayload) {
  try {
    console.log("Adding user data kathegory for user ID:", id, "with data:", newUserData);  
    // Versuche neues Dokument zu erstellen
    const response = await databases.createDocument<AppwriteUserKategorie>(
      config.databaseId,
      config.userKathegoryCollectionId,
      id,
      newUserData,
        [
            Permission.delete(Role.user(id)), 
            Permission.update(Role.user(id)),
            Permission.write(Role.user(id)),
            Permission.read(Role.user(id))
        ]

    );
    console.log("✅ User data kathegory created successfully", response);
    if (response) saveUserKategorieToMMKV(response);
    return response;
  } catch (error) {
    // Falls das Dokument schon existiert → update statt create
    if (hasErrorCode(error) && error.code === 409) {
      try {
        const updateResponse = await databases.updateDocument(
          config.databaseId,
          config.userKathegoryCollectionId,
          id,
          newUserData
        );
        return updateResponse;

      } catch (updateError) {
        console.error("❌ Fehler beim Aktualisieren des Dokuments:", updateError instanceof Error ? updateError.message : String(updateError));
      }
    } else {
      console.log("❌Error while creating user data kathegory", error instanceof Error ? error.message : String(error));
    }
  }
}

export async function updateUserDatakathegory(id:string,newUSerData:UserKategoriePayload) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userKathegoryCollectionId,
            id,
            newUSerData

        );

    } catch (error){
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function addUserUsage(id:string, newUserUsageData:UserUsage) {
    try {
        const response = await databases.createDocument(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            newUserUsageData,
            [
                Permission.delete(Role.user(id)), 
                Permission.update(Role.user(id)),
                Permission.write(Role.user(id)),
                Permission.read(Role.user(id))
            ]
        );
    } catch (error) {
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function addDocumentJob(job:documentConfig){
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.jobCollectionId,
            "unique()",
            job
        )
    } catch (error) {
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function addContact(contact:contact) {
    try {
        const res = await databases.createDocument<AppwriteContact>(
            config.databaseId,
            config.contactCollectionId,
            "unique()",
            contact
        );
        return res;
    } catch (error) {
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }
}

export async function reportModule(data:report) {
    try {
        const res = await databases.createDocument<AppwriteReport>(
            config.databaseId,
            config.reportModuleCollectionId,
            "unique()",
            data
        );
        return res;
    } catch (error) {
        console.error("❌Error while reporting a Module", error instanceof Error ? error.message : String(error));
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
 * @param {string[]} [moduleData.studiengangKathegory=[]]
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
    studiengangKathegory = [],
    id= "unique()",
    kategoryType = "",
    publicAcess = true
}: Partial<Omit<module, "releaseDate" | "creationCountry">> & {
    releaseDate?: string | null;
    creationCountry?: string | null;
    id?: string;
    publicAcess?: boolean;
}) {
    const kategoryTypeHere = kategoryType == "UNIVERSITY" ? "UNIVERSITY" : kategoryType == "SCHOOL" ? "SCHOOL" : kategoryType == "EDUCATION" ? "EDUCATION" : "OTHER"
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
            creationSchoolForm: creationSchoolForm ? creationSchoolForm : "OTHER",
            creationKlassNumber: creationKlassNumber,
            creationLanguage: creationLanguage,
            creationEducationKathegory: creationEducationKathegory,
            studiengangKathegory: Array.isArray(studiengangKathegory) ? studiengangKathegory : [],
            copy: copy,
            questionList: questionList,
            synchronization: synchronization,
            kategoryType: kategoryTypeHere
        }
    try {
        console.log("Adding Module with ID:", appwriteSafeModule.studiengangKathegory,creationSchoolForm, kategoryType, typeof kategoryType, kategoryType.length);  // Debug-Ausgabe der Module-Daten
        let permissions = [
            Permission.delete(Role.user(creator)), 
            Permission.update(Role.user(creator)),
            Permission.write(Role.user(creator)),
        ];
        if (publicAcess) permissions.push(
            Permission.read(Role.any())
        );
        else permissions.push(
            Permission.read(Role.user(creator))
        );
        const res = await databases.createDocument<AppwriteModule>(
            config.databaseId,
            config.moduleCollectionId,
            id,
            appwriteSafeModule,
            permissions

        );
        addModuleToMMKV(res)
        return res;

    } catch (error) {
        console.error("❌Error but no Problem", error);
        const tmpID = "tmp-" + uuid.v4()
        console.log(tmpID)
        const newModule = {
            ...appwriteSafeModule,
            $id:tmpID
        }
        addCompleatlyUnsavedModuleToMMKV(newModule as unknown as module)
        addModuleToMMKV(newModule as unknown as module)
        return newModule

    }
}


export async function addImageConfig(imageConfig: documentConfig){
    try {
        const res = await databases.createDocument(
            config.databaseId,
            config.documentCollectionId,
            "unique()",
            imageConfig
        );
        return res;
    } 
    catch (error) {
        console.error("❌Error", error instanceof Error ? error.message : String(error));
    }   
}


