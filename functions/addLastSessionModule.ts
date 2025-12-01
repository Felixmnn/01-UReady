import { updateModule } from "@/lib/appwriteEdit";
import { module, UserUsage } from "@/types/appwriteTypes";
import { t } from "i18next";

type LastSession = {
    sessionID: string,
    quizType: "infinite" | "limited" | "limitedTime" | "limitedAllCorrect",
    questionType: "single" | "multiple" | "questionAnswer",
    questionAmount: number | null,
    timeLimit: number | null,
    moduleID: string,
    name: string,
    percent: number,
    color: string,
    icon: string,
    questions: number,
}
type LastModule = {
    name:string,
    percent: number,
    color: string | null,
    fragen: number,
    sessions: number,
    sessionID: string,
}



export function returnNewUserUsage(oldUsage: UserUsage, newSession: LastSession): UserUsage {  
    const oldLastSessions = oldUsage.lastSessions || [];
    const oldLastSessionsParsed: LastSession[] = oldLastSessions.map((session: string) => JSON.parse(session));
    const filteredLastSessions = oldLastSessionsParsed.filter((ls:LastSession) => ls.sessionID !== newSession.sessionID);
    const updatedLastSessions = [newSession, ...filteredLastSessions].slice(0, 10); // Nur die letzten 5 Sessions behalten    
    const updatedLastSessionsStringified = updatedLastSessions.map((session: LastSession) => JSON.stringify(session));
    return {
        ...oldUsage,
        lastSessions: updatedLastSessionsStringified,
    };
}


export function returnNewLastModule(oldLastModules: string[], newModule: LastModule): string[] {
    const oldLastModulesParsed: LastModule[] = oldLastModules.map((module: any) => JSON.parse( module));
    console.log("Old Last Modules Parsed:", oldLastModulesParsed);
    const filteredLastModules = oldLastModulesParsed.filter((lm:LastModule) => lm.sessionID !== newModule.sessionID);
    const updatedLastModules = [newModule, ...filteredLastModules].slice(0, 10); // Nur die letzten 5 Modules behalten
    const returnUpdatedLastModules = updatedLastModules.map((module: LastModule) => JSON.stringify(module));
    return returnUpdatedLastModules;
}
