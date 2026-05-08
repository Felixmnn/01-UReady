import { Alert } from "react-native";
import { functions } from "./appwrite";


export const getUserSubscriptionStatus = async () => {
    const functionId = "692e779d0011cf896e95"
    const response = await functions.createExecution(functionId, JSON.stringify({

    }));
    
}

export interface IapVerificationSuccess {
  success: true;
  data: any; // Google API / Appwrite result
}

export interface IapVerificationError {
  success: false;
  error: string;
  status?: number;
}

export type IapVerificationResponse =
  | IapVerificationSuccess
  | IapVerificationError;



export async function triggerSubscriptionVerification(
  productId: string,
  purchaseToken: string
): Promise<IapVerificationResponse> {
  const functionId = "692e779d0011cf896e95";
  console.log("Triggering subscription verification for:", { productId, purchaseToken });
  try {
    const payload = {
      productId,
      purchaseToken,
    };

    const response = await functions.createExecution(
      functionId,
      JSON.stringify(payload)
    );

    

    // Fehler erkennen
    /*
    if (response.status !== "completed") {
      return {
        success: false,
        error: response.stdout || "Unknown function error",
      };
    }
      */

    let parsedOutput = {};
    try {
      parsedOutput = JSON.parse(response.responseBody ?? "{}");
    } catch {
      parsedOutput = response.responseBody;
    }

    return {
      success: true,
      data: parsedOutput,
    };
  } catch (err: any) {
    console.log("triggerSubscriptionVerification ERROR:", err);
    Alert.alert(
      "Verification Error",
      "An error occurred during subscription verification. Please try again later."
    );
    return {
      success: false,
      error: err?.message ?? "Unknown error during verification",
      status: err?.status,
    };
  }
}


export async function initializeIapVerification() {
    const functionId = "692e779d0011cf896e95"
    const response = await functions.createExecution(functionId, JSON.stringify({
      productId: "initializing",
      purchaseToken: "initializing"
    }));
    
    return response;
}


/*
export async function callThisFunction(prompt: string) {
  const functionId = "67fb209600235031156e";


  const response = await functions.createExecution(
    functionId,
    JSON.stringify({ prompt }) // payload als JSON
  );

  

  return response; // wichtig: NICHT response.responseBody zurückgeben!
}
  */

export async function callThisFunction(prompt: string) {
  // ngrok URL deines lokalen Servers
  const NGROK_URL = "https://api.qready-app.de/gpt";

  try {
    const response = await fetch(`https://api.qready-app.de/gpt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    console.log("Response from local GPT server:", response);

    // Ganze JSON-Antwort zurückgeben, wie bei Appwrite
    const data = await response.json();
    console.log("Parsed JSON data:", data);
    return data;
  } catch (err) {
    console.error("Error calling local GPT server:", err);
    throw err;
  }
}

export async function sendTextExtractionRequest(documentID: string) {
  console.log("🐋🐋🐋")
  const url = "https://craniological-lawson-synecdochically.ngrok-free.dev/process_document";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: "1234",
      document_id: documentID,
    }),
  });
  console.log("Response from text extraction server:", response);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} – ${errorText}`);
  }

  return await response.json();
}

