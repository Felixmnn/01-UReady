import { createContext, useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
import { loadUserData, loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import { updateUserUsage } from "@/functions/(userUsage)/updateUserUsage";
import { addUserUsage } from "@/lib/appwriteAdd";
import { updateUserUsageData } from "@/lib/appwriteUpdate";
import * as NavigationBar from "expo-navigation-bar";
import i18n from "@/assets/languages/i18n";
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import CustomButton from "@/components/(general)/customButton";
import { getUsavedUserUsageFromMMKV, getUserKategorieFromMMKV, getUserUsageFromMMKV, resetUnsavedModulesInMMKV, saveUsavedUserUsageToMMKV, saveUserKategorieToMMKV, saveUserUsageToMMKV } from "@/lib/mmkvFunctions";

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
  const [userCathegory, setUserCategory] = useState(getUserKategorieFromMMKV());
  const [reloadNeeded, setReloadNeeded] = useState([]);
  const [userUsage, setUserUsage] = useState(getUserUsageFromMMKV());
  const [isOffline, setIsOffline] = useState(true);

  // -------------------------------
  // 1. Session-Check
  // -------------------------------

  useEffect(() => {
    if (!user) return;
    loadUserDataKathegory(user?.$id).then((data) => {
      setUserCategory(data);
      saveUserKategorieToMMKV(data);
      console.log("🔷",data)
    });
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        const res = await checkSession();
        if (!isMounted) return;
        console.log("✅",res)
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
        saveUserUsageToMMKV(usage);
        resetUnsavedModulesInMMKV();
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
  /*
  WICHTIG SPÄTER WIEDER AKTIVIEREN
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  /*

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
  /*
  if (isOffline) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111418" }}>
        
        <Image
          source={require("../assets/Uncertain.gif")}
          style={{ width: 150, height: 150, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={{ color: "white", fontSize: 20, textAlign: "center", margin: 20 }}>
          {i18n.t("provider.noNetworkConnection")}
        </Text>
        <CustomButton
          title={i18n.t("provider.tryAgain")}
          handlePress={() => {
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                setIsOffline(false);
                router.reload();
              }
            });
          }}
          
          containerStyles="bg-blue-600 px-6 py-3 rounded-md"
        />
      </View>
    );
  }
    */

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
        isOffline
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
