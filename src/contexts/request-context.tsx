import React, { createContext, useState, useContext, ReactNode } from 'react';

import { DeviceData, ImageInfo, Objective, Item as ObjectiveItem, ObjectiveList, PresignedUrl } from '../TypesObjectives';
import { ChangeUserStatusRequest, ResponseUser, LoginModel, Response, ResponseServices, MessageType } from '../Types';
import storage from '../storage/storage';
import log from '../log/log';
import { useLogContext } from './log-context';

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
  putObjectives(objectives: Objective[], fError?: (error: any) => void): Promise<Objective[]|null>;
  deleteObjectives(objective: Objective[], fError?: (error: any) => void): Promise<Objective|null>;
  getObjectiveItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<ObjectiveItem|null>;
  putObjectiveItems(item: ObjectiveItem[], fError?: (error: any) => void): Promise<ObjectiveItem[]|null>;
  deleteObjectiveItem(item: ObjectiveItem, fError?: (error: any) => void): Promise<ObjectiveItem|null>;
  syncObjectivesList(objectivesList: ObjectiveList, fError?: (error: any) => void): Promise<ObjectiveList>;
  backupData(fError?: (error: any) => void): Promise<boolean>;
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

  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<any> => {
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
        return response;
    } catch (error) {
        if(fError) fError(error);
        else {
          console.error("Untreated error...", { autoClose: 5000 });
        }
        return undefined;
    }
  }
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
      return this.requestIdentity('/IsUp', 'GET', body, fError);
    },
    async login(body?: string, fError?: (error: any) => void): Promise<LoginModel|null>{
      return this.requestIdentity<LoginModel|null>('/Login', 'POST', body, fError);
    },
    async getUser(body?: string, fError?: (error: any) => void): Promise<any>{
      return this.requestIdentity('/GetUser', 'GET', body, fError);
    },
    async getUserList(fError?: (error: any) => void): Promise<ResponseUser[]|null>{
      return await this.requestIdentity<ResponseUser[]>('/GetUserList', 'GET', undefined, fError);
    },
    async askToCreate(body?: string, fError?: (error: any) => void): Promise<any>{
      return this.requestIdentity('/AskToCreate', 'POST', body, fError);
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

          if(!resp.ok) popMessage(respData.message?? 'There was a problem with the server. No explanation', MessageType.Error)
          if(respData.data){
            return respData.data;
          }
          else{
            if(fError) {
              log.err(respData.message);
              fError(respData);
            }
            //alert(respData.Message);
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
      }
      return null;
    },
  }

  const objectiveslistApi = {
    async isUpObjective(fError?: (error: any) => void): Promise<any>{
      return this.requestObjectivesList('/IsUpObjective', 'GET', undefined, fError);
    },
    async getObjectiveList(fError?: (error: any) => void): Promise<Objective[]|null>{
      return this.requestObjectivesList<Objective[]>('/GetObjectiveList', 'GET', undefined, fError);
    },
    async getObjectiveItemList(objectiveId: string, fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return this.requestObjectivesList<ObjectiveItem[]>('/GetObjectiveItemList', 'POST', JSON.stringify({ObjectiveId: objectiveId}), fError);
    },
    async getObjective(objectiveId: string, fError?: (error: any) => void): Promise<Objective|null>{
      return this.requestObjectivesList<Objective>('/GetObjective', 'POST', JSON.stringify({ObjectiveId: objectiveId}), fError);
    },
    async putObjectives(objectives: Objective[], fError?: (error: any) => void): Promise<Objective[]|null>{
      return this.requestObjectivesList<Objective[]>('/PutObjectives', 'PUT', JSON.stringify(objectives), fError);
    },
    async deleteObjectives(objective: Objective[], fError?: (error: any) => void): Promise<Objective|null>{
      return this.requestObjectivesList<Objective>('/DeleteObjectives', 'DELETE', JSON.stringify(objective), fError);
    },
    async getObjectiveItem(userIdCategoryId: string, itemId: string, fError?: () => void): Promise<ObjectiveItem|null>{
      return this.requestObjectivesList<ObjectiveItem>('/GetObjectiveItem', 'POST', JSON.stringify({UserIdCategoryId: userIdCategoryId, ItemId: itemId}), fError);
    },
    async putObjectiveItems(item: ObjectiveItem[], fError?: (error: any) => void): Promise<ObjectiveItem[]|null>{
      return this.requestObjectivesList<ObjectiveItem[]>('/PutObjectiveItems', 'PUT', JSON.stringify(item), fError);
    },
    async deleteObjectiveItem(item: ObjectiveItem, fError?: (error: any) => void): Promise<ObjectiveItem|null>{
      return this.requestObjectivesList<ObjectiveItem>('/DeleteObjectiveItem', 'DELETE', JSON.stringify(item), fError);
    },
    async syncObjectivesList(objectivesList: ObjectiveList, fError?: (error: any) => void): Promise<ObjectiveList>{
      return this.requestObjectivesList<ObjectiveList>('/SyncObjectivesList', 'PUT', JSON.stringify(objectivesList), fError);
    },
    async backupData(fError?: (error: any) => void): Promise<boolean>{
      return this.requestObjectivesList<ObjectiveList>('/BackupData', 'GET', undefined, fError);
    },
    async getBackupDataList(fError?: (error: any) => void): Promise<string[]>{
      return this.requestObjectivesList<string[]>('/GetBackupDataList', 'GET', undefined, fError);
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GenerateGetPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GeneratePutPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: (error: any) => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GenerateDeletePresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async getDeviceData(deviceId: string, fError?: (error: any) => void): Promise<DeviceData[]>{
      return this.requestObjectivesList<DeviceData[]>('/GetDeviceData', 'POST', JSON.stringify({DeviceId: deviceId}), fError);
    },
    async requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: (error: any) => void): Promise<any>{
      try {
        const resp = await request(await getObjectivelistUrl(), endpoint, method, body, fError);
  
        if(resp){
          const respData: Response<T> = await resp.json();
          if(respData.data){
            return respData.data;
          }
          else{
            if(fError) {
              log.err(respData.message);
              fError(respData);
            }
            //alert(respData.Message);
          }
        }
      } catch (err) {
        if(fError) fError(err);
        else log.err('Error: ', endpoint, err);
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
