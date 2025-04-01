import { useEffect, useState } from "react";
import './DividerView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, Divider, ItemViewProps, ItemType } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
      IsOpen: true,
    }
  )
}

interface DividerProps extends ItemViewProps{
  divider: Divider,
  orderDividerItems: (item: Item)=>Promise<void>,
  choseNewItemToAdd: (type: ItemType, pos?:number)=>void,
}

const LocationView: React.FC<DividerProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { divider, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, choseNewItemToAdd, orderDividerItems } = props;

  const [newTitle, setNewTitle] = useState<string>(divider.Title);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isOrderingAToZ, setIsOrderingAToZ] = useState<boolean>(false);
  
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingIsOpen, setIsSavingIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [isAddingNewItemLocked, setIsAddingNewItemLocked] = useState<boolean>(false);

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

      const data = await objectiveslistApi.putObjectiveItem(newDivider);

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

    const data = await objectiveslistApi.putObjectiveItem(newDivider);
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

    const data = await objectiveslistApi.deleteObjectiveItem(divider);

    if(data){
      putItemInDisplay(divider, true);
    }

    setIsDeleting(false);
  }

  const getTheme = () => {
    let rtnTheme = 'dividerContainer';

    if(divider.Title.trim() === '') rtnTheme += ' dividerContainerEmptyTitle';
    if(isSelected) rtnTheme += ' dividerContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' dividerContainerSeletedEnding';
    return rtnTheme;
  }

  const getTextColor = () => {
    if(divider.Title.trim() === ''){
        return ' dividerTextPlaceholder';
    }
    else{
      if(theme === 'darkBlue'){
        return ' dividerTextBlue'
      }
      else if(theme === 'darkRed'){
        return ' dividerTextRed'
      }
      else if(theme === 'darkGreen'){
        return ' dividerTextGreen'
      }
      else if(theme === 'darkWhite'){
        return ' dividerTextWhite'
      }
      else if(theme === 'noTheme'){
        return ' dividerTextNoTheme'
      }
      else{
        return ' dividerTextNoTheme';
      }
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'dividerInputBlue dividerTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'dividerInputRed dividerTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'dividerInputGreen dividerTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'dividerInputWhite dividerTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'dividerInputNoTheme dividerTextNoTheme'
    }
    else{
      v+= 'dividerInputNoTheme dividerTextNoTheme';
    }

    return 'dividerInput ' + v;
  }

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
  }

  const onOrderAToZ = async () => {
    setIsOrderingAToZ(true);

    await orderDividerItems(divider);
    
    setIsOrderingAToZ(false);
  }

  const getTitle = () => {
    const rtnTitle = divider.Title.trim() === ''?'add title':divider.Title;
    return <div className={'dividerTitleLine' + getTextColor()} onClick={() => {if(!isEditingPos)setIsEditingTitle(true)}}>{rtnTitle}</div>;
  }

  return (
    <div className={getTheme()}>
      <div className='titleLineContainer'>
        {!isEditingTitle && 
          (isSavingIsOpen?
            <Loading IsBlack={theme==='darkWhite'}></Loading>
            :
            (divider.IsOpen?
              <PressImage onClick={() => {if(!isEditingPos)changeIsOpen()}} src={process.env.PUBLIC_URL + '/down-chevron' + getTintColor() + '.png'}/>
              :
              <PressImage onClick={() => {if(!isEditingPos)changeIsOpen()}} src={process.env.PUBLIC_URL + '/up-chevron' + getTintColor() + '.png'}/>
            )
          )
        }
        {isSavingTitle?
          <Loading IsBlack={theme==='darkWhite'}></Loading>
          :
          (isEditingTitle?
            <>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
              <input 
                className={getInputColor()}
                type='text'
                value={newTitle}
                onChange={onTitleInputChange}
                onKeyDown={onTitleKeyDown} autoFocus></input>
              <PressImage onClick={cancelEditTitle} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}/>
              <PressImage onClick={doneEditTitle} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}/>
            </>
            :
            getTitle()
          )
        }
        {!isEditingTitle && 
          (isOrderingAToZ?
            <Loading  IsBlack={theme==='darkWhite'}></Loading>
            :
            <PressImage onClick={onOrderAToZ} src={process.env.PUBLIC_URL + '/atoz' + getTintColor() + '.png'}/>
          )
        }
        {!isEditingTitle && <img className='dividerImage' onClick={()=>{if(!isEditingPos)addingNewItem()}} src={process.env.PUBLIC_URL + (isAddingNewItemLocked?'/lock':'/add'+ getTintColor()) + '.png'}></img>}
      </div>
      {isAddingNewItem &&
        <div className='dividerNewItemContainer'>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Wait, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/wait' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Links, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/link' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Exercise, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/exercise-filled' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Divider, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/minus' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Grocery, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/grocery-filled' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Medicine, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/medicine-filled' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Location, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/location-filled' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Question, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/question' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Note, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/note' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Step, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/step-filled' + getTintColor() + '.png'}></img>
          </div>
          <div className='dividerNewItemImageContainer' onClick={()=>{if(!isAddingNewItemLocked)setIsAddingNewItem(false); choseNewItemToAdd(ItemType.Image, divider.Pos);}}>
            <img className='dividerNewItemImage' src={process.env.PUBLIC_URL + '/image-filled' + getTintColor() + '.png'}></img>
          </div>
        </div>
      }
    </div>
  );
}

export default LocationView;