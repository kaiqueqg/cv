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

export interface UserModel{
  UserId: string,
  Username: string,
  Password: string,
}

export interface LoginModel{
  User?: UserModel,
  Token: string,
  ErrorMessage: string,
}

export enum Language{ PR_BR, EN, FR, IT }
export enum MenuOption{ Login, Curriculum, GroceryList, SleepDevice, WorldDefence }