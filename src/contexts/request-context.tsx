import React, { createContext, useState, useContext, ReactNode } from 'react';

import { DeviceData, ImageInfo, Objective, Item as ObjectiveItem, ObjectivesList, PresignedUrl } from '../TypesObjectives';
import { ChangeUserStatusRequest, ResponseUser, LoginModel, Response, ResponseServices, MessageType } from '../Types';
import storage from '../storage/storage';
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
  getUser(body?: string, fError?: (error: any) => void): Promise<any>;
  getUserList(fError?: (error: any) => void): Promise<ResponseUser[]|null>;
  askToCreate(body?: string, fError?: (error: any) => void): Promise<any>;
  resendApproveEmail(fError?: (error: any) => void): Promise<any>;
  changeUserStatus(request?: ChangeUserStatusRequest, fError?: (error: any) => void): Promise<ResponseUser|null>;
  getIdentityServiceStatus(fError?: (error: any) => void): Promise<ResponseServices|null>;
  putIdentityServiceStatus(service: ResponseServices, fError?: (error: any) => void): Promise<ResponseServices|null>;
  getEmergencyStop(fError?: (error: any) => void): Promise<string|null>;
  requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<T|null>;
}

export interface ObjectivesListApi {
  isUpObjective(fError?: (error: any) => void): Promise<any>;
  getObjectiveList(fError?: (error: any) => void): Promise<Objective[]|null>;
  getObjectiveItemList(objectiveId: string, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>;
  getObjective(objectiveId: string, fError?: (error: any) => void): Promise<Objective|null>;
  putObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>;
  deleteObjectives(objective: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>;
  getObjectiveItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<ObjectiveItem|null>;
  putObjectiveItems(item: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>;
  deleteObjectiveItems(item: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>;
  syncObjectivesList(objectivesList: ObjectivesList, fError?: (error: any) => void): Promise<ObjectivesList>;
  backupData(fError?: (error: any) => void): Promise<{success: boolean}>;
  getBackupDataList(fError?: (error: any) => void): Promise<string[]>;
  generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>;
  generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>;
  generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>;
  getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]>;
  requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<T|null>;
}

export interface S3Api {
  getImage(imageInfo: ImageInfo, fError?: () => void): Promise<File | null>;
  sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean>;
  deleteImage(itemId:string, file: File, fError?: () => void): Promise<boolean>;
}

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const { popMessage } = useLogContext();
  const { logout } = useUserContext();

  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<any> => {
    const headers: {[key: string]: string} = {};
    headers['Content-Type'] = 'application/json';

    const token = storage.getToken();
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

      return IDENTITY_URLS['default'];
    } catch (err) {
      console.error('Error getting region, using default', err);
      return IDENTITY_URLS['default'];
    }
  }

  const getObjectivelistUrl = async () => {
    try {
      // const res = await fetch('https://ipapi.co/json/');
      // const data = await res.json();
      // const country = data.country_code;

      // if (country === 'BR') return OBJECTIVELIST_URLS['BR'];
      // // if (country === 'FR') return OBJECTIVELIST_URLS['FR'];
      return OBJECTIVELIST_URLS['default'];
    } catch (err) {
      console.error('Error getting region, using default', err);
      return OBJECTIVELIST_URLS['default'];
    }
  }

  const identityApi = {
    async isUp(body?: string, fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/IsUp', 'GET', body, fError);
    },
    async login(body?: string, fError?: (error: any) => void): Promise<LoginModel|null>{
      return await this.requestIdentity<LoginModel|null>('/Login', 'POST', body, fError);
    },
    async getUser(body?: string, fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/GetUser', 'GET', body, fError);
    },
    async getUserList(fError?: (error: any) => void): Promise<ResponseUser[]|null>{
      return await this.requestIdentity<ResponseUser[]>('/GetUserList', 'GET', undefined, fError);
    },
    async askToCreate(body?: string, fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/AskToCreate', 'POST', body, fError);
    },
    async resendApproveEmail(fError?: (error: any) => void): Promise<any>{
      return await this.requestIdentity('/ResendApproveEmail', 'GET', undefined, fError);
    },
    async changeUserStatus(request?: ChangeUserStatusRequest, fError?: (error: any) => void): Promise<ResponseUser|null>{
      return await this.requestIdentity<ResponseUser>('/ChangeUserStatus', 'POST', JSON.stringify(request), fError);
    },
    async getIdentityServiceStatus(fError?: (error: any) => void): Promise<ResponseServices|null>{
      return await this.requestIdentity<ResponseServices>('/GetServiceStatus', 'GET', undefined, fError);
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
            return respData.data;
          }else{
            if(resp.status === 500){
              log.r('Response: ', resp);
            }
            else if(respData.message){
              popMessage(respData.message, MessageType.Error);
            }
            else{
              popMessage('No info error.', MessageType.Error);
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

  const objectiveslistApi = {
    splitArr<T>(arr: T[], chunkSize: number): T[][] { 
      const parts: T[][] = [];
      for (let i = 0; i < arr.length; i += chunkSize){ 
          parts.push(arr.slice(i, i + chunkSize)); 
      } 
      return parts; 
    },
    async splitRequestObjectivesList<T>(endpoint: string, method: string, data: T[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<T[]|null> { 
      const splitItems: T[][] = this.splitArr<T>(data, 10);
      let returnList:T[] = [];

      const amountOfLists = splitItems.length;
      let startListSended = 0;
      if(splitCallback !== undefined && amountOfLists > 1) splitCallback(startListSended.toString()+'/'+amountOfLists.toString())

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
      const rtn = await this.splitRequestObjectivesList<Objective>('/PutObjectives', 'PUT', objectives, splitCallback, fError);
      return rtn;
    },
    async deleteObjectives(objectives: Objective[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<Objective[]|null>{
      return await this.splitRequestObjectivesList<Objective>('/DeleteObjectives', 'DELETE', objectives, splitCallback, fError);
    },
    async getObjectiveItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<ObjectiveItem|null>{
      return await this.requestObjectivesList<ObjectiveItem>('/GetObjectiveItem', 'POST', {UserIdCategoryId: userIdCategoryId, ItemId: itemId}, fError);
    },
    async putObjectiveItems(items: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return await this.splitRequestObjectivesList<ObjectiveItem>('/PutObjectiveItems', 'PUT', items, splitCallback, fError);
    },
    async deleteObjectiveItems(item: ObjectiveItem[], splitCallback?:(value: string) => void, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return await this.splitRequestObjectivesList<ObjectiveItem>('/DeleteObjectiveItems', 'DELETE', item, splitCallback, fError);
    },
    async syncObjectivesList(objectivesList: ObjectivesList, fError?: (error: any) => void): Promise<ObjectivesList>{
      return await this.requestObjectivesList<ObjectivesList>('/SyncObjectivesList', 'PUT', objectivesList, fError);
    },
    async backupData(fError?: (error: any) => void): Promise<{success: boolean}>{
      return await this.requestObjectivesList<ObjectivesList>('/BackupData', 'GET', undefined, fError);
    },
    async getBackupDataList(fError?: (error: any) => void): Promise<string[]>{
      return await this.requestObjectivesList<string[]>('/GetBackupDataList', 'GET', undefined, fError);
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return await this.requestObjectivesList<ImageInfo>('/GenerateGetPresignedUrl', 'PUT', fileInfo, fError);
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return await this.requestObjectivesList<ImageInfo>('/GeneratePutPresignedUrl', 'PUT', fileInfo, fError);
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return await this.requestObjectivesList<ImageInfo>('/GenerateDeletePresignedUrl', 'PUT', fileInfo, fError);
    },
    async getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]>{
      return await this.requestObjectivesList<DeviceData[]>('/GetDeviceData', 'POST', {DeviceId: deviceId}, fError);
    },
    async requestObjectivesList<T>(endpoint: string, method: string, body?: any, fError?: (error: any) => void): Promise<any>{
      try {
        const resp = await request(await getObjectivelistUrl(), endpoint, method, JSON.stringify(body), fError);
        
        const respData: Response<T> = await resp.json();
        if(resp.ok && respData.data){
          return respData.data;
        }else{
          if(resp.status === 401){
            popMessage('Unauthorized, try to Logoff and Login again...', MessageType.Error);
            logout();
          }
          if(resp.status === 500){
            log.r('Response: ', resp);
          }
          else if(respData.message){
            const words = respData.message.split(/\s+/).length;
            const displayTime = Math.max(5, words * 0.8);
            // popMessage(respData.message, MessageType.Error, displayTime);
          }
          else{
            popMessage('No info error.', MessageType.Error, 5);
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
        if(fError) fError(err);
      }
      return null;
    },
  }

  const s3Api = {
    async getImage(imageInfo: ImageInfo, fError?: () => void): Promise<File | null> {
      const presignedUrlReturn = await objectiveslistApi.generateGetPresignedUrl(imageInfo);
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
    },
    async sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name, fileType: file.type };
      const presignedUrlReturn:PresignedUrl = await objectiveslistApi.generatePutPresignedUrl(imageInfo);

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
      const presignedUrlReturn:PresignedUrl = await objectiveslistApi.generateDeletePresignedUrl(imageInfo);

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

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
