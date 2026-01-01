export interface LangText{
  current: Language,
  ptbr: string,
  en?: string,
  fr?: string,
  it?: string,
}

export enum Theme{
  Dark = 'Dark',
  Light = 'Light',
  Win95 = 'Win95',
  // Auto = 'Auto',
}

export interface ResponseUser{
  Username: string,
  Email: string,
  Status: string,
  Role: string,
  TwoFAActive: boolean,
  CreateAt?: string,
  Count?: number,
  CountResetAt?: string,
  FCMToken?: string,
}

export enum UserRoles{
  Admin = 'Admin',
  Basic = 'Basic',
  Guest = 'Guest',
  EmailToken = 'EmailToken',
  TokenTester = 'TokenTester',
}

export enum UserStatus{
  Active = 'Active',
  WaitingApproval = 'WaitingApproval',
  Refused = 'Refused',
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
  Token?: string,
  RequiringTwoFA: boolean,
  TwoFATempToken?: string,
}

export interface LoginRequest {
  Password: string;
  Email: string;
  ExpoToken?: string;
}
export interface LoginResponse {
  User?: ResponseUser,
  Token?: string,
  RequiringTwoFA: boolean,
  TwoFATempToken?: string,
}

export interface ChangeUserStatusRequest { Email: string, Status: string }
export interface ChangeUserPasswordRequest { Email: string, Password: string }
export interface TwoFactorAuthRequest { 
  TwoFACode: string,
  TwoFATempToken?: string,
}

export interface UserPrefs{
  theme: string,
  allowLocation: boolean,
  vibrate: boolean,
  autoSync: boolean,
}

export interface CreateUserModel{
  Email: string,
  Username: string,
  Password: string,
  Reason: string,
}

export interface Response<T>{
  data: T,
  success: boolean,
  message?: string,
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