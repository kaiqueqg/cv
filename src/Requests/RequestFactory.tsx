import {  toast } from 'react-toastify';
import log from '../Log/Log';
import storage from '../Storage/Storage';
import { ChangeUserStatusRequest, ResponseUser, LoginModel, Response, ResponseServices } from '../Types';
import { ObjectiveList, Item as ObjectiveItem, Objective } from '../TypesObjectives';

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

    const response = await fetch(url + endpoint, payload);

    if(response !== undefined && errors.includes(response.status)){
      const message = await response.text();
      log.err('request', message);
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
  async login(body?: string, fError?: () => void): Promise<LoginModel|null>{
    return this.requestIdentity<LoginModel|null>('/Login', 'POST', body, fError);
  },
  async getUser(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/GetUser', 'GET', body, fError);
  },
  async getUserList(fError?: () => void): Promise<ResponseUser[]|null>{
    return await this.requestIdentity<ResponseUser[]>('/GetUserList', 'GET', undefined, fError);
  },
  async askToCreate(body?: string, fError?: () => void): Promise<any>{
    return this.requestIdentity('/AskToCreate', 'POST', body, fError);
  },
  async changeUserStatus(request?: ChangeUserStatusRequest, fError?: () => void): Promise<ResponseUser|null>{
    return await this.requestIdentity<ResponseUser>('/ChangeUserStatus', 'POST', JSON.stringify(request), fError);
  },
  async getIdentityServiceStatus(fError?: () => void): Promise<ResponseServices|null>{
    return await this.requestIdentity<ResponseServices>('/GetServiceStatus', 'GET', undefined, fError);
  },
  async putIdentityServiceStatus(service: ResponseServices, fError?: () => void): Promise<ResponseServices|null>{
    return await this.requestIdentity<ResponseServices>('/PutServiceStatus', 'PUT', JSON.stringify(service), fError);
  },
  async requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<T|null>{
    try {
      const resp = await request('https://68m8rbceac.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);

      if(resp){
        const respData: Response<T> = await resp.json();
        if(!respData.WasAnError && respData.Data){
          return respData.Data;
        }
        else{
          log.alert(respData.Message);
        }
      }
    } catch (err) {
      log.err('Error: ', endpoint, err);
    }
    return null;
  },
}

export const objectiveslistApi = {
  async isUpObjective(fError?: () => void): Promise<any>{
    return this.requestObjectivesList('/IsUpObjective', 'GET', undefined, fError);
  },
  async getObjectiveList(fError?: () => void): Promise<Objective[]|null>{
    return this.requestObjectivesList<Objective[]>('/GetObjectiveList', 'GET', undefined, fError);
  },
  async getObjectiveItemList(objectiveId: string, fError?: () => void): Promise<ObjectiveItem[]|null>{
    return this.requestObjectivesList<ObjectiveItem[]>('/GetObjectiveItemList', 'POST', JSON.stringify({ObjectiveId: objectiveId}), fError);
  },
  async getObjective(objectiveId: string, fError?: () => void): Promise<Objective|null>{
    return this.requestObjectivesList<Objective>('/GetObjective', 'POST', JSON.stringify({ObjectiveId: objectiveId}), fError);
  },
  async putObjective(objective: Objective, fError?: () => void): Promise<Objective|null>{
    return this.requestObjectivesList<Objective>('/PutObjective', 'PUT', JSON.stringify(objective), fError);
  },
  async putObjectives(objectives: Objective[], fError?: () => void): Promise<Objective[]|null>{
    return this.requestObjectivesList<Objective[]>('/PutObjectives', 'PUT', JSON.stringify(objectives), fError);
  },
  async deleteObjective(objective: Objective, fError?: () => void): Promise<Objective|null>{
    return this.requestObjectivesList<Objective>('/DeleteObjective', 'DELETE', JSON.stringify(objective), fError);
  },
  async getObjectiveItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<ObjectiveItem|null>{
    return this.requestObjectivesList<ObjectiveItem>('/GetObjectiveItem', 'POST', JSON.stringify({UserIdCategoryId: userIdCategoryId, ItemId: itemId}), fError);
  },
  async putObjectiveItem(item: ObjectiveItem, fError?: () => void): Promise<ObjectiveItem|null>{
    return this.requestObjectivesList<ObjectiveItem>('/PutObjectiveItem', 'PUT', JSON.stringify(item), fError);
  },
  async putObjectiveItems(item: ObjectiveItem[], fError?: () => void): Promise<ObjectiveItem[]|null>{
    return this.requestObjectivesList<ObjectiveItem[]>('/PutObjectiveItems', 'PUT', JSON.stringify(item), fError);
  },
  async deleteObjectiveItem(item: ObjectiveItem, fError?: () => void): Promise<ObjectiveItem|null>{
    return this.requestObjectivesList<ObjectiveItem>('/DeleteObjectiveItem', 'DELETE', JSON.stringify(item), fError);
  },
  async syncObjectivesList(objectivesList: ObjectiveList, fError?: () => void): Promise<ObjectiveList>{
    return this.requestObjectivesList<ObjectiveList>('/SyncObjectivesList', 'PUT', JSON.stringify(objectivesList), fError);
  },
  async requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<any>{
    try {
      const resp = await request('https://0z58mhwlhf.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);

      if(resp){
        const respData: Response<T> = await resp.json();
        if(!respData.WasAnError && respData.Data){
          return respData.Data;
        }
        else{
        }
      }
    } catch (err) {
      log.err('Error: ', endpoint, err);
    }
    return null;
  },
}