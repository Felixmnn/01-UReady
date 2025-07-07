
import { addDocumentJob, addNewModule, addNewModuleWithID } from '@/lib/appwriteAdd';
import { addQUestion, setUserDataSetup } from '@/lib/appwriteEdit';
import { updateModuleQuestionList } from '@/lib/appwriteUpdate';
import {router} from 'expo-router';
import uuid from 'react-native-uuid';
import { create } from 'react-test-renderer';



export async function materialToModule(user, material, userData, newModule, setNewModule, questions, setQuestions, sessions, setSessions, setLoading, reloadNeeded, setReloadNeeded,setIsVisibleModal) {
  setLoading(true);
  let directQuestions = [];
  let questionConfig = [];
  const moduleID = uuid.v4();

  try {
    for (let i = 0; i < material.length; i++) {
      try {
        let res;
        if (material[i].type == "PEN") {
          res = await generateQuestionsFromText(material[i].content, "5-10", material[i].sessionID, "PLACEHOLDER");
        } else if (material[i].type == "TOPIC") {
          res = await questionFromTopic(material[i].content, material[i].sessionID, "PLACEHOLDER");
        } else {
          const res = await createDocumentJob(material[i].id, moduleID, material[i].sessionID, setSessions);7
        }

        if (typeof res == "object" && Array.isArray(res)) {
          directQuestions = [...directQuestions, ...res];
          setQuestions((prev) => [...prev, ...res]);
        }
      } catch (error) {
      }
    }


    // Modul trotzdem speichern, selbst wenn Fragen fehlen

    let newModuleData;
      /*
    questionConfig = directQuestions.map((question) => ({
      [...questionConfig, {
        id: directQuestions.id,
        status: null
      }]
    }))
      */
    try {
      newModuleData = await addNewModuleWithID({
        ...newModule,
        color: newModule.color.toUpperCase(),
        questions: directQuestions.length,
        sessions: sessions.map((item) => JSON.stringify(item)),
      },moduleID);
    } catch (error) {
      if (__DEV__) {
      console.log("Fehler beim Speichern des Moduls:", error);
      }
      // Wenn Modul-Speicherung fehlschlägt, redirect trotzdem ausführen
    }
    let savedQuestions = [];
    // Fragen speichern
    if (newModuleData && newModuleData.$id) {
      for (let i = 0; i < directQuestions.length; i++) {
        try {
          const question = { ...directQuestions[i], subjectID: newModuleData.$id };
          const savedQuestion = await addQUestion(question);
          savedQuestions.push({
            id: savedQuestion.$id,
            status: null
          })
        } catch (error) {
          if (__DEV__) {
          console.log("Fehler beim Speichern einer Frage:", error);
          }
        }
      }
    }
    
    //Update Module
    const res = await updateModuleQuestionList(newModuleData.$id, savedQuestions.map((item) => JSON.stringify(item)));
    // Benutzer-Daten aktualisieren
    try {
      const resp = await setUserDataSetup(user.$id);

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

export async function createDocumentJob(databucketID, moduleID, sessionID, setSessions ) {
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


export async function generateQuestionsFromText (text, amount, sessionID, subjectID) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Erstelle basierend auf den folgenden Themen jeweils zwischen 3 und 10 Multiple-Choice-Fragen: ${text}.  
Jede Frage muss für sich allein stehen und darf nicht vom Kontext anderen Fragen oder eines externen Textes abhängen.
Der Nutuzer soll die Fragen isoliert beantworten können, ohne den Kontext anderer Fragen oder Materialien die nicht in der Frage enthalten sind, zu benötigen.
WICHTIG: Keine Fragen mit externen Materialien oder Texten, die nicht in der Frage enthalten sind. !

Die Ausgabe soll ausschließlich ein gültiges, parsebares JSON-Array von Objekten sein.  

Jede Frage muss folgende Struktur haben (bitte exakt einhalten):
Hinweis die wenn du eine Latex formel oder tabelle einbindest müssen diese von Kartex (React Native) renderbar sein
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

Wichtige Regeln:
- Die Anzahl der Antwortoptionen ist immer 4.
- Die Anzahl der korrekten Antworten (answerIndex) muss mindestens 1 betragen.
- Der index der korrekten Antwort sollte zufällig sein und nicht immer 0 sein.
- Jede Antwortoption muss ein gültiger, stringifizierter JSON-String sein.
- Gib keine zusätzliche Erklärung oder Einleitung außerhalb des JSON zurück – nur das
-Die Latex Formeln müssen von der React Native Kartex renderbar sein 

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

  export async function questionFromTopic (topics, sessionID, subjectID) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Erstelle basierend auf den folgenden Themen jeweils zwischen 3 und 10 Multiple-Choice-Fragen: ${topics}.  
Jede Frage muss für sich allein stehen und darf nicht vom Kontext anderen Fragen oder eines externen Textes abhängen.
Der Nutuzer soll die Fragen isoliert beantworten können, ohne den Kontext anderer Fragen zu benötigen. 

Die Ausgabe soll ausschließlich ein gültiges, parsebares JSON-Array von Objekten sein.  

Jede Frage muss folgende Struktur haben (bitte exakt einhalten):
Hinweis die wenn du eine Latex formel oder tabelle einbindest müssen diese von Kartex (React Native) renderbar sein
{
  "sessionID": "${sessionID}",
  "subjectID": "${subjectID}",
  "status": null,
  "tags": [],
  "public": true,
  "aiGenerated": true,
  "question": "Die Frage als String.",
  "questionLatex": "", //Wenn topics elemnte enthält die sich gut für eine Latex Formel eignen oder sich die Frage gut durch eine Latex Formel ergänzen lässt
  "questionSVG": "",   // Bitte Leer lassen, da SVGs nicht unterstützt werden
  "questionUrl": "",   // Bitte Leer lassen, da URLs nicht unterstützt werden
  "hint": "",          // Wenn die Frage einen Hinweis benötigt, ansonsten leer lassen
  "explanation": "",   // Wenn die Frage eine Erklärung benötigt, ansonsten leer lassen
  "answers": [
    "{\"title\":\"Antwort A\",\"latex\":\"\",\"image\":null}",
    "{\"title\":\"Antwort B\",\"latex\":\"\",\"image\":null}",
    "{\"title\":\"Antwort C\",\"latex\":\"\",\"image\":null}",
    "{\"title\":\"Antwort D\",\"latex\":\"\",\"image\":null}"
  ],
  "answerIndex": [X]   // eine oder mehrere korrekte Antworten; Index basiert auf der Position im answers-Array (beginnend bei 0),
  "explaination": "Unter einer Guten Frage versteht man eine Frage die zeigt dass der Beantwortende diese verstanden hat" // Eine kurze Erklärung zur Frage sodass der Nutzer nach dem Quiz versteht warum die Antwort richtig oder falsch ist. Mindestens 2 Sätze lang.

}

Wichtige Regeln:
- Die Anzahl der Antwortoptionen ist immer 4.
- Die Anzahl der korrekten Antworten (answerIndex) muss mindestens 1 betragen.
- Der index der korrekten Antwort sollte zufällig sein und nicht immer 0 sein.
- Jede Antwortoption muss ein gültiger, stringifizierter JSON-String sein.
- Gib keine zusätzliche Erklärung oder Einleitung außerhalb des JSON zurück – nur das
-Die Latex Formeln müssen von der React Native Kartex renderbar sein 

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
