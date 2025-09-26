import { createContext, useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
import { loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import { updateUserUsage } from "@/functions/(userUsage)/updateUserUsage";
import { addUserUsage } from "@/lib/appwriteAdd";
import { updateUserUsageData } from "@/lib/appwriteUpdate";
import * as NavigationBar from "expo-navigation-bar";
import i18n from "@/assets/languages/i18n";

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
  const [userData, setUserData] = useState(null);
  const [userCathegory, setUserCategory] = useState(null);
  const [reloadNeeded, setReloadNeeded] = useState([]);
  const [userUsage, setUserUsage] = useState(null);

  // -------------------------------
  // 1. Session-Check
  // -------------------------------

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
      if (!usage) {
        usage = await addUserUsage(user.$id, {
          streak: 0,
          streakActive: false,
          streakLastUpdate: new Date(),
          energy: 30,
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
    if (!userUsage) return;

    const updateUsage = async () => {
      try {
        await updateUserUsageData({
          ...userUsage
        });
      } catch (err) {
        if (__DEV__) console.log("Usage update error", err);
      }
    };

    updateUsage();
  }, [userUsage]);

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
  // Exportierte Werte
  // -------------------------------

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
