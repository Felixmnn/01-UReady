
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import { generateQuestionsFromText, questionFromTopic } from './materialToModule';
import { addQUestion } from '@/lib/appwriteEdit';

export async function materialToQuestion(material, sessionID, subjectID, questions, setQuestions, setLoading, module) { 
    setLoading(true);
    let directQuestions = [];
    try {
        for (let i = 0; i < material.length; i++) {
            try {
                let res;
                if (material[i].type == "PEN") {
                    res = await generateQuestionsFromText(material[i].content, "5-10", sessionID, subjectID);
                } else if (material[i].type == "TOPIC") {
                    res = await questionFromTopic(material[i].content, sessionID, subjectID);
                }
                if (typeof res == "object" && Array.isArray(res)) {
                    directQuestions = [...directQuestions, ...res];
                }
            } catch (error) {
                if (__DEV__) {
                console.log("Fehler beim Fragen-Generieren:", error);
                }
            }
        }
        
    } catch (error) {
        if (__DEV__) {
        console.log("Fehler beim Fragen-Generieren:", error);
        }
    }
    let savedQuestions = [];
    for (let i = 0; i < directQuestions.length; i++) {
        try {
            const question = { ...directQuestions[i], subjectID: subjectID };
            const savedQuestion = await addQUestion(question);
            savedQuestions.push({
                id: savedQuestion?.$id || null ,
                status: null,});
        } catch (error) {
            if (__DEV__) {
            console.log("Fehler beim Speichern einer Frage:", error);
            }
        }
        }
    const stringifyedQuestions = savedQuestions.map(q => JSON.stringify(q));
    const mergedQuestions = module.questionList.length > 0 ? [...module.questionList, ...stringifyedQuestions] : stringifyedQuestions;
    const res = await updateModuleQuestionList(module.$id, mergedQuestions);
    setLoading(false);
    return directQuestions;
}