
import { addDocumentJob, addNewModule, addNewModuleWithID } from '@/lib/appwriteAdd';
import { addQUestion, setUserDataSetup } from '@/lib/appwriteEdit';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import { ModuleProps } from '@/types/moduleTypes';
import {router} from 'expo-router';
import { useTranslation } from 'react-i18next';
import uuid from 'react-native-uuid';



export async function materialToModule({
  user, 
  material, 
  newModule, 
  sessions, 
  setSessions, 
  setLoading, 
  reloadNeeded, 
  setReloadNeeded,
  setIsVisibleModal,
  questionOptions
}:{
  user: string,
  material: {type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;}[],
  newModule: ModuleProps,
  sessions: {id: string; tags: string;}[],
  setSessions: React.Dispatch<React.SetStateAction<{id: string; tags: string;}[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  reloadNeeded: string[],
  setReloadNeeded: React.Dispatch<React.SetStateAction<string[]>>,
  setIsVisibleModal?: React.Dispatch<React.SetStateAction<boolean>>,
  questionOptions: {questionsType: "MULTIPLE" | "SINGLE" | "QA",
  amountOfAnswers: 2 | 3 | 4 | 5 | 6
  }


}) {

  setLoading(true);
  let directQuestions : any[] = [];
  const moduleID = uuid.v4();

  try {
    console.log("Starting Step 1")
    // Schritt 1: Fragen erstellen
    directQuestions = await generateQuestions({
      material,   // Materialien sind Objekte mit der Basis für die Generierung
      moduleID: moduleID as string,
      setSessions,
      directQuestions,
      questionOptions
    });
    console.log("Generated Questions:", directQuestions);

    let newModuleData;

    console.log("Starting Step 2")
    // Schritt 2: Modul speichern
    const resMod = await saveModule({
      newModule,
      moduleID: moduleID as string, 
      sessions,
      directQuestions,
      newModuleData
    });

    newModuleData = resMod;
    console.log("Saved Module:", newModuleData);

    let savedQuestions :  any [] = [];

    // Schritt 3: Fragen speichern
    console.log("Starting Step 3")
    await saveQuestions({
      newModuleData,
      directQuestions,
      savedQuestions
    });
    

    console.log("Starting Step 4")
    // Schritt 4: Modul mit Fragen verknüpfen

    if (!newModuleData || !newModuleData.$id) console.log("Fehlecode 1: newModuleData oder newModuleData.$id ist undefined");
    await updateModuleQuestionList(newModuleData.$id, savedQuestions.map((item) => JSON.stringify(item)));
    // Benutzer-Daten aktualisieren
    try {
      if (!user) throw new Error("User ID is undefined");
      const resp = await setUserDataSetup(user);

    } catch (error) {
      if (__DEV__) {
      console.log("Fehler beim Aktualisieren der Benutzerdaten:", error);
      }
    }
  } catch (error) {
    if (__DEV__) {
    console.log("Allgemeiner Fehler:", error);
    }
  } finally {
    setReloadNeeded([...reloadNeeded, "BIBLIOTHEK"]);
    if (setIsVisibleModal) {
      setIsVisibleModal(false);
    }
    setLoading(false);
    router.push("/bibliothek");
  }
}


export async function generateQuestions({
  material,
  moduleID,
  setSessions,
  directQuestions,
  questionOptions
}: {
  material: {
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  }[];
  moduleID: string;
  setSessions: React.Dispatch<React.SetStateAction<{ id: string; tags: string }[]>>;
  directQuestions: any[];
  questionOptions: {questionsType: "MULTIPLE" | "SINGLE" | "QA",
  amountOfAnswers:number};
}) {
  try {
    console.log("Material to process:", material);
    for (let i = 0; i < material.length; i++) {
      try {
        let res;
        if (material[i].type === "PEN") {
          res = await generateQuestionsFromText({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers
          }
            
          );
        } else if (material[i].type === "TOPIC") {
          res = await questionFromTopic({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers
          }
          );
        } else if (material[i].type === "QUESTION") {
          res = await generateQuestionsFromQuestions({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers
          })
        } else {
          res = await createDocumentJob(
            material[i].id ?? "",
            moduleID,
            material[i].sessionID ?? "",
            setSessions
          );
        } 
        // The questions now need to be transformed into the correct format for the app adding ids etc.
        /*
        {
  "sessionID": "${sessionID}",
  "subjectID": "${subjectID}",
  "status": null,
  "tags": [],
  "public": true,
  "aiGenerated": true,
  "question": "Die Frage als String.",
  "questionLatex": "", //Wenn die Materialien elemnte enthält die sich gut für eine Latex Formel eignen oder sich die Frage gut durch eine Latex Formel ergänzen lässt bitte nutzen 
  "questionSVG": "",   // Bitte Leer lassen, da SVGs nicht unterstützt werden
  "questionUrl": "",   // Bitte Leer lassen, da URLs nicht unterstützt werden
  "hint": "",          // Wenn die Frage einen Hinweis benötigt, ansonsten leer lassen
  "explanation": "",   // Wenn die Frage eine Erklärung benötigt, ansonsten leer lassen
  "answers": [
    "{\"title\":\"Antwort A\",\"latex\":\"\",\"image\":null}", //Die Latex Formeln müssen von der React Native Kartex renderbar sein
    "{\"title\":\"Antwort B\",\"latex\":\"\",\"image\":null}",
    "{\"title\":\"Antwort C\",\"latex\":\"\",\"image\":null}",
    "{\"title\":\"Antwort D\",\"latex\":\"\",\"image\":null}"
  ],
  "answerIndex": [X]   // eine oder mehrere korrekte Antworten; Index basiert auf der Position im answers-Array (beginnend bei 0),
  "explaination": "Unter einer Guten Frage versteht man eine Frage die zeigt dass der Beantwortende diese verstanden hat" // Eine kurze Erklärung zur Frage sodass der Nutzer nach dem Quiz versteht warum die Antwort richtig oder falsch ist. Mindestens 2 Sätze lang.

}
        */
        res = res.map((r:any)=> {
          return {
            sessionID: material[i].sessionID,
            subjectID: moduleID,
            status: null,
            tags: [],
            public: true,
            aiGenerated: true,
            question: r.question,
            questionLatex:"",
            questionSVG: "",
            questionUrl: "",
            hint: r.hint ? r.hint : "",
            explanation: r.explanation ? r.explanation : "",
            answers: r.answers.map((a:any)=> JSON.stringify({title: a, latex: "", image: null})),
            answerIndex: r.answerIndex,
        }})
        console.log("Generated questions:", res);

        if (Array.isArray(res)) {
          directQuestions = [...directQuestions, ...res];
          // setQuestions((prev) => [...prev, ...res]);
        }
      } catch (error) {
        console.error("Error processing material:", error);
      }
    }
    return directQuestions;
  } catch (err) {
    console.error("Error in generateQuestions:", err);
    return directQuestions;
  }
}


async function saveModule({
  newModule,
  moduleID,
  sessions,
  directQuestions,
  newModuleData
}:{
  newModule: ModuleProps, 
  moduleID: string,
  sessions: {id: string; tags: string;}[],
  directQuestions : any[],
  newModuleData: any

}) {
   try {
      newModuleData = await addNewModuleWithID({
        ...newModule,
        color: typeof newModule.color == "string" ? newModule.color.toUpperCase() : "BLUE",
        questions: directQuestions.length,
        sessions: sessions.map((item) => JSON.stringify(item)),
      },moduleID);
      return newModuleData;
    } catch (error) {
      if (__DEV__) {
      console.log("Fehler beim Speichern des Moduls:", error);
    }    
  }
}

async function saveQuestions({
  newModuleData,
  directQuestions,
  savedQuestions
}:{
  newModuleData: any,
  directQuestions : any[],
  savedQuestions: any[]
}) {
    // Schritt 3: Fragen speichern
    if (newModuleData && newModuleData.$id) {
      for (let i = 0; i < directQuestions.length; i++) {
        try { 
          const question = { ...directQuestions[i], subjectID: newModuleData.$id };
          const savedQuestion = await addQUestion(question);
          savedQuestions.push({ 
            id: savedQuestion && typeof savedQuestion.$id == "string" ? savedQuestion.$id : uuid.v4(),
            status: null
          })
        }
        catch (error) {
          if (__DEV__) {
          console.log("Fehler beim Speichern einer Frage:", error);
          }
        }
      }
    }
}





















export async function createDocumentJob(databucketID:string, moduleID:string, sessionID:string, setSessions: React.Dispatch<React.SetStateAction<{ id: string; tags: string; }[]>>) {
    const job = {
        databucketID: databucketID,
        subjectID: moduleID,
        sessionID: sessionID,
    }
    const res = await addDocumentJob(job)
    setSessions((prevSessions) => {
        const newSessions = [...prevSessions];
        const sessionIndex = newSessions.findIndex((session) => session.id === sessionID);
        if (sessionIndex !== -1) {
            newSessions[sessionIndex].tags = "JOB-PENDING";
        }
        return newSessions;
    })
}


export async function generateQuestionsFromText ({
  text,
  questionsType,
  amountOfAnswers
  
}:{
    text: string,
    questionsType: "MULTIPLE" | "SINGLE" | "QA",
    amountOfAnswers: number
}) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Erstelle basierend auf den folgenden Themen jeweils zwischen 3 und 10 Fragen: ${text}.  
        Jede Frage muss für sich allein stehen und darf nicht vom Kontext anderen Fragen oder eines externen Textes abhängen.
        Der Nutuzer soll die Fragen isoliert beantworten können, ohne den Kontext anderer Fragen oder Materialien die nicht in der Frage enthalten sind, zu benötigen.
        WICHTIG: Keine Fragen mit externen Materialien oder Texten, die nicht in der Frage enthalten sind. !

        Die Ausgabe soll ausschließlich ein gültiges, parsebares JSON-Array von Objekten sein.  

        Jede Frage muss folgende Struktur haben (bitte exakt einhalten):
        {
          "question": "Die Frage als String.",
          "hint": "",          // Wenn die Frage einen Hinweis benötigt, ansonsten leer lassen
          "explanation": "",   // Wenn die Frage eine Erklärung benötigt, ansonsten leer lassen
          "answers": [
            "",...
          ],
          "answerIndex": [X]   // eine oder mehrere korrekte Antworten; Index basiert auf der Position im answers-Array (beginnend bei 0),
        }

        Wichtige Regeln:
        - Die Anzahl der Antwortoptionen soll immer ${questionsType == "QA" ? 1 : amountOfAnswers} sein nicht mehr und nicht weniger.
        ${questionsType === "MULTIPLE" ? 
          "- Es handelt sich um Multiple-Choice Fragen, es können also mehrere Antworten korrekt sein." : 
          questionsType === "SINGLE" ? "- Es handelt sich um Single-Choice Fragen, es ist also nur eine Antwort korrekt." : 
          "- Es handelt sich um eine offene Frage bei der der Nutzer erst selbst Antworten muss und dann die korrekte Antwort angezeigt bekommt. Es soll also nur eine Antwort geben."}
        - Die Anzahl der korrekten Antworten (answerIndex) muss mindestens 1 betragen.
        - Der index der korrekten Antwort sollte zufällig sein und nicht immer 0 sein.
        - Jede Antwortoption muss ein gültiger, stringifizierter JSON-String sein.
        - Gib keine zusätzliche Erklärung oder Einleitung außerhalb des JSON zurück – nur das

                `}],
            });
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`); 
      }
      const data = await res.json();
      const text = data.choices[0].message.content.trim()
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        const parsedData = JSON.parse(jsonString);
        
        return parsedData
      }
      

    } catch (error) {
      console.error('Error fetching OpenAI API:', error);
      const response = ('Es gab einen Fehler bei der Anfrage!');
    }
  };


export async function generateQuestionsFromQuestions ({
  text,
  questionsType,
  amountOfAnswers
  
}:{
    text: string,
    questionsType: "MULTIPLE" | "SINGLE" | "QA",
    amountOfAnswers: number
}) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Du erhälts Fragen über einen User Input. Wandle diese Fragen in das gewünschte Format um versuche dabei nah an der ursprünglichen Frage zu bleiben.: ${text}.  
        Wenn der Nutzer bereits Antworten gegeben hat, übernehme diese. Wenn nicht, generiere passende Antworten.
        Jede Frage muss für sich allein stehen und darf nicht vom Kontext anderen Fragen oder eines externen Textes abhängen.
        WICHTIG: Keine Fragen mit externen Materialien oder Texten, die nicht in der Frage enthalten sind. !

        Die Ausgabe soll ausschließlich ein gültiges, parsebares JSON-Array von Objekten sein.  

        Jede Frage muss folgende Struktur haben (bitte exakt einhalten):
        {
          "question": "Die Frage als String.",
          "hint": "",          // Wenn die Frage einen Hinweis benötigt, ansonsten leer lassen
          "explanation": "",   // Wenn die Frage eine Erklärung benötigt, ansonsten leer lassen
          "answers": [
            "",...
          ],
          "answerIndex": [X]   // eine oder mehrere korrekte Antworten; Index basiert auf der Position im answers-Array (beginnend bei 0),
        }

        Wichtige Regeln:
        - Die Anzahl der Antwortoptionen soll immer ${questionsType == "QA" ? 1 : amountOfAnswers} sein nicht mehr und nicht weniger.
        ${questionsType === "MULTIPLE" ? 
          "- Es handelt sich um Multiple-Choice Fragen, es können also mehrere Antworten korrekt sein." : 
          questionsType === "SINGLE" ? "- Es handelt sich um Single-Choice Fragen, es ist also nur eine Antwort korrekt." : 
          "- Es handelt sich um eine offene Frage bei der der Nutzer erst selbst Antworten muss und dann die korrekte Antwort angezeigt bekommt. Es soll also nur eine Antwort geben."}
        -Wenn der Nutzer Anworten vorgeben hat halte dich an die Anzl der Antworten unabhängig von amountOfAnswers.
          - Die Anzahl der korrekten Antworten (answerIndex) muss mindestens 1 betragen.
        - Jede Antwortoption muss ein gültiger, stringifizierter JSON-String sein.
        - Gib keine zusätzliche Erklärung oder Einleitung außerhalb des JSON zurück – nur das

                `}],
            });
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`); 
      }
      const data = await res.json();
      const text = data.choices[0].message.content.trim()
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        const parsedData = JSON.parse(jsonString);
        
        return parsedData
      }
      

    } catch (error) {
      console.error('Error fetching OpenAI API:', error);
      const response = ('Es gab einen Fehler bei der Anfrage!');
    }
  };

  export async function questionFromTopic ({
  text,
  questionsType,
  amountOfAnswers
  
}:{
    text: string,
    questionsType: "MULTIPLE" | "SINGLE" | "QA",
    amountOfAnswers: number
}) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Erstelle basierend auf dem dir im folgenden Text geben Informationen zwischen 3 und 10 Fragen: ${text}.  
        Diese Fragen sollen möglichst alle wichtigen Aspekte des Textes abdecken.
        Jede Frage muss für sich allein stehen und darf nicht vom Kontext anderen Fragen oder eines externen Textes abhängen.
        Der Nutuzer soll die Fragen isoliert beantworten können, ohne den Kontext anderer Fragen oder Materialien die nicht in der Frage enthalten sind, zu benötigen.
        WICHTIG: Keine Fragen mit externen Materialien oder Texten, die nicht in der Frage enthalten sind. !

        Die Ausgabe soll ausschließlich ein gültiges, parsebares JSON-Array von Objekten sein.  

        Jede Frage muss folgende Struktur haben (bitte exakt einhalten):
        {
          "question": "Die Frage als String.",
          "hint": "",          // Wenn die Frage einen Hinweis benötigt, ansonsten leer lassen
          "explanation": "",   // Wenn die Frage eine Erklärung benötigt, ansonsten leer lassen
          "answers": [
            "",...
          ],
          "answerIndex": [X]   // eine oder mehrere korrekte Antworten; Index basiert auf der Position im answers-Array (beginnend bei 0),
        }

        Wichtige Regeln:
        - Die Anzahl der Antwortoptionen soll immer ${questionsType == "QA" ? 1 : amountOfAnswers} sein nicht mehr und nicht weniger.
        ${questionsType === "MULTIPLE" ? 
          "- Es handelt sich um Multiple-Choice Fragen, es können also mehrere Antworten korrekt sein." : 
          questionsType === "SINGLE" ? "- Es handelt sich um Single-Choice Fragen, es ist also nur eine Antwort korrekt." : 
          "- Es handelt sich um eine offene Frage bei der der Nutzer erst selbst Antworten muss und dann die korrekte Antwort angezeigt bekommt. Es soll also nur eine Antwort geben."}
        - Die Anzahl der korrekten Antworten (answerIndex) muss mindestens 1 betragen.
        - Der index der korrekten Antwort sollte zufällig sein und nicht immer 0 sein.
        - Jede Antwortoption muss ein gültiger, stringifizierter JSON-String sein.
        - Gib keine zusätzliche Erklärung oder Einleitung außerhalb des JSON zurück – nur das

        `}],
    });
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (!res.ok) {
        throw new Error(`Fehler: ${res.status}`); 
      }
      const data = await res.json();
      const text = data.choices[0].message.content.trim()
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = text.substring(startIndex, endIndex + 1);
        const parsedData = JSON.parse(jsonString);
        return parsedData
      }
      

    } catch (error) {
      console.error('Error fetching OpenAI API:', error);
      const response = ('Es gab einen Fehler bei der Anfrage!');
    }
  };
