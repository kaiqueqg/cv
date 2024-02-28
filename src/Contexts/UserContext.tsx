// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { identityApi } from '../Requests/RequestFactory';
import { DBUser } from '../Types';

interface UserContextType {
  user: DBUser|null,
  setUser: React.Dispatch<React.SetStateAction<DBUser|null>>,
  hideQuantity: boolean,
  setHideQuantity: React.Dispatch<React.SetStateAction<boolean>>,
  shouldCreateNewItemWhenCreateNewCategory: boolean,
  setShouldCreateNewItemWhenCreateNewCategory: React.Dispatch<React.SetStateAction<boolean>>,
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
  const [user, setUser] = useState<DBUser|null>(null);
  const [hideQuantity, setHideQuantity] = useState<boolean>(false);
  const [shouldCreateNewItemWhenCreateNewCategory, setShouldCreateNewItemWhenCreateNewCategory,] = useState<boolean>(false);
  const [isServerUp, setIsServerUp] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');

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
        hideQuantity, setHideQuantity, 
        shouldCreateNewItemWhenCreateNewCategory, setShouldCreateNewItemWhenCreateNewCategory,
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
