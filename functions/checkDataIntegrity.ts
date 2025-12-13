import { module } from "@/types/appwriteTypes";

/**
 * !!not all attributes are compared yet!!
 * This function compares two modules and returns the one with more complete data
 * Module A is the local module
 * Module B is the remote module
 */
export function compareModules(loaclModule:module, remoteModule:module):module | null {
    // First the Question List
    console.log("🔴Comparing Modules:", loaclModule.questionList,"🟦", remoteModule.questionList);
    const localQuestionList = loaclModule.questionList.map((q)=> JSON.parse(q));
    const remoteQuestionList = remoteModule.questionList.map((q)=> JSON.parse(q));

    const filteredRemoteList = remoteQuestionList.filter((q:{id:string, status:any})=> {
        return !localQuestionList.find((lq)=> lq.id === q.id)
    });
    //The remaining Questions should be the new ones
    const mergedQuestionList = [...localQuestionList, ...filteredRemoteList];
    const removedDuplicates = mergedQuestionList.filter((q, index, self) =>
        index === self.findIndex((t) => (
            t.id === q.id
        ))
    );
    const mergedListStringified = removedDuplicates.map((q)=> JSON.stringify(q));

    // Now the Session Lists are compared
    const localSessionList = loaclModule.sessions.map((s)=> JSON.parse(s));
    const remoteSessionList = remoteModule.sessions.map((s)=> JSON.parse(s));

    const updatedSessionState = localSessionList.map((ls)=> {
        const matchingRemote = remoteSessionList.find((rs)=> rs.id === ls.id);
        if(matchingRemote){

            return {
                ...ls,
                ...matchingRemote
            }
        }
        return ls;
    });

    const filteredRemoteSessionList = remoteSessionList.filter((s:{id:string, status:any})=> {
        return !localSessionList.find((ls)=> ls.id === s.id)
    });

    const mergedSessionList = [...updatedSessionState, ...filteredRemoteSessionList];
    const mergedSessionListStringified = mergedSessionList.map((s)=> JSON.stringify(s));



    
    
    return {
        ...loaclModule,
        questionList: mergedListStringified,
        sessions: mergedSessionListStringified,
        questions: mergedListStringified.length
    }  
}