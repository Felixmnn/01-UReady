import { config, functions } from "./appwrite";

export async function handleValidationCode(email: string, code?: string, userId?: string, passwordReset?: boolean, newPassword?: string, passwordConfirm?: string) {
  let response = "";
  try {
    // Payload für die Function bauen
    const payload: any = { email };
    if (code) payload.code = code;
    if (userId) payload.userId = userId;
    if (passwordReset) payload.passwordReset = passwordReset;
    if (newPassword) payload.newPassword = newPassword;
    if (passwordConfirm) payload.passwordConfirm = passwordConfirm;

    const execution = await functions.createExecution(
      config.functionID ,
      JSON.stringify(payload),
      false // false = warte auf Response
    );

    // Response parsen
    let response = JSON.parse(execution.responseBody || "{}");
    return response;

  } catch (err) {
    console.error("❌ Error executing function:", err);
    throw err;
    return response
  }
}
