import { updateModuleQuestionList } from "@/lib/appwriteUpdate";
import {
  generateQuestionsFromText,
  questionFromTopic,
} from "./materialToModule";
import { addQUestion } from "@/lib/appwriteEdit";

interface MaterialItem {
  type: "PEN" | "TOPIC";
  content: string;
}

interface Module {
  $id: string;
  questionList: string[];
}

interface SavedQuestion {
  id: string | null;
  status: any;
}

export async function materialToQuestion(
  material: MaterialItem[],
  sessionID: string,
  subjectID: string,
  questions: any[],
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  module: Module
): Promise<any[]> {
  setLoading(true);
  let directQuestions: any[] = [];
  try {
    for (let i = 0; i < material.length; i++) {
      try {
        let res: any;
        if (material[i].type == "PEN") {
          res = await generateQuestionsFromText({
            text: material[i].content,
            questionsType: "SINGLE", // or "MULTIPLE" or "QA" as needed
            amountOfAnswers: 5, // or any number you want between 3 and 10
          });
        } else if (material[i].type == "TOPIC") {
          res = await questionFromTopic({
            text: material[i].content,
            questionsType: "SINGLE", // or "MULTIPLE" or "QA" as needed
            amountOfAnswers: 5, // or any number you want between 3 and 10
          });
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
  let savedQuestions: SavedQuestion[] = [];
  for (let i = 0; i < directQuestions.length; i++) {
    try {
      const question = { ...directQuestions[i], subjectID: subjectID };
      const savedQuestion: any = await addQUestion(question);
      savedQuestions.push({
        id: savedQuestion?.$id || null,
        status: null,
      });
    } catch (error) {
      if (__DEV__) {
        console.log("Fehler beim Speichern einer Frage:", error);
      }
    }
  }
  const stringifyedQuestions: string[] = savedQuestions.map((q) =>
    JSON.stringify(q)
  );
  const mergedQuestions: string[] =
    module.questionList.length > 0
      ? [...module.questionList, ...stringifyedQuestions]
      : stringifyedQuestions;
  await updateModuleQuestionList(module.$id, mergedQuestions);
  setLoading(false);
  return directQuestions;
}
