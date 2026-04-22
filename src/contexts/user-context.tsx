// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Theme, User, UserPrefs, UserRoles, UserStatus } from '../Types';
import {local, session, StgKey} from '../storage/storage';
import log from '../log/log';
import { Item, ItemType, Objective } from '../TypesObjectives';
import { useLogContext } from './log-context';
// import demoData from './demoData.json';

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextType {
  user: User|null,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  isLogged: boolean,
  logout: () => void,
  prefs: UserPrefs,
  setPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>,
  isServerUp: boolean, 
  setIsServerUp : React.Dispatch<React.SetStateAction<boolean>>,
  theme: string,
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  writeIsLogged: (v: boolean) => void,
  writeAvailableTags: (tags: string[]) => void,
  putAvailableTags: (tags: string[]) => void,
  removeAvailableTags: (tags: string[]) => void,
  availableTags: string[],
  putSelectedTags: (tags: string[]) => void,
  removeSelectedTags: (tags: string[]) => void,
  writeSelectedTags: (selectedTags: string[]) => void,
  selectedTags: string[],

  isReady: boolean,
}

export const DefaultUserPrefs: UserPrefs = {
  theme: Theme.Dark,
  allowLocation: false,
  vibrate: false,
  autoSync: false,
}

export const DefaultUser:User = {
  Email: '',
  Username: 'Demo',
  Role: 'Basic',
  Status: 'Active',
  TwoFAActive: false,
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { removeMessageByText } = useLogContext();
  const [user, setUser] = useState<User>(DefaultUser);
  const [isServerUp, setIsServerUp] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');
  const [prefs, setPrefs] = useState<UserPrefs>(DefaultUserPrefs);
  const [availableTags, setAvailableTags] = useState<string[]>(['Pin']);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pin']);
  const [isLogged, setIsLogged] = useState<boolean>(()=> {
    const value = local.getData(StgKey.IsLogged);
    return value??false;
  });
  const [isReady, setIsReady] = useState<boolean>(false);
  
  useEffect(() => {
    const savedUser: User|null = local.getData(StgKey.User);

    if(savedUser === null){
      setUser(DefaultUser);
      loadDemoData();
      // loadEmptyData();
    }
    else{
      setUser(savedUser);
    }

    loadUserPrefs();
    loadSelectedTags();

    setIsReady(true);
  }, []);

  const loadDemoData = () => {
    try {
      local.setData(StgKey.Objectives, [{ObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",IsShowing:true,IsArchived:false,Title:"Things to do",Theme:"blue",UserId:"",Done:false,Pos:0,LastModified:"2026-04-15T13:38:37.088Z",CreatedAt:"2026-04-15T12:48:42.819Z",IsShowingCheckedGrocery:true,IsShowingCheckedStep:true,IsShowingCheckedExercise:true,IsShowingCheckedMedicine:true,Tags:["Pin","Showing ❗","Compound tag"]},{ObjectiveId:"4euGcCA6JElRj8N4jhSfVkdkw6cvWFJpirt75hIk",IsShowing:false,IsArchived:false,Title:"Objective hidden",Theme:"red",UserId:"",Done:false,Pos:1,LastModified:"2026-04-15T13:36:34.899Z",CreatedAt:"2026-04-15T13:16:15.298Z",IsShowingCheckedGrocery:true,IsShowingCheckedStep:true,IsShowingCheckedExercise:true,IsShowingCheckedMedicine:true,Tags:["Hidden"]},{ObjectiveId:"J05KSMENgrDpoKEbUC07NeCgUeRLZTnz8gobbe55",IsShowing:true,IsArchived:true,Title:"Objective archived",Theme:"cyan",UserId:"",Done:false,Pos:2,LastModified:"2026-04-15T13:36:56.873Z",CreatedAt:"2026-04-15T13:16:28.405Z",IsShowingCheckedGrocery:true,IsShowingCheckedStep:true,IsShowingCheckedExercise:true,IsShowingCheckedMedicine:true,Tags:["Archived"]}]);
      local.setData(StgKey.Items, [{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"1Ttct5zYjLo3UZC1EwcZuDdMUuAUrtI5wEpNsvfc",Pos:1,Type:"Step",LastModified:"2026-04-15T12:54:35.616Z",Title:"Minor problem",CreatedAt:"2026-04-15T12:53:58.233Z",Done:false,Importance:9,AutoDestroy:true},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"D6Ev0k7C63iBxjBPmWATO20ekAUyMaUwR3A8Vp9h",Pos:2,Type:"Step",LastModified:"2026-04-15T13:17:02.103Z",Title:"Should I do that?",CreatedAt:"2026-04-15T12:53:58.637Z",Done:true,Importance:4,AutoDestroy:false},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"SHilZGgk7bhfD2cG2sbtXot457nRvJWuCoBl03Qn",Pos:0,Type:"Step",LastModified:"2026-04-15T12:54:15.466Z",Title:"Very important",CreatedAt:"2026-04-15T12:48:57.831Z",Done:false,Importance:3},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"zxNPRmovSE8rxIvO8ZgJqV0Kh9aZsctSgcjuE678",Pos:3,Type:"Note",LastModified:"2026-04-15T13:19:42.973Z",Title:"Notes",CreatedAt:"2026-04-15T13:17:24.410Z",Text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat eget ipsum eu condimentum. Morbi eleifend mauris lacus, id porttitor nisi condimentum placerat. Curabitur fermentum enim finibus tortor varius, ac bibendum justo interdum. Vivamus dictum lacinia purus a porttitor. Suspendisse convallis enim ac commodo efficitur. Donec sed mollis orci, et auctor orci. Vivamus viverra turpis porttitor sem pellentesque lacinia. "},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"UlbPfnBAn03HD86LPKqgXGIdllU1t3aMTd14iqeW",Pos:4,Type:"Question",LastModified:"2026-04-15T13:20:20.101Z",Title:"",CreatedAt:"2026-04-15T13:20:01.947Z",Statement:"Curabitur fermentum enim finibus tortor varius?",Answer:"Yes"},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"TIblrypOXYFzwzdyUia2csbF4bFSs7DQwkB3rVBx",Pos:5,Type:"Location",LastModified:"2026-04-15T13:21:01.178Z",Title:"Big metal antenna.",CreatedAt:"2026-04-15T13:20:26.555Z",Url:"https://www.google.com/maps/place/Tour+Eiffel/@48.8583736,2.2919064,17z/data=!3m1!4b1!4m6!3m5!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813!16zL20vMDJqODE?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D"},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"Is6vcuDWWxhPwSLphG2hKLNgdIaMpnoycZSvsUfA",Pos:6,Type:"Medicine",LastModified:"2026-04-15T13:21:31.186Z",Title:"Aspirin",CreatedAt:"2026-04-15T13:21:04.175Z",Purpose:"Headache",IsChecked:false,Quantity:3,Unit:"100g",Components:[]},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"GvudpB21DVWJfCBphZIYvPHawuYLl4z0EDG6Rte2",Pos:7,Type:"Grocery",LastModified:"2026-04-15T13:23:00.504Z",Title:"Meat",CreatedAt:"2026-04-15T13:21:37.373Z",IsChecked:false,Quantity:1,Unit:"",GoodPrice:"10€"},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"idOKm0Nss3BziY1EsaEtpZ6rUSGJn6uLMKFTQtWh",Pos:8,Type:"Divider",LastModified:"2026-04-15T13:23:08.246Z",Title:"More items",CreatedAt:"2026-04-15T13:23:04.613Z",IsOpen:true},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"bNoOfqVPdynruazNjgwDY5YZujwjPUFP11XvnZYN",Pos:9,Type:"Exercise",LastModified:"2026-04-15T13:24:00.247Z",Title:"Bench press",CreatedAt:"2026-04-15T13:23:24.787Z",IsDone:false,Reps:2,Series:3,MaxWeight:"100kg",Description:"",Weekdays:["Monday","Tuesday","Wednesday"],LastDone:"2026-04-15T13:23:59.315Z",BodyImages:["chest","triceps"]},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"5EjV8ekmcrganV8CzHhwuSAlNj0JOZnktKjOvJtw",Pos:10,Type:"Exercise",LastModified:"2026-04-15T13:34:33.767Z",Title:"Deadlift",CreatedAt:"2026-04-15T13:24:05.675Z",IsDone:true,Reps:1,Series:1,MaxWeight:"",Description:"",Weekdays:[],LastDone:"2026-04-15T13:34:33.767Z",BodyImages:[]},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"YkcPUWmwbfKeEZPfVphsnkGwInJLGltNfy1NqiVL",Pos:11,Type:"Link",LastModified:"2026-04-15T13:30:45.425Z",Title:"Link to website",CreatedAt:"2026-04-15T13:24:20.737Z",Link:"https://www.france.fr/en/"},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"gFDePaPKxNaTE2OaFYLYjWgRVGj0n9M0yb5nx1Tw",Pos:12,Type:"House",LastModified:"2026-04-15T13:36:07.674Z",Title:"Beautiful house.",CreatedAt:"2026-04-15T13:24:43.217Z",Listing:"https://www.google.com/maps/place/Maison+Blanche/@38.8976804,-77.0391047,16z/data=!3m1!4b1!4m6!3m5!1s0x89b7b7bcdecbb1df:0x715969d86d0b76bf!8m2!3d38.8976763!4d-77.0365298!16zL20vMDgxc3E?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",MapLink:"https://www.google.com/maps/place/Maison+Blanche/@38.8976804,-77.0391047,16z/data=!3m1!4b1!4m6!3m5!1s0x89b7b7bcdecbb1df:0x715969d86d0b76bf!8m2!3d38.8976763!4d-77.0365298!16zL20vMDgxc3E?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D",MeterSquare:"",Rating:0,Address:"",TotalPrice:0,Contacted:false,Details:"Looks good, but has crazy people inside.",Attention:"Expensive.",WasContacted:false},{UserIdObjectiveId:"PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk",ItemId:"iamyXrFdMscjUP58qmoFPWM9FO1Hs93Dze0GeDKK",Pos:13,Type:"Review",LastModified:"2026-04-15T13:33:31.113Z",Title:"Review: 1841 Veuve Clicquot",CreatedAt:"2026-04-15T13:28:05.289Z",Rating:"3/5",Description:"Tastes like Veuve Clicquot 1841… flat, tired, and ready for retirement.",IsCurrentChoise:false}], 'PuAW3jZJrjyhQWURtqt8QPmGkjNsieKAQ8WqZVdk');
      local.setData(StgKey.SelectedTags, ["Pin","Showing ❗","Compound tag","Hidden","Archived"]);
      local.setData(StgKey.AvailableTags, ["Pin","Showing ❗","Compound tag","Hidden","Archived"]);
    } catch (err) {
    }
  }

  const loadEmptyData = () => {
    try {
      local.clearAll();
    } catch (err) {
    }
  }

  const logout = () => {
    local.deleteData(StgKey.JwtToken);
    local.deleteData(StgKey.User);
    local.deleteData(StgKey.AvailableTags);
    local.deleteData(StgKey.SelectedTags);
    local.deleteData(StgKey.FirstLogin);
    setUser(DefaultUser);

    localStorage.clear();
    sessionStorage.clear();
  };

  const loadUserPrefs = async () => {
    const userPrefs = await local.getData(StgKey.UserPrefs);
  };

  const loadSelectedTags = async () => {
    const storageAvailableTags = local.getData(StgKey.AvailableTags);
    if (storageAvailableTags) {
      writeAvailableTags(Array.from(storageAvailableTags));
    }

    if (storageAvailableTags) {
      const storageSelectedTags = local.getData(StgKey.SelectedTags);
      if(storageSelectedTags) {
        const filteredTags = storageSelectedTags.filter((tag: string) => storageAvailableTags.includes(tag));
        writeSelectedTags(Array.from(filteredTags));
      }
    } else {
      //log.err('no selected tags');
    }
  };

  const writeIsLogged = (v: boolean) => {
    try {
      local.setData(StgKey.IsLogged, v);
      setIsLogged(v);

      if(v !== isLogged) {
        if(v) removeMessageByText('Not logged.')
        else loadEmptyData();
      }
    } catch (err) {
      log.err('writeIsLogged', 'Problem writing is logged.', err);
    }
  };
  
  const writeAvailableTags = (availableTags: string[]) => {
    try {
      const uniqueTags = Array.from(new Set([...availableTags, 'Pin']));
      local.setData(StgKey.AvailableTags, uniqueTags);
      setAvailableTags(uniqueTags);
    } catch (err) {
      log.err('AvailableTags', 'Problem writing available tags', err);
    }
  };

  const putAvailableTags = (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...availableTags, ...tags, 'Pin']));
      local.setData(StgKey.AvailableTags, newTags);
      setAvailableTags(newTags);
    } catch (err) {
      log.err('putAvailableTags', 'Problem putting available tags', err);
    }
  };

  const removeAvailableTags = (tags: string[]) => {
    try {
      const newTags = availableTags.filter((t) => !tags.includes(t));
      local.setData(StgKey.AvailableTags, newTags);
      setAvailableTags(newTags);
    } catch (err) {
      log.err('removeAvailableTags', 'Problem removing available tags', err);
    }
  };
  
  const removeSelectedTags = (tags: string[]) => {
    try {
      const newTags = selectedTags.filter((t) => !tags.includes(t));
      local.setData(StgKey.SelectedTags, newTags);
      setSelectedTags(newTags);
    } catch (err) {
      log.err('removeSelectedTags', 'Problem removing selected tags', err);
    }
  };

  const putSelectedTags = (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...selectedTags, ...tags, 'Pin']));
      local.setData(StgKey.SelectedTags, newTags);
      setSelectedTags(newTags);
    } catch (err) {
      log.err('putSelectedTags', 'Problem putting selected tags', err);
    }
  };

  const writeSelectedTags = (selectedTags: string[]) => {
    try {
      const uniqueTags = Array.from(new Set([...selectedTags, 'Pin']));
      local.setData(StgKey.SelectedTags, uniqueTags);
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
        isLogged,
        logout,
        prefs,
        setPrefs,
        isServerUp,
        setIsServerUp,
        theme,
        setTheme,
        writeIsLogged,
        writeAvailableTags,
        putAvailableTags,
        removeAvailableTags,
        availableTags,
        putSelectedTags,
        removeSelectedTags,
        writeSelectedTags,
        selectedTags,

        isReady,
      }}
    >
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
