import { Client,Account,ID, Avatars, Databases,Query, Storage,Functions  } from 'react-native-appwrite';
import { Linking } from "react-native";


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.uready",
    projectId: "67a9b50700084eaa4e04",
    databaseId : "67c50ecf001b7baf5de3",
    collectionId : "67c54fcb0017adfea948",
    questionCollectionId : "67c54fc20037f246f948",
    moduleCollectionId : "67c54fcb0017adfea948",
    noteCollectionId : "67c54fe90018edb315a2",
    documentCollectionId : "67e129400016566baa83",
    documentsBucketId : "67dc11e000003ae76023",
    userDataCollectionId : "67ca9db700166b55a401",
    userKathegoryCollectionId : "67e6e01e0032815236da",
    userUsageCollectionId : "680e44c8003850b9fcd2",
    jobCollectionId : "681dd825000e6990368a",
    shopCollectionId :"6846ab40003dc0deb5c7",
    contactCollectionId : "68465fe1000b07eefc85",
    commercialCollectionId : "6829f8a0000a0326c8b8",
    aktionsCodesCollectionId : "68465ff800292a506a23",
    surveyCollectionId : "6846600000085b18d75b",
    surveyQuestionsId: "6846600d0019c1ce8196",
    reportModuleCollectionId : "684936f900361725e602",
};

const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases (client);
const storage = new Storage(client);
const functions = new Functions(client);

export { client, databases, storage,functions,account };

export const createUser = async (email, password, username) => {
    
    try {

        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        )
        if (!newAccount) throw Error;
            const avatarUrl = avatars.getInitials(username); // optional nutzbar
        const signInResult = await signIn(email, password);
        if (!signInResult.success) {
        
            return { success: false, error: signInResult.error };
        }

        return {
            success: true,
            data: newAccount,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Unbekannter Fehler bei der Registrierung"
        };
}}

export const signIn = async(email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email,password)
        return { success: true, data: session };
    }  catch (error) {
        return { success: false, error: error.message || "Unbekannter Fehler beim Login" };
    }
}

export const signOut = async ()=> {
    try {
        await account.deleteSession('current');
    }
    catch {
        if (__DEV__) {
        console.log(error)
        }
    }
}
export const checkSession = async () => {
    try {
        const session = await account.get(); 
        return session;
    } catch (error) {
        if (__DEV__) {
        console.log("Keine aktive Sitzung:", error);
        }
        return null; 
    }
};



export const loginWithGoogle = () => {
    const redirectUrl = "http://localhost:8081/personalize"; // Stelle sicher, dass diese URL in Google OAuth registriert ist
    const redirectUrlExpo = "https://auth.expo.io/@felix08/node-ready"
    const redirectUrlFail = "https://node-ready.duckdns.org/"; // Stelle sicher, dass diese URL in Google OAuth registriert ist
    const authUrl = account.createOAuth2Session("google", redirectUrl, redirectUrlFail);
    Linking.openURL(authUrl);
};



  


export async function updateUserName (newName){
    try {
        const res = await account.updateName(newName)
        return res;
    } catch (error) {
        if (__DEV__) {
        console.log("Error updating name", error)
        }
    }
}

export async function updateUserEmail (newEmail){
    try {
        const res = await account.updateEmail(newEmail)
        return res;
    } catch (error) {
        if (__DEV__) {
        console.log("Error updating email", error)
        }
    }
}

export async function deletingAccount (){
    try {
        const res = await account.updateStatus('inactive');
        return res;
    } catch (error) {
        if (__DEV__) {
        console.log("Error deleting account", error)
        }
    }
}

export async function validateEmail  (){
    try {
        const res = await account.createVerification('http://10.0.10.209:8081/validate-mail');
    } catch (error) {
        if (__DEV__) {
        console.log("Error validating email", error)
        }
    }
}

export async function enterResponse (secret, userId){
    try {
       
        const res = await account.updateVerification(userId, secret);
        return res;
    } catch (error) {
        if (__DEV__) {
        console.log("Error entering response", error)
        }
    }
}

export async function resetPassword (email){
    try {
        const res = await account.createRecovery(email, 'http://localhost:8081/reset-password');
    } catch (error) {
        if (__DEV__) {
        console.log("Error resetting password", error)
        }
    }
}

export async function updatePassword (userId, secret, newPassword){
    try {
        const res = await account.updateRecovery(userId, secret, newPassword);
        return res;
    } catch (error) {
        if (__DEV__) {
        console.log("Error updating password", error)
        }
    }
}

export async function stripeFunction({price=1099}) {
    console.log("Price", price)
  try {
    
const res = await functions.createExecution('684cfd47003509ae622e', JSON.stringify({
        user: {
          id: 'user-123',
          email: 'user@example.com',
          name: 'Max Mustermann'
        },
        amount: price, // Cent-Betrag, z.B. 10,99 EUR
        currency: 'eur',
      }));
      console.log("Res of the new Function", res)

    return res;
  } catch (e) {
    console.log("Function error:", e);
  }
}


