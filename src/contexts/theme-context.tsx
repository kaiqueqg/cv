import React, { createContext, useContext, useState, ReactNode } from 'react';


export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const enum SCSSObjType {
  OBJ_BG,
  ITEM_BG,
}

export const enum SCSSItemType {
  INPUT,
  INPUT_CONTRAST,
  INPUT_ALERT,
  TEXT,
  TEXT_CONTRAST,
  TEXT_ALERT,
  BORDERCOLOR,
  BORDERCOLOR_CONTRAST,
  BORDERCOLOR_ALERT,
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>('light');

  const getScssObjColor = (objTheme: string, ...items: SCSSObjType[]) => {
    let finalStyle = '';
    for (let i = 0; i < items.length; i++) {
      let currentStyle = '';
      if(objTheme === 'blue'){
        currentStyle += ' global-blue';
      }
      else if(objTheme === 'red'){
        currentStyle += ' global-red';
      }
      else if(objTheme === 'green'){
        currentStyle += ' global-green';
      }
      else if(objTheme === 'white'){
        currentStyle += ' global-white';
      }
      else if(objTheme === 'cyan'){
        currentStyle += ' global-cyan';
      }
      else if(objTheme === 'pink'){
        currentStyle += ' global-pink';
      }
      else{
        currentStyle += ' global-notheme';
      }
  
      switch (items[i]) {
        case SCSSObjType.ITEM_BG:
          currentStyle += '-item-background';
          break;
        case SCSSObjType.OBJ_BG:
          currentStyle += '-obj-background';
          break;
      }

      finalStyle += ' ' + currentStyle + ' ';
    }
    
    return ' '+finalStyle+' ';
  }

  //
  const getItemScssColor = (objTheme: string, ...items: SCSSItemType[]): string => {
    let finalStyle = '';


    for (let i = 0; i < items.length; i++) {
      let currentStyle = '';
      if(objTheme === 'blue'){
        currentStyle += ' global-blue';
      }
      else if(objTheme === 'red'){
        currentStyle += ' global-red';
      }
      else if(objTheme === 'green'){
        currentStyle += ' global-green';
      }
      else if(objTheme === 'white'){
        currentStyle += ' global-white';
      }
      else if(objTheme === 'cyan'){
        currentStyle += ' global-cyan';
      }
      else if(objTheme === 'pink'){
        currentStyle += ' global-pink';
      }
      else{
        currentStyle += ' global-notheme';
      }
  
      switch(items[i]){
        case SCSSItemType.INPUT:
          currentStyle += '-input';
          break;
        case SCSSItemType.INPUT_CONTRAST:
          currentStyle += '-input-contrast';
          break;
        case SCSSItemType.INPUT_ALERT:
          currentStyle += '-input-alert';
          break;
        case SCSSItemType.TEXT:
          currentStyle += '-text';
          break;
        case SCSSItemType.TEXT_CONTRAST:
          currentStyle += '-text-contrast';
          break;
        case SCSSItemType.TEXT_ALERT:
          currentStyle += '-text-alert';
          break;
        case SCSSItemType.BORDERCOLOR:
          currentStyle += '-bordercolor';
          break;
        case SCSSItemType.BORDERCOLOR_CONTRAST:
          currentStyle += '-bordercolor-contrast';
          break;
        case SCSSItemType.BORDERCOLOR_ALERT:
          currentStyle += '-bordercolor-alert';
          break;
      }

      finalStyle += ' ' + currentStyle + ' ';
    }
    
    return ' '+finalStyle+' ';
  }

  return (
    <ThemeContext.Provider value={{ 
        theme, setTheme,
        getItemScssColor,
        getScssObjColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface ThemeContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  getItemScssColor: (objTheme: string, ...items: SCSSItemType[]) => string
  getScssObjColor: (objTheme: string, ...items: SCSSObjType[]) => string
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};