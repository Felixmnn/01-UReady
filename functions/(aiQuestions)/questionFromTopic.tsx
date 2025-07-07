


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
        Ertelle auf basis dieser Themen jeweils ${topics} 2-4 Fragen:
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
            "subjectID": ${subjectID},
            "explaination": "Unter einer Guten Frage versteht man eine Frage die zeigt dass der Beantwortende diese verstanden hat" // Eine kurze Erklärung zur Frage sodass der Nutzer nach dem Quiz versteht warum die Antwort richtig oder falsch ist. Mindestens 2 Sätze lang.

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

      // Überprüfe, ob die Antwort `choices` enthält und greife auf den Text zu
      if (data && data.choices && data.choices.length > 0) {
        const response = (data.choices[0].message.content.trim());  // Antworte mit dem Text
        return(data.choices[0].message.content.trim())
      } else {
        const response = ('Keine Antwort von OpenAI erhalten.');
        return('Keine Antwort von OpenAI erhalten.')
      }
    } catch (error) {
      console.error('Error fetching OpenAI API:', error);
      const response = ('Es gab einen Fehler bei der Anfrage!');
    }
  };