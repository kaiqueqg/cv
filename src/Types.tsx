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
export enum MenuOption{ Main, Login, Curriculum, GroceryList, ObjectivesList, SleepDevice, WorldDefence };
export enum LogLevel { Dev, Warn, Error, None  };