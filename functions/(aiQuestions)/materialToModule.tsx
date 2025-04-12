import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import { addNewModule } from '@/lib/appwriteAdd';
import { addQUestion, setUserDataSetup } from '@/lib/appwriteEdit';
import {router} from 'expo-router';


export async function materialToModule(user,material,userData,newModule, setNewModule, questions, setQuestions, sessions, setSessions, setLoading) {
    setLoading(true)
    let directQuestions = []
    for (let i = 0; i < material.length; i++) {
        try {
            let res;
            if (material[i].type == "PEN" ) {
                console.log("Erstelle Fragen aus Text...")
                res = await generateQuestionsFromText(material[i].content, "5-10", material[i].sessionID , "PLACEHOLDER");
            } else if (material[i].type == "TOPIC" ) {
                console.log("Erstelle Fragen aus Themen...")
                res = await questionFromTopic(material[i].content, material[i].sessionID , "PLACEHOLDER");
            } else {
                generateQuestionsFromFile(material[i].uri);
                res = []
            }
            if (typeof res == "object"){
                if (Array.isArray(res)) {
                    directQuestions = [...directQuestions, ...res]
                    setQuestions((prev) => [...prev, ...res]); 
                  }
                
                console.log("Die Fragen sind:", res)
            }
            
        } catch (error) {
            console.log(error);
        }
        
    }
    console.log("Die Fragen sind:", questions)
    const res = await addNewModule({...newModule, color: newModule.color.toUpperCase(), questions: questions.length, sessions:sessions.map(item => JSON.stringify(item)) });
    console.log("Das neue Modul ist:", res)
    for (let i = 0; i < directQuestions.length; i++) {
        console.log("So liegt Questions vor:", directQuestions[i])
        try {
            
        const question = {...directQuestions[i], subjectID: res.$id};

        const s = await addQUestion (question); 
        console.log("Erfolg 🔴🔴🔴", s)
        } catch (error) {
            console.log(error);
        }
    //Speichern Des Moduls in der Appwrite Datenbank
    //Speichern aller Fragen in der Appwrite Datenbank
    
}setLoading(false)
    //Beenden des Moduls
    const resp = await setUserDataSetup(user.$id)
    console.log(user.$id)
    console.log("User data updated: ", resp)
    router.push("/bibliothek")
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
