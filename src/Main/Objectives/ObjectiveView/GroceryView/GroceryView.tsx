import { useEffect, useState } from "react";
import './GroceryView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Grocery, Item, ItemViewProps } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import log from "../../../../Log/Log";

interface QuestionViewProps extends ItemViewProps{
  grocery: Grocery,
}

const QuestionView: React.FC<QuestionViewProps> = (props) => {
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
    const newItem: Grocery = {...newGrocery, LastModified: new Date().toISOString()};

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
      }

      setTimeout(() => {
        setIsEditingGrocery(false);
      }, 200); 
    }
    else{
      setIsEditingGrocery(false);
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
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'groceryContainer groceryContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'groceryContainer groceryContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'groceryContainer groceryContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'groceryContainer groceryContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'groceryContainer groceryContainerNoTheme';
    }
    else{
      rtnTheme = 'groceryContainer groceryContainerNoTheme';
    }

    return rtnTheme + (isSelected? ' groceryContainerSelected':'') + (isEndingPos&&isSelected? ' groceryContainerSelectedEnding':'');
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

  const getDisplayText = () => {
    let rtn = '';
    if(grocery.Quantity && grocery.Quantity > 1) rtn += grocery.Quantity.toString()+'x ';
    rtn += grocery.Title;
    if(grocery.GoodPrice){
      rtn += ' (' + grocery.GoodPrice;

      if(grocery.Unit) rtn += ' - ' + grocery.Unit;
      rtn += ')';
    }

    return rtn;
  }

  return (
    <div className={getTheme()}>
      {isSavingGrocery?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingGrocery?
          <div className='inputsContainer'>
            <div className='inputLeft'>
              <input 
                className={'groceryInput' + getTextColor()}
                type='text'
                value={newGrocery.Title}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder="Title"
                autoFocus></input>
              <input 
                className={'groceryInput' + getTextColor()}
                type='number'
                value={newGrocery.Quantity?? ''}
                onChange={handleQuantityInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Quantity"
                min={1}></input>
              <input 
                className={'groceryInput' + getTextColor()}
                type='text'
                value={newGrocery.GoodPrice?? ''}
                onChange={handleGoodPriceInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Good price"></input>
                <input 
                className={'groceryInput' + getTextColor()}
                type='text'
                value={newGrocery.Unit?? ''}
                onChange={handleUnitInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Unit"></input>
            </div>
            <div className='inputRight'>
              <img className='inputImage' onClick={doneEditGrocery} src={process.env.PUBLIC_URL + '/done.png'}></img>
              <img className='inputImage' onClick={cancelEditGrocery} src={process.env.PUBLIC_URL + '/cancel.png'}></img>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
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
                  <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/checked-grey.png'}></img>
                  :
                  <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeIsChecked()}} src={process.env.PUBLIC_URL + '/unchecked' + getTintColor() + '.png'}></img>
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