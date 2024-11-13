import { toast } from 'react-toastify';
import { ResponseUser, DBUserPrefs } from '../Types';


type StorageKeys = {
  JwtToken: string,
  User: string,
  BaseUrl: string,
  DBUserPrefs: string,
};

const keys: StorageKeys = {
  JwtToken: '@kaiqueqgcv:jwt',
  User: '@kaiqueqgcv:user',
  BaseUrl: '@kaiqueqgcv:baseurl',
  DBUserPrefs: '@kaiqueqgcv:dBUserPrefs',
};

const storage = {
  getToken(): string|null{
    const token = localStorage.getItem(keys.JwtToken);
    return token;
  },
  setToken(token: string){
    localStorage.setItem(keys.JwtToken, token);
  },
  deleteToken(){
    localStorage.removeItem(keys.JwtToken);
  },
  getUser(): ResponseUser|null{
    const userJson = localStorage.getItem(keys.User);
    return userJson ? JSON.parse(userJson) : null;
  },
  setUser(user: ResponseUser){
    localStorage.setItem(keys.User, JSON.stringify(user));
  },
  deleteUser(){
    localStorage.removeItem(keys.User)
  },
  getBaseUrl() : string{
    const value = localStorage.getItem(keys.BaseUrl);
    if(value === null){
      toast.error("No base url saved on local storage!");
      return 'https://ygwynyk5j6.execute-api.sa-east-1.amazonaws.com/dev/api'
    }
    else return value;
  },
  setBaseUrl(baseUrl: string) {
    toast.warning(baseUrl);
    localStorage.setItem(keys.BaseUrl, baseUrl);
  },
  getDBUserPrefs(): DBUserPrefs {
    const prefs = localStorage.getItem(keys.DBUserPrefs);
    return prefs ? JSON.parse(prefs) : { checkedUncheckedBoth: 'both', hideQuantity: true, locked: false, shouldCreateNewItemWhenCreateNewCategory: false, theme: 'dark' };
  },
  setDBUserPrefs(prefs: DBUserPrefs) {
    localStorage.setItem(keys.DBUserPrefs, JSON.stringify(prefs));
  },
}


export default storage;