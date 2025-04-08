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

export { client, databases, storage,functions };

export const createUser = async (email, password, username) => {
    
    try {

        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        )
        if (!newAccount) throw Error;
            const avatarUrl = avatars.getInitials(username)
            await signIn(email,password)
            
            return newAccount;
    } catch (error) {
        console.log(error)
        }
}

export const signIn = async(email, password) => {
    
    try {
        const session = await account.createEmailPasswordSession(email,password)
            return session;
    }  catch (error) {
        console.log(error)
    }
}

export const signOut = async ()=> {
    try {
        console.log("Logging out")
        await account.deleteSession('current');
        
    }
    catch {
        console.log(error)
    }
}
export const checkSession = async () => {
    try {
        const session = await account.get(); 
        console.log(session)
        return session;
    } catch (error) {
        console.log("Keine aktive Sitzung:", error);
        return null; 
    }
};

export const loginWithGoogle = () => {
    const redirectUrl = "http://localhost:8081/"; // Stelle sicher, dass diese URL in Google OAuth registriert ist
    const authUrl = account.createOAuth2Session("google", redirectUrl, redirectUrl);
    Linking.openURL(authUrl);
};


