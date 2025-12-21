export interface ObjectivesList{
  Objectives?: Objective[],
  Items?: Item[],
  DeleteObjectives?: Objective[],
  DeleteItems?: Item[],
}

export interface Objective {
  UserId: string,
  ObjectiveId: string,
  Title: string,
  Done: boolean,
  Theme: string,
  IsArchived: boolean,
  IsShowing: boolean,
  LastModified: string,
  Pos: number,
  IsShowingCheckedGrocery?: boolean,
  IsShowingCheckedStep?: boolean,
  IsShowingCheckedMedicine?: boolean,
  IsShowingCheckedExercise?: boolean,
  Tags: string[],
}

export const ItemNew = (userId: string, objectiveId: string, itemId: string, type: ItemType, pos: number, title: string) => {
  return({
    UserIdObjectiveId: userId + objectiveId,
    ItemId: itemId,
    Pos: pos,
    Type: type,
    LastModified: (new Date()).toISOString(),
    Title: title,
  });
}

export interface ItemViewProps{
  theme: string,
  isSelecting: boolean,
  isSelected: boolean,
  isDisabled: boolean,
  putItemsInDisplay: (item: Item[]) => void,
  removeItemsInDisplay: (item: Item[]) => void,
  itemTintColor: (theme: string, fade?: boolean) => string,
  isLoadingBlack: boolean,
}

export enum MultiSelectType { MOVE = 'Move', COPY = 'Copy' }
export interface MultSelectAction { type: MultiSelectType, objectiveId: string, items: Item[] }

export interface DisplayTag{
  tag: string,
  show: boolean
}

export interface ImageInfo {
  itemId: string;
  fileName: string;
  fileType: string;
}
export interface PresignedUrl { url: string }

export enum ItemType {
  Step = 'Step',
  Wait = 'Wait',
  Question = 'Question',
  Note = 'Note',
  Location = 'Location',
  Divider = 'Divider',
  Grocery = 'Grocery',
  Medicine = 'Medicine',
  Exercise = 'Exercise',
  Link = 'Link',
  ItemFake = 'ItemFake',
  Image = 'Image',
  House = 'House'
}

export const isCheckableItem = (type: ItemType): boolean => {
  return(
    type === ItemType.Step || 
    type === ItemType.Grocery || 
    type === ItemType.House || 
    type === ItemType.Exercise || 
    type === ItemType.Medicine
  )
}

export interface Item {
  ItemId: string,
  UserIdObjectiveId: string,
  Type: ItemType,
  Pos: number,
  Title: string,
  LastModified: string,
}

export enum StepImportance {
  None,
  Low,
  Medium,
  High,
  Question,
  Waiting,
  InProgress,
  Ladybug,
  LadybugYellow,
  LadybugGreen,
}
export interface Step extends Item {
  Done: boolean,
  Importance: StepImportance,
  AutoDestroy: boolean,
}

export interface Wait extends Item {
}

export interface Note extends Item {
  Text: string,
}

export interface Question extends Item {
  Statement: string,
  Answer: string,
}

export interface Location extends Item {
  Url: string,
}

export interface Divider extends Item {
  IsOpen: boolean,
}

export interface Grocery extends Item {
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  GoodPrice?: string,
}

export interface Medicine extends Item{
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  Purpose?: string,
  Components?: string[],
}

export enum Weekdays{ Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

export interface Exercise extends Item{
  IsDone: boolean,
  Reps: number,
  Series: number,
  MaxWeight: string,
  Description: string,
  Weekdays: Weekdays[],
  LastDone: string,
  BodyImages: string[],
}

export interface Link extends Item{
  Link: string,
}

export interface Image extends Item{
  Name: string,
  Size: number,
  Width: number,
  Height: number,
  IsDisplaying: boolean;
}

export interface House extends Item{
  Listing: string,
  MapLink: string,
  MeterSquare: string,
  Rating: number,
  Address: string,
  TotalPrice: number,
  WasContacted: boolean,
  Details: string,
  Attention: string,
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