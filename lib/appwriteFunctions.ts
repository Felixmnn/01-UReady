import { functions } from "./appwrite";


export const getUserSubscriptionStatus = async () => {
    const functionId = "692e779d0011cf896e95"
    const response = await functions.createExecution(functionId, JSON.stringify({

    }));
    console.log("Function Response:", response);
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

    console.log("Function Response:", response);

    // Fehler erkennen
    if (response.status !== "completed") {
      return {
        success: false,
        error: response.stdout || "Unknown function error",
      };
    }

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
    console.log("Function Response:", response);
    return response;
}