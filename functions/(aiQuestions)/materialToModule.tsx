import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import { addNewModule } from '@/lib/appwriteAdd';
import { addQUestion, setUserDataSetup } from '@/lib/appwriteEdit';
import {router} from 'expo-router';



export async function materialToModule(user, material, userData, newModule, setNewModule, questions, setQuestions, sessions, setSessions, setLoading, reloadNeeded, setReloadNeeded) {
  setLoading(true);
  let directQuestions = [];

  try {
    for (let i = 0; i < material.length; i++) {
      try {
        let res;
        if (material[i].type == "PEN") {
          console.log("Erstelle Fragen aus Text...");
          res = await generateQuestionsFromText(material[i].content, "5-10", material[i].sessionID, "PLACEHOLDER");
        } else if (material[i].type == "TOPIC") {
          console.log("Erstelle Fragen aus Themen...");
          res = await questionFromTopic(material[i].content, material[i].sessionID, "PLACEHOLDER");
        } else {
          console.log("Erstelle Fragen aus Datei...");
          await generateQuestionsFromFile(material[i].uri);
          res = [];
        }

        if (typeof res == "object" && Array.isArray(res)) {
          directQuestions = [...directQuestions, ...res];
          setQuestions((prev) => [...prev, ...res]);
          console.log("Die Fragen sind:", res);
        }
      } catch (error) {
        console.log("Fehler beim Fragen-Generieren:", error);
        // Fehler hier wird ignoriert und der nächste Durchlauf beginnt
      }
    }

    console.log("Alle gesammelten Fragen:", questions);

    // Modul trotzdem speichern, selbst wenn Fragen fehlen
    let newModuleData;
    try {
      newModuleData = await addNewModule({
        ...newModule,
        color: newModule.color.toUpperCase(),
        questions: questions.length,
        sessions: sessions.map((item) => JSON.stringify(item)),
      });
      console.log("Das neue Modul ist:", newModuleData);
    } catch (error) {
      console.log("Fehler beim Speichern des Moduls:", error);
      // Wenn Modul-Speicherung fehlschlägt, redirect trotzdem ausführen
    }

    // Fragen speichern
    if (newModuleData && newModuleData.$id) {
      for (let i = 0; i < directQuestions.length; i++) {
        try {
          const question = { ...directQuestions[i], subjectID: newModuleData.$id };
          const savedQuestion = await addQUestion(question);
          console.log("Frage gespeichert 🔴🔴🔴", savedQuestion);
        } catch (error) {
          console.log("Fehler beim Speichern einer Frage:", error);
        }
      }
    }

    // Benutzer-Daten aktualisieren
    try {
      const resp = await setUserDataSetup(user.$id);
      console.log("Benutzerdaten aktualisiert:", resp);
    } catch (error) {
      console.log("Fehler beim Aktualisieren der Benutzerdaten:", error);
    }
  } catch (error) {
    console.log("Allgemeiner Fehler:", error);
  } finally {
    setReloadNeeded([...reloadNeeded, "BIBLIOTHEK"]);
    setLoading(false);
    router.push("/bibliothek");
  }
}



async function generateQuestionsFromText (text, amount, sessionID, subjectID) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Ertelle auf basis dieses Textes ${text} ${amount} Fragen:
        Die Fragen sollen dabei als stringifyed JSON Array zurückgegeben werden.
        Es soll immer 4 Antorten geben die anzahl der richtigen Antworten soll dabei >= 1 sein.
        Die Struktur der Fragen soll dabei wie folgt aussehen:
        {
            "question": "DIE FRAGE",
            "answers": "EINE ANTWORT","NOCH EINE ANTWORT", "UND NOCH EINE ANTWORT",...
            "answerIndex": [0,1,2,...],
            "public": false,
            "aiGenerated": true,
            "status": null,
            "tags": [],
            "sessionID": ${sessionID},
            "subjectID": ${subjectID}
        }
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

  async function questionFromTopic (topics, sessionID, subjectID) {
    const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
    const url = 'https://api.openai.com/v1/chat/completions';  // ChatGPT Endpunkt
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
      model: 'gpt-4o-mini', 
      messages: [{ role: 'user', content: `
        Ertelle auf basis dieser Themen jeweils ${topics} 3-10 Fragen:
        Die Fragen sollen dabei als stringifyed JSON Array zurückgegeben werden.
        Es soll immer 4 Antorten geben die anzahl der richtigen Antworten soll dabei >= 1 sein.
        Die Struktur der Fragen soll dabei wie folgt aussehen:
        Es ist wichtig, dass deine Antwort nur eine gültiges JSON-Array ist.
        {
            "question": "DIE FRAGE",
            "answers": "EINE ANTWORT","NOCH EINE ANTWORT", "UND NOCH EINE ANTWORT",...
            "answerIndex": [0,1,2,...],
            "public": false,
            "aiGenerated": true,
            "status": null,
            "tags": [],
            "sessionID": ${sessionID},
            "subjectID": ${subjectID}
        }
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

  async function generateQuestionsFromFile(uri) {
    try {
        console.log("APPWRITE fucntion wird aufgerfuen 🔷🔷🔷")
        
    } catch (error) {
        console.log(error);
    }
    }
