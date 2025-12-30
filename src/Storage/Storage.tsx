import { ResponseUser, UserPrefs } from '../Types';
import log from '../log/log';

type LocalKeys = {
  JwtToken: string,
  User: string,
  FirstLogin: string,
  BaseUrl: string,
  UserPrefs: string,
  AvailableTags: string,
  SelectedTags: string,
  Theme: string,
};

const localKeys: LocalKeys = {
  JwtToken: '@kaiqueqgcv:jwt',
  User: '@kaiqueqgcv:user',
  FirstLogin: '@kaiqueqgcv:FirstLogin',
  BaseUrl: '@kaiqueqgcv:baseurl',
  UserPrefs: '@kaiqueqgcv:UserPrefs',
  AvailableTags: '@kaiqueqgcv:AvailableTags',
  SelectedTags: '@kaiqueqgcv:SelectedTags',
  Theme: '@kaiqueqgcv:Theme',
};

type SessionKeys = {
  TwoFATempToken: string,
};

const sessionKeys: SessionKeys = {
  TwoFATempToken: '@kaiqueqgcv:TwoFATempToken',
};

export const local = {
  //^-------------------- First Token
  getToken(): string|null{
    const token = localStorage.getItem(localKeys.JwtToken);
    return token;
  },
  setToken(token: string){
    localStorage.setItem(localKeys.JwtToken, token);
  },
  deleteToken(){
    localStorage.removeItem(localKeys.JwtToken);
  },

  //^-------------------- User
  getUser(): ResponseUser|null{
    const userJson = localStorage.getItem(localKeys.User);
    return userJson ? JSON.parse(userJson) : null;
  },
  setUser(user: ResponseUser){
    localStorage.setItem(localKeys.User, JSON.stringify(user));
  },
  deleteUser(){
    localStorage.removeItem(localKeys.User);
  },

  //^-------------------- First Login
  getFirstLogin(): boolean|null{
    const firstLogin = localStorage.getItem(localKeys.FirstLogin);
    return firstLogin ? JSON.parse(firstLogin) : null;
  },
  setFirstLogin(value: boolean){
    localStorage.setItem(localKeys.FirstLogin, JSON.stringify(value));
  },
  deleteFirstLogin(){
    localStorage.removeItem(localKeys.FirstLogin);
  },

  //^-------------------- Base Url
  getBaseUrl() : string{
    const value = localStorage.getItem(localKeys.BaseUrl);
    if(value === null){
      console.error("No base url saved on local storage!");
      return 'https://ygwynyk5j6.execute-api.sa-east-1.amazonaws.com/dev/api'
    }
    else return value;
  },
  setBaseUrl(baseUrl: string) {
    localStorage.setItem(localKeys.BaseUrl, baseUrl);
  },

  //^-------------------- User Prefs
  getUserPrefs(): UserPrefs {
    const prefs = localStorage.getItem(localKeys.UserPrefs);
    return prefs ? JSON.parse(prefs) : {
      theme: '',
      allowLocation: false,
      vibrate: false,
      autoSync: false
    };
  },
  setUserPrefs(prefs: UserPrefs) {
    localStorage.setItem(localKeys.UserPrefs, JSON.stringify(prefs));
  },

  //^-------------------- Available Tags
  async writeAvailableTags(tags: string[]): Promise<void> {
    try {
      await localStorage.setItem(localKeys.AvailableTags, JSON.stringify(tags));
    } catch (err) {
      // log.err('stg writeAvailableTags', '[catch] writing available tags.');
    }
  },
  async readAvailableTags(): Promise<string[]|null> {
    try {
      const data = await localStorage.getItem(localKeys.AvailableTags);
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
    await localStorage.removeItem(localKeys.AvailableTags);
  },
  
  //^-------------------- Selected Tags
  async writeSelectedTags(tags: string[]): Promise<void> {
    try {
      await localStorage.setItem(localKeys.SelectedTags, JSON.stringify(tags));
    } catch (err) {
      // log.err('stg writeSelectedTags', '[catch] writing selected tags.');
    }
  },
  async readSelectedTags(): Promise<string[]|null> {
    try {
      const data = await localStorage.getItem(localKeys.SelectedTags);
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
    await localStorage.removeItem(localKeys.SelectedTags);
  },
  
  //^-------------------- Theme
  async writeTheme(theme: string){
    try {
      await localStorage.setItem(localKeys.Theme, theme);
    } catch (err) {
    }
  },
  async readTheme(): Promise<string|null>{
    try {
      const data = await localStorage.getItem(localKeys.Theme);
      if(data !== null){
        return data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

export const session = {
  //^-------------------- Selected Tags
  async writeTwoFATempToken(token: string): Promise<void> {
    try {
      await sessionStorage.setItem(sessionKeys.TwoFATempToken, JSON.stringify(token));
    } catch (err) {
      // log.err('stg writeTwoFATempToken', '[catch] writing selected token.');
    }
  },
  async readTwoFATempToken(): Promise<string|null> {
    try {
      const data = await sessionStorage.getItem(sessionKeys.TwoFATempToken);
      if(data !== null){
        try {
          const parsedData: string = JSON.parse(data);
          return parsedData;
        } catch (err) {
          // log.err('stg readTwoFATempToken', 'Error parsing json');
        }
      }
      return null;
    } catch (err) {
      // log.err('stg readTwoFATempToken', '[catch] reading selected token.');
      return null;
    }
  },

  async deleteTwoFATempToken() {
    await sessionStorage.removeItem(sessionKeys.TwoFATempToken);
  },
}

// export default storage;