
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
                console.log("Fehler beim Fragen-Generieren:", error);
            }
        }
        
    } catch (error) {
        console.log("Fehler beim Fragen-Generieren:", error);
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
            console.log("Fehler beim Speichern einer Frage:", error);
        }
        }
    console.log("🤦‍♂️Gespeicherte Fragen:...", module?.$id || "MADRE PUTA", savedQuestions);
    const stringifyedQuestions = savedQuestions.map(q => JSON.stringify(q));
    const mergedQuestions = module.questionList.length > 0 ? [...module.questionList, ...stringifyedQuestions] : stringifyedQuestions;
    console.log("Format after parse ", [...module.questionList, ...stringifyedQuestions]);
    const res = await updateModuleQuestionList(module.$id, mergedQuestions);
    console.log("💕😍😘Fragen erfolgreich gespeichert:", res);
    setLoading(false);
    return directQuestions;
}