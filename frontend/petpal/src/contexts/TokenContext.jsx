import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from 'react-router-dom';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken_] = useState(localStorage.getItem('token'));
    let navigate = useNavigate();
    
    const setToken = (newToken) => {
      setToken_(newToken);
    };
  
    useEffect(() => {
      if (token) {
        localStorage.setItem('token',token);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }, [token]);
  
    const contextValue = useMemo(
      () => ({
        token,
        setToken,
      }),
      [token]
    );

    return (
      <TokenContext.Provider value={contextValue}>
        {children}
      </TokenContext.Provider>
    );
  };
  
export const useAuth = () => {
    return useContext(TokenContext);
};