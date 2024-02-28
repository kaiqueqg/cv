import React, { useState } from 'react';
import './ItemRow.scss';
import { Item, Response } from '../../../../Types';
import { toast } from 'react-toastify';
import Loading from '../../../../Loading/Loading';
import { useUserContext } from '../../../../Contexts/UserContext';
import { grocerylistApi } from '../../../../Requests/RequestFactory';
import log from '../../../../Log/Log';

interface ItemRowProps{
  item: Item,
  updateItemsDisplay: () => Promise<void>, 
  isPair: boolean,
}

const ItemRow: React.FC<ItemRowProps> = (props) => {

  const [item, setItem] = useState(props.item);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [isSavingIsChecked, setIsSavingIsChecked] = useState(false);
  const [textValue, setTextValue] = useState(props.item.Text);
  const [quantityValue, setQuantityValue] = useState(props.item.Quantity);
  const [quantityUnit, setQuantityUnit] = useState(props.item.QuantityUnit);
  const [goodPrice, setGoodPrice] = useState(props.item.GoodPrice);
  
  const { hideQuantity, testServer } = useUserContext();

  const displayConfirmDeleteRow = () => {
    deleteItem();
  }

  const deleteItem = async () =>{
    setIsDeleting(true);

    try {
      const response = await grocerylistApi.deleteItem(item.UserIdCategoryId, item.ItemId, () => {testServer();});

      //! Problem with reaching server
      if(response !== undefined && response !== undefined){
        const respDeleteItem: Response<Item> = await response.json();

        //!Problem with response data or missing
        if(respDeleteItem.WasAnError || respDeleteItem.Data === null || respDeleteItem.Data === undefined){
          log.pop(respDeleteItem.Message);
        }
        else{
          props.updateItemsDisplay();
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsDeleting(false);
  }

  const changeIsChecked = async () => {
    setIsSavingIsChecked(true);

    try {
      const newItem = { ...item, IsChecked: !item.IsChecked};
      const response = await grocerylistApi.putItem(newItem, () => {testServer();});

      //! Problem with reaching server
      if(response !== undefined && response !== undefined){
        const respPutItem: Response<Item> = await response.json();

        //!Problem with response data or missing
        if(respPutItem.WasAnError || respPutItem.Data === null || respPutItem.Data === undefined){
          log.pop(respPutItem.Message);
        }
        else{
          setItem(newItem);
          setIsSavingIsChecked(false);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingIsChecked(false);
  }

  const handleRowClick = (event: any) => {
    if(!isEditing) {
      setIsEditing(true);
      const inputElement = event.target as HTMLInputElement;
      inputElement.focus();
    }
  }

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityValue(parseInt(event.target.value));
  }

  const handleQuantityUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantityUnit(event.target.value);
  }

  const handleQuantityGoodPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoodPrice(event.target.value);
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
    const newItem: Item = {
      UserIdCategoryId: item.UserIdCategoryId,
      ItemId: item.ItemId,
      Text: textValue.toUpperCase(),
      Quantity: quantityValue,
      QuantityUnit: quantityUnit,
      GoodPrice: goodPrice,
      IsChecked: item.IsChecked
    }

    if(newItem.Text !== item.Text || newItem.Quantity !== item.Quantity || newItem.QuantityUnit !== item.QuantityUnit || newItem.GoodPrice !== item.GoodPrice) {
      setIsSavingItem(true);

      const response = await grocerylistApi.putItem(newItem, () => {testServer();});

      if(response !== undefined && response.ok){
        setItem(newItem);
        setIsEditing(false);
      }

      setTimeout(() => {
        setIsSavingItem(false);
      }, 1000); 
    }
    else{
      setIsEditing(false);
    }
  }

  const cancelEdit = () => {
    setTextValue(item.Text);
    setIsEditing(false);
  }

  const increaseQuantity = async () => {
    try {
      const newItem = {...item, Quantity: item.Quantity+1};
      const response = await grocerylistApi.putItem(newItem, () => {testServer();});

      //! Problem with reaching server
      if(response !== undefined && response !== undefined){
        const respPutItem: Response<Item> = await response.json();

        //!Problem with response data or missing
        if(respPutItem.WasAnError || respPutItem.Data === null || respPutItem.Data === undefined){
          log.pop(respPutItem.Message);
        }
        else{
          setItem(newItem);
          setIsEditing(false);
          setQuantityValue(newItem.Quantity);
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
  }

  const decreaseQuantity = async () => {
    if(item.Quantity > 1) {
      try {
        const newItem = {...item, Quantity: item.Quantity-1};
        const response = await grocerylistApi.putItem(newItem, () => {testServer();});
  
        //! Problem with reaching server
        if(response !== undefined && response !== undefined){
          const respPutItem: Response<Item> = await response.json();
  
          //!Problem with response data or missing
          if(respPutItem.WasAnError || respPutItem.Data === null || respPutItem.Data === undefined){
            log.pop(respPutItem.Message);
          }
          else{
            setItem(newItem);
            setIsEditing(false);
            setQuantityValue(newItem.Quantity);
          }
        }
      } catch (err) {
        log.err(JSON.stringify(err));
      }
    }
  }

  const getDisplayText = () => {
    let displayText = item.Text;
    if(!isEditing){
      if(!hideQuantity && item.Quantity !== null) displayText = (item.Quantity + 'x ') + displayText;
      if(item.GoodPrice !== null && item.GoodPrice !== '' && item.GoodPrice !== '$') displayText = displayText + (' (' + item.GoodPrice + ')');
    }

    return displayText;
  }
  

  return(
    <>
      <tr className={props.isPair? 'item-row-color-one' : 'item-row-color-two'}>
        <td style={{textAlign: 'center'}}>
          {isEditing && !isDeleting && <img src={process.env.PUBLIC_URL + '/trash.png'} className="item-row-image" alt='meaningfull text' onClick={displayConfirmDeleteRow}></img>}
          {isEditing && isDeleting && <Loading></Loading>}
          {!isEditing && !hideQuantity && 
            <div className='item-row-container'>
              <img className="item-row-image item-row-image-plusminus" src={process.env.PUBLIC_URL + '/add.png'} alt='meaningfull text' onClick={increaseQuantity}></img>
              <img className="item-row-image item-row-image-plusminus" src={process.env.PUBLIC_URL + '/minus.png'} alt='meaningfull text' onClick={decreaseQuantity}></img>
            </div>
          }
        </td>
        {isSavingItem ? 
        <Loading></Loading>
        :
        (isEditing ?
          <td className="item-row-details">
            <div className='item-row-details-line'>
              <div className='item-row-details-text'>TEXT:</div>
              <input className='form-control item-row-input' type='text' value={textValue.toUpperCase()} onChange={handleTextInputChange} onKeyDown={handleKeyDown} autoFocus></input>
            </div>
            <div className='item-row-details-line'>
              <div className='item-row-details-text'>QUANTITY:</div>
              <input className='form-control item-row-input' style={{width: '10%', minWidth:'100px'}} type='number' value={quantityValue} onChange={handleQuantityChange} onKeyDown={handleKeyDown}></input>
            </div>
            <div className='item-row-details-line'>
              <div className='item-row-details-text'>GOOD PRICE:</div>
              <input className='form-control item-row-input' type='text' value={goodPrice} onChange={handleQuantityGoodPriceChange} onKeyDown={handleKeyDown}></input>
            </div>
            <div className='item-row-details-line'>
              <div className='item-row-details-text'>QUANTITY UNIT:</div>
              <input className='form-control item-row-input' type='text' value={quantityUnit} onChange={handleQuantityUnitChange} onKeyDown={handleKeyDown}></input>
            </div>
            <div className='item-row-donecancel-container'>
              <img src={process.env.PUBLIC_URL + '/done.png'} className="item-row-done" alt='meaningfull text' style={{marginRight: '30px'}} onClick={doneEdit}></img>
              <img src={process.env.PUBLIC_URL + '/cancel.png'} className="item-row-cancel" alt='meaningfull text' onClick={cancelEdit}></img>
            </div>
          </td>
          :
          <td className={'item-row-text'} onClick={handleRowClick}>{getDisplayText()}</td>
        )
        }
        <td>
          {isSavingIsChecked ? 
            <Loading></Loading>
            :
            <img src={item.IsChecked ? process.env.PUBLIC_URL + '/checked.png' : process.env.PUBLIC_URL + '/unchecked.png'} className="item-row-image" alt='meaningfull text' onClick={changeIsChecked}></img>
          }
        </td>
        
      </tr>
    </>
  );
}

export default ItemRow;