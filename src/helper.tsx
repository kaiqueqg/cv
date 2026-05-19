export const shouldBeBlack = (theme: string):boolean => { return theme==='white' || theme==='pink'}

export const removeAccents = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export const compareTextForSearch = (text: string, search: string, options?: {searchMatchAccent?: boolean, searchMatchCase?: boolean, searchdMatchWholeWord: boolean}): boolean=> {
  let newSearch = search.trim();
  let newText = text.trim();
  if(options) {
    if(!options.searchMatchAccent){
      newSearch = removeAccents(newSearch);
      newText = removeAccents(newText);
    }
    if(!options.searchMatchCase){
      newSearch = newSearch.toLowerCase();
      newText = newText.toLowerCase();
    }
  
    if(options.searchdMatchWholeWord){
      const v = (newText === newSearch);
      return v;
    }
    else{
      const v = newText.includes(newSearch);
      return v;
    }
  }
  else{
    let newSearch = search.trim();
    let newText = text.trim();
    newSearch = removeAccents(newSearch);
    newText = removeAccents(newText);
    newSearch = newSearch.toLowerCase();
    newText = newText.toLowerCase();

    return newText.includes(newSearch);
  }
}