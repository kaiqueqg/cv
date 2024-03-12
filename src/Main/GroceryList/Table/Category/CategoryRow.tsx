import React, { useEffect, useState } from 'react';
import { Item, Category, Response, DBUser } from '../../../../Types';
import './CategoryRow.scss';
import { toast } from 'react-toastify';
import ItemRow from '../Item/ItemRow';
import Loading from '../../../../Loading/Loading';
import log from '../../../../Log/Log';
import { grocerylistApi } from '../../../../Requests/RequestFactory';
import { useUserContext } from '../../../../Contexts/UserContext';
import storage from '../../../../Storage/Storage';
import { redirect } from 'react-router-dom';

interface CategoryProps{
  receivedItems?: Item[],
  category: Category,
  redrawCallback: () => void,
}

const CategoryRow: React.FC<CategoryProps> = (props) => {
  const [category, setCategory] = useState(props.category);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textValue, setTextValue] = useState(props.category.Text);
  const [isSavingText, setIsSavingText] = useState(false);
  const [isSavingIsOpen, setIsSavingIsOpen] = useState(false);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);
  const [isRequestingItems, setIsRequestingItems] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  const {shouldCreateNewItemWhenCreateNewCategory, testServer} = useUserContext();

  useEffect(() => 
  {
    const {receivedItems} = props;
    if(category.IsOpen) {
      if(receivedItems === undefined){
        //log.dev('CategoryRow.useEffect', 'undefined');
        getItemList();
      }
      else{
        //log.dev('CategoryRow.useEffect', 'receivedItems', receivedItems);
        setItems(receivedItems);
      }
    }
  }, []);

  const getItemList = async () => {
    setIsRequestingItems(true);

    try {
      const respGetCategoryItemList = await grocerylistApi.getCategoryItemList(category.CategoryId);
  
      //!Problem with reaching server
      if(respGetCategoryItemList !== undefined && respGetCategoryItemList !== null){
        const respGetItemList: Response<Item[]> = await respGetCategoryItemList.json();
  
        //!Problem with response data or missing
        if(respGetItemList.WasAnError || respGetItemList.Data === null || respGetItemList.Data === undefined){
          //log.pop(respGetItemList.Message);
        }
        //*Happy path
        else{
          setItems(respGetItemList.Data);
        }
      }
    } 
    catch (err) {
      log.err(JSON.stringify(err));
      setIsRequestingItems(false);
    }

    setIsRequestingItems(false);
  }

  const displayConfirmDeleteRow = () => {
    if( items.length > 0){
      toast.warning('Are you sure?', {
        closeButton: <button className='btn btn-warning' onClick={deleteCategory} style={{marginTop: '5px', marginBottom: '5px'}}>YES</button>,
        autoClose: 5000,
        draggable: false,
        pauseOnHover: false,
      });
    }
    else{
      deleteCategory();
    }
  }

  const deleteCategory = async () => {   
    setIsDeleting(true);
    try {
      const response = await grocerylistApi.deleteCategory(category.CategoryId, () => {testServer();});
  
      //! Problem with reaching server
      if(response !== undefined && response !== undefined){

        const respPutCategory: Response<Category> = await response.json();
        //!Problem with response data or missing
        if(respPutCategory.WasAnError || respPutCategory.Data == null || respPutCategory.Data === undefined){
          log.pop(respPutCategory.Message);
        }
        else{
          props.redrawCallback();
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsDeleting(false);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const newText: string = textValue.toUpperCase().trim();
    const inputElement = event.target as HTMLInputElement;

    if(event.key === 'Enter'){
      if(category.Text !== newText) {
        updateCategory(inputElement, newText);
      }
      else{
        setIsEditing(false);
        inputElement.blur();
      }
    }
    else{
      if(event.key === 'Escape') {
        setTextValue(category.Text);
        setIsEditing(false);
        inputElement.blur();
      }
    }
  }

  const updateCategory = async (inputElement: HTMLInputElement, newText: string) => {
    setIsSavingText(true);
    try {
      const response = await grocerylistApi.putCategory({...category, Text: newText}, () => {testServer();});
  
      //! Problem with reaching server
      if(response !== undefined && response !== undefined){

        const respPutCategory: Response<Category> = await response.json();
        //!Problem with response data or missing
        if(respPutCategory.WasAnError || respPutCategory.Data == null || respPutCategory.Data === undefined){
          log.pop(respPutCategory.Message);
        }
        else{
          updateItemsDisplay();
          setCategory({...category, Text: newText});
          setIsEditing(false);
          inputElement.blur(); //todo maybe put outside the func?
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingText(false);
  }

  const handleRowClick = (event: any) => {
    if(!isEditing) {
      setIsEditing(true);
      const inputElement = event.target as HTMLInputElement;
      inputElement.focus();
    }
  }

  const handleInputBlur = (event: any) => {
    const inputElement = event.target as HTMLInputElement;
    setIsEditing(false);
    inputElement.blur();
  }

  const addNewItem = async () => {
    setIsCreatingNewItem(true);

    if(!category.IsOpen) changeItemsDisplay();
    
    const user: DBUser|null = storage.getUser();

    try {
      const emptyItem: Item = {
        UserIdCategoryId: category.CategoryId,
        ItemId: '',
        Text: 'NEW ITEM',
        IsChecked: false,
        Quantity: 1,
        GoodPrice: '$',
        QuantityUnit: 'unit',
      }
  
      const response = await grocerylistApi.putItem(emptyItem, () => {testServer();});
  
      //!Problem with reaching server
      if(response !== undefined && response !== undefined){
        const respPutItem: Response<Item> = await response.json();

        //!Problem with response data or missing
        if(respPutItem.WasAnError || respPutItem.Data === undefined || respPutItem.Data === null){
          log.pop(respPutItem.Message);
          log.err(respPutItem.Exception ?? 'no exception');
        }else{
          updateItemsDisplay();
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsCreatingNewItem(false);
  }

  const updateItemsDisplay = async () => {
    getItemList();
  }

  const changeItemsDisplay = async () => {
    setIsSavingIsOpen(true);
    try {
      const response = await grocerylistApi.putCategory({...category, IsOpen: !category.IsOpen}, () => {testServer();});
  
      //! Problem with reaching server
      if(response !== undefined && response !== undefined){

        const respPutCategory: Response<Category> = await response.json();
        //!Problem with response data or missing
        if(respPutCategory.WasAnError || respPutCategory.Data == null || respPutCategory.Data === undefined){
          log.pop(respPutCategory.Message);
        }
        else{
          setCategory(respPutCategory.Data);
        if(respPutCategory.Data.IsOpen){
          getItemList();
        }
        else{
          setItems([]);
        }
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsSavingIsOpen(false);
  }

  return(
    <>
      <div className='category-row' >
        <div className='category-image-container'>
          {isSavingIsOpen?
          <Loading></Loading>
          :
          (isEditing? 
            (isDeleting?
              <Loading></Loading>
              :
              <img src={process.env.PUBLIC_URL + '/trash-red.png'} className="trash-image" alt='meaningfull text' onClick={displayConfirmDeleteRow}></img>
            )
            :
            (category.IsOpen ?
              <img src={process.env.PUBLIC_URL + '/down-chevron.png'} className="unfold-image" alt='meaningfull text' onClick={changeItemsDisplay}></img>
              :
              <img src={process.env.PUBLIC_URL + '/up-chevron.png'} className="fold-image" alt='meaningfull text' onClick={changeItemsDisplay}></img>
            )
          )
          }
        </div>
        {isEditing ? 
          <input className='category-text-input' type='text' value={textValue.toUpperCase()} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus></input>
          :
          <>
            {(isSavingText ?
            <Loading></Loading>
            :
            <div className='category-text' onClick={handleRowClick}>{category.Text.toUpperCase()}</div>)
            }
          </>
        }
        <div className='category-image-container'>
          {category.IsOpen && 
            (isCreatingNewItem ? 
              <Loading></Loading>
              :
              <img src={process.env.PUBLIC_URL + '/add.png'} className="add-image" alt='meaningfull text' onClick={addNewItem}></img>)
          }
          {!category.IsOpen && !isEditing && <img src={process.env.PUBLIC_URL + '/add.png'} className="add-image" alt='meaningfull text' onClick={addNewItem}></img>}
        </div>
      </div>
      {category.IsOpen &&
      (isRequestingItems ? 
        <div>
          <div></div>
            <div className="loading-items"><Loading></Loading></div>            
          <div></div>
        </div>
        :
        items.map((item: Item, index: number) => (
          <ItemRow 
            key={'item' + item.ItemId} 
            item={item} 
            updateItemsDisplay={updateItemsDisplay} 
            isPair={index % 2===0}></ItemRow>
        )))}
    </>
  );
}

export default CategoryRow