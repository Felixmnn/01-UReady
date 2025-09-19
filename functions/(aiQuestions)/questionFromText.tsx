export async function generateQuestionsFromText(
  text: string,
  amount: number,
  sessionID: string,
  subjectID: string
) {
  const apiKey = process.env.EXPO_PUBLIC_API_URL; // Dein OpenAI API-Schlüssel
  const url = "https://api.openai.com/v1/chat/completions"; // ChatGPT Endpunkt
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
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
                "subjectID": ${subjectID},
            "explaination": "" //Mindestens 2 Sätze lang. Wichtig ist, das die Erklärung nicht nur die richtige Antwort in anderer Form wiedergibt, sondern eine Erklärung ist, die dem Nutzer hilft die Frage zu verstehen und zu lernen. WICHTIG DIE ERKLÄRUNG IST NICHT OPTIONAL
            }
            `,
      },
    ],
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!res.ok) {
      throw new Error(`Fehler: ${res.status}`);
    }
    console.log("Response from OpenAI:", res);

    const data = await res.json();

    // Überprüfe, ob die Antwort `choices` enthält und greife auf den Text zu
    if (data && data.choices && data.choices.length > 0) {
      const response = data.choices[0].message.content.trim(); // Antworte mit dem Text
      return data.choices[0].message.content.trim();
    } else {
      const response = "Keine Antwort von OpenAI erhalten.";
      return "Keine Antwort von OpenAI erhalten.";
    }
  } catch (error) {
    console.error("Error fetching OpenAI API:", error);
    const response = "Es gab einen Fehler bei der Anfrage!";
  }
}
