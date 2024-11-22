export interface ObjectiveList{
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
  IsOpen: boolean,
  IsShowing: boolean,
  LastModified: string,
  Pos: number,
  IsShowingCheckedGrocery?: boolean,
  IsShowingCheckedStep?: boolean,
}

export interface ItemViewProps{
  theme: string,
  isEditingPos: boolean,
  isSelected: boolean,
  isEndingPos: boolean,
  putItemInDisplay: (item?: Item, remove?: boolean) => void,
}

export enum ItemType{ Step, Wait, Question, Note, Location, Divider, Grocery, Medicine, ItemFake }

export interface Item {
  ItemId: string,
  UserIdObjectiveId: string,
  Type: ItemType,
  Pos: number,
  LastModified: string,
}
export interface Step extends Item {
  Title: string,
  Done: boolean,
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