import { createContext,useContext, useEffect, useState } from "react";
import { checkSession } from "../lib/appwrite";
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [ isLoggedIn,setIsLoggedIn] = useState(false);
    const [ user,setUser ] = useState(null);
    const [ isLoading, setIsLoading] = useState(true);
    const [ colorScheme, setColorScheme ] = useState('light');
    const [ language,setLanguage ] = useState('de');
    const [ userData, setUserData ] = useState(null);
    const [ userCathegory, setUserCategory ] = useState(null);


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
                setLanguage,
                userData,
                setUserData,
                userCathegory,
                setUserCategory,
            }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;