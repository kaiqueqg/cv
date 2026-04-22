import React, { createContext, useState, useContext, ReactNode } from 'react';

import { DeviceData, ImageInfo, Item, Objective, Item as ObjectiveItem, ObjectivesList, PresignedUrl } from '../TypesObjectives';
import { ChangeUserStatusRequest, User, LoginModel, Response, ResponseServices, MessageType, ChangeUserPasswordRequest, TwoFactorAuthRequest } from '../Types';
import { local, randomId, session, StgKey } from '../storage/storage';
import log from '../log/log';
import { useLogContext } from './log-context';
import { useUserContext } from './user-context';

interface RequestProviderProps {
  children: ReactNode;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

interface RequestContextType {
  identityApi: IdentityApi;
  objectiveslistApi: ObjectivesListApi;
  s3Api: S3Api;
}

export interface IdentityApi {
  isUp(body?: string, fError?: (error: any) => void): Promise<any>;
  login(body?: string, fError?: (error: any) => void): Promise<LoginModel|null>;
  getUserInfo(fError?: (error: any) => void): Promise<User|null>;
  getUserList(fError?: (error: any) => void): Promise<User[]|null>;
  askToCreate(body?: string, fError?: (error: any) => void): Promise<any>;
  resendApproveEmail(fError?: (error: any) => void): Promise<any>;
  changeUserStatus(request?: ChangeUserStatusRequest, fError?: (error: any) => void): Promise<User|null>;
  changeUserPassword(request?: ChangeUserPasswordRequest, fError?: (error: any) => void): Promise<User|null>;
  getIdentityServiceStatus(fError?: (error: any) => void): Promise<ResponseServices|null>;
  getTwoFAAuth(fError?: (error: any) => void): Promise<string|null>;
  activateTwoFA(request: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<string|null>;
  deactivateTwoFA(request: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<string|null>;
  validateTwoFA(code: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<LoginModel|null>;
  putIdentityServiceStatus(service: ResponseServices, fError?: (error: any) => void): Promise<ResponseServices|null>;
  getEmergencyStop(fError?: (error: any) => void): Promise<string|null>;
  requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<T|null>;
}

export interface ObjectivesListApi {
  splitArr<T>(arr: T[], chunkSize: number): T[][];
  splitRequestObjectivesList<T>(endpoint: string, method: string, data: T[], splitCallback?: (value: string) => void, fError?: (error: any) => void): Promise<T[] | null>;
  isUpObjective(fError?: (error: any) => void): Promise<any>;
  getObjectiveList(fError?: (error: any) => void): Promise<Objective[] | null>;
  getObjectiveItemList(objectiveId: string, fError?: (error: any) => void): Promise<ObjectiveItem[] | null>;
  getObjective(objectiveId: string, fError?: (error: any) => void): Promise<Objective | null>;
  putObjectives(objectives: Objective[], splitCallback?: (value: string) => void, fError?: (error: any) => void): Promise<Objective[] | null>;
  deleteObjectives(objectives: Objective[], splitCallback?: (value: string) => void, fError?: (error: any) => void): Promise<Objective[] | null>;
  putObjectiveItems(items: ObjectiveItem[], splitCallback?: (value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[] | null>;
  deleteObjectiveItems(item: ObjectiveItem[], splitCallback?: (value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[] | null>;
  syncObjectivesList(objectivesList: ObjectivesList, fError?: (error: any) => void): Promise<ObjectivesList|null>;
  backupData(fError?: (error: any) => void): Promise<any>;
  getBackupDataList(fError?: (error: any) => void): Promise<string[]|null>;
  generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>;
  generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>;
  generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>;
  getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]|null>;
  requestObjectivesList<T>(endpoint: string, method: string, body?: any, fError?: (error: any) => void): Promise<T | null>;
}

export interface S3Api {
  getImage(imageInfo: ImageInfo, fError?: () => void): Promise<File | null>;
  sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean>;
  deleteImage(itemId:string, file: File, fError?: () => void): Promise<boolean>;
}

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const { popMessage } = useLogContext();
  const { user, logout, isLogged } = useUserContext();

  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<any> => {
    const headers: {[key: string]: string} = {};
    headers['Content-Type'] = 'application/json';

    const token = local.getData(StgKey.JwtToken);
    if(token !== null) headers['Authorization'] = "Bearer " + token;

    const payload: RequestInit = {
    headers,
    method,
    mode: 'cors',
    body,
    };

    const response:globalThis.Response = await fetch(url + endpoint, payload);
    return response;
  };

  const IDENTITY_URLS = {
    BR: process.env.REACT_APP_IDENTITY_URL_BR!,
    FR: process.env.REACT_APP_IDENTITY_URL_FR!,
    default: process.env.REACT_APP_IDENTITY_URL_DEFAULT!
  };

  const OBJECTIVELIST_URLS = {
    BR: process.env.REACT_APP_OBJECTIVELIST_URL_BR!,
    FR: process.env.REACT_APP_OBJECTIVELIST_URL_FR!,
    default: process.env.REACT_APP_OBJECTIVELIST_URL_DEFAULT!
  };

  const getIdentityUrl = async () => {
    try {
      // const res = await fetch('https://ipapi.co/json/');
      // const data = await res.json();
      // const country = data.country_code;

      // if (country === 'BR') return IDENTITY_URLS['BR'];
      // if (country === 'FR') return IDENTITY_URLS['FR'];

      return IDENTITY_URLS['FR'];
    } catch (err) {
      console.error('Error getting region, using default', err);
      return IDENTITY_URLS['FR'];
    }
  }

  const getObjectivelistUrl = async () => {
    try {
      // const res = await fetch('https://ipapi.co/json/');
      // const data = await res.json();
      // const country = data.country_code;

      // if (country === 'BR') return OBJECTIVELIST_URLS['BR'];
      // // if (country === 'FR') return OBJECTIVELIST_URLS['FR'];
      return OBJECTIVELIST_URLS['FR'];
    } catch (err) {
      console.error('Error getting region, using default', err);
      return OBJECTIVELIST_URLS['FR'];
    }
  }

  const identityApi = {
    async isUp(body?: string, fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/IsUp', 'GET', body, fError);
    },
    async login(body?: string, fError?: (error: any) => void): Promise<LoginModel|null>{
      return await this.requestIdentity<LoginModel|null>('/Login', 'POST', body, fError);
    },
    async getUserInfo(fError?: (error: any) => void): Promise<User|null>{
      return await this.requestIdentity<User>('/GetUserInfo', 'GET', undefined, fError);
    },
    async getUserList(fError?: (error: any) => void): Promise<User[]|null>{
      return await this.requestIdentity<User[]>('/GetUserList', 'GET', undefined, fError);
    },
    async askToCreate(body?: string, fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/AskToCreate', 'POST', body, fError);
    },
    async resendApproveEmail(fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/ResendApproveEmail', 'GET', undefined, fError);
    },
    async changeUserStatus(request?: ChangeUserStatusRequest, fError?: (error: any) => void): Promise<User|null>{
      return await this.requestIdentity<User>('/ChangeUserStatus', 'POST', JSON.stringify(request), fError);
    },
    async changeUserPassword(request?: ChangeUserPasswordRequest, fError?: (error: any) => void): Promise<User|null>{
      return await this.requestIdentity<User>('/ChangeUserPassword', 'POST', JSON.stringify(request), fError);
    },
    async getIdentityServiceStatus(fError?: (error: any) => void): Promise<ResponseServices|null>{
      return await this.requestIdentity<ResponseServices>('/GetServiceStatus', 'GET', undefined, fError);
    },
    async getTwoFAAuth(fError?: (error: any) => void): Promise<string|null>{
      return await this.requestIdentity<string>('/GetTwoFAAuth', 'GET', undefined, fError);
    },
    async activateTwoFA(code: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<string|null>{
      return await this.requestIdentity<string>('/ActivateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async deactivateTwoFA(code: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<string|null>{
      return await this.requestIdentity<string>('/DeactivateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async validateTwoFA(code: TwoFactorAuthRequest, fError?: (error: any) => void): Promise<LoginModel|null>{
      return await this.requestIdentity<LoginModel|null>('/ValidateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async putIdentityServiceStatus(service: ResponseServices, fError?: (error: any) => void): Promise<ResponseServices|null>{
      return await this.requestIdentity<ResponseServices>('/PutServiceStatus', 'PUT', JSON.stringify(service), fError);
    },
    async getEmergencyStop(fError?: (error: any) => void): Promise<string|null>{
      return await this.requestIdentity<string>('/EmergencyStop', 'GET', undefined, fError);
    },
    async requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<T|null>{
      try {
        const resp = await request(await getIdentityUrl(), endpoint, method, body, fError);
        if(resp){
          const respData: Response<T> = await resp.json();
          if(resp.ok && respData.data){
            if(respData.message) 
              popMessage(respData.message);

            return respData.data;
          }else{
            if(resp.status === 500){
              log.r('Response: ', resp);
            }
            else if(respData.message){
              popMessage(respData.message, MessageType.ERROR);
            }
            else{
              popMessage('No info error.', MessageType.ERROR);
            }

            return null;
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
        return null;
      }
      return null;
    },
  }

  const objectiveslistApi: ObjectivesListApi = 
  isLogged?
  {
    splitArr<T>(arr: T[], chunkSize: number): T[][] { 
      const parts: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize){ 
          parts.push(arr.slice(i, i + chunkSize)); 
      } 
      return parts; 
    },
    async splitRequestObjectivesList<T>(endpoint: string, method: string, data: T[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<T[]|null> { 
      const splitItems: T[][] = this.splitArr<T>(data, 100);
      let returnList:T[] = [];

      const amountOfLists = splitItems.length;
      let startListSended = 0;
      if(splitCallback !== undefined && amountOfLists > 1) {splitCallback(startListSended.toString()+'/'+amountOfLists.toString())}
      
      for (let i = 0; i < splitItems.length; i++) {
        const split = splitItems[i];
        const v = await this.requestObjectivesList<T[]>(endpoint, method, split, fError);
        if(v !== null) {
          startListSended++;
          if(splitCallback !== undefined && amountOfLists > 1) splitCallback(startListSended.toString()+'/'+amountOfLists.toString());

          if(Array.isArray(v))
            returnList.push(...v);
          else
            returnList.push(v);
        }
        else {
          return null;
        }
      } 
      const rtn = !returnList ||returnList.length === 0?null:returnList; 
      return rtn;
    },
    async isUpObjective(fError?: (error: any) => void): Promise<any>{
      return await this.requestObjectivesList('/IsUpObjective', 'GET', undefined, fError);
    },
    async getObjectiveList(fError?: (error: any) => void): Promise<Objective[]|null>{
      return await this.requestObjectivesList<Objective[]>('/GetObjectiveList', 'GET', undefined, fError);
    },
    async getObjectiveItemList(objectiveId: string, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return await this.requestObjectivesList<ObjectiveItem[]>('/GetObjectiveItemList', 'POST', {ObjectiveId: objectiveId}, fError);
    },
    async getObjective(objectiveId: string, fError?: (error: any) => void): Promise<Objective|null>{
      return await this.requestObjectivesList<Objective>('/GetObjective', 'POST', {ObjectiveId: objectiveId}, fError);
    },
    async putObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>{
      return await this.splitRequestObjectivesList<Objective>('/PutObjectives', 'PUT', objectives, splitCallback, fError);
    },
    async deleteObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>{
      return await this.splitRequestObjectivesList<Objective>('/DeleteObjectives', 'DELETE', objectives, splitCallback, fError);
    },
    async putObjectiveItems(items: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return await this.splitRequestObjectivesList<ObjectiveItem>('/PutObjectiveItems', 'PUT', items, splitCallback, fError);
    },
    async deleteObjectiveItems(items: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return await this.splitRequestObjectivesList<ObjectiveItem>('/DeleteObjectiveItems', 'DELETE', items, splitCallback, fError);
    },
    async syncObjectivesList(objectivesList: ObjectivesList, fError?: (error: any) => void): Promise<ObjectivesList|null>{
      return await this.requestObjectivesList<ObjectivesList>('/SyncObjectivesList', 'PUT', objectivesList, fError);
    },
    async backupData(fError?: (error: any) => void): Promise<any>{
      return await this.requestObjectivesList<ObjectivesList>('/BackupData', 'GET', undefined, fError);
    },
    async getBackupDataList(fError?: (error: any) => void): Promise<string[]|null>{
      return await this.requestObjectivesList<string[]>('/GetBackupDataList', 'GET', undefined, fError);
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      return await this.requestObjectivesList<PresignedUrl|null>('/GenerateGetPresignedUrl', 'PUT', fileInfo, fError);
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      return await this.requestObjectivesList<PresignedUrl|null>('/GeneratePutPresignedUrl', 'PUT', fileInfo, fError);
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      return await this.requestObjectivesList<PresignedUrl|null>('/GenerateDeletePresignedUrl', 'PUT', fileInfo, fError);
    },
    async getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]|null>{
      return await this.requestObjectivesList<DeviceData[]>('/GetDeviceData', 'POST', {DeviceId: deviceId}, fError);
    },
    async requestObjectivesList<T>(endpoint: string, method: string, body?: any, fError?: (error: any) => void): Promise<any>{
      try {
        const resp = await request(await getObjectivelistUrl(), endpoint, method, JSON.stringify(body), fError);
        
        const respData: Response<T> = await resp.json();
        if(resp.ok && respData.data){
          if(resp.message) popMessage(resp.message);
          return respData.data;
        }else{
          if(resp.status === 401){
            popMessage('Unauthorized, try to Logoff and Login again...', MessageType.ERROR);
            logout();
          }
          if(resp.status === 500){
            log.r('Response: ', resp);
          }
          else if(respData.message){
            popMessage(respData.message, MessageType.ERROR);
          }
          else{
            popMessage('No info error.', MessageType.ERROR, 5);
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
        if(fError) fError(err);
      }
      return null;
    },
  }
  :
  {
    splitArr<T>(arr: T[], chunkSize: number): T[][] { 
      const parts: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize){ 
        parts.push(arr.slice(i, i + chunkSize)); 
      } 
      return parts; 
    },
    async splitRequestObjectivesList<T>(endpoint: string, method: string, data: T[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<T[]|null> { 
      const splitItems: T[][] = this.splitArr<T>(data, 100);
      let returnList:T[] = [];

      const amountOfLists = splitItems.length;
      let startListSended = 0;
      if(splitCallback !== undefined && amountOfLists > 1) {splitCallback(startListSended.toString()+'/'+amountOfLists.toString())}
      
      for (let i = 0; i < splitItems.length; i++) {
        const split = splitItems[i];
        const v = await this.requestObjectivesList<T[]>(endpoint, method, split, fError);
        if(v !== null) {
          startListSended++;
          if(splitCallback !== undefined && amountOfLists > 1) splitCallback(startListSended.toString()+'/'+amountOfLists.toString());

          if(Array.isArray(v))
            returnList.push(...v);
          else
            returnList.push(v);
        }
        else {
          return null;
        }
      } 
      const rtn = !returnList ||returnList.length === 0?null:returnList; 
      return rtn;
    },
    async isUpObjective(fError?: (error: any) => void): Promise<any>{
      return true;
    },//ok
    async getObjectiveList(fError?: (error: any) => void): Promise<Objective[]|null>{
      return local.getData(StgKey.Objectives);
    },//ok
    async getObjectiveItemList(objectiveId: string, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return local.getData(StgKey.Items, objectiveId);
    },//ok
    async getObjective(objectiveId: string, fError?: (error: any) => void): Promise<Objective|null>{
      const objs: Objective[]|null  = local.getData(StgKey.Objectives);
      if(objs){
        const obj = objs.find((o) => o.ObjectiveId === objectiveId);
        if(obj)
          return obj;
        return null;
      }

      return null;
    },//ok
    async putObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>{
      try {
        for(let i = 0; i < objectives.length; i++){
          objectives[i].LastModified = (new Date()).toISOString();
        }

        const existing = local.getData(StgKey.Objectives) || [];
        let newObjectives: Objective[] = [...existing];
        for (let i = 0; i < objectives.length; i++) {
          let updated = false;
          for(let j = 0; j < newObjectives.length; j++){
            if(newObjectives[j].ObjectiveId === objectives[i].ObjectiveId){
              newObjectives[j] = {...newObjectives[j], ...objectives[i]};
              updated = true;
            }
          }
          if(!updated){
            newObjectives.push({...objectives[i]});
          }
        }
        const sortedObjs = newObjectives.sort((a: Objective, b: Objective) => a.Pos - b.Pos);
        local.setData(StgKey.Objectives, sortedObjs);

        return sortedObjs;
      } catch (err) {
        log.err('putItem', 'Problem putting objectives', err);
      }

      return null;
    },//ok
    async deleteObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>{
      try {
        for (let i = 0; i < objectives.length; i++) {
          const objective = objectives[i];
          
          const existing: Objective[] = local.getData(StgKey.Objectives) || [];
          let newObjs: Objective[] = existing.filter((o: Objective) => o.ObjectiveId !== objective.ObjectiveId);
          local.deleteData(StgKey.Items, objective.ObjectiveId);
  
          // Write new objectives
          local.setData(StgKey.Objectives, newObjs);
          return newObjs;
        }
      } catch (err) {
        log.err('deleteObjective', 'Problem deleting objective', err);
      }

      return null;
    },//ok
    async putObjectiveItems(items: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      if(items.length === 0) return null;

      try {
        const objectiveId = (items[0].UserIdObjectiveId.length > 40)?items[0].UserIdObjectiveId.slice(-40):items[0].UserIdObjectiveId; //bad

        for(let i = 0; i < items.length; i++){
          if(items[i].ItemId === '') items[i].ItemId = randomId();
          items[i].LastModified = (new Date()).toISOString();
        }
        const dbItems = local.getData(StgKey.Items, objectiveId);
        let newItems: Item[] = [];

        if(dbItems){
          newItems = [...dbItems];
          for (let i = 0; i < items.length; i++) {
            let updated = false;
            for(let j = 0; j < newItems.length; j++){
              if(newItems[j].ItemId === items[i].ItemId){
                newItems[j] = {...newItems[j], ...items[i]};
                updated = true;
              }
            }
            if(!updated){
              newItems.push({...items[i]});
            }
          }
        }
        else{
          items.forEach((item)=>{
            newItems.push(item);
          })
        }

        local.setData(StgKey.Items, newItems, objectiveId);
        return newItems;
      } catch (err) {
        log.err('putItem', 'Problem putting item', err);
      }

      return null;
    },//ok
    async deleteObjectiveItems(items: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      log.w('deleteObjectiveItems');
      try {
        if(items.length === 0) return null;

        local.deleteData(StgKey.Items, items[0].UserIdObjectiveId.slice(-40));
        return items;
      } catch (err) {
        log.err('deleteObjectiveItems', 'Problem deleting items', err);
      }

      return null;
    },//ok
    async syncObjectivesList(objectivesList: ObjectivesList, fError?: (error: any) => void): Promise<ObjectivesList|null>{
      if(objectivesList.Objectives) local.setData(StgKey.Objectives, objectivesList.Objectives);

      if(objectivesList.Items){
        const items = objectivesList.Items;
        const map: Record<string, Item[]> = {};

        items.forEach(item => {
          const objId = item.UserIdObjectiveId.slice(-40); // pas ItemId
          if (!map[objId]) map[objId] = [];
          map[objId].push(item);
        });

        const result: Item[][] = Object.values(map);

        for(let i = 0; i < result.length; i++){
          const currentItems: Item[] = result[i];

          local.setData(StgKey.Items, currentItems, currentItems[0].UserIdObjectiveId.slice());
        }
      }

      return null;
    },
    async backupData(fError?: (error: any) => void): Promise<any>{
      //TODO Mok implement
      return null;
    },
    async getBackupDataList(fError?: (error: any) => void): Promise<string[]|null>{
      //TODO Mok implement
      return null;
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      //TODO Mok implement
      return null;
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      //TODO Mok implement
      return null;
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl|null>{
      //TODO Mok implement
      return null;
    },
    async getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]|null>{
      //TODO Mok implement
      return null;
    },
    async requestObjectivesList<T>(endpoint: string, method: string, body?: any, fError?: (error: any) => void): Promise<any>{
      // try {
      //   const resp = await request(await getObjectivelistUrl(), endpoint, method, JSON.stringify(body), fError);
        
      //   const respData: Response<T> = await resp.json();
      //   if(resp.ok && respData.data){
      //     if(resp.message) popMessage(resp.message);
      //     return respData.data;
      //   }else{
      //     if(resp.status === 401){
      //       popMessage('Unauthorized, try to Logoff and Login again...', MessageType.Error);
      //       logout();
      //     }
      //     if(resp.status === 500){
      //       log.r('Response: ', resp);
      //     }
      //     else if(respData.message){
      //       popMessage(respData.message, MessageType.Error);
      //     }
      //     else{
      //       popMessage('No info error.', MessageType.Error, 5);
      //     }
      //   }
      // } catch (err) {
      //   log.err('Error: ', endpoint, err);
      //   if(fError) fError(err);
      // }
      return null;
    },
  }


  const s3Api = {
    async getImage(imageInfo: ImageInfo, fError?: () => void): Promise<File | null> {
      const presignedUrlReturn:PresignedUrl|null = await objectiveslistApi.generateGetPresignedUrl(imageInfo);
      if(presignedUrlReturn) {
        try {
            const fetchResponse = await fetch(presignedUrlReturn?.url, {
              method: 'GET',
            });
  
            if (fetchResponse.ok) {
              const blob = await fetchResponse.blob();
              const downloadedFile = new File([blob], imageInfo.fileName, { type: imageInfo.fileType });
              return downloadedFile;
            }
  
            return null; // Request failed
        } catch (err) {
            if (fError) fError();
            else log.err('Error getting image from S3', err);
  
            return null;
        }
      }

      return null;
    },
    async sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name, fileType: file.type };
      const presignedUrlReturn:PresignedUrl|null = await objectiveslistApi.generatePutPresignedUrl(imageInfo);
      if(!presignedUrlReturn) return false;
      try {
        const uploadResponse = await fetch(presignedUrlReturn?.url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if(uploadResponse.ok){
          return true;
        }

        return false;
      } catch (err) {
        if(fError) fError();
        else log.err('Error sending image to S3', err);

        return false;
      }
    },
    async deleteImage(itemId:string, file: File, fError?: () => void): Promise<boolean>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name, fileType: file.type };
      const presignedUrlReturn:PresignedUrl|null = await objectiveslistApi.generateDeletePresignedUrl(imageInfo);
      if(!presignedUrlReturn) return false;

      if(presignedUrlReturn.url === null){
        return false;
      }

      try {
        const uploadResponse = await fetch(presignedUrlReturn?.url, {
          method: 'DELETE',
        });

        if(uploadResponse.ok){
          return true;
        }

        return false;
      } catch (err) {
        if(fError) fError();
        else log.err('Error deleting image from S3', err);

        return false;
      }
    },
  }
    
  return (
    <RequestContext.Provider 
    value={{
      identityApi,
      objectiveslistApi,
      s3Api,
    }}>
    {children}
    </RequestContext.Provider>
  );
};
