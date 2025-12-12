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


export async function callThisFunction(prompt: string) {
  const functionId = "67fb209600235031156e";

  console.log("Calling Function...");

  const response = await functions.createExecution(
    functionId,
    JSON.stringify({ prompt }) // payload als JSON
  );

  

  return response; // wichtig: NICHT response.responseBody zurückgeben!
}
