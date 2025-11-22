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

export const ItemNew = (userId: string, objectiveId: string, itemId: string, type: ItemType, pos: number) => {
  return({
    UserIdObjectiveId: userId + objectiveId,
    ItemId: itemId,
    Pos: pos,
    Type: type,
    LastModified: (new Date()).toISOString(),
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

export enum MultiSelectType { MOVE, COPY }
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

export enum ItemType{
  Step,
  Wait,
  Question,
  Note,
  Location,
  Divider,
  Grocery, 
  Medicine, 
  Exercise, 
  Link, 
  ItemFake, 
  Image,
  House }

export interface Item {
  ItemId: string,
  UserIdObjectiveId: string,
  Type: ItemType,
  Pos: number,
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
  Title: string,
  Done: boolean,
  Importance: StepImportance,
  AutoDestroy: boolean,
}

export interface Wait extends Item {
  Title: string,
}

export interface Note extends Item {
  Text: string,
}

export interface Question extends Item {
  Statement: string,
  Answer: string,
}

export interface Location extends Item {
  Title: string,
  Url: string,
}

export interface Divider extends Item {
  Title: string,
  IsOpen: boolean,
}

export interface Grocery extends Item {
  Title: string,
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  GoodPrice?: string,
}

export interface Medicine extends Item{
  Title: string,
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  Purpose?: string,
  Components?: string[],
}

export enum Weekdays{ Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

export interface Exercise extends Item{
  Title: string,
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
  Title: string,
  Link: string,
}

export interface Image extends Item{
  Title: string;
  Name: string,
  Size: number,
  Width: number,
  Height: number,
  IsDisplaying: boolean;
}

export interface House extends Item{
  Title: string,
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