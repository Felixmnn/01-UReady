import { createContext,useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
import { loadUserDataKathegory } from "@/lib/appwriteDaten";
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
    const [ userUsage, setUserUsage ] = useState({
        streak: 0,
        streakActive: false,
        streakLastUpdate: new Date(),
        energy: 5,
        microchip: 0,
        boostActive: true,
        boostActivation: new Date(),
        boostType: null,
        lastModules: [],
        lastSessions: [],
    });


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
        if (!user) return;
        async function fetchUserData() {
            const userDataKathegory = await loadUserDataKathegory(user.$id);
            if (!userDataKathegory) return;
            const allowedLanguages = ["DEUTSCH", "ENGLISH(US)", "ENGLISH(UK)", "AUSTRALIAN", "SPANISH"];
            setNewLanguage(allowedLanguages.includes(userDataKathegory.language) ? userDataKathegory.language : "DEUTSCH");
        }
        fetchUserData()
    },[user]);



    
    




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