import { compareModules } from '@/functions/checkDataIntegrity';
import { databases,config } from './appwrite';
import { loadModule, loadUserUsage } from './appwriteDaten';
import { addUnsavedModuleToMMKV, getSessionFromMMKV, saveUserUsageToMMKV, updateModuleInMMKV, updateModuleQuestionListInMMKV } from './mmkvFunctions';
import { AppwriteModule, AppwriteUserData, AppwriteUserUsage, module, question, userData, UserUsage } from '@/types/appwriteTypes';
import { Session } from '@/types/moduleTypes';

export async function updateUserData (id:string, data:Partial<userData>) {
    try {
        const res = await databases.updateDocument<AppwriteUserData>(
            config.databaseId,
            config.userDataCollectionId,
            id,
            data
        )
        return res;
    } catch (error) {
        if (__DEV__) {
        console.error("❌Error while updating User Data updateUserData()", error instanceof Error ? error.message : String(error));
        }
    }
        
}

export async function updateModuleData (id:string, data:AppwriteModule) {
    try {
        if (!data || !id) return;
        const currentSate = await loadModule(id)

        if (!currentSate) return updateModuleInMMKV(data);
        const mergedLocalState = {
            ...currentSate,
            ...data
        };
        const comparedModule = compareModules(mergedLocalState, currentSate);
        if (!comparedModule) return;
        const res = await databases.updateDocument<AppwriteModule>(
            config.databaseId,
            config.moduleCollectionId,
            id,
            comparedModule
        )
        updateModuleInMMKV(res)
        return res;
    } catch (error) {
        if (__DEV__) {
        console.error("❌Error while updating Module compleatly ", error instanceof Error ? error.message : String(error));
        }
    }
        
}

    export async function updateModuleQuestionList (id:string, data:string[], onlyLocal = false) {
    try {
        if (onlyLocal) {
            updateModuleQuestionListInMMKV(id, data);
            return true;
        }
        const currentState = await loadModule(id)
        const mergedQuestionList = [
            ...currentState?.questionList || [],
            ...data
        ];
        const mergedNoDuplicates = mergedQuestionList.filter((item, index) => {
            return mergedQuestionList.indexOf(item) === index;
        });
        const res = await databases.updateDocument<AppwriteModule>(
            config.databaseId,
            config.moduleCollectionId,
            id,
            {
                questionList: data.map((q)=> {if (typeof q === 'string') {return q} else {return JSON.stringify(q)}})
            }
        )
        updateModuleQuestionListInMMKV(id, mergedNoDuplicates);
        return true;
    } catch (error) {
        if (__DEV__) {
        console.log("❌Error while updating Module Data", error instanceof Error ? error.message : String(error));
        }
        updateModuleQuestionListInMMKV(id, data);        
        addUnsavedModuleToMMKV({
            moduleID: id,
            items: data as any[]
        });

        return true;
    }
        
}

export async function updateUserUsageData (data:AppwriteUserUsage):Promise<AppwriteUserUsage | void> {
   
    try {
        const res = await databases.updateDocument<AppwriteUserUsage>(
            config.databaseId,
            config.userUsageCollectionId,
            data.$id,
            data
        )
        return res;
    } catch (error) {
        saveUserUsageToMMKV(data)
        if (__DEV__) {
        console.log("❌Error while updating User Data uodateUserUsageData()", error instanceof Error ? error.message : String(error));
        }
    }
        
}

export async function updateUserUsageSessions(id: string, newSession: any): Promise<any | void> {
    try {
        const oldUserUsage = await loadUserUsage(id);
        if (!oldUserUsage) return;
        const parsedOldSessions = oldUserUsage.lastSessions?.map((session) => (
            JSON.parse(session)
        ))
        const noDublicates = parsedOldSessions.filter((session) => session.sessionID !== newSession.id);
        const updatedSessions = [
            newSession,
            ...noDublicates
        ]
        const parsedSessions = updatedSessions.map((session) => (
            JSON.stringify(session)
        ))
        const res = await databases.updateDocument<AppwriteUserUsage>(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastSessions: parsedSessions
            }
        )
      return res;
    } catch (error) {
        if (__DEV__) {
      console.error("❌ Fehler beim Update der User-Daten:", error instanceof Error ? error.message : String(error));
        }
    }
  }
  

  export async function updateUserUsageModules(id:string, newModule: AppwriteModule): Promise<void> {
    try {
        const oldUserUsage = await loadUserUsage(id);
        if (!oldUserUsage) return;
        const lastModules = oldUserUsage.lastModules?.map((module) => (
            JSON.parse(module)
        ))
        const noDublicates = lastModules.filter((module) => module.sessionID !== newModule.sessionID);
        const updatedModules = [
            newModule,
            ...noDublicates
        ]
        const parsedModules = updatedModules.map((module) => (
            JSON.stringify(module)
        ))
        const res = await databases.updateDocument<AppwriteUserUsage>(
            config.databaseId,
            config.userUsageCollectionId,
            id,
            {
                lastModules: parsedModules
            }
        )

      
    } catch (error) {
        if (__DEV__) {
      console.error("❌ Error while updating User Data updateUserUsageModules()", error instanceof Error ? error.message : String(error));
        }
    }
  }
