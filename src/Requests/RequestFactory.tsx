import {  toast } from 'react-toastify';
import log from '../Log/Log';
import storage from '../Storage/Storage';
import { Category, Item } from '../Types';

const errors = [400, 401, 404, 409, 500, 503]

const request = async (url: string, endpoint: string, method: string, body?: string, fError?: () => void): Promise<any> => {
  const headers: {[key: string]: string} = {};
  headers['Content-Type'] = 'application/json';

  const token = storage.getToken();
  if(token !== null) headers['Authorization'] = "Bearer " + token;
  try {
    const payload: RequestInit = {
      headers,
      method,
      mode: 'cors',
      body,
    };

    //log.dev('request', url + endpoint, payload, body);
    const response = await fetch(url + endpoint, payload);

    if(response !== undefined && errors.includes(response.status)){
      const message = await response.text();
      toast.warning(message, { autoClose: 10000});
    }

    return response;
  } catch (error) {
    if(fError !== undefined) fError();
    else {
      toast.error("Untreated error...", { autoClose: 5000 });
    }
    return undefined;
  }
}

export const identityApi = {
  async isUp(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/IsUp', 'GET', body, fError);
  },
  async login(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/Login', 'POST', body, fError);
  },
  async getUser(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/GetUser', 'GET', body, fError);
  },
  async getUserList(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/GetUserList', 'GET', body, fError);
  },
  async askToCreate(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/AskToCreate', 'POST', body, fError);
  },
  async requestIdentity(endpoint: string, method: string, body?: string, fError?: () => void): Promise<any>{
    return request('https://68m8rbceac.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);
  },
}

export const grocerylistApi = {
  async getCategoryList(fError?: () => void): Promise<any>{
    return this.requestGroceryList('/GetCategoryList', 'GET', undefined, fError);
  },
  async getCategoryItemList(categoryId: string, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/GetCategoryItemList', 'POST', JSON.stringify({CategoryId: categoryId}), fError);
  },
  async getCategory(categoryId: string, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/GetCategory', 'POST', JSON.stringify({CategoryId: categoryId}), fError);
  },
  async putCategory(category: Category, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/PutCategory', 'PUT', JSON.stringify(category), fError);
  },
  async deleteCategory(categoryId: string, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/DeleteCategory', 'DELETE', JSON.stringify({CategoryId: categoryId}), fError);
  },
  async getItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/GetItem', 'POST', JSON.stringify({UserIdCategoryId: userIdCategoryId, ItemId: itemId}), fError);
  },
  async putItem(item: Item, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/PutItem', 'PUT', JSON.stringify(item), fError);
  },
  async deleteItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<any>{
    return this.requestGroceryList('/DeleteItem', 'DELETE', JSON.stringify({UserIdCategoryId: userIdCategoryId, ItemId: itemId}), fError);
  },

  async requestGroceryList(endpoint: string, method: string, body?: string, fError?: () => void): Promise<any>{
    return request('https://soi7x4bjkc.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);
  },
}