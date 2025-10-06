// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Divider, Grocery, Item, ItemType, Location,  Note, Question, Step, Wait, Objective } from '../TypesObjectives';
import { LogLevel, MessageType, PopMessage, } from '../Types';

interface LogProviderProps {
  children: ReactNode;
}

const LogContext = createContext<LogContextType | undefined>(undefined);
const currentLogLevel = LogLevel.Dev;

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  
  const randomId = (size?: number) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    const amount = size ?? 40;
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
    return randomString;
  };
  
  const [consoleLogs, setConsoleLogs] = useState<string>('');
  // const putLog = (...messages: (string | undefined)[]) => {
  //   const newLogEntry = messages.join('\n');
  //   setConsoleLogs((prevLogs) => `${prevLogs}\n${newLogEntry}`);
  // };

  const deleteLog = () => {
    setConsoleLogs('');
  };

  const log: LogFunctions = {
    arr(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrg(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrb(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrr(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arry(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    dev(...texts: any[]) {
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';

          if (typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;255;255;255m[DEV]`, ...formattedTexts);
        // putLog(...formattedTexts);
      }
    },
    o(...objs: Objective[]){
      const formattedTexts = objs.map(text => {
        if(text === null) return 'null';
        if(text === undefined) return 'undefined';
        return text.Title;
      });
      console.log('%c[DEV]' + formattedTexts, 'color: rgb(255, 80, 80); font-weight: bold;');
      // putLog(...formattedTexts);
    },
    i(...texts: Item[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text.Type===ItemType.Divider) return (text as Divider).Title;
          if(text.Type===ItemType.Grocery) return (text as Grocery).Title;
          if(text.Type===ItemType.Location) return (text as Location).Title;
          if(text.Type===ItemType.Note) return (text as Note).Text;
          if(text.Type===ItemType.Question) return (text as Question).Statement;
          if(text.Type===ItemType.Step) return (text as Step).Title;
          if(text.Type===ItemType.Wait) return (text as Wait).Title;
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgba(255, 255, 255, 1); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    ir(...texts: Item[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text.Type===ItemType.Divider) return (text as Divider).Title;
          if(text.Type===ItemType.Grocery) return (text as Grocery).Title;
          if(text.Type===ItemType.Location) return (text as Location).Title;
          if(text.Type===ItemType.Note) return (text as Note).Text;
          if(text.Type===ItemType.Question) return (text as Question).Statement;
          if(text.Type===ItemType.Step) return (text as Step).Title;
          if(text.Type===ItemType.Wait) return (text as Wait).Title;
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(255, 80, 80); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    ig(...texts: Item[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text.Type===ItemType.Divider) return (text as Divider).Title;
          if(text.Type===ItemType.Grocery) return (text as Grocery).Title;
          if(text.Type===ItemType.Location) return (text as Location).Title;
          if(text.Type===ItemType.Note) return (text as Note).Text;
          if(text.Type===ItemType.Question) return (text as Question).Statement;
          if(text.Type===ItemType.Step) return (text as Step).Title;
          if(text.Type===ItemType.Wait) return (text as Wait).Title;
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgba(21, 255, 0, 1); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    ib(...texts: Item[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text.Type===ItemType.Divider) return (text as Divider).Title;
          if(text.Type===ItemType.Grocery) return (text as Grocery).Title;
          if(text.Type===ItemType.Location) return (text as Location).Title;
          if(text.Type===ItemType.Note) return (text as Note).Text;
          if(text.Type===ItemType.Question) return (text as Question).Statement;
          if(text.Type===ItemType.Step) return (text as Step).Title;
          if(text.Type===ItemType.Wait) return (text as Wait).Title;
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgba(25, 0, 255, 1); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    y(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if(typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(255, 255, 80); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    r(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if(typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(255, 80, 80); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    b(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(80, 80, 255); font-weight: bold;');
        //putLog(...formattedTexts);
      }
    },
    g(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(80, 255, 80); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    w(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log('%c[DEV]' + formattedTexts, 'color: rgb(255, 255,255); font-weight: bold;');
        // putLog(...formattedTexts);
      }
    },
    war(...texts: any[]){
      if (currentLogLevel <= LogLevel.Warn) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
    
        console.log(`\x1b[38;2;255;255;80m[WAR]`, ...formattedTexts);
        // putLog(...formattedTexts);
      }
    },
    err(...texts: any[]){
      if (currentLogLevel <= LogLevel.Error) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
    
        console.log(`\x1b[38;2;255;80;80m[ERR]`, ...formattedTexts);
        // putLog(...formattedTexts);
      }
    },
  }

  const [messageList, setMessageList] = useState<PopMessage[]>([]);
  const popMessage = (text: string, type?: MessageType, timeoutInSeconds?: number) => {
    let timeout = 3000;

    if(timeoutInSeconds){
      timeout = timeoutInSeconds*1000;
      if(timeoutInSeconds > 30) timeout = 30000;
      if(timeoutInSeconds < 1) timeout = 1000;
    }

    setMessageList((prevList) => [
      ...prevList,
      {
        id: randomId(),
        text: text,
        type: type ?? MessageType.Normal,
        timeout: timeout,
      },
    ]);
  }
  const removeMessage = (removeId: string) => {
    setMessageList(prevMessages => prevMessages.filter(msg => msg.id !== removeId));
  }
    
  return (
    <LogContext.Provider 
    value={{
      log,
      consoleLogs,
      deleteLog,
      messageList, popMessage, removeMessage,
    }}>
    {children}
    </LogContext.Provider>
  );
};

interface LogFunctions {
  arr: (array: any[], f?: (e: any) => string) => void;
  arrg: (array: any[], f?: (e: any) => string) => void;
  arrb: (array: any[], f?: (e: any) => string) => void;
  arrr: (array: any[], f?: (e: any) => string) => void;
  arry: (array: any[], f?: (e: any) => string) => void;

  dev: (...texts: any[]) => void;
  o: (...objs: Objective[]) => void;
  i: (...texts: Item[]) => void;
  ir: (...texts: Item[]) => void;
  ig: (...texts: Item[]) => void;
  ib: (...texts: Item[]) => void;
  y: (...texts: any[]) => void;
  r: (...texts: any[]) => void;
  b: (...texts: any[]) => void;
  g: (...texts: any[]) => void;
  w: (...texts: any[]) => void;
  war: (...texts: any[]) => void;
  err: (...texts: any[]) => void;
}

interface LogContextType {
  log: LogFunctions,
  consoleLogs: string,
  deleteLog: () => void,
  //^Message
  messageList: PopMessage[],
  popMessage: (text: string, type?: MessageType, timeoutInSeconds?: number) => void,
  removeMessage: (removeId: string) => void,
}

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
};
