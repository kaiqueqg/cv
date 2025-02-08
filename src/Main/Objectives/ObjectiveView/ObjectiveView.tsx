import { useEffect, useState } from "react";
import './ObjectiveView.scss';
import { useUserContext } from "../../../Contexts/UserContext";
import { Item, ItemType, Note, Objective, Question, Step, Wait, Location, Divider, Grocery, Medicine, Exercise, Weekdays, StepImportance, Links, Image } from "../../../TypesObjectives";
import StepView from "./StepView/StepView";
import QuestionView from "./QuestionView/QuestionView";
import WaitView from "./WaitView/WaitView";
import log from "../../../Log/Log";
import { objectiveslistApi } from "../../../Requests/RequestFactory";
import { toast } from "react-toastify";
import Loading from "../../../Loading/Loading";
import NoteView from "./NoteView/NoteView";
import LocationView from "./LocationView/LocationView";
import DividerView from "./DividerView/DividerView";
import GroceryView from "./GroceryView/GroceryView";
import MedicineView from "./MedicineView/MedicineView";
import ItemFakeView from "./ItemFakeView/ItemFakeView";
import ExerciseView from "./ExerciseView/ExerciseView";
import TagsView from "./TagsView/TagsView";
import LinksView from "./LinksView/LinksView";
import ImageView from "./ImageView/ImageView";

interface ObjectiveViewProps{
  objective: Objective,
  putObjective: (obj?: Objective, remove?: boolean) => void,
  isObjsEditingPos: boolean,
}

const ObjectiveView: React.FC<ObjectiveViewProps> = (props) => {
  const { testServer, putSelectedTags } = useUserContext();
  const { objective, putObjective, isObjsEditingPos } = props;
  
  const [items, setItems] = useState<(Item)[]>([]);
  const [newTitle, setNewTitle] = useState<string>(props.objective.Title);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [isAddingNewItemLocked, setIsAddingNewItemLocked] = useState<boolean>(false);
  const [isChangingColor, setIsChangingColor] = useState<boolean>(false);
  const [isChangingTags, setIsChangingTags] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isObjectiveMenuOpen, setIsObjectiveMenuOpen] = useState<boolean>(false);

  //Changing pos
  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [itemsSelected, setItemsSelected] = useState<Item[]>([]);
  const [isEndingPos, setIsEndingPos] = useState<any>(false);

  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingNewItem, setIsSavingNewItem] = useState<boolean>(false);
  const [isSavingMenu, setIsSavingMenu] = useState<boolean>(false);
  const [isRequestingItems, setIsRequestingItems] = useState<boolean>(false);

  useEffect(() => {
    if(objective.IsShowing) {
      downloadItemList();
    }
  }, []);

  useEffect(()=>{
    // const handleKeyUp = (event: KeyboardEvent) => {
    //   if(isHovering){
    //     if(event.key === "Escape"){
    //       cancelChangePos();
    //     }
    //     else if(event.key.toLowerCase() === "m" && !isEditingPos && !isEndingPos){
    //       startChangePos();
    //     }
    //     else if(event.key.toLowerCase() === "m" && isEditingPos && !isEndingPos && shouldShowEndingIcon()){
    //       onEditingPosTo();
    //     }
    //   }
    // };

    // window.addEventListener("keyup", handleKeyUp);

    // return () => {
    //   window.removeEventListener("keyup", handleKeyUp);
    // };
  },[isHovering, isEditingPos, isEndingPos, itemsSelected])

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

  const putItemInDisplay = async (item?: Item, remove?: boolean) => {
    if (item) {
      let sorted: Item[] = [];
      setItems((prevItems) => {
        let newItems = [];
        if (remove) {
          newItems = prevItems.filter((i: Item) => i.ItemId !== item.ItemId);
        } else {
          const itemInList = prevItems.find((i: Item) => i.ItemId === item.ItemId);
          if (itemInList) {
            newItems = prevItems.map((i: Item) => i.ItemId === item.ItemId ? item : i);
          } else {
            newItems = [...prevItems, item];
          }
        }
        sorted = newItems.sort((a, b) => a.Pos - b.Pos);
        return sorted;
      });
    } else {
      if(objective.IsShowing) {
        await downloadItemList();
      }
    }
  }

  const displayConfirmDeleteRow = () => {
    if(items.length > 0){
      toast.warning('Are you sure?', {
        closeButton: <button className='btn btn-warning' onClick={deleteObjective} style={{marginTop: '5px', marginBottom: '5px'}}>YES</button>,
        autoClose: 5000,
        draggable: false,
        pauseOnHover: false,
      });
    }
    else{
      deleteObjective();
    }
  }

  const deleteObjective = async () => {   
    setIsDeleting(true);
    try {
      const data = await objectiveslistApi.deleteObjective(objective, () => {testServer();});
  
      if(data){
        putObjective(objective, true);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsDeleting(false);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
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
      const data = await objectiveslistApi.putObjective(newObjective);

      if(data){
        putObjective(data);
        setIsEditingTitle(false);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }

    setIsSavingTitle(false);
  }

  const cancelEdit = () => {
    setNewTitle(objective.Title);
    setIsEditingTitle(false);
  }

  const doneEditTags = async (tagList: string[]) => {
    setIsChangingTags(false);
    setIsSavingMenu(true);
    const newObjective: Objective = {...objective, Tags: tagList, LastModified: new Date().toISOString()};

    const newTags = tagList.filter((t) => !objective.Tags.includes(t));

    if(newObjective.Tags !== objective.Tags) {
      const data = await objectiveslistApi.putObjective(newObjective);

      if(data){
        putObjective(data);
        putSelectedTags(newTags);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }

    setIsSavingMenu(false);
  }

  const cancelEditTags = () => {
    setIsChangingTags(false);
  }

  //Responsable for open, close and lock icon and menu.
  const addingNewItem = async () => {
    if(isAddingNewItem){
      if(isAddingNewItemLocked){ //turn all off
        setIsAddingNewItemLocked(false);
        setIsAddingNewItem(false);
      }
      else{//adding but now lock
        setIsAddingNewItemLocked(true);
      }
    }
    else{//start adding item
      setIsAddingNewItem(true);
    }

    if(isChangingColor) setIsChangingColor(false);
  }

  const addNewStep = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);
    try {
      const emptyItem: Step = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: pos? pos:items.length,
        Title: '',
        Type: ItemType.Step,
        Done: false,
        Importance: StepImportance.None,
        LastModified: new Date().toISOString(),
      }
      
      let sending:Item[] = [];
      if(pos !== undefined && pos !== null) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewQuestion = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Question = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Statement: '',
        Answer: '',
        Type: ItemType.Question,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewWait = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Wait = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        Type: ItemType.Wait,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewNote = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Note = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Text: '',
        Type: ItemType.Note,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewLocation = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Location = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        Url: '',
        Type: ItemType.Location,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewDivider = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Divider = {
        Type: ItemType.Divider,
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        IsOpen: true,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewGrocery = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);
    
    try {
      const emptyItem: Grocery = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        IsChecked: false,
        GoodPrice: '',
        Quantity: 1,
        Unit: '',
        Type: ItemType.Grocery,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewMedicine = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    try {
      const emptyItem: Medicine = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        IsChecked: false,
        Quantity: 1,
        Unit: '',
        Components: [],
        Purpose: '',
        Type: ItemType.Medicine,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewExercise = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
      const emptyItem: Exercise = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        Reps: 1,
        Series: 1,
        IsDone: false,
        MaxWeight: '',
        Description: '',
        Weekdays: [ Weekdays.Monday, Weekdays.Tuesday, Weekdays.Wednesday, Weekdays.Thursday, Weekdays.Friday, Weekdays.Saturday, Weekdays.Sunday ],
        LastDone: yesterday.toISOString(),
        Type: ItemType.Exercise,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewLinks = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
      const emptyItem: Links = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: items.length,
        Title: '',
        Links: [],
        Type: ItemType.Links,
        LastModified: new Date().toISOString(),
      }
  
      let sending:Item[] = [];
      if(pos) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const addNewImage = async (pos?:number) => {
    setIsSavingNewItem(true);
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);
    try {
      const emptyItem: Image = {
        ItemId: '',
        UserIdObjectiveId: objective.ObjectiveId,
        Pos: pos? pos:items.length,
        Title: '',
        Type: ItemType.Image,
        Size: 0,
        IsDisplaying: true,
        Name: '',
        Height: 0,
        Width: 0,
        LastModified: new Date().toISOString(),
      }
      
      let sending:Item[] = [];
      if(pos !== undefined && pos !== null) {
        const newList = items.filter((i: Item) => !itemsSelected.includes(i));
        const before = newList.slice(0, pos+1);
        const after = newList.slice(pos+1);

        let ajustedList = [...before, ...[emptyItem], ...after];

        for(let i = 0; i < ajustedList.length; i++){
          sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
        }
      }
      else{
        sending.push(emptyItem);
      }

      const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
      if(data){
        data.forEach(element => {
          putItemInDisplay(element);
        });
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingNewItem(false);
  }

  const onChangeObjectiveIsArchived = async () => {
    setIsSavingMenu(true);
    
    try {
      const data = await objectiveslistApi.putObjective({...objective, IsArchived: !objective.IsArchived, LastModified: new Date().toISOString()}, () => {testServer();});
      
      if(data){
        putObjective(data);
        if(data.IsShowing){
          downloadItemList();
        }
        else{
          setItems([]);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingMenu(false);
  }

  const onChangeObjectiveIsShowing = async () => {
    setIsSavingMenu(true);
    
    try {
      const data = await objectiveslistApi.putObjective({...objective, IsShowing: !objective.IsShowing, LastModified: new Date().toISOString()}, () => {testServer();});
      
      if(data){
        putObjective(data);
        if(data.IsShowing){
          downloadItemList();
        }
        else{
          setItems([]);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingMenu(false);
  }

  const changeColor = async () => {
    setIsChangingColor(!isChangingColor);
  }

  const changeTags = async (v?:boolean) => {
    setIsChangingTags(v??!isChangingTags);
  }

  const changeObjColor = async (theme: string) => {
    setIsObjectiveMenuOpen(false);
    setIsChangingColor(false);
    setIsSavingMenu(true);
    try {
      const data = await objectiveslistApi.putObjective({...objective, Theme: theme, LastModified: new Date().toISOString()}, () => {testServer();});
  
      if(data){
        putObjective(data);
        downloadItemList();
        setIsChangingColor(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingMenu(false);
  }

  const getTheme = () => {
    if(objective.Theme === 'darkBlue'){
      return 'objContainer objObjectiveBlue';
    }
    else if(objective.Theme === 'darkRed'){
      return 'objContainer objObjectiveRed';
    }
    else if(objective.Theme === 'darkGreen'){
      return 'objContainer objObjectiveGreen';
    }
    else if(objective.Theme === 'darkWhite'){
      return 'objContainer objObjectiveWhite';
    }
    else if(objective.Theme === 'noTheme'){
      return 'objContainer objObjectiveNoTheme';
    }
  }

  const getTextColor = () => {
    if(objective.Theme === 'darkBlue'){
      return ' objTextBlue'
    }
    else if(objective.Theme === 'darkRed'){
      return ' objTextRed'
    }
    else if(objective.Theme === 'darkGreen'){
      return ' objTextGreen'
    }
    else if(objective.Theme === 'darkWhite'){
      return ' objTextWhite'
    }
    else if(objective.Theme === 'noTheme'){
      return ' objTextNoTheme'
    }
    else{
      return ' objTextBlue';
    }
  }

  const getInputColor = () => {
    let v = '';
    if(objective.Theme === 'darkBlue'){
      v+= 'objInputBlue objTextBlue'
    }
    else if(objective.Theme === 'darkRed'){
      v+= 'objInputRed objTextRed'
    }
    else if(objective.Theme === 'darkGreen'){
      v+= 'objInputGreen objTextGreen'
    }
    else if(objective.Theme === 'darkWhite'){
      v+= 'objInputWhite objTextWhite'
    }
    else if(objective.Theme === 'noTheme'){
      v+= 'objInputNoTheme objTextNoTheme'
    }
    else{
      v+= 'objInputNoTheme objTextNoTheme';
    }

    return 'objInput ' + v;
  }

  const onChangeObjectiveMenuOpen = () => {
    setIsChangingColor(false);
    setIsObjectiveMenuOpen(!isObjectiveMenuOpen);
  }

  const onChangeIsShowingItems  = async () => {
    setIsObjectiveMenuOpen(false);
    setIsChangingColor(false);
    setIsSavingNewItem(true);
    const newObjective: Objective = {
      ...objective, 
      IsShowingCheckedGrocery: !objective.IsShowingCheckedGrocery, 
      IsShowingCheckedExercise: !objective.IsShowingCheckedGrocery,
      IsShowingCheckedMedicine: !objective.IsShowingCheckedGrocery,
      IsShowingCheckedStep: !objective.IsShowingCheckedGrocery, //for now, to all be the same
      LastModified: new Date().toISOString()};

    const data = await objectiveslistApi.putObjective(newObjective);

    if(data){
      putObjective(data);
    }

    setIsSavingNewItem(false);
  }

  const onChangeIsShowingChecked = async () => {
    setIsObjectiveMenuOpen(false);
    setIsChangingColor(false);
    setIsSavingNewItem(true);
    const newObjective: Objective = {...objective, IsShowingCheckedGrocery: !objective.IsShowingCheckedGrocery, LastModified: new Date().toISOString()};

    const data = await objectiveslistApi.putObjective(newObjective);

    if(data){
      putObjective(data);
    }

    setIsSavingNewItem(false);
  }

  const onChangeIsShowingStep = async () => {
    setIsObjectiveMenuOpen(false);
    setIsChangingColor(false);
    setIsSavingNewItem(true);
    const newObjective: Objective = {...objective, IsShowingCheckedStep: !objective.IsShowingCheckedStep, LastModified: new Date().toISOString()};

    const data = await objectiveslistApi.putObjective(newObjective);

    if(data){
      putObjective(data);
    }

    setIsSavingNewItem(false);
  }

  const startChangePos = () => {
    setIsEditingPos(!isEditingPos);
  }

  const cancelChangePos = () => {
    setItemsSelected([]);
    setIsEditingPos(false);
    setIsEndingPos(false);
  }

  const addingRemovingItem = (item: Item) => {
    const filteredList = itemsSelected.filter((i) => i.ItemId !== item.ItemId);

    if(filteredList.length !== itemsSelected.length){
      setItemsSelected(filteredList);
    }
    else{
      setItemsSelected([...itemsSelected, item]);
    }
  }

  const onEditingPosTo = () => {
    setIsEndingPos(true);
  }

  const endChangingPos = async (itemTo: Item) => {
    const newList = items.filter((i: Item) => !itemsSelected.includes(i));
    const index = newList.indexOf(itemTo);
    const before = newList.slice(0, index+1);
    const after = newList.slice(index+1);

    let ajustedList = [...before, ...itemsSelected, ...after];

    let finalList:Item[] = [];
    for(let i = 0; i < ajustedList.length; i++){
      finalList.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    try{
      setIsRequestingItems(true);
      const data = await objectiveslistApi.putObjectiveItems(finalList, () => {testServer();});
      if(data) {
        setItems(data);
      }
      else{
        // add warning
      }
    }
    catch(err){}

    setIsRequestingItems(false);
    cancelChangePos();
  }

  const sortItemsAlphabetically = (items: Item[]): Item[] => {
    return items.sort((a, b) => {
        const titleA = getSortableText(a);
        const titleB = getSortableText(b);

        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
  }

  const getSortableText = (item: Item): string => {
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
    return "";
  }

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

    const data = await objectiveslistApi.putObjectiveItems(sending, () => {testServer();});
    if(data){
      data.forEach(element => {
        putItemInDisplay(element);
      });
    }
  }

  const getItemView = (item: Item): React.ReactNode => {
    let rtnItem;
    const isSelected = itemsSelected.includes(item);

    if(item.Type === ItemType.Step){
      rtnItem = <StepView 
        key={item.ItemId}
        theme={objective.Theme}
        step={item as Step}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></StepView>
    }
    else if(item.Type === ItemType.Question){
      rtnItem = <QuestionView 
        key={item.ItemId}
        theme={objective.Theme} 
        question={item as Question}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></QuestionView>
    }
    else if(item.Type === ItemType.Wait){
      rtnItem = <WaitView 
        key={item.ItemId}
        theme={objective.Theme}
        wait={item as Wait}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></WaitView>
    }
    else if(item.Type === ItemType.Note){
      rtnItem = <NoteView 
        key={item.ItemId}
        theme={objective.Theme}
        note={item as Note}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></NoteView>
    }
    else if(item.Type === ItemType.Location){
      rtnItem = <LocationView 
        key={item.ItemId}
        theme={objective.Theme}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        location={item as Location}
        putItemInDisplay={putItemInDisplay}></LocationView>
    }
    else if(item.Type === ItemType.Divider){
      rtnItem = <DividerView 
        key={item.ItemId}
        theme={objective.Theme}
        divider={item as Divider}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        orderDividerItems={orderDividerItems}
        addNewStep={addNewStep}
        addNewDivider={addNewDivider}
        addNewGrocery={addNewGrocery}
        addNewMedicine={addNewMedicine}
        addNewLocation={addNewLocation}
        addNewNote={addNewNote}
        addNewQuestion={addNewQuestion}
        addNewWait={addNewWait}
        addNewExercise={addNewExercise}
        addNewLinks={addNewLinks}
        addNewImage={addNewImage}
        putItemInDisplay={putItemInDisplay}></DividerView>
    }
    else if(item.Type === ItemType.Grocery){
      rtnItem = <GroceryView 
        key={item.ItemId}
        theme={objective.Theme}
        grocery={item as Grocery}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></GroceryView>
    }
    else if(item.Type === ItemType.Medicine){
      rtnItem = <MedicineView 
        key={item.ItemId}
        theme={objective.Theme}
        medicine={item as Medicine}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></MedicineView>
    }
    else if(item.Type === ItemType.Exercise){
      rtnItem = <ExerciseView 
        key={item.ItemId}
        theme={objective.Theme}
        exercise={item as Exercise}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></ExerciseView>
    }
    else if(item.Type === ItemType.Links){
      rtnItem = <LinksView 
        key={item.ItemId}
        theme={objective.Theme}
        links={item as Links}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></LinksView>
    }
    else if(item.Type === ItemType.Image){
      rtnItem = <ImageView 
        key={item.ItemId}
        theme={objective.Theme}
        image={item as Image}
        isSelected={isSelected}
        isEndingPos={isEndingPos}
        isEditingPos={isEditingPos || isObjsEditingPos}
        putItemInDisplay={putItemInDisplay}></ImageView>
    }
    else{
      rtnItem = <div key={'cantrender'}>Can't render</div>
    }

    return (
    <div key={item.ItemId} className='objItemRow' onClick={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addingRemovingItem(item))}}>
      {rtnItem}
    </div>)
  }

  const getDisplayItemList = () => {
    let filteredItems:Item[] = [];
    let partialItems:Item[] = [];

    let isDividerOpen = true;
    for(let i = 0; i < items.length; i++){
      let current = items[i];
      let shouldAddStep = true;
      let shouldAddGrocery = true;
      let shouldAddExercise = true;
      let shouldAddMedicine = true;

      if(current.Type === ItemType.Divider) {
        const divider = current as Divider;
        filteredItems.push(divider);
        isDividerOpen = divider.IsOpen;
      }
      else{
        if(current.Type === ItemType.Step && !objective.IsShowingCheckedStep) shouldAddStep = !(current as Step).Done;
        if(current.Type === ItemType.Grocery && !objective.IsShowingCheckedGrocery) shouldAddGrocery = !(current as Grocery).IsChecked;
        if(current.Type === ItemType.Exercise && !objective.IsShowingCheckedExercise) shouldAddExercise = !(current as Exercise).IsDone;
        if(current.Type === ItemType.Medicine && !objective.IsShowingCheckedMedicine) shouldAddMedicine = !(current as Medicine).IsChecked;
  
        if(isDividerOpen && shouldAddStep && shouldAddGrocery && shouldAddExercise && shouldAddMedicine){
          filteredItems.push(current);
        }
        else{
        }
      }
    }

    let rtn: React.ReactNode[] = [];
    if(isEditingPos && isEndingPos) {
      const fakeItem = {ItemId:'---', LastModified:'', Pos:-1, Type: ItemType.ItemFake, UserIdObjectiveId:'---'};
      const a = <ItemFakeView 
      key={'asd'}
      theme={objective.Theme}
      isSelected={false}
      isEndingPos={isEndingPos}
      isEditingPos={isEditingPos || isObjsEditingPos}
      putItemInDisplay={putItemInDisplay}></ItemFakeView>
      rtn.push(
      <div key={'fake'} className='objItemRow' onClick={() => {isEditingPos && (isEndingPos? endChangingPos(fakeItem) : addingRemovingItem(fakeItem))}}>
        {a}
      </div>);
    }

    filteredItems.forEach((item, index)=>{
      rtn.push(getItemView(item));
    })

    return rtn;
  };

  const getTintColor = () => {
    if(objective.Theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getColorMenu = () => {
    return(
      <div className='objectiveColorContainer'>
        <div className='objectiveColorButton objectiveColorButtonBlue' onClick={()=>changeObjColor('darkBlue')}></div>
        <div className='objectiveColorButton objectiveColorButtonRed' onClick={()=>changeObjColor('darkRed')}></div>
        <div className='objectiveColorButton objectiveColorButtonGreen' onClick={()=>changeObjColor('darkGreen')}></div>
        <div className='objectiveColorButton objectiveColorButtonWhite' onClick={()=>changeObjColor('darkWhite')}></div>
        <div className='objectiveColorButton objectiveColorButtonNoTheme' onClick={()=>changeObjColor('noTheme')}></div>
      </div>
    )
  }

  const getNewItemMenu = () => {
    return(
      <div className='objectiveNewItemContainer'>
        <div onClick={()=>{addNewWait()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/wait' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewLinks()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/link' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewExercise()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/exercise-filled' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewDivider()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/minus' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewGrocery()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/grocery-filled' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewMedicine()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/medicine-filled' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewLocation()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/location-filled' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewQuestion()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/question' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewNote()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/note' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewStep()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/step-filled' + getTintColor() + '.png'}></img>
        </div>
        <div onClick={()=>{addNewImage()}} className='objMenuImageContainer'>
          <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/image-filled' + getTintColor() + '.png'}></img>
        </div>
      </div>
    )
  }

  const getLeftMenuIcons = () => {
    return(
      <div className='objTitleLeft'>
        {isSavingMenu?
          <div className='objMenuLoadingImageContainer'>
            <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
          </div>
          :
          <>
            {isEditingPos?
              <div className='objMenuImageContainer'></div>
              :
              <div onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveIsArchived()}} className='objMenuImageContainer'>
                <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/archive' + getTintColor() + '.png'}></img>
              </div>
            }
            {isEditingPos?
              <div className='objMenuImageContainer'></div>
              :
              <div onClick={()=>{if(!isObjsEditingPos)onChangeObjectiveIsShowing()}} className='objMenuImageContainer'>
              <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + (objective.IsShowing? '/show':'/hide') + getTintColor() + '.png'}></img>
            </div>
            }
            {!objective.IsShowing || isEditingPos?
              <div className='objMenuImageContainer'></div>
              :
              <div onClick={()=>{if(!isObjsEditingPos)changeColor()}} className='objMenuImageContainer'>
              <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/palette' + getTintColor() + '.png'}></img>
            </div>
            }
            {!objective.IsShowing || isEditingPos?
              <div className='objMenuImageContainer'></div>
              :
              <div onClick={()=>{if(!isObjsEditingPos)changeTags()}} className='objMenuImageContainer'>
              <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/tag' + getTintColor() + '.png'}></img>
            </div>
            }
          </>
        }
      </div>
    )
  }

  const shouldShowEndingIcon = () => {
    return isEditingPos && itemsSelected.length !== items.length && itemsSelected.length > 0;
  }

  const getRightMenuIcons = () => {
    return(
      <div className='objTitleRight'>
        {isSavingNewItem?
          <div className='objMenuLoadingImageContainer'>
            <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
          </div>
          :
          <>
            <div className='objMenuImageContainer'></div>
            {!objective.IsShowing || isEditingPos?
              <div className='objMenuImageContainer'></div>
              :
              <div onClick={()=>{if(!isObjsEditingPos)onChangeIsShowingItems()}} className='objMenuImageContainer'>
                <img className='objectiveNewItemImage' src={process.env.PUBLIC_URL + '/checked' + (objective.IsShowingCheckedExercise?'':'-grey') + getTintColor() + '.png'}></img>
              </div>
            }
            { //! ICON CHANGE POS
              !objective.IsShowing?
              <div className='objMenuImageContainer'></div>
              :
              <>
                {!isEditingPos && 
                  <div className='objMenuImageContainer'>
                    <img className='objectiveImage' onClick={startChangePos} src={process.env.PUBLIC_URL + '/updown' + getTintColor() + '.png'}></img>
                  </div>
                }
                {isEditingPos && 
                  <div className='objMenuImageContainer'>
                    <img className='objectiveImage' onClick={cancelChangePos} src={process.env.PUBLIC_URL + '/cancel.png'}></img>
                  </div>
                }
                {shouldShowEndingIcon() && 
                  <div className='objMenuImageContainer'>
                    <img className='objectiveImage' onClick={onEditingPosTo} src={process.env.PUBLIC_URL + '/move' + getTintColor() + '.png'}></img>
                  </div>
                }
              </>
            }
            {//! ICON NEW ITEM
              !objective.IsShowing || isEditingPos?
              (shouldShowEndingIcon()?<></>:<div className='objMenuImageContainer'></div>) //so there's always only the right amount of empth divs... bad solution
              :
              <div className='objMenuImageContainer'>
                <img className='objectiveImage' onClick={()=>{if(!isObjsEditingPos)addingNewItem()}} src={process.env.PUBLIC_URL + (isAddingNewItemLocked?'/lock':'/add' + getTintColor()) + '.png'}></img>
              </div>
            }
          </>
        }
      </div>
    )
  }

  const getObjectiveTitle = () => {
    return(
      <div className='objTitleContainer'>
        {isSavingTitle?
          <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
          :
          (isEditingTitle?
            <>
              {isDeleting?
                <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={displayConfirmDeleteRow} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
              <input
                className={getInputColor()}
                type='text'
                value={newTitle}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} autoFocus></input>
              <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel.png'}></img>
              <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done.png'}></img>
            </>
            :
            <div className={'objTitle'+getTextColor()} onClick={()=>{if(!isObjsEditingPos)setIsEditingTitle(true);}}>{objective.Title}</div>
          )
        }
      </div>
    )
  }

  return (
    <div className={getTheme()} onMouseEnter={()=>{setIsHovering(true);}} onMouseLeave={()=>{setIsHovering(false);}}>
      <div className='objTopContainer'>
        {!isEditingTitle && getLeftMenuIcons()}
        {getObjectiveTitle()}
        {!isEditingTitle && getRightMenuIcons()}
      </div>
      {objective.IsShowing && !isChangingColor && isAddingNewItem && getNewItemMenu() }
      {objective.IsShowing && !isChangingColor && !isAddingNewItem && isChangingTags &&
        <TagsView theme={objective.Theme} tags={objective.Tags} doneEditTags={doneEditTags} cancelEditTags={cancelEditTags}></TagsView>
      }
      {objective.IsShowing && isChangingColor && getColorMenu()}
      {isRequestingItems?
        <Loading IsBlack={objective.Theme==='darkWhite'}></Loading>
        :
        (objective.IsShowing && 
          <div className='objectiveItemsContainer'>
            {getDisplayItemList()}
          </div>
        )
      }
    </div>
  );
}

export default ObjectiveView;