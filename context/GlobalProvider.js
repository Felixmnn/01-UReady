import { createContext,useContext, useEffect, useState } from "react";
import { getCurrentUser,checkSession } from "../lib/appwrite";
import { loadUserData } from "@/lib/appwriteDaten";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [ isLoggedIn,setIsLoggedIn] = useState(false);
    const [ user,setUser ] = useState(null);
    const [ isLoading, setIsLoading] = useState(true);
    const [ colorScheme, setColorScheme ] = useState('light');
    const [ language,setLanguage ] = useState('de');
    const [ userData, setUserData ] = useState(null);


    useEffect(() => {
        try {
            checkSession()
            .then((res) =>{
                if(res) {
                    setIsLoggedIn(true);
                    setUser(res)
                } else {
                    setIsLoggedIn(false)
                    setUser(null)
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
    }, []);

    
    




    return (
        <GlobalContext.Provider 
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                colorScheme,
                setColorScheme,
                language,
                setLanguage,
                userData,
                setUserData
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;