import { stringify } from 'querystring';
import { Theme, User, UserPrefs } from '../Types';
import { Item, Objective } from '../TypesObjectives';
import log from '../log/log';

type LocalKeys = {
  JwtToken: string,
  IsLogged: string,
  User: string,
  FirstLogin: string,
  BaseUrl: string,
  UserPrefs: string,
  AvailableTags: string,
  SelectedTags: string,
  Theme: string,
  Objectives: string,
  Items: string,
};

const localKeys: LocalKeys = {
  JwtToken: '@kaiqueqgcv:jwt',
  IsLogged: '@kaiqueqgcv:IsLogged',
  User: '@kaiqueqgcv:user',
  FirstLogin: '@kaiqueqgcv:FirstLogin',
  BaseUrl: '@kaiqueqgcv:baseurl',
  UserPrefs: '@kaiqueqgcv:UserPrefs',
  AvailableTags: '@kaiqueqgcv:AvailableTags',
  SelectedTags: '@kaiqueqgcv:SelectedTags',
  Theme: '@kaiqueqgcv:Theme',
  Objectives: '@kaiqueqgcv:Objectives',
  Items: '@kaiqueqgcv:Items',
};

type SessionKeys = {
  TwoFATempToken: string,
};

const sessionKeys: SessionKeys = {
  TwoFATempToken: '@kaiqueqgcv:TwoFATempToken',
};

export const randomId = (size?: number): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  const amount = size ?? 40;
  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }
  return randomString;
};

export enum StgKey{
  JwtToken = '@kaiqueqgcv:jwt',
  IsLogged = '@kaiqueqgcv:IsLogged',
  User = '@kaiqueqgcv:user',
  FirstLogin = '@kaiqueqgcv:FirstLogin',
  BaseUrl = '@kaiqueqgcv:baseurl',
  UserPrefs = '@kaiqueqgcv:UserPrefs',
  AvailableTags = '@kaiqueqgcv:AvailableTags',
  SelectedTags = '@kaiqueqgcv:SelectedTags',
  Theme = '@kaiqueqgcv:Theme',
  Objectives = '@kaiqueqgcv:Objectives',
  Items = '@kaiqueqgcv:Items',
}

type StorageTypes = {
  [StgKey.JwtToken]: string;
  [StgKey.IsLogged]: boolean;
  [StgKey.User]: User;
  [StgKey.FirstLogin]: boolean;
  [StgKey.BaseUrl]: string;
  [StgKey.UserPrefs]: UserPrefs;
  [StgKey.AvailableTags]: string[];
  [StgKey.SelectedTags]: string[];
  [StgKey.Theme]: Theme;
  [StgKey.Objectives]: Objective[];
  [StgKey.Items]: any[];
};

export const local = {
  getData<T extends StgKey>(k: T, compositiveKey?: string): StorageTypes[T]|null {
    try {
      const data: string|null = localStorage.getItem(k + (compositiveKey?(':'+compositiveKey):''));
      if(data === null) return null;
  
      return JSON.parse(data) as StorageTypes[T];
    } catch (err) {
      log.r('Problem getting value. ' + err);
      return null;
    }
  },
  setData<T extends StgKey>(k: T, d: StorageTypes[T], compositiveKey?: string): boolean{
    try {
      localStorage.setItem(k + (compositiveKey?(':'+compositiveKey):''), JSON.stringify(d));
      return true;
    } catch (err) {
      log.r('Problem setting value. ' + err);
      return false;
    }
  },
  deleteData(k: StgKey, compositiveKey?: string): boolean{
    try {
      localStorage.removeItem(k + (compositiveKey?(':'+compositiveKey):''));
      return true;
    } catch (err) {
      log.r('Problem deleting value. ' + err);
      return false;
    }
  },
  clearAll(){
    localStorage.clear();
  }
}

export const session = {
  //^-------------------- Selected Tags
  writeTwoFATempToken(token: string): void {
    try {
      sessionStorage.setItem(sessionKeys.TwoFATempToken, JSON.stringify(token));
    } catch (err) {
      // log.err('stg writeTwoFATempToken', '[catch] writing selected token.');
    }
  },
  readTwoFATempToken(): string|null {
    try {
      const data = sessionStorage.getItem(sessionKeys.TwoFATempToken);
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

  deleteTwoFATempToken() {
    sessionStorage.removeItem(sessionKeys.TwoFATempToken);
  },
  clearAll(){
    sessionStorage.clear();
  }
}