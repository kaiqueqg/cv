// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { identityApi } from '../Requests/RequestFactory';
import { ResponseUser, DBUserPrefs } from '../Types';

interface UserContextType {
  user: ResponseUser|null,
  setUser: React.Dispatch<React.SetStateAction<ResponseUser|null>>,
  prefs: DBUserPrefs,
  setPrefs: React.Dispatch<React.SetStateAction<DBUserPrefs>>,
  isServerUp: boolean, 
  setIsServerUp : React.Dispatch<React.SetStateAction<boolean>>,
  theme: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  testServer : () => void,
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ResponseUser|null>(null);
  const [isServerUp, setIsServerUp] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');
  const [prefs, setPrefs] = useState<DBUserPrefs>(
    { 
      checkedUncheckedBoth: 'both', 
      hideQuantity: true, 
      locked: false, 
      shouldCreateNewItemWhenCreateNewCategory: false, 
      showOnlyItemText: false, 
      theme: 'dark',
    });

  const testServer = async () => {
    await identityApi.isUp(undefined, () => {
      setIsServerUp(false);
      toast.error('Server probably down...');
    });
  };

  return (
    <UserContext.Provider 
      value={{
        user,
        setUser,
        prefs,
        setPrefs,
        isServerUp, setIsServerUp,
        theme, setTheme,
        testServer,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
