import { createContext, useState } from "react";

export const TokenContext = createContext({
    token: '',
    setToken: () => {}
})

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
  
    const setTokenAndLocalStorage = (newToken) => {
      setToken(newToken);
      localStorage.setItem('token', newToken);
    };
  
    return (
      <TokenContext.Provider value={{ token, setToken: setTokenAndLocalStorage }}>
        {children}
      </TokenContext.Provider>
    );
  };
  