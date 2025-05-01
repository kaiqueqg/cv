import { useEffect, useState } from "react";
import './GroceryView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Grocery, Item, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";
import PressImage from "../../../../PressImage/PressImage";

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
  const { grocery, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

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
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsSavingIsChecked(false);
        putItemInDisplay(data);
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

      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        setIsEditingGrocery(false);
        putItemInDisplay(data);
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

    const data = await objectiveslistApi.deleteObjectiveItem(grocery);

    if(data){
      putItemInDisplay(grocery, true);
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
    <div className={'groceryContainer' + itemGetTheme(theme, isSelected, isEndingPos, grocery.IsChecked)}>
      {isSavingGrocery?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingGrocery?
          <div className='inputsContainer'>
            <div className='grocerySideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='groceryCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newGrocery.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={itemInputColor(theme)}
                type='number'
                value={newGrocery.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newGrocery.GoodPrice?? ''}
                onChange={handleGoodPriceInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Good price"></input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newGrocery.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
            </div>
            <div className='grocerySideContainer'>
              <PressImage onClick={doneEditGrocery} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={cancelEditGrocery} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className='groceryDisplayContainer'>
            <div 
              className={'groceryLine' + itemTextColor(theme, grocery.IsChecked)}
              onClick={() => {if(!isEditingPos)setIsEditingGrocery(true)}}>
              {getDisplayText()}
            </div>
            {!isEditingGrocery &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                (grocery.IsChecked?
                  <PressImage onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery-filled-grey.png'}/>
                  :
                  <PressImage onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery' + itemTintColor(theme) + '.png'}/>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}