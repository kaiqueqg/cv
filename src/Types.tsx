export interface ExperienceData{
  timeOnIt: LangText,
  company: LangText,
  jobTitle: LangText,
  description: LangText,
}

export interface LangText{
  current: Language,
  ptbr: string,
  en?: string,
  fr?: string,
  it?: string,
}

export interface DBUser{
  Email: string,
  Username?: string,
  Password?: string,
  Role?: string,
  Status?: string,
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

export interface GroceryList{
  categories: Category[]
}

export interface Category{
  CategoryId: string,
  Text: string,
  IsOpen: boolean
}

export interface Item{
  UserIdCategoryId: string,
  ItemId: string,
  Text: string,
  IsChecked: boolean,
  Quantity: number,
  QuantityUnit: string,
  GoodPrice: string,
}

export enum Language{ PR_BR, EN, FR, IT }
export enum MenuOption{ Login, Curriculum, GroceryList, SleepDevice, WorldDefence }
export enum LogLevel { Dev, Warn, Error, None  }