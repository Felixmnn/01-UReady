import {
  addDocumentJob,
  addNewModule,
  addNewModuleWithID,
} from "@/lib/appwriteAdd";
import {
  addQUestion,
  setUserDataSetup,
  updateModule,
} from "@/lib/appwriteEdit";
import { updateModuleQuestionList } from "@/lib/appwriteUpdate";
import { module } from "@/types/appwriteTypes";
import { ModuleProps, Session } from "@/types/moduleTypes";
import { router } from "expo-router";
import uuid from "react-native-uuid";

export async function addNewQuestionToModule({
  material,
  module,

  setQuestions,
  setLoading,
  setSessions,
  selectedSession,
  setModule
}: {
  material: {
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  }[];
  module: any;
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  selectedSession: any;
  setModule: React.Dispatch<React.SetStateAction<any>>;
}) {
  setLoading(true);
  //Schritt 1: Fragen generieren
  const newQuestions = await generateQuestions({
    material,
    moduleID: module.$id,
    setSessions,
    directQuestions: [],
    questionOptions: {
      questionsType: "MULTIPLE",
      amountOfAnswers: 4,
    },
  });
  //Schritt 2: Fragen speichern
  let savedQuestions: any[] = [];
  for (let i = 0; i < newQuestions.length; i++) {
    try {
      const question = { ...newQuestions[i], subjectID: module.$id };
      const savedQuestion = await addQUestion(question);
      savedQuestions.push({
        id:
          savedQuestion && typeof savedQuestion.$id == "string"
            ? savedQuestion.$id
            : uuid.v4(),
        status: null,
      });
      setQuestions((prev) => [question, ...prev]);
    } catch (error) {
      if (__DEV__) {
      }
    }
  }
  //Schritt 3: Modul mit Fragen verknüpfen
  if (!module || !module.$id) {

    return;
  }
  const oldList = module.questionList
    ? module.questionList.map((item: string) => JSON.parse(item))
    : [];
  const newList = [
  ...oldList,
  ...savedQuestions.map((i) => {
    return { id: i.id, status: null };
  }),
];

  const questionCountOld = module.questions ? module.questions : 0;
  const questionCountNew = questionCountOld + savedQuestions.length;
  console.log("🫡New List:", newList);
  console.log("🫡Question Count New:", questionCountNew);

  setModule({
    ...module,
    questions: questionCountNew,
    questionList: newList.map((item: any) => JSON.stringify(item)),
  })
  const newModule = {
    ...module,
    questions: questionCountNew,
    questionList: newList.map((item: any) => JSON.stringify(item)),
  };
  await updateModule(newModule);
  //Schritt 4: Lokale States aktualisieren
  const updatedSession = selectedSession
    ? {
        ...selectedSession,
        questions:
          (selectedSession.questions ? selectedSession.questions : 0) +
          newQuestions.length,
      }
    : null;

  setSessions((prevSessions) => {
    if (!updatedSession) return prevSessions;
    const newSessions = [...prevSessions];
    const sessionIndex = newSessions.findIndex(
      (session) => session.id === updatedSession.id
    );
    if (sessionIndex !== -1) {
      newSessions[sessionIndex] = updatedSession;
    }
    return newSessions;
  });

  setLoading(false);
}

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
  questionOptions,
}: {
  user: string;
  material: {
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  }[];
  newModule: module;
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  reloadNeeded: string[];
  setReloadNeeded: React.Dispatch<React.SetStateAction<string[]>>;
  setIsVisibleModal?: React.Dispatch<React.SetStateAction<boolean>>;
  questionOptions: {
    questionsType: "MULTIPLE" | "SINGLE" | "QA";
    amountOfAnswers: 2 | 3 | 4 | 5 | 6;
  };
}) {
  setLoading(true);
  let directQuestions: any[] = [];
  const moduleID = uuid.v4();

  try {
    // Schritt 1: Fragen erstellen
    directQuestions = await generateQuestions({
      material, // Materialien sind Objekte mit der Basis für die Generierung
      moduleID: moduleID as string,
      setSessions,
      directQuestions,
      questionOptions,
    });

    let newModuleData;

    // Schritt 2: Modul speichern
    const resMod = await saveModule({
      newModule,
      moduleID: moduleID as string,
      sessions,
      directQuestions,
      newModuleData,
    });

    newModuleData = resMod;

    let savedQuestions: any[] = [];

    // Schritt 3: Fragen speichern

    await saveQuestions({
      newModuleData,
      directQuestions,
      savedQuestions,
    });

    // Schritt 4: Modul mit Fragen verknüpfen

    if (!newModuleData || !newModuleData.$id)
      console.log(
        "Fehlecode 1: newModuleData oder newModuleData.$id ist undefined"
      );
    await updateModuleQuestionList(
      newModuleData.$id,
      savedQuestions.map((item) => JSON.stringify(item))
    );
    // Benutzer-Daten aktualisieren
    try {
      if (!user) throw new Error("User ID is undefined");
      const resp = await setUserDataSetup(user);
    } catch (error) {
      if (__DEV__) {
      }
    }
  } catch (error) {
    if (__DEV__) {
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
  questionOptions,
}: {
  material: {
    type: "PEN" | "TOPIC" | "FILE" | "QUESTION";
    content: string;
    uri: string | null;
    sessionID: string | null;
    id: string | null;
  }[];
  moduleID: string;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  directQuestions: any[];
  questionOptions: {
    questionsType: "MULTIPLE" | "SINGLE" | "QA";
    amountOfAnswers: number;
  };
}) {
  try {
    for (let i = 0; i < material.length; i++) {
      try {
        let res;
        if (material[i].type === "PEN") {
          res = await generateQuestionsFromText({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers,
          });
        } else if (material[i].type === "TOPIC") {
          res = await questionFromTopic({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers,
          });
        } else if (material[i].type === "QUESTION") {
          res = await generateQuestionsFromQuestions({
            text: material[i].content,
            questionsType: questionOptions.questionsType,
            amountOfAnswers: questionOptions.amountOfAnswers,
          });
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
        res = res.map((r: any) => {
          return {
            sessionID: material[i].sessionID,
            subjectID: moduleID,
            status: null,
            tags: [],
            public: true,
            aiGenerated: true,
            question: r.question,
            questionLatex: "",
            questionSVG: "",
            questionUrl: "",
            hint: r.hint ? r.hint : "",
            explanation: r.explanation ? r.explanation : "",
            answers: r.answers.map((a: any) =>
              JSON.stringify({ title: a, latex: "", image: null })
            ),
            answerIndex: r.answerIndex,
          };
        });

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
  newModuleData,
}: {
  newModule: module;
  moduleID: string;
  sessions: Session[];
  directQuestions: any[];
  newModuleData: any;
}) {
  try {
    newModuleData = await addNewModuleWithID(
      {
        ...newModule,
        color:
          typeof newModule.color == "string"
            ? newModule.color.toUpperCase()
            : "BLUE",
        questions: directQuestions.length,
        sessions: sessions.map((item) => JSON.stringify(item)),
      },
      moduleID
    );
    return newModuleData;
  } catch (error) {
    if (__DEV__) {
    }
  }
}

async function saveQuestions({
  newModuleData,
  directQuestions,
  savedQuestions,
}: {
  newModuleData: any;
  directQuestions: any[];
  savedQuestions: any[];
}) {
  // Schritt 3: Fragen speichern
  if (newModuleData && newModuleData.$id) {
    for (let i = 0; i < directQuestions.length; i++) {
      try {
        const question = {
          ...directQuestions[i],
          subjectID: newModuleData.$id,
        };
        const savedQuestion = await addQUestion(question);
        savedQuestions.push({
          id:
            savedQuestion && typeof savedQuestion.$id == "string"
              ? savedQuestion.$id
              : uuid.v4(),
          status: null,
        });
      } catch (error) {
        if (__DEV__) {
        }
      }
    }
  }
}

export async function createDocumentJob(
  databucketID: string,
  moduleID: string,
  sessionID: string,
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
) {
  const job = {
    databucketID: databucketID,
    subjectID: moduleID,
    sessionID: sessionID,
  };
  const res = await addDocumentJob(job);
  setSessions((prevSessions) => {
    const newSessions = [...prevSessions];
    const sessionIndex = newSessions.findIndex(
      (session) => session.id === sessionID
    );
    if (sessionIndex !== -1) {
      newSessions[sessionIndex].tags = ["JOB-PENDING"];
    }
    return newSessions;
  });
}

import { t } from "i18next";

export async function generateQuestionsFromText({
  text,
  questionsType,
  amountOfAnswers,
  promptType = "createQuestionsPrompt", // "createQuestionsPrompt" | "convertQuestionsPrompt" | "createQuestionsFromTextPrompt"
}: {
  text: string;
  questionsType: "MULTIPLE" | "SINGLE" | "QA";
  amountOfAnswers: number;
  promptType?: "createQuestionsPrompt" | "convertQuestionsPrompt" | "createQuestionsFromTextPrompt";
}) {
  const apiKey = process.env.EXPO_PUBLIC_API_URL;
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  // Berechne die Beschreibung basierend auf dem questionsType
  let questionTypeDescription = "";
  switch (questionsType) {
    case "MULTIPLE":
      questionTypeDescription = t("prompts.multipleChoiceDescription");
      break;
    case "SINGLE":
      questionTypeDescription = t("prompts.singleChoiceDescription");
      break;
    case "QA":
      questionTypeDescription = t("prompts.openQuestionDescription");
      break;
  }

  // Hilfsfunktion für die Interpolation aller Platzhalter
  function interpolatePrompt(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const key in vars) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), vars[key]);
    }
    return result;
  }

  // Lade den i18n-Prompt und ersetze alle Platzhalter
  const promptTemplate = interpolatePrompt(t(`prompts.${promptType}`), {
    instruction: t("prompts.instruction"),
    instruction_convert: t("prompts.instruction_convert"),
    instruction_text: t("prompts.instruction_text"),
    standaloneRule: t("prompts.standaloneRule"),
    important: t("prompts.important"),
    outputFormat: t("prompts.outputFormat"),
    questionStructure: t("prompts.questionStructure"),
    structureExample: t("prompts.structureExample"),
    rules: t("prompts.rules"),
    rules_convert: t("prompts.rules_convert"),
    rules_text: t("prompts.rules_text"),
    text: text,
    numberOfAnswers: amountOfAnswers.toString(),
    questionTypeDescription: questionTypeDescription,
  });

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: promptTemplate }],
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      throw new Error(`Fehler: ${res.status}`);
    }

    const data = await res.json();
    const textResponse = data.choices[0].message.content.trim();

    const startIndex = textResponse.indexOf("[");
    const endIndex = textResponse.lastIndexOf("]");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonString = textResponse.substring(startIndex, endIndex + 1);
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    }

    return [];
  } catch (error) {
    console.error("Error fetching OpenAI API:", error);
    return [];
  }
}



// Hilfsfunktion zum Ersetzen verschachtelter Platzhalter
function interpolatePrompt(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const key in vars) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), vars[key]);
  }
  return result;
}

export async function generateQuestionsFromQuestions({
  text,
  questionsType,
  amountOfAnswers,
}: {
  text: string;
  questionsType: "MULTIPLE" | "SINGLE" | "QA";
  amountOfAnswers: number;
}) {
  const apiKey = process.env.EXPO_PUBLIC_API_URL;
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  let questionTypeDescription = "";
  switch (questionsType) {
    case "MULTIPLE":
      questionTypeDescription = t("prompts.multipleChoiceDescription");
      break;
    case "SINGLE":
      questionTypeDescription = t("prompts.singleChoiceDescription");
      break;
    case "QA":
      questionTypeDescription = t("prompts.openQuestionDescription");
      break;
  }

  const promptTemplate = interpolatePrompt(t("prompts.convertQuestionsPrompt"), {
    instruction_convert: t("prompts.instruction_convert"),
    standaloneRule: t("prompts.standaloneRule"),
    important: t("prompts.important"),
    outputFormat: t("prompts.outputFormat"),
    questionStructure: t("prompts.questionStructure"),
    structureExample: t("prompts.structureExample"),
    rules_convert: t("prompts.rules_convert"),
    text: text,
    numberOfAnswers: amountOfAnswers.toString(),
    questionTypeDescription: questionTypeDescription,
  });

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: promptTemplate }],
  });

  try {
    const res = await fetch(url, { method: "POST", headers, body });
    if (!res.ok) throw new Error(`Fehler: ${res.status}`);

    const data = await res.json();
    const textResponse = data.choices[0].message.content.trim();
    const startIndex = textResponse.indexOf("[");
    const endIndex = textResponse.lastIndexOf("]");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonString = textResponse.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString);
    }

    return [];
  } catch (error) {
    console.error("Error fetching OpenAI API:", error);
    return [];
  }
}

export async function questionFromTopic({
  text,
  questionsType,
  amountOfAnswers,
}: {
  text: string;
  questionsType: "MULTIPLE" | "SINGLE" | "QA";
  amountOfAnswers: number;
}) {
  const apiKey = process.env.EXPO_PUBLIC_API_URL;
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  let questionTypeDescription = "";
  switch (questionsType) {
    case "MULTIPLE":
      questionTypeDescription = t("prompts.multipleChoiceDescription");
      break;
    case "SINGLE":
      questionTypeDescription = t("prompts.singleChoiceDescription");
      break;
    case "QA":
      questionTypeDescription = t("prompts.openQuestionDescription");
      break;
  }

  const promptTemplate = interpolatePrompt(t("prompts.createQuestionsFromTextPrompt"), {
    instruction_text: t("prompts.instruction_text"),
    standaloneRule: t("prompts.standaloneRule"),
    important: t("prompts.important"),
    outputFormat: t("prompts.outputFormat"),
    questionStructure: t("prompts.questionStructure"),
    structureExample: t("prompts.structureExample"),
    rules_text: t("prompts.rules_text"),
    text: text,
    numberOfAnswers: amountOfAnswers.toString(),
    questionTypeDescription: questionTypeDescription,
  });

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: promptTemplate }],
  });

  try {
    const res = await fetch(url, { method: "POST", headers, body });
    if (!res.ok) throw new Error(`Fehler: ${res.status}`);

    const data = await res.json();
    const textResponse = data.choices[0].message.content.trim();
    const startIndex = textResponse.indexOf("[");
    const endIndex = textResponse.lastIndexOf("]");

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const jsonString = textResponse.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString);
    }

    return [];
  } catch (error) {
    console.error("Error fetching OpenAI API:", error);
    return [];
  }
}

