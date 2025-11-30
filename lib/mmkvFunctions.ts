import { Module } from "i18next";
import { storage } from "./mmkv";
import { note, question, userData, userDataKathegory, UserUsage } from "@/types/appwriteTypes";
import { ModuleProps } from "@/types/moduleTypes";
import { uuid } from "expo-modules-core";

/**
 * What will be stored in MMKV
 - Modules      | user.modules
 - Questions    | user.questions.<moduleID>
 - Notes        | user.notes.<moduleID>
 - UserUsage    | user.usage
 */


/**
 * This function recives modules as an array of objects and saves them to MMKV storage.
 */
export function saveModulesToMMKV(modules: ModuleProps[]) {
    const modulesString = JSON.stringify(modules);
    storage.set('user.modules', modulesString);
}

/**
 * This function retrieves modules from MMKV storage and returns them as an array of objects.
 */
export function getModulesFromMMKV(): ModuleProps[] | [] {
    const modulesString = storage.getString('user.modules');
    return modulesString ? JSON.parse(modulesString) : [];
}

/**
 * This function returns a specific module from MMKV storage by its ID.
 */
export function getModuleFromMMKV(moduleID: string): ModuleProps | null {
    const allModules = getModulesFromMMKV();
    const module = allModules.find(m => m.$id === moduleID);
    return module || null;
}

/**
 * This function updates a specific module in MMKV storage.
 */
export function updateModuleInMMKV(updatedModule: ModuleProps) {
    const allModules = getModulesFromMMKV();
    const moduleIndex = allModules.findIndex(m => m.$id === updatedModule.$id);
    if (moduleIndex !== -1) {
        allModules[moduleIndex] = updatedModule;
        saveModulesToMMKV(allModules);
    } 
}

/**
 * Function to add a single Module
 */
export function addModuleToMMKV(newModule: ModuleProps) {
    const oldModules = getModulesFromMMKV()
    const newModules = [...oldModules, newModule]
    saveModulesToMMKV(newModules)
    console.log("Sucessfully added Module")
}
/**
 * This function updates the question list of a specific module in MMKV storage.
 */
export function updateModuleQuestionListInMMKV(moduleID: string, questionList: string[]) {
    const allModules = getModulesFromMMKV();
    const moduleIndex = allModules.findIndex(m => m.$id === moduleID);
    if (moduleIndex !== -1) {
        allModules[moduleIndex].questionList = questionList;
        saveModulesToMMKV(allModules);
    }
}



/**
 * This function saves questions for a specific module to MMKV storage.
 */
export function saveQuestionsToMMKV(moduleID: string, questions: question[]) {
    const questionsString = JSON.stringify(questions);
    storage.set(`user.questions.${moduleID}`, questionsString);
}

/**
 * This function adds or creates questions for a specific module to MMKV storage.
 */
export function addQuestionsToMMKV(moduleID: string, questions: question[]) {
    console.log("Adding question to MMKV")
    const existingQuestionsString = storage.getString(`user.questions.${moduleID}`);
    console.log("Debug 1")
    let existingQuestions: question[] = existingQuestionsString ? JSON.parse(existingQuestionsString) : [];
    console.log("Debug 2")
    const combinedQuestions = [...existingQuestions, ...questions];
    console.log("Debug 3")
    const combinedQuestionsString = JSON.stringify(combinedQuestions);
    console.log("Debug 4")
    storage.set(`user.questions.${moduleID}`, combinedQuestionsString);
    console.log("Successfully added question to MMKV")
}

/**
 * This function adds a single question to MMKV storage.
 */
export function addQuestionToMMKV(moduleID: string, question: question) {
    console.log("Adding single question to MMKV")
    const existingQuestionsString = storage.getString(`user.questions.${moduleID}`);    
    let existingQuestions: question[] = existingQuestionsString ? JSON.parse(existingQuestionsString) : [];
    existingQuestions.push(question);
    const updatedQuestionsString = JSON.stringify(existingQuestions);
    storage.set(`user.questions.${moduleID}`, updatedQuestionsString);
    console.log("Successfully added single question to MMKV")
}

/**
 * This function updates a specific question for a module in MMKV storage.
 */
export function updateQuestionInMMKV(moduleID: string, updatedQuestion: question) {
    const existingQuestionsString = storage.getString(`user.questions.${moduleID}`);
    if (existingQuestionsString) {
        let existingQuestions: question[] = JSON.parse(existingQuestionsString);
        const questionIndex = existingQuestions.findIndex(q => q.$id === updatedQuestion.$id);
        if (questionIndex !== -1) {
            existingQuestions[questionIndex] = updatedQuestion;
            const updatedQuestionsString = JSON.stringify(existingQuestions);
            storage.set(`user.questions.${moduleID}`, updatedQuestionsString);
        }
    }
}

/**
 * This function retrieves questions for a specific module from MMKV storage.
 */
export function getQuestionsFromMMKV(moduleID: string): question[] | [] {
    const questionsString = storage.getString(`user.questions.${moduleID}`);
    return questionsString ? JSON.parse(questionsString) : [];
}

/**
 * This function saves a unsaved question to MMKV storage.
 * All unsaved questions will be stored under 'user.unsavedQuestions'
 */
export function addUnsavedQuestionToMMKV(question: question) {
    const unsavedQuestionsString = storage.getString('user.unsavedQuestions');
    let unsavedQuestions: question[] = unsavedQuestionsString ? JSON.parse(unsavedQuestionsString) : [];
    unsavedQuestions.push(question);
    const updatedUnsavedQuestionsString = JSON.stringify(unsavedQuestions);
    storage.set('user.unsavedQuestions', updatedUnsavedQuestionsString);
    console.log("Added unsaved question to MMKV");
}

/**
 * This function updates a unsaved question in MMKV storage.
 */
export function updateUnsavedQuestionInMMKV(updatedQuestion: question) {
    const unsavedQuestionsString = storage.getString('user.unsavedQuestions');
    if (unsavedQuestionsString) {
        let unsavedQuestions: question[] = JSON.parse(unsavedQuestionsString);
        const questionIndex = unsavedQuestions.findIndex(q => q.$id === updatedQuestion.$id);
        if (questionIndex !== -1) {
            unsavedQuestions[questionIndex] = updatedQuestion;
            const updatedUnsavedQuestionsString = JSON.stringify(unsavedQuestions);
            storage.set('user.unsavedQuestions', updatedUnsavedQuestionsString);
        }
    }
    console.log("Updated unsaved question in MMKV");
}

/**
 * This function retrieves unsaved questions from MMKV storage.
 */
export function getUnsavedQuestionsFromMMKV(): question[] | [] {
    const unsavedQuestionsString = storage.getString('user.unsavedQuestions');
    return unsavedQuestionsString ? JSON.parse(unsavedQuestionsString) : [];
}
/**
 * This function removes all unsaved questions from MMKV storage.
 */
export function resetUnsavedQuestionsInMMKV() {
    storage.remove('user.unsavedQuestions');
    console.log("Reset unsaved questions in MMKV");
}

/**
 * This function saves notes for a specific module to MMKV storage.
 */
export function saveNotesToMMKV(sessionID: string, notes: note[]) {
    const notesString = JSON.stringify(notes);
    storage.set(`user.notes.${sessionID}`, notesString);
}
/**
 * This function retrieves notes for a specific module from MMKV storage.
 */
export function getNotesFromMMKV(sessionID: string): note[] | [] {
    const notesString = storage.getString(`user.notes.${sessionID}`);
    return notesString ? JSON.parse(notesString) : [];
}

/**
 * This function saves a Unsaved Note
 */
export function addUnsavedNote(note:note) : note{
    
    const tempNoteId = "tmp-" + uuid.v4()
    const unsavedNotes = getUnsavedNotes()
    const newNote = {
        ...note,
        $id:tempNoteId
    }
    const newUnsavedNotes = [...unsavedNotes, newNote]
    storage.set("user.unsavedNotes", JSON.stringify(newUnsavedNotes))
    saveNoteToMMKV(note.sessionID,newNote)
    return newNote
}

/**
 * This function updates a Unsaved Note
 */
export function updateUnsavedNote(note:note){
    const unsavedNotes = getUnsavedNotes()
    const newUnsavedNotes = unsavedNotes.map(n => {
        if (n.$id == note.$id){
            return note
        } else {
            return n
        }
    })
    storage.set("user.unsavedNotes", JSON.stringify(newUnsavedNotes))

}

/**
 * This function gets the Unsaved Notes
 */
export function getUnsavedNotes(): note[] | [] {
    const unsavedNotes = storage.getString("user.unsavedNotes");
    return unsavedNotes ? JSON.parse(unsavedNotes) : []
}

/**
 * Function that saves single Note
 */
export function saveNoteToMMKV(sessionID: string, note: note) {
    const oldList = getNotesFromMMKV(sessionID);
    let newList = [];

    if (!oldList || oldList.length === 0) {
        newList = [note];
    } else {
        const oldListFiltered = oldList.filter(n => n.$id !== note.$id);
        newList = [...oldListFiltered, note];
    }
    const newListString = JSON.stringify(newList);
    storage.set(`user.notes.${sessionID}`, newListString);
    console.log("Successfully saved Note")
}

/**
 * Removes Note from MMKV
 */
export function deleteNoteFromMMKV(sessionID: string, noteID: string) {
    const oldList = getNotesFromMMKV(sessionID);

    if (!oldList || oldList.length === 0) {
        console.log("No notes found for the given sessionID.");
        return;
    }

    const newList = oldList.filter(note => note.$id !== noteID);

    const newListString = JSON.stringify(newList);
    storage.set(`user.notes.${sessionID}`, newListString);

    console.log(`Successfully deleted note with ID: ${noteID}`);
}



/**
 * This function saves user usage data to MMKV storage.
 */
export function saveUserUsageToMMKV(usage: UserUsage) {
    const usageString = JSON.stringify(usage);
    storage.set('user.usage', usageString);
}
/**
 * This function retrieves user usage data from MMKV storage.
 */ 
export function getUserUsageFromMMKV(): UserUsage | null {
    const usageString = storage.getString('user.usage');
    return usageString ? JSON.parse(usageString) : null;
}

/**
 * This function ensures offine userUsage updates work
 */

export function saveUsavedUserUsageToMMKV(usage: UserUsage){
    const usageString = JSON.stringify(usage);
    storage.set('user.usavedUsage', usageString);
} 

/**
 * This function retrieves unsaved user usage data from MMKV storage.
 */
export function getUsavedUserUsageFromMMKV(): UserUsage | null {
    const usageString = storage.getString('user.usavedUsage');
    return usageString ? JSON.parse(usageString) : null;
}

/**
 *
 */
export function resetUsavedUserUsageInMMKV() {
    storage.remove('user.usavedUsage');
}

/**
 * This function adds a module to the list of unsaved modules in MMKV storage.
 */
type unsavedItem = {
    moduleID: string;
    items: { id:string, status: string | null }[];
}

export function addUnsavedModuleToMMKV(unsavedItem: unsavedItem) {
    let unsavedModules: unsavedItem[] = getUnsavedModulesFromMMKV();
    if (unsavedModules.length == 0) {
        unsavedModules = [unsavedItem]
    } else if (unsavedModules.some(um => um.moduleID === unsavedItem.moduleID)) {
        unsavedModules = unsavedModules.map(um => {
            if (um.moduleID === unsavedItem.moduleID) {
                return unsavedItem;
            }
            return um;
        });
    } else {
        unsavedModules.push(unsavedItem);
    }
    const unsavedModulesString = JSON.stringify(unsavedModules);
    storage.set('user.usavedModules', unsavedModulesString);
}

/**
 * This function retrieves unsaved modules from MMKV storage.
 */
export function getUnsavedModulesFromMMKV(): unsavedItem[] {
    const unsavedModulesString = storage.getString('user.usavedModules');
    return unsavedModulesString ? JSON.parse(unsavedModulesString) : [];
}

/**
 * Reset Unsaved Modules in MMKV storage.
 */
export function resetUnsavedModulesInMMKV() {
    storage.remove('user.usavedModules');
}


/**
 * Function to saveThe userKategorie to MMKV
 */
export function saveUserKategorieToMMKV(userDataKategorie: userDataKathegory) {
    const userDataKategorieString = JSON.stringify(userDataKategorie);
    storage.set('user.userDataKategorie', userDataKategorieString);
}

/**
 * Function to get The userKategorie from MMKV
 */
export function getUserKategorieFromMMKV(): userDataKathegory | null {
    const userDataKategorieString = storage.getString('user.userDataKategorie');
    return userDataKategorieString ? JSON.parse(userDataKategorieString) : null;
}

/**
 * Function to save a newModule in MMKV
 */
export function addCompleatlyUnsavedModuleToMMKV(module: ModuleProps) {
    try{
    const oldUnsavedModules = getCompleatlyUnsavedModulesFromMMKV();
    const newUnsavedModules = [...oldUnsavedModules, module];
    storage.set("user.unsavedModules", JSON.stringify(newUnsavedModules));

    } catch (e) {
        console.log("Compleatly invalid error ngl", e)
    }
    
}

/**
 * Function to update compleatly unnsaved Modules
 */
export function updateCompleatlyUnsavedModuleMMKV(module:ModuleProps){
    const oldUnsavedModules = getCompleatlyUnsavedModulesFromMMKV();
    const newUnsavedModules = oldUnsavedModules.map(m=> {
        if (m.$id == module.$id){
            return module;
        } else {
            return m;
        }
    })
    storage.set("user.unsavedModules", JSON.stringify(newUnsavedModules));
}

/**
 * Function to get the unsaved modules from MMKV
 */
export function getCompleatlyUnsavedModulesFromMMKV():ModuleProps[] | []{
    const unsavedModules = storage.getString('user.unsavedModules')
    return unsavedModules ? JSON.parse(unsavedModules) : [];

}
 

/**
 * Function to save a appwrite session
 */

export function setSessionInMMKV(session:any){
    storage.set("user.session", JSON.stringify(session))
    console.log("Successfully saved session to MMKV")
}

/**
 * Function to get a appwrite session
 */

export function getSessionFromMMKV():any | null{
    const session = storage.getString("user.session");
    return session ? JSON.parse(session) : null
}

/**
 * Function to set the user Data Config
 */
export function setUserDataConfigInMMKV(userDataConfig:any){
    storage.set("user.userDataConfig", JSON.stringify(userDataConfig));
}

/**
 * Function to get the User Data Config
 */

export function getUserDataConfigFromMMKV() :any | null {
    const userDataConfig = storage.getString("user.userDataConfig")
    return userDataConfig ? JSON.parse(userDataConfig) : null
}