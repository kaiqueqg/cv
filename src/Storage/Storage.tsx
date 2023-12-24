import { toast } from 'react-toastify';
import { UserModel } from '../Types';


type StorageKeys = {
  JwtToken: string,
  User: string,
  BaseUrl: string,
};

const keys: StorageKeys = {
  JwtToken: '@kaiqueqgcv:jwt',
  User: '@kaiqueqgcv:user',
  BaseUrl: '@kaiqueqgcv:baseurl',
};

const storage = {
  getToken(): string|null{
    const token = localStorage.getItem(keys.JwtToken);
    //console.log('token: ' + token);
    return token;
  },
  setToken(token: string){
    localStorage.setItem(keys.JwtToken, token);
  },
  deleteToken(){
    localStorage.removeItem(keys.JwtToken);
  },
  getUser(): UserModel|null{
    const userJson = localStorage.getItem(keys.User);
    //console.log('getUser: ' + userJson)
    return userJson ? JSON.parse(userJson) : null;
  },
  setUser(user: UserModel){
    //console.log('setUser' + keys.User);
    localStorage.setItem(keys.User, JSON.stringify(user));
  },
  deleteUser(){
    localStorage.removeItem(keys.User)
  },
  getBaseUrl() : string{
    const value = localStorage.getItem(keys.BaseUrl);
    if(value === null){
      toast.error("No base url saved on cookie!");
      return 'https://ygwynyk5j6.execute-api.sa-east-1.amazonaws.com/dev/api'
    }
    else return value;
  },
  setBaseUrl(baseUrl: string) {
    toast.warning(baseUrl);
    localStorage.setItem(keys.BaseUrl, baseUrl);
  },
}


export default storage;