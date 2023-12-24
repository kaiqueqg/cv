// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import request from '../Requests/RequestFactory';
import storage from '../Storage/Storage';
import { UserModel } from '../Types';

interface UserContextType {
  user: UserModel|null,
  setUser: React.Dispatch<React.SetStateAction<UserModel|null>>,
  baseUrl: string,
  setBaseUrl: React.Dispatch<React.SetStateAction<string>>,
  isServerUp: boolean, 
  setIsServerUp : React.Dispatch<React.SetStateAction<boolean>>,
  testServer : () => void,
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel|null>(null);
  const [baseUrl, setBaseUrl] = useState(storage.getBaseUrl());
  const [isServerUp, setIsServerUp] = useState<boolean>(true);

  const testServer = async () => {
    await request('/IsUp', 'GET', undefined, () => {
      setIsServerUp(false);
      toast.error('Server probably down...');
    });
  };

  return (
    <UserContext.Provider 
      value={{
        user,
        baseUrl,
        setBaseUrl,
        setUser,
        isServerUp, setIsServerUp,
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
