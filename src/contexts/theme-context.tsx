import React, { createContext, useContext, useState, ReactNode } from 'react';


export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const enum SCSS {
  OBJ_BG,
  ITEM_BG,
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
  // const [theme, setTheme] = useState<string>('light');

  const getTintColor = (objTheme: string): string => {
    if(objTheme === 'white' || objTheme === 'pink')
      return '-black';
    else
      return '';
  }
  
  const getThemeString = (item: SCSS, fade?: boolean, isSelecting?: boolean, isSelected?: boolean) => {
    switch(item){
      case SCSS.OBJ_BG:
        return '-obj-background';
      case SCSS.ITEM_BG:
        return '-item-background'+(fade?'-fade':'');
      case SCSS.INPUT:
        return '-input input ';
      case SCSS.INPUT_CONTRAST:
        return '-input-contrast input ';
      case SCSS.INPUT_ALERT:
        return '-input-alert input ';
      case SCSS.TEXT:
        return '-text'+(fade?'-fade':'');
      case SCSS.TEXT_CONTRAST:
        return '-text-contrast';
      case SCSS.TEXT_ALERT:
        return '-text-alert';
      case SCSS.BORDERCOLOR:
        if(isSelected)
          return '-bordercolor-selected';
        else if(isSelecting)
          return '-bordercolor-selecting';
        else if(fade)
          return '-bordercolor-fade';
        else
          return '-bordercolor';
      case SCSS.BORDERCOLOR_CONTRAST:
        if(isSelected)
          return '-bordercolor-selected';
        else if(isSelecting)
          return '-bordercolor-selecting';
        else if(fade)
          return '-bordercolor-fade';
        else
          return '-bordercolor-contrast';
      case SCSS.BORDERCOLOR_ALERT:
        return '-bordercolor-alert';
      }

      return '';
  }

  const scss = (objTheme: string, items: SCSS[]|SCSS, fade?: boolean, isSelecting?: boolean, isSelected?: boolean): string => {
    let finalSCSS = '';
    let baseStyle = '';

    if(objTheme === 'blue'){
      baseStyle += ' global-blue';
    }
    else if(objTheme === 'red'){
      baseStyle += ' global-red';
    }
    else if(objTheme === 'green'){
      baseStyle += ' global-green';
    }
    else if(objTheme === 'white'){
      baseStyle += ' global-white';
    }
    else if(objTheme === 'cyan'){
      baseStyle += ' global-cyan';
    }
    else if(objTheme === 'pink'){
      baseStyle += ' global-pink';
    }
    else{
      baseStyle += ' global-notheme';
    }

    if(Array.isArray(items)){
      for (let i = 0; i < items.length; i++) {
        finalSCSS += (baseStyle + getThemeString(items[i], fade, isSelecting, isSelected));
      }
    }
    else{
      finalSCSS += (baseStyle + getThemeString(items, fade, isSelecting, isSelected));
    }

    return ' '+finalSCSS+' ';
  }

  return (
    <ThemeContext.Provider value={{ 
        // theme, setTheme,
        scss,
        getTintColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface ThemeContextProps {
  // theme: string;
  // setTheme: React.Dispatch<React.SetStateAction<string>>,
  scss: (objTheme: string, items: SCSS[], fade?: boolean, isSelecting?: boolean, isSelected?: boolean) => string
  getTintColor: (objTheme: string) => string,
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};