import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { account } from './appwrite'; // korrekt initialisierter Appwrite-Client
import { openAuthSessionAsync } from 'expo-web-browser';
import { router } from 'expo-router';

export async function startAppwriteOAuthInSystemBrowser() {
        const endpoint = 'https://cloud.appwrite.io/v1';         // Dein Appwrite Endpoint
        const projectId = '67a9b50700084eaa4e04';            // Deine Projekt-ID
        const provider = 'google';                       // OAuth Provider (z.B. google)
        const redirectUri = encodeURIComponent('http://10.0.10.209:8081/redirectApp');  // Redirect URI (im Appwrite erlaubt)

        // URL manuell zusammenbauen:
        const loginUrl = `${endpoint}/account/sessions/oauth2/${provider}?project=${projectId}&success=${redirectUri}&failure=${redirectUri}&response_type=token`;

        console.log('Manuelle OAuth URL:', loginUrl);

        // Öffne externen Browser mit Login URL
        await WebBrowser.openBrowserAsync(loginUrl);
}


export const loginWithOAuth = async ({setUserData,setUser}) => {
    console.log('Starting OAuth login with Appwrite...');
    let redirectScheme = makeRedirectUri({ preferLocalhost: true });

    //HACK: localhost is a hack to get the redirection possible
    if (!redirectScheme.includes('localhost')) {
      redirectScheme = `${redirectScheme}localhost`;
    }
    redirectScheme = "exp://10.0.10.209:8081/"

    const url = account.createOAuth2Token("google", redirectScheme); 
    // It should never return void but the types say so that needs a fix on the SDK
    if (!url) return;

    const result = await openAuthSessionAsync(url.href, redirectScheme);
    console.log("OAuth result:", result);
    if ('url' in result) {

      const resultUrl = new URL(result.url);
      const secret = resultUrl.searchParams.get('secret');
      const userId = resultUrl.searchParams.get('userId');
      if (!secret || !userId) return;
      await account.createSession(userId, secret);
      try {
        const user = await account.get();
        console.log("Logged in user:", user);
        setUser(user);

        router.push('/personalize'); 
        
      } catch (error) {
        console.error("Error fetching user after OAuth login:", error);
      }
      
    }
}
