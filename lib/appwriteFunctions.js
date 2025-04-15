import { functions } from "./appwrite";

export async function createFunction() {
    // Der Text, den du übergeben möchtest
    const requestBody = "Ein Cooler Text";
    const Objekt = {
        subjectID:"322a6f2f-33a1-4e39-892f-9bc8ba690e5d",
        sessionID:"67fa00a7e789a23eeb2c",
        apiKey:"-",
        url:"https://cloud.appwrite.io/v1/storage/buckets/67dc11e000003ae76023/files/67fb3b7f001e7e45df7c/view?project=67a9b50700084eaa4e04&mode=admin"
    }
    const stringBody = JSON.stringify(Objekt); // Konvertiere das Objekt in einen JSON-String

    try {
        // Trigger die Appwrite-Funktion und übergebe den Text als body
        const result = await functions.createExecution(
            '67fb1ab70021cf91b18c', // functionId
            stringBody, // body (nur der Text)
            true
        );

        console.log('Function executed successfully:', result);
    } catch (error) {
        console.error('Error executing function:', error);
    }
}
