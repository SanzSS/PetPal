import { createContext, useState, useEffect, useMemo, useContext } from "react";

const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
    const [userType, setUserType_] = useState(localStorage.getItem('user_type'));
    
    const setUserType = (newUserType) => {
        setUserType_(newUserType);
    };
  
    useEffect(() => {
      if (userType) {
        localStorage.setItem('user_type',userType);
      } else {
        localStorage.removeItem('user_type');
      }
    }, [userType]);
  
    const contextValue = useMemo(
      () => ({
        userType,
        setUserType,
      }),
      [userType]
    );

    return (
      <UserTypeContext.Provider value={contextValue}>
        {children}
      </UserTypeContext.Provider>
    );
  };
  
export const useUserType = () => {
    return useContext(UserTypeContext);
};