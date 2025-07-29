import { LogLevel } from "../Types";
import T from "../text/t";

const currentLogLevel = LogLevel.Dev;

const log = {
  arr(array: any[], f?:(e:any)=>string){
    for(let i = 0; i < array.length; i++){
      if(f)
        log.w(f(array[i]));
      else
        log.w(array[i]);
    }
  },
  arrg(array: any[], f?:(e:any)=>string){
    for(let i = 0; i < array.length; i++){
      if(f)
        log.g(f(array[i]));
      else
        log.g(array[i]);
    }
  },
  arrb(array: any[], f?:(e:any)=>string){
    for(let i = 0; i < array.length; i++){
      if(f)
        log.b(f(array[i]));
      else
        log.b(array[i]);
    }
  },
  arrr(array: any[], f?:(e:any)=>string){
    for(let i = 0; i < array.length; i++){
      if(f)
        log.r(f(array[i]));
      else
        log.r(array[i]);
    }
  },
  arry(array: any[], f?:(e:any)=>string){
    for(let i = 0; i < array.length; i++){
      if(f)
        log.y(f(array[i]));
      else
        log.y(array[i]);
    }
  },
  dev(texts: any[], opts?:string) {
    if (currentLogLevel <= LogLevel.Dev) {
      const formattedTexts = texts.map(text => {
        if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
          return JSON.stringify(text, null, 2); //if object, prettyfy
        } else {
          return text;
        }
      });
      let finalText:string = '';
      formattedTexts.forEach(t => {
        finalText += (' ' + t)
      });
      console.log("%c[DEV]" + finalText, opts?opts:"color: white;");
    }
  },
  w(...texts: any[]){
    log.dev(texts, "color:white;")
  },
  y(...texts: any[]){
    log.dev(texts, "color:yellow;")
  },
  r(...texts: any[]){
    log.dev(texts, "color:red;")
  },
  b(...texts: any[]){
    log.dev(texts, "color:lightblue;")
  },
  g(...texts: any[]){
    log.dev(texts, "color:green;")
  },
  war(...texts: any[]){
    if (currentLogLevel <= LogLevel.Warn) {
      const formattedTexts = texts.map(text => {
        if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
          return JSON.stringify(text, null, 2); //if object, prettyfy
        } else {
          return text;
        }
      });
  
      console.log(`[WAR] `, ...formattedTexts);
    }
  },
  err(...texts: any[]){
    if (currentLogLevel <= LogLevel.Error) {
      const formattedTexts = texts.map(text => {
        if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
          return JSON.stringify(text, null, 2); //if object, prettyfy
        } else {
          return text;
        }
      });
  
      console.log(`[ERR] `, ...formattedTexts);
    }
  },
  pop(text: string|null|undefined){
    if(text !== '' && text !== null && text !== undefined) console.log(text);
  },
  poop(text: string|null|undefined){
    if(text !== '' && text !== null && text !== undefined) console.log(text);
  },
  alert(text: string|null|undefined){
    if(text !== '' && text !== null && text !== undefined) this.err(text);
  },
}

export default log;