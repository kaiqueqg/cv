import { useEffect, useState } from "react";
import './GroceryView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Grocery, Item, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";

interface GroceryViewProps extends ItemViewProps{
  grocery: Grocery,
}

const QuestionView: React.FC<GroceryViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { grocery, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

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

  const getTheme = () => {
    let rtnTheme = 'groceryContainer';

    if(grocery.IsChecked){
      rtnTheme += ' groceryContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' groceryContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' groceryContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' groceryContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' groceryContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' groceryContainerNoTheme';
      }
      else{
        rtnTheme += ' groceryContainerNoTheme';
      }
    }

    if(isSelected) rtnTheme += ' groceryContainerSelected';
    if(isEndingPos && isSelected) rtnTheme += ' groceryContainerSelectedEnding';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' groceryTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' groceryTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' groceryTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' groceryTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' groceryTextNoTheme'
    }
    else{
      return ' groceryTextBlue';
    }
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' groceryTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' groceryTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' groceryTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' groceryTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' groceryTextFadeNoTheme'
    }
    else{
      return ' groceryTextFadeBlue';
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
      v+= 'groceryInputBlue groceryTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'groceryInputRed groceryTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'groceryInputGreen groceryTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'groceryInputWhite groceryTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'groceryInputNoTheme groceryTextNoTheme'
    }
    else{
      v+= 'groceryInputNoTheme groceryTextNoTheme';
    }

    return 'groceryInput ' + v;
  }

  const getDisplayText = () => {
    let rtn = '';
    if(grocery.Quantity && grocery.Quantity > 1) rtn += grocery.Quantity.toString()+grocery.Unit+' ';
    rtn += grocery.Title;
    if(grocery.GoodPrice){ rtn += ' (' + grocery.GoodPrice + ')'}

    return rtn;
  }

  return (
    <div className={getTheme()}>
      {isSavingGrocery?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingGrocery?
          <div className='inputsContainer'>
            <div className='grocerySideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
            </div>
            <div className='groceryCenterContainer'>
              <input 
                className={getInputColor()}
                type='text'
                value={newGrocery.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={getInputColor()}
                type='number'
                value={newGrocery.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newGrocery.GoodPrice?? ''}
                onChange={handleGoodPriceInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Good price"></input>
              <input 
                className={getInputColor()}
                type='text'
                value={newGrocery.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
            </div>
            <div className='grocerySideContainer'>
              <img className='inputImage' onClick={doneEditGrocery} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
              <img className='inputImage' onClick={cancelEditGrocery} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            </div>
          </div>
          :
          <div className='groceryDisplayContainer'>
            <div 
              className={'groceryLine' + (grocery.IsChecked? getTextFadeColor():getTextColor())}
              onClick={() => {if(!isEditingPos)setIsEditingGrocery(true)}}>
              {getDisplayText()}</div>
            {!isEditingGrocery &&
              (isSavingIsChecked?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                (grocery.IsChecked?
                  <img className='groceryImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery-filled-grey.png'}></img>
                  :
                  <img className='groceryImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/grocery' + getTintColor() + '.png'}></img>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default QuestionView;