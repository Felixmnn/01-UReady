import { createContext,useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
import { loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import { updateUserUsage } from "@/functions/(userUsage)/updateUserUsage";
import { addUserUsage } from "@/lib/appwriteAdd";
import { updateUserUsageData } from "@/lib/appwriteUpdate";
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [ isLoggedIn,setIsLoggedIn] = useState(false);
    const [ user,setUser ] = useState(null);
    const [ isLoading, setIsLoading] = useState(true);
    const [ colorScheme, setColorScheme ] = useState('light');
    const [ language,setNewLanguage ] = useState('DEUTSCH');
    const [ userData, setUserData ] = useState(null);
    const [ userCathegory, setUserCategory ] = useState(null);
    const [ reloadNeeded, setReloadNeeded ] = useState([]);
    const [ userUsage, setUserUsage ] = useState(null);


    async function fetchUserUsage() {   
            const userU = await loadUserUsage(user.$id)
            if (userU) {
                const newU = await updateUserUsage(userU);
                setUserUsage(newU);
            } else if (!userU ) {
                const res = await addUserUsage(user.$id, {
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
                    streakUpdate:[new Date()],
                    purcharses: [],
                    watchedComercials: [],
                    participatedQuizzes: [],
                    streakUpdate: [new Date()],

                });
                setUserUsage(res);
                }
            }

    useEffect(() => {
        try {
            checkSession()
            .then((res) =>{
                if(res) {
                    setIsLoggedIn(true);
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(undefined)
                }
            } )
            .catch ((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
        } catch (error){
            console.log(error)
        }
    }, [isLoading,isLoggedIn]);

    useEffect(() => {
        if (user == null) return;
        async function fetchUserData() {
            let userDataKathegory;
            try {
                userDataKathegory = await loadUserDataKathegory(user.$id);
            } catch (error) {
                userDataKathegory = null;
            }
            if (!userDataKathegory) return;
            const allowedLanguages = ["DEUTSCH", "ENGLISH(US)", "ENGLISH(UK)", "AUSTRALIAN", "SPANISH"];
            setNewLanguage(allowedLanguages.includes(userDataKathegory.language) ? userDataKathegory.language : "DEUTSCH");
            if (!userUsage) await fetchUserUsage();
        }
        fetchUserData()
    },[user]);

    useEffect(() => {
        if (!user) return;
        async function fetchUserCategory() {
            try {
                const userU = await loadUserUsage(user.$id);
                if (!userU) {
                    await fetchUserUsage();
                }
                setUserUsage(userU);
            } catch (error) {
                const userU = await fetchUserUsage()
                setUserUsage(userU);
            }
        }
        fetchUserCategory();
    }
    , [user]);

    useEffect(() => {
        if (!userUsage) return;
        async function upDateUserUsage() {
            const res = await updateUserUsageData({
                ...userUsage,
                streakLastUpdate: new Date(),
            });
        }
        upDateUserUsage();
    }, [userUsage]);



    
    




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
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;