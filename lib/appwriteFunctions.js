import { functions } from "./appwrite";

const functionId = "67eca51c003e4f9e78f8"

const payload = {
    prompt: "Erzähle mir einen Witz!",
    subjectID: "123",
    sessionID: "456",
    title: "Mein Titel",
    public: true
};


export async function callAppwriteFunction() {
    try {
        console.log("I am doing something");
        const response = await functions.createExecution(functionId, JSON.stringify(payload));
        console.log("Funktion erfolgreich aufgerufen:", response);
    } catch (error) {
        console.error("Fehler beim Aufrufen der Funktion:", error);
    }
}
