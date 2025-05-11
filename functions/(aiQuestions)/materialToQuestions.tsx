
import { generateQuestionsFromText, questionFromTopic } from './materialToModule';
import { addQUestion } from '@/lib/appwriteEdit';

export async function materialToQuestion(material, sessionID, subjectID, questions, setQuestions, setLoading)  {
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
    for (let i = 0; i < directQuestions.length; i++) {
        try {
            const question = { ...directQuestions[i], subjectID: subjectID };
            const savedQuestion = await addQUestion(question);
        } catch (error) {
            console.log("Fehler beim Speichern einer Frage:", error);
        }
        }
    
    setLoading(false);
    return directQuestions;
}