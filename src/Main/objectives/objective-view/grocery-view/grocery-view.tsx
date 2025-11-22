import { useEffect, useState } from "react";
import './grocery-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Grocery, Item, ItemViewProps } from "../../../../TypesObjectives";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { useLogContext } from "../../../../contexts/log-context";
import { MessageType } from "../../../../Types";
import { SCSS, useThemeContext } from "../../../../contexts/theme-context";

export function groceryNew(){
  return {
    Title: '',
    IsChecked: false,
    Quantity: 1,
    Unit: '',
    GoodPrice: '',
  }
}

interface GroceryViewProps extends ItemViewProps{
  grocery: Grocery,
}

export const GroceryView: React.FC<GroceryViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { popMessage } = useLogContext();
  const { identityApi, objectiveslistApi } = useRequestContext();
  const { scss } = useThemeContext();
  const { grocery, theme, putItemsInDisplay, removeItemsInDisplay, isDisabled, isSelected, isSelecting, itemTintColor } = props;

  const [newGrocery, setNewGrocery] = useState<Grocery>(grocery);
  const [isEditingGrocery, setIsEditingGrocery] = useState<boolean>(false);
  
  const [isSavingGrocery, setIsSavingGrocery] = useState<boolean>(false);
  const [isSavingIsChecked, setIsSavingIsChecked] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, [grocery]);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery({...newGrocery, Title: event.target.value});
  }
  const handleQuantityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery({...newGrocery, Quantity: Number(event.target.value)});
  }
  const handleUnitInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery({...newGrocery, Unit: event.target.value});
  }
  const handleGoodPriceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery({...newGrocery, GoodPrice: event.target.value});
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditGrocery();
    }
    else if(event.key === 'Escape'){
      cancelEditGrocery();
    }
  }

  const onChangeIsChecked = async () => {
    setIsSavingIsChecked(true);

    try {
      const newItem: Grocery = { ...grocery, IsChecked: !grocery.IsChecked, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItems([newItem], (error:any) => popMessage(error.Message, MessageType.Error, 10));

      if(data){
        setIsSavingIsChecked(false);
        putItemsInDisplay(data);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingIsChecked(false);
  }

  const doneEditGrocery = async () => {
    setIsSavingGrocery(true);
    const newItem: Grocery = {
      ...newGrocery,
      Title: newGrocery.Title.trim(),
      GoodPrice: newGrocery.GoodPrice?.trim(),
      Unit: newGrocery.Unit,
      LastModified: new Date().toISOString()};

    if(newGrocery.Title !== grocery.Title
      || newItem.Quantity !== grocery.Quantity
      || newItem.GoodPrice !== grocery.GoodPrice
      || newItem.Unit !== grocery.Unit
      || newItem.Pos !== grocery.Pos) {
      setIsEditingGrocery(true);

      putItemsInDisplay([newItem]);
      const data = await objectiveslistApi.putObjectiveItems([newItem], (error:any) => popMessage(error.Message, MessageType.Error, 10));

      if(data){
        setIsEditingGrocery(false);
        setNewGrocery(newGrocery);
      }

      setTimeout(() => {
        setIsEditingGrocery(false);
      }, 200); 
    }
    else{
      setIsEditingGrocery(false);
      setNewGrocery(grocery);
    }

    setIsSavingGrocery(false);
  }

  const cancelEditGrocery = () => {
    setNewGrocery(grocery);
    setIsEditingGrocery(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([grocery]);

    if(data){
      removeItemsInDisplay([grocery]);
    }

    setIsDeleting(false);
  }

  const getDisplayText = () => {
    let rtn = '';
    if(grocery.Quantity && grocery.Quantity > 1) rtn += grocery.Quantity.toString()+grocery.Unit+' ';
    rtn += grocery.Title;
    if(grocery.GoodPrice){ rtn += ' (' + grocery.GoodPrice + ')'}

    return rtn;
  }

  return (
    <div className={'groceryContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], grocery.IsChecked, isSelecting, isSelected)}>
      {isSavingGrocery?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingGrocery?
          <div className='inputsContainer'>
            <div className='grocerySideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='groceryCenterContainer'>
              <input 
                className={scss(theme, [SCSS.INPUT])}
                type='text'
                value={newGrocery.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={scss(theme, [SCSS.INPUT])}
                type='number'
                value={newGrocery.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={scss(theme, [SCSS.INPUT])}
                type='text'
                value={newGrocery.GoodPrice?? ''}
                onChange={handleGoodPriceInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Good price"></input>
              <input 
                className={scss(theme, [SCSS.INPUT])}
                type='text'
                value={newGrocery.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
            </div>
            <div className='grocerySideContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEditGrocery} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEditGrocery} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className='groceryDisplayContainer'>
            <div 
              className={'groceryLine' + scss(theme, [SCSS.TEXT], grocery.IsChecked)}
              onClick={() => {if(!isDisabled)setIsEditingGrocery(true)}}>
              {getDisplayText()}
            </div>
            {!isEditingGrocery &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                (grocery.IsChecked?
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery-filled-grey.png'}/>
                  :
                  <PressImage isBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery' + itemTintColor(theme) + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}