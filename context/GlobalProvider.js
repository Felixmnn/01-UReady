import { createContext, useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
import { loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import { updateUserUsage } from "@/functions/(userUsage)/updateUserUsage";
import { addUserUsage } from "@/lib/appwriteAdd";
import { updateUserUsageData } from "@/lib/appwriteUpdate";
import * as NavigationBar from "expo-navigation-bar";
import i18n from "@/assets/languages/i18n";
import NetInfo from "@react-native-community/netinfo";
import { getUsavedUserUsageFromMMKV, getUserDataConfigFromMMKV, getUserKategorieFromMMKV, getUserUsageFromMMKV, resetUnsavedModulesInMMKV, resetUsavedUserUsageInMMKV, saveUsavedUserUsageToMMKV, saveUserKategorieToMMKV, saveUserUsageToMMKV } from "@/lib/mmkvFunctions";
import { initializeIapVerification, triggerSubscriptionVerification } from "@/lib/appwriteFunctions";
import { getUserSubscriptionStatus } from "@/lib/appwriteQuerys";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [colorScheme, setColorScheme] = useState("light");
  const [language, setNewLanguage] = useState("DEUTSCH");
  const [userData, setUserData] = useState(getUserDataConfigFromMMKV());
  const [userCathegory, setUserCategory] = useState(getUserKategorieFromMMKV());
  const [reloadNeeded, setReloadNeeded] = useState([]);
  const [userUsage, setUserUsage] = useState(getUserUsageFromMMKV());
  const [isOffline, setIsOffline] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [userUsageInitialized, setUserUsageInitialized] = useState(false);

  
  // -------------------------------
  // 1. Session-Check
  // -------------------------------

  useEffect(() => {
    if (!user) return;
    loadUserDataKathegory(user?.$id).then((data) => {
      setUserCategory(data);
      saveUserKategorieToMMKV(data);
    });
  }, [user]);
 
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const res = await checkSession();
        if (!isMounted) return;
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        if (__DEV__) console.log("Session error", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------
  // 2. UserData + Language + UserUsage laden
  // -------------------------------

  useEffect(() => {
    if (!user) return;

    const fetchUserInfo = async () => {
      try {
        const data = await loadUserDataKathegory(user.$id);
        
        if (data) {
          const allowedLanguages = [
            "DEUTSCH",
            "ENGLISH(US)",
            "ENGLISH(UK)",
            "AUSTRALIAN",
            "SPANISH",
            "de",
            "en",
            "es",
            "fra"
          ];
          setNewLanguage(
            allowedLanguages.includes(data.language) ? data.language : "DEUTSCH"
          );
          await i18n.changeLanguage(data.language);
        }

        await ensureUserUsage();
      } catch (err) {
        if (__DEV__) console.log("UserInfo error", err);
      }
    };

    fetchUserInfo();
  }, [user]);

  // -------------------------------
  // 3. UserUsage laden/erstellen/aktualisieren
  // -------------------------------
  const ensureUserUsage = async () => {
    try {
      let usage = await loadUserUsage(user.$id);
      let unsavedUsage = getUsavedUserUsageFromMMKV();
      if (unsavedUsage) {
        usage = {
          ...usage,
          lastModules : unsavedUsage.lastModules,
          lastSessions : unsavedUsage.lastSessions,
        }
      }
      if (!usage) {
        usage = await addUserUsage(user.$id, {
          streak: 0,
          streakActive: false,
          streakLastUpdate: new Date(),
          energy: 50,
          microchip: 0,
          boostActive: false,
          boostActivation: new Date(),
          boostType: null,
          lastModules: [],
          lastSessions: [],
          recharges: 0,
          supercharges: 0,
          streakUpdate: [new Date()],
          purcharses: [],
          watchedComercials: [],
          participatedQuizzes: [],
        });
      } else {
        usage = await updateUserUsage(usage);
        setUserUsageInitialized(true);
        saveUserUsageToMMKV(usage);
        resetUsavedUserUsageInMMKV();        
      }
      setUserUsage(usage);
    } catch (err) {
      if (__DEV__) console.log("UserUsage error", err);
    }
  };
 
  // -------------------------------
  // 4. userUsage automatische Aktualisierung bei Änderung
  // -------------------------------
  useEffect(() => {
    if (!userUsage || !userUsageInitialized) return;
    const updateUsage = async () => {
      try {


        const res = await updateUserUsageData({
          ...userUsage
        });
        saveUserUsageToMMKV(userUsage);
      } catch (err) {
        saveUsavedUserUsageToMMKV(userUsage);
        if (__DEV__) console.log("Usage update error", err);

      }
    };

    updateUsage();
  }, [userUsage]);

  // -------------------------------
  // Netzwerkstatus überwachen
  // -------------------------------
  
  //WICHTIG SPÄTER WIEDER AKTIVIEREN
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  

  // -------------------------------
  // App neu laden, falls kein User vorhanden ist und das Laden abgeschlossen ist
  // -------------------------------
  useEffect(() => {
    if (!user && !isLoading) {
      // App neu laden, z.B. mit window.location.reload() (nur Web) oder Navigation reset
      if (typeof window !== "undefined" && window.location) {
        window.location.reload();
      } else {
        // Optional: Navigation reset für native
        // z.B. router.replace("/sign-in") falls du expo-router nutzt
      }
    }
  }, [user, isLoading]);

  // -------------------------------
 
    
    async function fetchSubscriptionStatus() {

  try {
    const status = await getUserSubscriptionStatus(user.$id);
    if (status) {
      const expiry = new Date(status.expiry);
      const now = new Date();
      if ( status.status == "active" && expiry < now) {
        
        const res = await triggerSubscriptionVerification(
          status.productId,
          status.linkedPurchaseToken,
        );

        
        
        setSubscriptionStatus(res.data.subscriptionDocument);
      } else {
        setSubscriptionStatus(status);
      }
      return;
    }

    const res = await initializeIapVerification();
    setSubscriptionStatus(res);

  } catch (error) {
    console.log("Error fetching subscription status:", error);

    const res = await initializeIapVerification();
    setSubscriptionStatus(res);
  }
}
  useEffect(() => {
      if (!user) return;

    fetchSubscriptionStatus();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
        colorScheme,
        setColorScheme,
        language,
        setNewLanguage,
        userData,
        setUserData,
        userCathegory,
        setUserCategory,
        reloadNeeded,
        setReloadNeeded,
        userUsage,
        setUserUsage,
        isOffline,
        subscriptionStatus,
        setSubscriptionStatus
      }} 
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
