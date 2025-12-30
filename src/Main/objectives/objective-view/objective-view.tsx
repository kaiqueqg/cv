import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import './objective-view.scss';
import { useUserContext } from "../../../contexts/user-context";
import { Item, ItemType, Note, Objective, Question, Step, Wait, Location, Divider, Grocery, Medicine, Exercise, Weekdays, StepImportance, Link, Image, ItemNew, House, MultiSelectType, MultSelectAction, isCheckableItem } from "../../../TypesObjectives";
import Loading from "../../../loading/loading";
import TagsView from "./tags-view/tags-view";
import { useLogContext } from "../../../contexts/log-context";

import { ItemFakeView, itemFakeNew } from "./item-fake-view/item-fake-view";
import { WaitView, waitNew} from "./wait-view/wait-view";
import { QuestionView, questionNew } from "./question-view/question-view";
import { StepView, stepNew } from "./step-view/step-view";
import { NoteView, noteNew } from "./note-view/note-view";
import { LocationView, locationNew } from "./location-view/location-view";
import { DividerView, dividerNew } from "./divider-view/divider-view";
import { GroceryView, groceryNew } from "./grocery-view/grocery-view";
import { MedicineView, medicineNew } from "./medicine-view/medicine-view";
import { ExerciseView, exerciseNew } from "./exercise-view/exercise-view";
import { LinkView, linkNew } from "./link-view/link-view";
import { ImageView, imageNew } from "./image-view/image-view";
import { HouseView, houseNew } from "./house-view/house-view";
import PressImage from "../../../press-image/press-image";
import { useRequestContext } from "../../../contexts/request-context";
import { MessageType } from "../../../Types";
import { SCSS, useThemeContext } from "../../../contexts/theme-context";
import { parse } from "path";
import { shouldBeBlack } from "../../../helper";

interface ObjectiveViewProps{
  objective: Objective,
  putObjective: (obj?: Objective, remove?: boolean) => void,
  deleteObjectiveItemsInDisplay: (objectiveId: string, items: Item[], remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

export interface ObjectiveViewRef{
  deleteItems: (items: Item[]) => void,
}

export const ObjectiveView = forwardRef<ObjectiveViewRef, ObjectiveViewProps>((props, ref) => {
  const { objectiveslistApi } = useRequestContext();
  const { putSelectedTags, selectedTags } = useUserContext();
  const { log, popMessage } = useLogContext();
  const { scss, getTintColor } = useThemeContext();
  const { objective, putObjective, isObjsEditingPos } = props;
  const { Theme } = objective;
  
  const [items, setItems] = useState<(Item)[]>([]);
  const [itemSearchToShow, setItemsSearchToShow] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState<string>(props.objective.Title);
  // const [isBelow700px, setIsBelow700px] = useState(window.innerWidth < 700);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>('');
  const [wasNoSearchNoItemFound, setWasNoSearchNoItemFound] = useState<boolean>(false);

  //menus states
  const [isObjectiveMenuOpen, setIsObjectiveMenuOpen] = useState<boolean>(false);

  const [isAddingNewItemMenuOpen, setIsAddingNewItemMenuOpen] = useState<boolean>(false);
  const [amountOfItemsToAdd, setAmountOfItemsToAdd] = useState<number>(1);
  const [isAddingNewItemLocked, setIsAddingNewItemLocked] = useState<boolean>(false);

  const [isColorMenuOpen, setIsColorMenuOpen] = useState<boolean>(false);
  const [isTagsMenuOpen, setIsTagsMenuOpen] = useState<boolean>(false);
  const [isMultiSelectMenuOpen, setIsMultiSelectMenuOpen] = useState<boolean>(false);
  const [isSearchingMenuOpen, setIsSearchingMenuOpen] = useState<boolean>(false);
  const [shouldFoldAll, setShouldFoldAll] = useState<boolean>(true);
  const [hasADividerToFold, setHasADividerToFold] = useState<boolean>(false);
  
  //menu loadings
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoadingChangingColor, setIsLoadingChangingColor] = useState<boolean>(false);
  const [isLoadingChangingTags, setIsLoadingChangingTags] = useState<boolean>(false);
  const [isLoadingIsShowingItems, setIsLoadingIsShowingItems] = useState<boolean>(false);
  const [isLoadingIsEndingSelecMult, setIsLoadingIsEndingSelecMult] = useState<boolean>(false);
  const [isLoadingAddingNewItem, setIsLoadingAddingNewItem] = useState<boolean>(false);
  const [isLoadingShorting, setLoadingIsShorting] = useState<boolean>(false);
  const [isLoadingFoldingUnfolding, setIsLoadingFoldingUnfolding] = useState<boolean>(false);

  //Partial infos
  const [addingNewItemPartialInfo, setAddingNewItemPartialInfo] = useState<string>('');
  const [shortingPartialInfo, setShortingPartialInfo] = useState<string>('');
  const [selecMultPartialInfo, setSelecMultPartialInfo] = useState<string>('');
  const [foldingUnfoldingDividersPartialInfo, setFoldingUnfoldingDividersPartialInfo] = useState<string>('');

  //Multiple selected items
  const [shouldSelectAll, setShouldSelectAll] = useState<boolean>(false);
  const [multItemsSelected, setMultItemsSelected] = useState<Item[]>([]);
  const [isSelectingPastePos, setIsSelectingPastePos] = useState<any>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isRequestingItems, setIsRequestingItems] = useState<boolean>(false);

  //dev
  const [devShowPos, setDevShowPos] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  let hiddenItems = 0;

  useEffect(() => {
    if(objective.IsShowing) {
      downloadItemList();
    }

    // const handleResize = () => {
    //   setIsBelow700px(window.innerWidth < 700);
    // };

    
    // window.addEventListener('resize', handleResize);
    // return () => {
    //   window.removeEventListener('resize', handleResize);
    // };
  }, []);

  useEffect(() => {
    setHasADividerToFold(items.some((item) => {
      if(item.Type === ItemType.Divider){
        return true;
      }
      else{
        return false;
      }
    }));
  }, [items]);

  //!Dangerous
  useImperativeHandle(ref, () => ({
    deleteItems(items: Item[]) {
      deleteItems(items);
    },
  }));

  const downloadItemList = async () => {
    setIsRequestingItems(true);

    try {
      const data = await objectiveslistApi.getObjectiveItemList(objective.ObjectiveId);
      if(data){
        const sorted = data.sort((a: Item, b: Item) => a.Pos-b.Pos);
        setItems(sorted);
      }
    } 
    catch (err) {
      log.err(JSON.stringify(err));
      setIsRequestingItems(false);
    }

    setIsRequestingItems(false);
  }

  ///Put items in display
  const putItemsInDisplay = async (items: Item[]) => {
    setItems((prevItems) => {
      let newItems: Item[] = [...prevItems];
      // Add or update each item
      for (const item of items) {
        const existingIndex = newItems.findIndex((i: Item) => i.ItemId === item.ItemId);
        if (existingIndex >= 0) {
          newItems[existingIndex] = item; // update
        } else {
          newItems.push(item); // add new
        }
      }

      return newItems.sort((a, b) => a.Pos - b.Pos);
    });
  }

  ///Remove items in display
  const removeItemsInDisplay = (items: Item[]) => {
    setItems((prevItems) => {
      let newItems: Item[] = [...prevItems];

      // Remove all matching items
      newItems = newItems.filter(
        (i: Item) => !items.some((r: Item) => r.ItemId === i.ItemId)
      );

      // Sort by position
      return newItems.sort((a, b) => a.Pos - b.Pos);
    });
  }

  ///Delete items in DB and update in display
  const deleteItems = async (items: Item[]) => {
    setIsLoadingIsEndingSelecMult(true);
    const data = await objectiveslistApi.deleteObjectiveItems(items, (value: string) =>{
      setSelecMultPartialInfo(value);
    });

    if(data){
      removeItemsInDisplay(data);
    }
    setIsLoadingIsEndingSelecMult(false);
  }

  const deleteObjective = async () => {   
    setIsDeleting(true);
    try {
      const data = await objectiveslistApi.deleteObjectives([objective]);
  
      if(data){
        putObjective(objective, true);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsDeleting(false);
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleTitleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const doneEdit = async () => {
    setIsSavingTitle(true);
    const newObjective: Objective = {...objective, Title: newTitle, LastModified: new Date().toISOString()};

    if(newObjective.Title !== objective.Title) {
      const data = await objectiveslistApi.putObjectives([newObjective]);
      if(data){
        putObjective(newObjective);
        setIsEditingTitle(false);
      }
    }

    setIsSavingTitle(false);
    setIsEditingTitle(false);
  }

  const cancelEdit = () => {
    setNewTitle(objective.Title);
    setIsEditingTitle(false);
  }

  const doneEditTags = async (tagList: string[]) => {
    setIsTagsMenuOpen(false);

    setIsLoadingChangingTags(true);
    const newObjective: Objective = {...objective, Tags: tagList, LastModified: new Date().toISOString()};

    const newTags = tagList.filter((t) => !objective.Tags.includes(t));

    if(newObjective.Tags !== objective.Tags) {
      const data = await objectiveslistApi.putObjectives([newObjective]);

      if(data){
        putObjective(newObjective);
        putSelectedTags(newTags);
      }
    }

    setIsLoadingChangingTags(false);
  }

  const cancelEditTags = () => {
    setIsTagsMenuOpen(false);
  }

  const closeAllTopMenus = () => {
    // setIsObjectiveMenuOpen(false);

    setIsAddingNewItemMenuOpen(false);
    setIsColorMenuOpen(false);
    setIsTagsMenuOpen(false);
    setIsSearchingMenuOpen(false);

    setIsMultiSelectMenuOpen(false);
    setIsSelectingPastePos(false);
  }

  ////Open, close or lock icon and menu.
  const openNewItemMenu = async () => {
    closeAllTopMenus();

    if(isAddingNewItemMenuOpen){
      if(isAddingNewItemLocked){ //turn all off
        setIsAddingNewItemLocked(false);
        setIsAddingNewItemMenuOpen(false);
        setAmountOfItemsToAdd(1);
      }
      else{//adding but now lock
        setIsAddingNewItemMenuOpen(true);
        setIsAddingNewItemLocked(true);
      }
    }
    else{//start adding item
      setIsAddingNewItemMenuOpen(true);
        setIsAddingNewItemLocked(false);
    }
  }

  ////Actualy add the items
  const addNewItems = async (addItems: Item[], pos?:number) => {
    let sending:Item[] = [];

    //^ With pos
    if (pos !== undefined && pos !== null) {
      const newList = items.filter((i: Item) => !multItemsSelected.includes(i));

      const before = newList.slice(0, pos + 1);
      const after = newList.slice(pos + 1);

      const adjustedList = [...before, ...addItems, ...after];

      for (let i = 0; i < adjustedList.length; i++) {
        sending.push({
          ...adjustedList[i],
          Pos: i,
          LastModified: new Date().toISOString(),
        });
      }
    }
    //^ Without pos
    else{
      setIsLoadingAddingNewItem(true);
      for(let i = 0; i < addItems.length; i++){
        sending.push({...addItems[i], Pos: items.length+i});
      }
    }
    
    const data = await objectiveslistApi.putObjectiveItems(sending, (value: string) =>{
      setAddingNewItemPartialInfo(value);
    });
    if(data){
      putItemsInDisplay(data);
    }

    setAddingNewItemPartialInfo('');
    setIsLoadingAddingNewItem(false);
  }

  ////Chose which item to add
  const choseNewItemToAdd = async (type: ItemType, pos?:number, amount?: number) => {
    if(!isAddingNewItemLocked) setIsAddingNewItemMenuOpen(false);

    const baseItem:Item = ItemNew('', objective.ObjectiveId, '', type, pos?pos:items.length, '');
    let typeItem:any = {};

    switch (type) {
      case ItemType.Divider:
        typeItem = {...baseItem, ...dividerNew()};
        break;
      case ItemType.Step:
        typeItem = {...baseItem, ...stepNew()};
        break;
      case ItemType.Question:
        typeItem = {...baseItem, ...questionNew()};
        break;
      case ItemType.Wait:
        typeItem = {...baseItem, ...waitNew()};
        break;
      case ItemType.Note:
        typeItem = {...baseItem, ...noteNew()};
        break;
      case ItemType.Location:
        typeItem = {...baseItem, ...locationNew()};
        break;
      case ItemType.Grocery:
        typeItem = {...baseItem, ...groceryNew()};
        break;
      case ItemType.Medicine:
        typeItem = {...baseItem, ...medicineNew()};
        break;
      case ItemType.Exercise:
        typeItem = {...baseItem, ...exerciseNew()};
        break;
      case ItemType.ItemFake:
        typeItem = {...baseItem, ...itemFakeNew()};
        break;
      case ItemType.Link:
        typeItem = {...baseItem, ...linkNew()};
        break;
      case ItemType.Image:
        typeItem = {...baseItem, ...imageNew()};
        break;
      case ItemType.House:
        typeItem = {...baseItem, ...houseNew()};
        break;
      default:
        break;
    }

    const itemList:Item[] = [];
    const finalAmount = amount?amount:amountOfItemsToAdd;
    for(let i = 0; i < finalAmount; i++){
      itemList.push(typeItem);
    }
    await addNewItems(itemList, pos)
  }

  const onChangeObjectiveIsArchived = async () => {
    try {
      const newObjective: Objective = {...objective, IsArchived: !objective.IsArchived, LastModified: new Date().toISOString()};
      putObjective(newObjective);
      const data = await objectiveslistApi.putObjectives([newObjective]);
      
      if(data){
        if(data[0].IsShowing){
          downloadItemList();
        }
        else{
          setItems([]);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
  }

  const onChangeObjectiveIsShowing = async () => {
    try {

      const newObjective:Objective = {...objective, IsShowing: !objective.IsShowing, LastModified: new Date().toISOString()};
      putObjective(newObjective); //change before confirm to be more practicle
      const data = await objectiveslistApi.putObjectives([newObjective]);
      
      if(data){
        if(data[0].IsShowing){
          downloadItemList();
        }
        else{
          setItems([]);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
  }

  const openColorMenu = async () => {
    closeAllTopMenus();
    setIsColorMenuOpen(!isColorMenuOpen);
  }

  const openTagsMenu = () => {
    closeAllTopMenus();
    setIsTagsMenuOpen(!isTagsMenuOpen);
  }

  const openSearchMenu = () => {
    closeAllTopMenus();

    setIsSearchingMenuOpen(!isSearchingMenuOpen);
    setSearchText('');
    setWasNoSearchNoItemFound(false);
    setItemsSearchToShow([]);
  }

  const openObjectiveMenu = () => {
    closeAllTopMenus();

    setIsObjectiveMenuOpen(!isObjectiveMenuOpen);
  }

  const onFoldUnfoldDividers = async () => {
    setIsLoadingFoldingUnfolding(true);

    const newDividers:Divider[] = items.filter((item: Item) => {
      return item.Type === ItemType.Divider && (item as Divider).IsOpen === shouldFoldAll;
      }).map((item) => {
      return {...(item as Divider), IsOpen:!shouldFoldAll};
    });

    const data = await objectiveslistApi.putObjectiveItems(newDividers, (value: string) => {
      log.r(value)
      setFoldingUnfoldingDividersPartialInfo(value);
    });
    if(data){
      putItemsInDisplay(data);
      setShouldFoldAll(!shouldFoldAll);
    }

    setFoldingUnfoldingDividersPartialInfo('');
    setIsLoadingFoldingUnfolding(false);
  }

  const changeObjColor = async (theme: string) => {
    
    setIsLoadingChangingColor(true);
    try {
      const newObj = {...objective, Theme: theme, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectives([newObj]);
      
      if(data){
        putObjective(newObj);
      }
      else{
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    
    setIsColorMenuOpen(false);
    setIsLoadingChangingColor(false);
  }

  const onChangeIsShowingItems  = async () => {
    setIsColorMenuOpen(false);

    setIsLoadingIsShowingItems(true);

    const newObjective: Objective = {
      ...objective, 
      IsShowingCheckedGrocery: !objective.IsShowingCheckedGrocery, 
      IsShowingCheckedExercise: !objective.IsShowingCheckedGrocery,
      IsShowingCheckedMedicine: !objective.IsShowingCheckedGrocery,
      IsShowingCheckedStep: !objective.IsShowingCheckedGrocery, //for now, to all be the same
      LastModified: new Date().toISOString()
    };

    const data = await objectiveslistApi.putObjectives([newObjective]);
      
    if(data){
      putObjective(newObjective);
    }

    setIsLoadingIsShowingItems(false);
  }

  ////Open or close multi select menu
  const onMultiSelectOpen = () => {
    closeAllTopMenus();
    setIsMultiSelectMenuOpen(!isMultiSelectMenuOpen);
    setShouldSelectAll(false);
    if(!isMultiSelectMenuOpen) cancelMultiSelect();
  }

  const cancelMultiSelect = () => {
    setShouldSelectAll(false);
    setMultItemsSelected([]);
  }

  //// Add or remove Item from multi select list
  const addingRemovingItem = (item: Item) => {
    const filteredList = multItemsSelected.filter((i) => i.ItemId !== item.ItemId);

    if(filteredList.length !== multItemsSelected.length){
      setMultItemsSelected(filteredList);
    }
    else{
      setMultItemsSelected([...multItemsSelected, item]);
    }
  }
  
  ///TODO Multi select functions --------------------------------------------------------------------------

  const eraseSelectedItems = () => {
    setMultItemsSelected([]);
    sessionStorage.removeItem('multiItems');
  }

  const moveItems = () => {
    const action: MultSelectAction = { type: MultiSelectType.MOVE, objectiveId:objective.ObjectiveId, items: multItemsSelected};
    sessionStorage.setItem('multiItems', JSON.stringify(action));

    popMessage('Items to move selected.');

    setSelecMultPartialInfo('');
    setIsMultiSelectMenuOpen(false);
    setMultItemsSelected([]);
    setShouldSelectAll(false);

    setIsLoadingIsEndingSelecMult(false);
  }

  const copyItems = () => {
    const action: MultSelectAction = { type: MultiSelectType.COPY, objectiveId:objective.ObjectiveId, items: multItemsSelected};
    sessionStorage.setItem('multiItems', JSON.stringify(action));

    popMessage('Items copied.');

    setSelecMultPartialInfo('');
    setIsMultiSelectMenuOpen(false);
    setMultItemsSelected([]);
    setShouldSelectAll(false);

    setIsLoadingIsEndingSelecMult(false);
  }

  const pasteItems = async (itemTo: Item) => {
    try{
      const action: string|null = sessionStorage.getItem('multiItems'); /// should 
      let parsedAction: MultSelectAction;

      if(action) {
        try {
          parsedAction = JSON.parse(action);

          const itemsToCopy = parsedAction.items.map((item: Item) => {
            return {...item, ItemId: '', UserIdObjectiveId: objective.ObjectiveId };
          });

          const index = items.indexOf(itemTo);
          const before = items.slice(0, index+1);
          const after = items.slice(index+1);

          let ajustedList = [...before, ...itemsToCopy, ...after];

          let finalList:Item[] = [];
          for(let i = 0; i < ajustedList.length; i++){
            finalList.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
          }

          try{
            setIsLoadingIsEndingSelecMult(true);
            const data = await objectiveslistApi.putObjectiveItems(finalList, 
            //   (value: string) =>{
            //   setSelecMultPartialInfo(value);
            // }
          );

            if(data) {
              sessionStorage.removeItem('multiItems');
              setItems(data);

              if(parsedAction.type === MultiSelectType.MOVE){
                props.deleteObjectiveItemsInDisplay(parsedAction.objectiveId, parsedAction.items, true);
              }
              
              setMultItemsSelected([]);
            }
            else{
              downloadItemList(); //// in case failed, reload items
            }
          }
          catch(err){}
        } catch (err) {
          popMessage('Error trying to paste.', MessageType.Error);
          return;
        }
      }
    }
    catch{
      popMessage('Error trying to parse items', MessageType.Error);
    }

    setSelecMultPartialInfo('');
    setIsMultiSelectMenuOpen(false);
    setIsSelectingPastePos(false);
    setShouldSelectAll(false);
    setIsLoadingIsEndingSelecMult(false);
  }

  const deleteSelectedItems = async () => {
    setIsLoadingIsEndingSelecMult(true);
    setIsMultiSelectMenuOpen(false);
    
    await deleteItems(multItemsSelected);
    setMultItemsSelected([]);

    setIsLoadingIsEndingSelecMult(false);
  }

  ///TODO Multi select functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const sortItemsAlphabetically = (items: Item[], onlyTitle?: boolean): Item[] => {
    return items.sort((a, b) => {
        const titleA = getSortableText(a, onlyTitle);
        const titleB = getSortableText(b, onlyTitle);

        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
  }

  ////Get correct text to compare in each type of item
  const getSortableText = (item: Item, onlyTitle?: boolean): string => {
    if (item.Type === ItemType.Step) {
        return (item as Step).Title.toLowerCase();
    }
    if (item.Type === ItemType.Wait) {
      return (item as Wait).Title.toLowerCase();
    }
    if (item.Type === ItemType.Grocery) {
      return (item as Grocery).Title.toLowerCase();
    }
    if (item.Type === ItemType.Divider) {
      return (item as Divider).Title.toLowerCase();
    }
    if (item.Type === ItemType.Location) {
      return (item as Location).Title.toLowerCase();
    }
    if (item.Type === ItemType.Question) {
      return (item as Question).Statement.toLowerCase();
    }
    if (item.Type === ItemType.Note) {
      return (item as Note).Text.toLowerCase();
    }
    if (item.Type === ItemType.Exercise) {
      return (item as Exercise).Title.toLowerCase();
    }
    if (item.Type === ItemType.Medicine) {
      return (item as Location).Title.toLowerCase();
    }
    if (item.Type === ItemType.Link) {
      return (item as Link).Title.toLowerCase();
    }
    if (item.Type === ItemType.ItemFake) {
      return "";
    }
    if (item.Type === ItemType.Image) {
      return (item as Image).Title.toLowerCase();
    }
    if (item.Type === ItemType.House) {
      const i = (item as House);

      if(onlyTitle)
        return i.Title;
      else
        return i.Address + i.Rating.toString() + i.MeterSquare + i.TotalPrice + i.Title;
    }
    return "";
  }

  const checkUncheckedDividerItems = async (value: boolean, divider: Item) => {
    let start = false;
    let itemsToChange:Item[] = [];
    for(let i = 0; i < items.length; i++){
      const item = items[i];
      if(start && item.Type === ItemType.Divider) break;

      if(start) {
        switch(item.Type){
          case ItemType.Exercise:
            itemsToChange.push({...item, IsDone: value} as Exercise);
            break;
          case ItemType.Medicine:
            itemsToChange.push({...item, IsChecked: value} as Medicine);
            break;
          case ItemType.Step:
            itemsToChange.push({...item, Done: value} as Step);
            break;
          case ItemType.Grocery:
            itemsToChange.push({...item, IsChecked: value} as Grocery);
            break;
          case ItemType.House:
            itemsToChange.push({...item, WasContacted: value} as House);
            break;
        }
      }

      if(items[i] === divider){ 
        start = true; 
      }
    }

    const data = await objectiveslistApi.putObjectiveItems(itemsToChange);

    if(data){
      putItemsInDisplay(data);
    }
  }

  ////Order items only bellowing to divider
  const orderDividerItems = async (divider: Item) => {
    let start = false;
    let itemsToOrder = [];
    for(let i = 0; i < items.length; i++){
      if(start && items[i].Type === ItemType.Divider) break;

      if(start) itemsToOrder.push(items[i]);

      if(items[i] === divider){ 
        start = true; 
      }
    }

    let itemsOrdered:Item[] = sortItemsAlphabetically(itemsToOrder);

    let sending:Item[] = [];
    const newList = items.filter((i: Item) => !itemsOrdered.includes(i));
    const before = newList.slice(0, divider.Pos+1);
    const after = newList.slice(divider.Pos+1);

    let ajustedList = [...before, ...itemsOrdered, ...after];

    for(let i = 0; i < ajustedList.length; i++){
      sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    const data = await objectiveslistApi.putObjectiveItems(sending, (value: string) => {
        setShortingPartialInfo(value);
      }
    );

    if(data){
      putItemsInDisplay(data);
    }
  }

  ////Order all items
  const orderItemsAtoZ = async () => {
    setLoadingIsShorting(true);
    let itemsOrdered:Item[] = sortItemsAlphabetically(items, true);
    let sending:Item[] = [];

    for(let i = 0; i < itemsOrdered.length; i++){
      sending.push({...itemsOrdered[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    const data = await objectiveslistApi.putObjectiveItems(sending, 
      (value: string) => {
      setShortingPartialInfo(value);
    }
  );

    if(data){
      putItemsInDisplay(data);
    }
    
    setShortingPartialInfo('');
    setLoadingIsShorting(false);
  }

  ////Increment the number os items to add
  const increaseAmountItemsToAdd = () => {
    if(amountOfItemsToAdd >= 10)
      setAmountOfItemsToAdd(1);
    else
      setAmountOfItemsToAdd(amountOfItemsToAdd+1);
  }

  ////Get the specific Item view
  const getItemView = (item: Item): React.ReactNode => {
    let rtnItem;
    const includes = multItemsSelected.includes(item);
    const isSelecting = includes && isMultiSelectMenuOpen && !isSelectingPastePos;

    const action: string|null = sessionStorage.getItem('multiItems');
    let parsedAction: MultSelectAction|null = null;

    try {
      if(action) parsedAction = JSON.parse(action);
    } catch (err) {}

    let isSelected = false;
    if(parsedAction) isSelected = parsedAction.items.some(i => i.ItemId === item.ItemId);
    if(item.Type === ItemType.Step){
      rtnItem = <StepView 
        key={item.ItemId}
        theme={Theme}
        step={item as Step}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        ></StepView>
    }
    else if(item.Type === ItemType.Question){
      rtnItem = <QuestionView 
        key={item.ItemId}
        theme={Theme} 
        question={item as Question}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></QuestionView>
    }
    else if(item.Type === ItemType.Wait){
      rtnItem = <WaitView 
        key={item.ItemId}
        theme={Theme}
        wait={item as Wait}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></WaitView>
    }
    else if(item.Type === ItemType.Note){
      rtnItem = <NoteView 
        key={item.ItemId}
        theme={Theme}
        note={item as Note}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></NoteView>
    }
    else if(item.Type === ItemType.Location){
      rtnItem = <LocationView 
        key={item.ItemId}
        theme={Theme}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        location={item as Location}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></LocationView>
    }
    else if(item.Type === ItemType.Divider){
      rtnItem = <DividerView 
        key={item.ItemId}
        theme={Theme}
        divider={item as Divider}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        orderDividerItems={orderDividerItems}
        checkUncheckedDividerItems={checkUncheckedDividerItems}
        choseNewItemToAdd={choseNewItemToAdd}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></DividerView>
    }
    else if(item.Type === ItemType.Grocery){
      rtnItem = <GroceryView 
        key={item.ItemId}
        theme={Theme}
        grocery={item as Grocery}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></GroceryView>
    }
    else if(item.Type === ItemType.Medicine){
      rtnItem = <MedicineView 
        key={item.ItemId}
        theme={Theme}
        medicine={item as Medicine}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></MedicineView>
    }
    else if(item.Type === ItemType.Exercise){
      rtnItem = <ExerciseView 
        key={item.ItemId}
        theme={Theme}
        exercise={item as Exercise}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></ExerciseView>
    }
    else if(item.Type === ItemType.Link){
      rtnItem = <LinkView 
        key={item.ItemId}
        theme={Theme}
        link={item as Link}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></LinkView>
    }
    else if(item.Type === ItemType.Image){
      rtnItem = <ImageView 
        key={item.ItemId}
        theme={Theme}
        image={item as Image}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></ImageView>
    }
    else if(item.Type === ItemType.House){
      rtnItem = <HouseView 
        key={item.ItemId}
        theme={Theme}
        house={item as House}
        isSelecting={isSelecting}
        isSelected={isSelected}
        isDisabled={isMultiSelectMenuOpen || isSelectingPastePos}
        putItemsInDisplay={putItemsInDisplay}
        removeItemsInDisplay={removeItemsInDisplay}
        itemTintColor={getTintColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}></HouseView>
    }
    else{
      rtnItem = <div key={'cantrender'}>Can't render</div>
    }

    return (
    <div key={item.ItemId} className='objItemRow' onClick={()=>onClickItemContainer(item)}>
      {isMultiSelectMenuOpen && !isSelectingPastePos && <PressImage onClick={() => {if(isMultiSelectMenuOpen) addingRemovingItem(item)}} src={process.env.PUBLIC_URL + (isSelecting?'/checked':'/unchecked') + getTintColor(Theme) + '.png'} isLoadingBlack={shouldBeBlack(objective.Theme)}/>}
      {devShowPos && <div className={'objDevPosText' + scss(Theme, [SCSS.TEXT])}>{item.Pos < 10?'0'+item.Pos:item.Pos}</div>}
      {rtnItem}
    </div>)
  }

  const onClickItemContainer = (item: Item) => {
    if(isMultiSelectMenuOpen){
      if(isSelectingPastePos){
        pasteItems(item);
      }
      else{
        addingRemovingItem(item);
      }
    }
  }

  const getDisplayItemList = () => {
    let filteredItems:Item[] = [];
    let partialItems:Item[] = [];

    let isAfterDivider = false;
    let isDividerOpen = true;
    for(let i = 0; i < items.length; i++){
      let current = items[i];
      let shouldAddStep = true;
      let shouldAddGrocery = true;
      let shouldAddExercise = true;
      let shouldAddMedicine = true;
      let shouldAddHouse = true;
      let shouldAddIsInSearch = true;

      if(itemSearchToShow.length && !itemSearchToShow.includes(current.ItemId)) shouldAddIsInSearch = false;

      if(current.Type === ItemType.Divider) {
        isAfterDivider = true;
        if(partialItems.length > 1 && !objective.IsShowingCheckedStep && shouldAddIsInSearch){
          filteredItems.push(...partialItems);
        }
        partialItems = [];
        const divider = current as Divider;
        if(objective.IsShowingCheckedStep && shouldAddIsInSearch)
          filteredItems.push(divider);
        else if(shouldAddIsInSearch)
          partialItems.push(divider);
        isDividerOpen = divider.IsOpen;
      }
      else{
        if(current.Type === ItemType.Step && !objective.IsShowingCheckedStep) shouldAddStep = !(current as Step).Done;
        if(current.Type === ItemType.Grocery && !objective.IsShowingCheckedGrocery) shouldAddGrocery = !(current as Grocery).IsChecked;
        if(current.Type === ItemType.Exercise && !objective.IsShowingCheckedExercise) shouldAddExercise = !(current as Exercise).IsDone;
        if(current.Type === ItemType.Medicine && !objective.IsShowingCheckedMedicine) shouldAddMedicine = !(current as Medicine).IsChecked;
        if(current.Type === ItemType.House && !objective.IsShowingCheckedStep) shouldAddHouse = !(current as House).WasContacted;
        if(isDividerOpen && shouldAddStep && shouldAddGrocery && shouldAddExercise && shouldAddMedicine && shouldAddHouse && shouldAddIsInSearch){
          if(isAfterDivider && !objective.IsShowingCheckedStep)
            partialItems.push(current);
          else
            filteredItems.push(current);
        }
        else{
        }
      }
    }

    if(partialItems.length > 1 && !objective.IsShowingCheckedStep){
      filteredItems.push(...partialItems);
    }

    let rtn: React.ReactNode[] = [];
    if(isMultiSelectMenuOpen && isSelectingPastePos) {
      const fakeItem = {ItemId:'---', LastModified:'', Pos:-1, Type: ItemType.ItemFake, UserIdObjectiveId:'---', Title: 'fake'};
      const a = <ItemFakeView 
      key={'asd'}
      theme={Theme}
      isSelecting={false}
      isSelected={false}
      isDisabled={false}
      putItemsInDisplay={putItemsInDisplay}
      removeItemsInDisplay={removeItemsInDisplay}
      itemTintColor={getTintColor}
      isLoadingBlack={shouldBeBlack(objective.Theme)}></ItemFakeView>
      rtn.push(
      <div key={'fake'} className='objItemRow' onClick={() => pasteItems(fakeItem)}>
        {a}
      </div>);
    }

    hiddenItems = (items.length - filteredItems.length);
    filteredItems.forEach((item)=>{
      rtn.push(getItemView(item));
    })

    return rtn;
  };

  const getItemList = () => {
    if(isRequestingItems){
      return <Loading IsBlack={shouldBeBlack(objective.Theme)}></Loading>;
    }
    else{
      return(
        (objective.IsShowing && 
          <div className='objectiveItemsContainer'>
            {getDisplayItemList()}
          </div>
        )
      )
    }
  }

  //TODO GET Menus ---------------------------------------------------------------------------
  
  const getTopMenu = () => {
    return (
      <div className={'objTopMenu '}>
        {!isEditingTitle && getLeftIconsMenu()}
        {getObjectiveTitle()}
        {!isEditingTitle && getRightIconsMenu()}
      </div>
    )
  }

  const getObjectiveMenu = () => {
    if(!isObjectiveMenuOpen) return <></>;

    return (
      <div className={'objObjectiveMenu ' + scss(Theme, [SCSS.BORDERCOLOR_CONTRAST, SCSS.ITEM_BG])}>
        {getArchiveButton()}
        {getIsShowingButton()}
        {getPaletteButton()}
        {getTagMenuButton()}
        {getSearchMenuButton()}
        {getFoldUnfoldButton()}
        {getSortItemsButton()}
        {getMultiSelectButton()}
        {getIsShowingItemsButton()}
        {getNewItemButton()}
      </div>
    )
  }

  const getLeftIconsMenu = () => {
    return(
      <div className='objTitleLeft'>
        <PressImage hide/>
      </div>
    )
  }
  
  const getRightIconsMenu = () => {
    return(
      <div className='objTitleRight'>
        {getObjectiveMenuButton()}
      </div>
    )
  }

  const getColorMenu = () => {
    if(!(objective.IsShowing && isColorMenuOpen)) return <></>;

    return(
      <div className={'objectiveColorContainer ' + scss(Theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST])}>
        <div className={'objectiveColorButton ' + scss('blue', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('blue')}></div>
        <div className={'objectiveColorButton ' + scss('red', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('red')}></div>
        <div className={'objectiveColorButton ' + scss('green', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('green')}></div>
        <div className={'objectiveColorButton ' + scss('white', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('white')}></div>
        <div className={'objectiveColorButton ' + scss('cyan', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('cyan')}></div>
        <div className={'objectiveColorButton ' + scss('pink', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('pink')}></div>
        <div className={'objectiveColorButton ' + scss('noTheme', [SCSS.OBJ_BG])} onClick={()=>changeObjColor('noTheme')}></div>
      </div>
    )
  }

  const getNewItemMenu = () => {
    if(!isAddingNewItemMenuOpen) return <></>;

    return(
      <div className={'objectiveNewItemContainer' + scss(Theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST])}>
        <div className={'objectiveNewItemAmount' + scss(Theme, [SCSS.TEXT])} onClick={increaseAmountItemsToAdd}>{amountOfItemsToAdd + 'x'}</div>
        <div className='objectiveNewItemImages'>
          <PressImage src={process.env.PUBLIC_URL + '/home' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.House)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/link' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Link)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/exercise-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Exercise)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/minus' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Divider)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/grocery-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Grocery)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/medicine-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Medicine)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/location-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Location)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/question-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Question)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/note' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Note)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/step-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Step)}}/>
          <PressImage src={process.env.PUBLIC_URL + '/image-filled' + getTintColor(Theme) + '.png'} onClick={()=>{choseNewItemToAdd(ItemType.Image)}}/>
        </div>
      </div>
    )
  }

  const getTagMenu = () => {
    if(!isTagsMenuOpen) return <></>;

    return(
      <TagsView 
        theme={Theme}
        tags={objective.Tags}
        doneEditTags={doneEditTags}
        cancelEditTags={cancelEditTags}/>
    )
  }

  const getMultiSelectMenu = () => {
    if(!isMultiSelectMenuOpen) return <></>;
    
    const stgValue: string|null = sessionStorage.getItem('multiItems');

    return(
      <div className={'objectiveMultiSelectContainer ' + scss(Theme, [SCSS.BORDERCOLOR_CONTRAST, SCSS.ITEM_BG])}>
        <PressImage onClick={multiSelectChangeSelectAll} src={process.env.PUBLIC_URL + (shouldSelectAll?'/checked':'/unchecked') + getTintColor(Theme) + '.png'} isLoadingBlack={shouldBeBlack(objective.Theme)}/>
        <div className={'objectiveMultiSelectMenu '}>
          <div className={'objectiveMultiSelectMenuIcon ' + scss(Theme, [SCSS.TEXT], !(multItemsSelected.length !== 0 || stgValue !== null))} onClick={() => {if(multItemsSelected.length > 0 || stgValue !== null) eraseSelectedItems()}}>
            <PressImage src={process.env.PUBLIC_URL + '/eraser' + getTintColor(Theme) + '.png'} disable={multItemsSelected.length === 0 && stgValue === null} disableMsg="No item unselect..." disableSrc={process.env.PUBLIC_URL + '/eraser-grey.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} hideHoverEffect/>
            Unselect
          </div>
          <div className={'objectiveMultiSelectMenuIcon' + scss(Theme, [SCSS.TEXT], multItemsSelected.length === 0)} onClick={()=> {if(multItemsSelected.length !== 0)moveItems()}}>
            <PressImage onClick={moveItems} src={process.env.PUBLIC_URL + '/next' + getTintColor(Theme) + '.png'} disable={multItemsSelected.length === 0} disableMsg="No item selected..." disableSrc={process.env.PUBLIC_URL + '/next-grey.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} hideHoverEffect/>
            Move
          </div>
          <div className={'objectiveMultiSelectMenuIcon' + scss(Theme, [SCSS.TEXT], multItemsSelected.length === 0)} onClick={()=> {if(multItemsSelected.length !== 0)copyItems()}}>
            <PressImage onClick={copyItems} src={process.env.PUBLIC_URL + '/copy' + getTintColor(Theme) + '.png'} disable={multItemsSelected.length === 0} disableMsg="No item selected..." disableSrc={process.env.PUBLIC_URL + '/copy-grey.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} hideHoverEffect/>
            Copy
          </div>
          <div className={'objectiveMultiSelectMenuIcon' + scss(Theme, [SCSS.TEXT], stgValue === null)} onClick={() => {if(stgValue !== null)setIsSelectingPastePos(true);}}>
            <PressImage onClick={() => {setIsSelectingPastePos(true);}} src={process.env.PUBLIC_URL + '/insert' + getTintColor(Theme) + '.png'} disable={stgValue === null} disableMsg="You need to select copy or move before paste..." disableSrc={process.env.PUBLIC_URL + '/insert-grey.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} hideHoverEffect/>
            Paste
          </div>
          <div className={'objectiveMultiSelectMenuIcon' + scss(Theme, [SCSS.TEXT], multItemsSelected.length === 0)} onClick={()=> {if(multItemsSelected.length !== 0)deleteSelectedItems()}}>
            <PressImage onClick={deleteSelectedItems} src={process.env.PUBLIC_URL + '/trash-red' + getTintColor(Theme) + '.png'} confirm disable={multItemsSelected.length === 0} disableMsg="No item selected..." disableSrc={process.env.PUBLIC_URL + '/trash-grey.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} rawImage hideHoverEffect/>
            Delete
          </div>
        </div>
      </div>
    )
  }

  const getSearchingMenu = () => {
    if(!isSearchingMenuOpen) return <></>;

    return(
      <div className={'objectiveSearchContainer' + scss(Theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST])}>
        <input
          className={'input-simple-base ' + scss(Theme, [SCSS.INPUT]) + (wasNoSearchNoItemFound? ' inputAlert':'')}
          type='text'
          value={searchText}
          placeholder="search..."
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown} autoFocus>
        </input>
        <PressImage onClick={doSearchText} src={process.env.PUBLIC_URL + '/done' + getTintColor(Theme) + '.png'} rawImage></PressImage>
        <PressImage onClick={cancelSearch} src={process.env.PUBLIC_URL + '/cancel' + getTintColor(Theme) + '.png'} rawImage></PressImage>
      </div>
    )
  }

  //TODO GET Menus ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //TODO GET Buttons ---------------------------------------------------------------------------

  const getObjectiveMenuButton = () => {
    return(
      <PressImage 
        onClick={()=>{if(!isObjsEditingPos)openObjectiveMenu()}}
        src={process.env.PUBLIC_URL + '/menu' + getTintColor(Theme) + '.png'}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isObjectiveMenuOpen}
      />
    )
  }

  const getFoldUnfoldButton = () => {
    return(
      <PressImage 
        onClick={()=>{if(!isObjsEditingPos)onFoldUnfoldDividers()}}
        src={process.env.PUBLIC_URL + '/double'+(shouldFoldAll?'down':'up')+'-chevron' + getTintColor(Theme) + '.png'}
        disable={items.length < 1 || !hasADividerToFold} isLoading={isLoadingFoldingUnfolding}
        disableSrc={process.env.PUBLIC_URL + '/double'+(  shouldFoldAll?'down':'up')+'-chevron-grey.png'}
        disableMsg="There's no divider item to fold..."
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        badgeText={foldingUnfoldingDividersPartialInfo}
      />
    )
  }

  const getSortItemsButton = () => {
    return (
      <PressImage 
        onClick={orderItemsAtoZ}
        src={process.env.PUBLIC_URL + '/atoz' + getTintColor(Theme) + '.png'}
        isLoading={isLoadingShorting}
        badgeText={shortingPartialInfo}
        confirm
        disable={items.length < 2}
        disableSrc={process.env.PUBLIC_URL + '/atoz-grey.png'}
        disableMsg="There are fewer than two items on the list..."
        isLoadingBlack={shouldBeBlack(objective.Theme)}/>
    )
  }

  const getArchiveButton = () => {
    return(
      <PressImage
        onClick={onChangeObjectiveIsArchived}
        src={process.env.PUBLIC_URL + '/archive' + getTintColor(Theme) + '.png'}
        confirm={true}
        isLoadingBlack={shouldBeBlack(objective.Theme)} />
    )
  }

  const getIsShowingButton = () => {
    return(
      <PressImage
        onClick={onChangeObjectiveIsShowing}
        src={process.env.PUBLIC_URL + (objective.IsShowing? '/show':'/hide') + getTintColor(Theme) + '.png'}
        isLoadingBlack={shouldBeBlack(objective.Theme)}/>
    )
  }

  const getPaletteButton = () => {
    return(
      <PressImage
        onClick={openColorMenu}
        src={process.env.PUBLIC_URL + '/palette' + getTintColor(Theme) + '.png'}
        isLoading={isLoadingChangingColor}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isColorMenuOpen}
        />
    )
  }

  const getTagMenuButton = () => {
    return(
      <PressImage
        onClick={openTagsMenu}
        src={process.env.PUBLIC_URL + '/tag' + getTintColor(Theme) + '.png'}
        isLoading={isLoadingChangingTags}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isTagsMenuOpen}
      />
    )
  }

  const getSearchMenuButton = () => {
    return(
      <PressImage
        onClick={openSearchMenu}
        src={process.env.PUBLIC_URL + '/search' + getTintColor(Theme) + '.png'}
        disable={items.length < 1}
        disableSrc={process.env.PUBLIC_URL + '/search-grey.png'}
        disableMsg="No item to search..."
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isSearchingMenuOpen}
      />
    )
  }

  const getNewItemButton = () => {
    return(
      <PressImage
        onClick={openNewItemMenu}
        src={process.env.PUBLIC_URL + (isAddingNewItemLocked?'/lock':'/add' + getTintColor(Theme)) + '.png'}
        isLoading={isLoadingAddingNewItem}
        badgeText={addingNewItemPartialInfo}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isAddingNewItemMenuOpen || isAddingNewItemLocked}
        rawImage={isAddingNewItemLocked}
        />
    )
  }

  const getIsShowingItemsButton = () => {
    const hasHidibleItems:Item|undefined = items.find((item)=>{
      if(item.Type===ItemType.Grocery||item.Type=== ItemType.Medicine||item.Type=== ItemType.Step||item.Type=== ItemType.Exercise||item.Type=== ItemType.House) return item;
    });

    return(
      <PressImage
        onClick={onChangeIsShowingItems}
        src={process.env.PUBLIC_URL + '/checked' + (objective.IsShowingCheckedExercise?'':'-off') + getTintColor(Theme) + '.png'}
        isLoading={isLoadingIsShowingItems}
        disable={!hasHidibleItems}
        disableSrc={process.env.PUBLIC_URL + '/checked-grey.png'}
        disableMsg="There's no item to hide..."
        isLoadingBlack={shouldBeBlack(objective.Theme)}/>
    )
  }
  
  const getMultiSelectButton = () => {
    return(
      <PressImage
        onClick={onMultiSelectOpen}
        src={process.env.PUBLIC_URL + '/change' + getTintColor(Theme) + '.png'}
        isLoading={isLoadingIsEndingSelecMult}
        badgeText={selecMultPartialInfo}
        isLoadingBlack={shouldBeBlack(objective.Theme)}
        isSelected={isMultiSelectMenuOpen}
      />
    )
  }

  //TODO GET Buttons ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  const multiSelectChangeSelectAll = () => {
    if(shouldSelectAll){
      setMultItemsSelected([]);
      setShouldSelectAll(false);
    }
    else{
      setMultItemsSelected(items);
      setShouldSelectAll(true);
    }
  }

  const handleMouseDown = () => {
    timerRef.current = setTimeout(() => {
      setDevShowPos(!devShowPos);
    }, 800);
  };

  const handleMouseUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const getObjectiveTitle = () => {
    return(
      <div className='objTitleContainer'>
        {isSavingTitle?
          <Loading IsBlack={shouldBeBlack(objective.Theme)}></Loading>
          :
          (isEditingTitle?
            <>
              <PressImage onClick={deleteObjective} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true} isLoadingBlack={shouldBeBlack(objective.Theme)} isLoading={isDeleting} rawImage/>
              <input
                className={'input-simple-base ' + scss(Theme, [SCSS.INPUT])}
                type='text'
                value={newTitle}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown} autoFocus></input>
              <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} rawImage/>
              <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done.png'} isLoadingBlack={shouldBeBlack(objective.Theme)} rawImage/>
            </>
            :
            <div 
              className={'objTitle '+scss(Theme, [SCSS.TEXT])} 
              onClick={()=>{if(!isObjsEditingPos)setIsEditingTitle(true);}}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              >
              {objective.Title}
            </div>
          )
        }
      </div>
    )
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setWasNoSearchNoItemFound(false);
    if(event.key === 'Escape'){
      cancelSearch();
    }
    else if(event.key === 'Enter'){
      doSearchText();
    }
  }

  const cancelSearch = () => {
    setSearchText('');
    setIsSearchingMenuOpen(false);
    setItemsSearchToShow([]);
  }

  const doSearchText = () => {
    let newList: string[] = [];
    items.forEach((item: Item)=>{
      if(item.Type === ItemType.Step){
        if(searchTextIgnoreCase((item as Step).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Question){
        if(searchTextIgnoreCase((item as Question).Statement)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Wait){
        if(searchTextIgnoreCase((item as Wait).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Note){
        if(searchTextIgnoreCase((item as Note).Text)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Location){
        if(searchTextIgnoreCase((item as Location).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Divider){
        if(searchTextIgnoreCase((item as Divider).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Grocery){
        if(searchTextIgnoreCase((item as Grocery).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Medicine){
        if(searchTextIgnoreCase((item as Medicine).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Exercise){
        if(searchTextIgnoreCase((item as Exercise).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Link){
        if(searchTextIgnoreCase((item as Link).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Image){
        if(searchTextIgnoreCase((item as Image).Title)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.House){
        if(searchTextIgnoreCase((item as House).Title)) newList.push(item.ItemId);
      }
      else{
      }
    });

    if(newList.length === 0) setWasNoSearchNoItemFound(true);
    setItemsSearchToShow(newList);

  }

  const searchTextIgnoreCase = (text: string):boolean => {
    return text.trim().toLowerCase().includes(searchText.trim().toLowerCase());
  }

  const getPin = () => {
    const as = selectedTags.filter(tag => objective.Tags.includes(tag));
    if(as.length === 1 && as[0] === 'Pin')
      return <img className='pinImage' src={process.env.PUBLIC_URL + '/pin.png'}></img>
  }

  const getHiddenMessage = () => {
    if(hiddenItems !== 0){
      return <div className={'objTitle'+scss(Theme, [SCSS.TEXT])}>{hiddenItems} hidden item{hiddenItems>1?'s':''}.</div>
    }
  }

  return (
    <div className={'objContainer' + scss(Theme, [SCSS.OBJ_BG])}>
      {getPin()}
      {getTopMenu()}
      {getObjectiveMenu()}
      {getMultiSelectMenu()}
      {getSearchingMenu()}
      {getNewItemMenu()}
      {getTagMenu()}
      {getColorMenu()}
      {getItemList()}
      {getHiddenMessage()}
    </div>
  );
})