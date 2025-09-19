import React, { createContext, useContext, useState, ReactNode } from 'react';


export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const enum SCSSItemType {
  INPUT,
  INPUT_ALERT,
  TEXT,
  TEXT_ALERT,
  BORDERCOLOR,
  BORDERCOLOR_ALERT,
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>('light');

  const getScssColor = (item: SCSSItemType, objTheme: string): string => {
    let finalStyle = '';
    if(objTheme === 'blue'){
      finalStyle += ' global-blue';
    }
    else if(objTheme === 'red'){
      finalStyle += ' global-red';
    }
    else if(objTheme === 'green'){
      finalStyle += ' global-green';
    }
    else if(objTheme === 'white'){
      finalStyle += ' global-white';
    }
    else if(objTheme === 'cyan'){
      finalStyle += ' global-cyan';
    }
    else if(objTheme === 'pink'){
      finalStyle += ' global-pink';
    }
    else{
      finalStyle += ' global-notheme';
    }

    switch(item){
      case SCSSItemType.INPUT:
        finalStyle += '-input';
        break;
      case SCSSItemType.INPUT_ALERT:
        finalStyle += '-input-alert';
        break;
      case SCSSItemType.TEXT:
        finalStyle += '-text';
        break;
      case SCSSItemType.TEXT_ALERT:
        finalStyle += '-text-alert';
        break;
      case SCSSItemType.BORDERCOLOR:
        finalStyle += '-bordercolor';
        break;
      case SCSSItemType.BORDERCOLOR_ALERT:
        finalStyle += '-bordercolor-alert';
        break;
    }
    
    return finalStyle;
  }

  return (
    <ThemeContext.Provider value={{ 
        theme, setTheme,
        getScssColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface ThemeContextProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>,
  getScssColor: (item: SCSSItemType, objTheme: string, baseClass?: string) => string
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};