// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ResponseUser, UserPrefs } from '../Types';
import storage from '../storage/storage';
import log from '../log/log';

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ResponseUser | null>(null);
  const [isServerUp, setIsServerUp] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');
  const [prefs, setPrefs] = useState<UserPrefs>({
    theme: 'dark',
    allowLocation: false,
    vibrate: true,
    autoSync: false, 
  });
  
  useEffect(() => {
    loadUserPrefs();
    loadSelectedTags();
  }, []);

  const logout = async () => {
    storage.deleteToken();
    storage.deleteUser();
    storage.deleteAvailableTags();
    storage.deleteSelectedTags();
    storage.deleteFirstLogin();
    setUser(null);
  };

  const loadUserPrefs = async () => {
    const userPrefs = await storage.getUserPrefs();
  };

  const loadSelectedTags = async () => {
    const storageAvailableTags = await storage.readAvailableTags();
    if (storageAvailableTags) {
      writeAvailableTags(Array.from(storageAvailableTags));
    }

    if (storageAvailableTags) {
      const storageSelectedTags = await storage.readSelectedTags();
      if(storageSelectedTags) {
        const filteredTags = storageSelectedTags.filter((tag: string) => storageAvailableTags.includes(tag));
        writeSelectedTags(Array.from(filteredTags));
      }
    } else {
      //log.err('no selected tags');
    }
  };

  const [availableTags, setAvailableTags] = useState<string[]>(['Pin']);
  const writeAvailableTags = async (availableTags: string[]) => {
    try {
      const uniqueTags = Array.from(new Set([...availableTags, 'Pin']));
      await storage.writeAvailableTags(uniqueTags);
      setAvailableTags(uniqueTags);
    } catch (err) {
      log.err('AvailableTags', 'Problem writing available tags', err);
    }
  };

  const putAvailableTags = async (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...availableTags, ...tags, 'Pin']));
      await storage.writeAvailableTags(newTags);
      setAvailableTags(newTags);
    } catch (err) {
      log.err('putAvailableTags', 'Problem putting available tags', err);
    }
  };

  const removeAvailableTags = async (tags: string[]) => {
    try {
      const newTags = availableTags.filter((t) => !tags.includes(t));
      await storage.writeAvailableTags(newTags);
      setAvailableTags(newTags);
    } catch (err) {
      log.err('removeAvailableTags', 'Problem removing available tags', err);
    }
  };

  const [selectedTags, setSelectedTags] = useState<string[]>(['Pin']);
  const removeSelectedTags = async (tags: string[]) => {
    try {
      const newTags = selectedTags.filter((t) => !tags.includes(t));
      await storage.writeSelectedTags(newTags);
      setSelectedTags(newTags);
    } catch (err) {
      log.err('removeSelectedTags', 'Problem removing selected tags', err);
    }
  };

  const putSelectedTags = async (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...selectedTags, ...tags, 'Pin']));
      await storage.writeSelectedTags(newTags);
      setSelectedTags(newTags);
    } catch (err) {
      log.err('putSelectedTags', 'Problem putting selected tags', err);
    }
  };

  const writeSelectedTags = async (selectedTags: string[]) => {
    try {
      const uniqueTags = Array.from(new Set([...selectedTags, 'Pin']));
      await storage.writeSelectedTags(uniqueTags);
      setSelectedTags(uniqueTags);
    } catch (err) {
      log.err('SelectedTags', 'Problem writing selected tags', err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        prefs,
        setPrefs,
        // firstLogin,
        // writeFirstLogin,
        isServerUp,
        setIsServerUp,
        theme,
        setTheme,
        writeAvailableTags,
        putAvailableTags,
        removeAvailableTags,
        availableTags,
        putSelectedTags,
        removeSelectedTags,
        writeSelectedTags,
        selectedTags,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

interface UserContextType {
  user: ResponseUser|null,
  setUser: React.Dispatch<React.SetStateAction<ResponseUser|null>>,
  logout: () => void,
  prefs: UserPrefs,
  setPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>,
  // firstLogin: boolean,
  // writeFirstLogin: (value: boolean) => void,
  isServerUp: boolean, 
  setIsServerUp : React.Dispatch<React.SetStateAction<boolean>>,
  theme: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  writeAvailableTags: (tags: string[]) => void,
  putAvailableTags: (tags: string[]) => void,
  removeAvailableTags: (tags: string[]) => void,
  availableTags: string[],
  putSelectedTags: (tags: string[]) => void,
  removeSelectedTags: (tags: string[]) => void,
  writeSelectedTags: (selectedTags: string[]) => void,
  selectedTags: string[],
}


export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
