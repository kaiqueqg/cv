export interface LangText{
  current: Language,
  ptbr: string,
  en?: string,
  fr?: string,
  it?: string,
}

export interface ResponseUser{
  Username: string,
  Email: string,
  Status: string,
  Role: string,
  CreateAt: string,
  FCMToken?: string,
}

export interface ResponseServices{
  Name: string,
  Up: boolean,
  UpReason: string,
  RequestNewUserUp: boolean,
  RequestNewUserUpReason: string,
}

export interface LoginModel{
  User?: ResponseUser,
  Token: string,
  ErrorMessage: string
}

export interface ChangeUserStatusRequest { Email: string, Status: string }

export interface DBUserPrefs{
  shouldCreateNewItemWhenCreateNewCategory: boolean,
  hideQuantity: boolean,
  showOnlyItemText: boolean,
  checkedUncheckedBoth: string,
  locked: boolean,
  theme: string,
}

export interface CreateUserModel{
  Email: string,
  Username: string,
  Password: string,
  Reason: string,
}

export interface Response<T>{
  Data?: T,
  Message: string,
  Exception?: string,
  WasAnError: boolean,
  Code: number,
}

export enum Language{ PR_BR, EN, FR, IT };
export enum MenuOption{ Main, Login, Curriculum, GroceryList, ObjectivesList, IoT, WorldDefence };
export enum LogLevel { Dev, Warn, Error, None }

export enum MessageType { Normal, Error, Alert, }

export interface PopMessage { 
  id: string,
  text: string,
  timeout: number,
  type: MessageType,
}

export interface DeviceData{
  UserId: string,
  DataId: string,
  DateAdded: string,
  AmbientTemperature: string,
  AmbientPressure: string,
  AmbientHumidity: string,
  AmbientLight: string,
  UVLight: string,
  IRTemperature: string,
  WeakProbTemperature: string,
  StrongProbTemperature: string,
  AirQuality: string,
  TotalAcel: string,
  AccX: string,
  AccY: string,
  AccZ: string,
  GyrX: string,
  GyrY: string,
  GyrZ: string,
  MagX: string,
  MagY: string,
  MagZ: string,
}