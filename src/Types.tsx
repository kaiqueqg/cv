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

export enum Language{ PR_BR, EN, FR, IT }
export enum MenuOption{ Curriculum, GroceryList, SleepDevice, WorldDefence }