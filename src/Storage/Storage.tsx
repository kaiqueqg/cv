import { ResponseUser, UserPrefs } from '../Types';
import log from '../log/log';


type StorageKeys = {
  JwtToken: string,
  User: string,
  BaseUrl: string,
  UserPrefs: string,
  AvailableTags: string,
  SelectedTags: string,
};

const keys: StorageKeys = {
  JwtToken: '@kaiqueqgcv:jwt',
  User: '@kaiqueqgcv:user',
  BaseUrl: '@kaiqueqgcv:baseurl',
  UserPrefs: '@kaiqueqgcv:UserPrefs',
  AvailableTags: '@kaiqueqgcv:AvailableTags',
  SelectedTags: '@kaiqueqgcv:SelectedTags',
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
    localStorage.removeItem(keys.User);
  },
  getBaseUrl() : string{
    const value = localStorage.getItem(keys.BaseUrl);
    if(value === null){
      console.error("No base url saved on local storage!");
      return 'https://ygwynyk5j6.execute-api.sa-east-1.amazonaws.com/dev/api'
    }
    else return value;
  },
  setBaseUrl(baseUrl: string) {
    localStorage.setItem(keys.BaseUrl, baseUrl);
  },
  getUserPrefs(): UserPrefs {
    const prefs = localStorage.getItem(keys.UserPrefs);
    return prefs ? JSON.parse(prefs) : {
      theme: '',
      allowLocation: false,
      vibrate: false,
      autoSync: false
    };
  },
  setUserPrefs(prefs: UserPrefs) {
    localStorage.setItem(keys.UserPrefs, JSON.stringify(prefs));
  },
  //^-------------------- TAGS
  async writeAvailableTags(tags: string[]): Promise<void> {
    try {
      await localStorage.setItem(keys.AvailableTags, JSON.stringify(tags));
    } catch (err) {
      // log.err('stg writeAvailableTags', '[catch] writing available tags.');
    }
  },
  async readAvailableTags(): Promise<string[]|null> {
    try {
      const data = await localStorage.getItem(keys.AvailableTags);
      if(data !== null){
        try {
          const parsedData: string[] = JSON.parse(data);
          return parsedData;
        } catch (err) {
          // log.err('stg readAvailableTags', 'Error parsing json');
        }
      }
      return null;
    } catch (err) {
      // log.err('stg readAvailableTags', '[catch] reading available tags.');
      return null;
    }
  },

  async deleteAvailableTags() {
    log.r('deleting available');
    await localStorage.removeItem(keys.AvailableTags);
    log.g('done  available');
  },

  async writeSelectedTags(tags: string[]): Promise<void> {
    try {
      await localStorage.setItem(keys.SelectedTags, JSON.stringify(tags));
    } catch (err) {
      // log.err('stg writeSelectedTags', '[catch] writing selected tags.');
    }
  },
  async readSelectedTags(): Promise<string[]|null> {
    try {
      const data = await localStorage.getItem(keys.SelectedTags);
      if(data !== null){
        try {
          const parsedData: string[] = JSON.parse(data);
          return parsedData;
        } catch (err) {
          // log.err('stg readSelectedTags', 'Error parsing json');
        }
      }
      return null;
    } catch (err) {
      // log.err('stg readSelectedTags', '[catch] reading selected tags.');
      return null;
    }
  },

  async deleteSelectedTags() {
    await localStorage.removeItem(keys.SelectedTags);
  },
}


export default storage;