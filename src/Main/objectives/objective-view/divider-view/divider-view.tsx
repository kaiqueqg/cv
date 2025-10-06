import { useEffect, useState } from "react";
import './divider-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, Divider, ItemViewProps, ItemType } from "../../../../TypesObjectives";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";
import { MessageType } from "../../../../Types";
import { useLogContext } from "../../../../contexts/log-context";
import { useRequestContext } from "../../../../contexts/request-context";
import { SCSSItemType, useThemeContext } from "../../../../contexts/theme-context";

export function dividerNew(){
  return {
    Title: '',
    IsOpen: true,
  }
}

interface DividerProps extends ItemViewProps{
  divider: Divider,
  orderDividerItems: (item: Item)=>Promise<void>,
  choseNewItemToAdd: (type: ItemType, pos?:number, amount?: number)=>void,
}

export const DividerView: React.FC<DividerProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { identityApi, objectiveslistApi } = useRequestContext();
  const { popMessage } = useLogContext();
  const { getItemScssColor } = useThemeContext();
  const { divider, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, choseNewItemToAdd, orderDividerItems, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const [newTitle, setNewTitle] = useState<string>(divider.Title);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isOrderingAToZ, setIsOrderingAToZ] = useState<boolean>(false);
  
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingIsOpen, setIsSavingIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [isAddingNewItemLocked, setIsAddingNewItemLocked] = useState<boolean>(false);
  const [amountOfItemsToAdd, setAmountOfItemsToAdd] = useState<number>(1);
  const [isLoadingAddingNewItem, setIsLoadingAddingNewItem] = useState<boolean>(false);

  const onTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const onTitleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditTitle();
    }
    else if(event.key === 'Escape'){
      cancelEditTitle();
    }
  }

  const doneEditTitle = async () => {
    setIsSavingTitle(true);
    const newDivider: Divider = {...divider, Title: newTitle.trim(), LastModified: new Date().toISOString()};

    if(newDivider.Title !== divider.Title
      || newDivider.Pos !== divider.Pos) {
      setIsEditingTitle(true);

      const data = await objectiveslistApi.putObjectiveItem(newDivider, (error:any) => popMessage(error.Message, MessageType.Error, 10));

      if(data){
        setIsEditingTitle(false);
        putItemInDisplay(data);
        setNewTitle(newDivider.Title);
      }

      setTimeout(() => {
        setIsEditingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingTitle(false);
      setNewTitle(divider.Title);
    }

    setIsSavingTitle(false);
  }

  const changeIsOpen = async () => {
    setIsSavingIsOpen(true);
    const newDivider: Divider = {...divider, IsOpen: divider.IsOpen? !divider.IsOpen:true, LastModified: new Date().toISOString()};

    const data = await objectiveslistApi.putObjectiveItem(newDivider, (error:any) => popMessage(error.Message, MessageType.Error, 10));
    if(data){
      putItemInDisplay(data);
    }

    setIsSavingIsOpen(false);
  }

  const cancelEditTitle = () => {
    setNewTitle(divider.Title);
    setIsEditingTitle(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(divider, (error:any) => popMessage(error.Message, MessageType.Error, 10));

    if(data){
      putItemInDisplay(divider, true);
    }

    setIsDeleting(false);
  }

  const addingNewItem = async () => {
    if(isAddingNewItem){
      if(isAddingNewItemLocked){ //turn all off
        setIsAddingNewItemLocked(false);
        setIsAddingNewItem(false);
        setAmountOfItemsToAdd(1);
      }
      else{//adding but now lock
        setIsAddingNewItemLocked(true);
      }
    }
    else{//start adding item
      setIsAddingNewItem(true);
    }
  }

  const onOrderAToZ = async () => {
    setIsOrderingAToZ(true);

    await orderDividerItems(divider);
    
    setIsOrderingAToZ(false);
  }

  const getTitle = () => {
    const rtnTitle = divider.Title.trim() === ''?'add title':divider.Title;
    return <div className={'dividerTitleLine' + itemTextColor(theme, divider.Title.trim() === '')} onClick={() => {if(!isEditingPos)setIsEditingTitle(true)}}>{rtnTitle}</div>;
  }

  const increaseAmountItemsToAdd = () => {
    setAmountOfItemsToAdd(amountOfItemsToAdd+1);
  }

  const addNewItem = async (type: ItemType, pos: number) => {
    if(!isAddingNewItemLocked) setIsAddingNewItem(false);

    setIsLoadingAddingNewItem(true);

    await choseNewItemToAdd(type, pos, amountOfItemsToAdd);

    setIsLoadingAddingNewItem(false);
  }

  return (
    <div className={'dividerContainer' + itemGetTheme(theme, isSelected, isEndingPos, divider.Title.trim() !== '') + ' dividerLighten'}>
      <div className='titleLineContainer'>
        {!isEditingTitle && 
          (isSavingIsOpen?
            <Loading IsBlack={theme==='white'}></Loading>
            :
            (divider.IsOpen?
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)changeIsOpen()}} src={process.env.PUBLIC_URL + '/down-chevron' + itemTintColor(theme) + '.png'}/>
              :
              <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isEditingPos)changeIsOpen()}} src={process.env.PUBLIC_URL + '/up-chevron' + itemTintColor(theme) + '.png'}/>
            )
          )
        }
        {isSavingTitle?
          <Loading IsBlack={theme==='white'}></Loading>
          :
          (isEditingTitle?
            <>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newTitle}
                onChange={onTitleInputChange}
                onKeyDown={onTitleKeyDown} autoFocus></input>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEditTitle} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEditTitle} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
            </>
            :
            getTitle()
          )
        }
        {!isEditingTitle && <PressImage isBlack={props.isLoadingBlack} onClick={onOrderAToZ} confirm={true} src={process.env.PUBLIC_URL + '/atoz' + itemTintColor(theme) + '.png'} isLoading={isOrderingAToZ}/>}
        {!isEditingTitle && <PressImage isBlack={props.isLoadingBlack} onClick={addingNewItem} src={process.env.PUBLIC_URL + (isAddingNewItemLocked?'/lock':'/add'+ itemTintColor(theme)) + '.png'} isLoading={isLoadingAddingNewItem}/>}
      </div>
      {isAddingNewItem &&
        <div className='dividerNewItemContainer'>
          <div className={'objectiveNewItemAmount' + getItemScssColor(theme, SCSSItemType.TEXT)} onClick={increaseAmountItemsToAdd}>{amountOfItemsToAdd + 'x'}</div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Wait, divider.Pos)}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/wait' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.House, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/home' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Link, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/link' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Exercise, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/exercise-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Divider, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/minus' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Grocery, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/grocery-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Medicine, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/medicine-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Location, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/location-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Question, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/question' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Note, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/note' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Step, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/step-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{addNewItem(ItemType.Image, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/image-filled' + itemTintColor(theme) + '.png'}></img>
          </div>
        </div>
      }
    </div>
  );
}