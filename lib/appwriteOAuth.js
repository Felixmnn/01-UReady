import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { account } from './appwrite'; // korrekt initialisierter Appwrite-Client
import { openAuthSessionAsync } from 'expo-web-browser';
import { router } from 'expo-router';
import * as Updates from 'expo-updates';


export const loginWithOAuth = async ({setUserData,setUser}) => {
    let redirectScheme = makeRedirectUri({ preferLocalhost: true });

    //HACK: localhost is a hack to get the redirection possible
    if (!redirectScheme.includes('localhost')) {
      redirectScheme = `${redirectScheme}localhost`;
    }
    redirectScheme = "exp://10.0.10.209:8081/"
    //redirectScheme = "node-ready:///"

    const url = account.createOAuth2Token("google", redirectScheme); 
    // It should never return void but the types say so that needs a fix on the SDK
    if (!url) return;

    const result = await openAuthSessionAsync(url.href, redirectScheme);
    if ('url' in result) {

      const resultUrl = new URL(result.url);
      const secret = resultUrl.searchParams.get('secret');
      const userId = resultUrl.searchParams.get('userId');
      if (!secret || !userId) return;
      await account.createSession(userId, secret);
      try {
        const user = await account.get();
        setUser(user);

        //router.push('/personalize'); 
          await Updates.reloadAsync();
        
      } catch (error) {
        console.error("Error fetching user after OAuth login:", error);
      }
      
    }
}
