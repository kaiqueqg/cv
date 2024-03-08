import React, { useEffect, useState } from 'react';
import './Table.scss';
import { Category, GroceryList, Item, Response } from '../../../Types';
import CategoryRow from './Category/CategoryRow';
import { useUserContext } from '../../../Contexts/UserContext';
import Loading from '../../../Loading/Loading';
import { grocerylistApi } from '../../../Requests/RequestFactory';
import log from '../../../Log/Log';

interface TableProps{
}

const Table: React.FC<TableProps> = (props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]|null>(null);
  const [isGettingCategoryList, setIsGettingCategoryList] = useState<boolean>(false);
  const [areAllOpen, setAreAllOpen] = useState<boolean>(false);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  
  const {shouldCreateNewItemWhenCreateNewCategory, testServer} = useUserContext();

  useEffect(() => {
    //getCategoryList();
    getGroceryList();
  }, []);

  const getGroceryList = async () => {
    setIsGettingCategoryList(true);
    
    try {
      const response = await grocerylistApi.getGroceryList(() => {testServer();});
      
      //! Problem with reaching server
      if(response !== undefined && response !== null){
        const respGetGroceryList: Response<GroceryList> = await response.json();
        //!Problem with response data or missing
        if(respGetGroceryList.WasAnError || respGetGroceryList.Data === null || respGetGroceryList.Data === undefined){
          log.pop(respGetGroceryList.Message);
        }
        //*Happy path
        else{
          log.dev('getGroceryList', 'grocerylist', respGetGroceryList.Data);
          setCategories(respGetGroceryList.Data.categories);
          setItems(respGetGroceryList.Data.items);
        }
      }
      else{
        log.pop('There was an error trying to  reach the server');
      }
    } 
    catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsGettingCategoryList(false);
  }

  const getCategoryList = async () => {
    setIsGettingCategoryList(true);
    
    try {
      const response = await grocerylistApi.getCategoryList(() => {testServer();});
      
      //! Problem with reaching server
      if(response !== undefined && response !== null){
        const respGetCategoryList: Response<Category[]> = await response.json();
        //!Problem with response data or missing
        if(respGetCategoryList.WasAnError || respGetCategoryList.Data === null || respGetCategoryList.Data === undefined){
          log.pop(respGetCategoryList.Message);
        }
        //*Happy path
        else{
          let areAnyOneOpen = false;
          for(let i = 0; i < respGetCategoryList.Data.length && !areAnyOneOpen; i++){
            areAnyOneOpen = respGetCategoryList.Data[i].IsOpen;
          }
          setAreAllOpen(areAnyOneOpen);
          setCategories(respGetCategoryList.Data);
        }
      }
      else{
        log.pop('There was an error trying to  reach the server');
      }
    } 
    catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsGettingCategoryList(false);
  }

  const addNewCategory = async () => {
    setIsAddingCategory(true);

    try {
      let newCategory: Category = {
        CategoryId: '',
        Text: 'NEW CATEGORY',
        IsOpen: true,
      }
  
      const response = await grocerylistApi.putCategory(newCategory, () => {testServer();});
  
      //!Problem with reaching server
      if(response !== undefined && response !== undefined){

        const respPutCategory: Response<Category> = await response.json();
        //!Problem with response data or missing
        if(respPutCategory.WasAnError || respPutCategory.Data === undefined || respPutCategory.Data === null){
          log.pop(respPutCategory.Message);
        }else{
          if(shouldCreateNewItemWhenCreateNewCategory){
            const emptyItem: Item = {
              UserIdCategoryId: respPutCategory.Data.CategoryId,
              ItemId: '',
              Text: 'NEW ITEM',
              IsChecked: false,
              Quantity: 1,
              GoodPrice: '$',
              QuantityUnit: 'unit',
            };
    
            await grocerylistApi.putItem(emptyItem, () => {testServer();});
          }
        }
  
        getCategoryList();
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsAddingCategory(false);
  }

  const redrawCallback = () => {
    getGroceryList();
  }

  const getItems = (category: Category):Item[]|undefined => {
    const filteredItems = items === null? undefined : items.filter(item => item.UserIdCategoryId.slice(-40) === category.CategoryId)
    return filteredItems;
  }

  return(
    <div className="table-container">
      <div key='table' className='grocerylist-table'>
        <div>
          <div className='header-row'>
            <div>
              <img src={process.env.PUBLIC_URL + '/download.png'} className="category-add-image" alt='meaningfull text' onClick={getGroceryList}></img>
            </div>
            <div className='grocerylist-table-title'>
              GROCERY LIST
            </div>
            <div>
              {isAddingCategory? 
                <Loading></Loading>
                :
                <img src={process.env.PUBLIC_URL + '/add.png'} className="category-add-image" alt='meaningfull text' onClick={addNewCategory}></img>}
            </div>
          </div>
        </div>
        {isGettingCategoryList?
          <div>
            <div>
              <div></div>
                <div className="loading-items"><Loading></Loading></div>            
              <div></div>
            </div>
          </div>
          :
          <div key='tbody'>
            {categories.map((category) => (
              <CategoryRow
                receivedItems={getItems(category)}
                key={'category' + category.CategoryId} 
                redrawCallback={redrawCallback}
                category={category}></CategoryRow>
            ))}
          </div>}
      </div>
    </div>
  );
}

export default Table;