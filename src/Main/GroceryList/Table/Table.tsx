import React, { useEffect, useState } from 'react';
import './Table.scss';
import { Category, Item, Response } from '../../../Types';
import CategoryRow from './Category/CategoryRow';
import { useUserContext } from '../../../Contexts/UserContext';
import Loading from '../../../Loading/Loading';
import { grocerylistApi } from '../../../Requests/RequestFactory';
import log from '../../../Log/Log';

interface TableProps{
}

const Table: React.FC<TableProps> = (props) => {
  const [data, setData] = useState<Category[]>([]);
  const [isGettingCategoryList, setIsGettingCategoryList] = useState<boolean>(false);
  const [areAllOpen, setAreAllOpen] = useState<boolean>(false);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  
  const {shouldCreateNewItemWhenCreateNewCategory, testServer} = useUserContext();

  useEffect(() => {
    getCategoryList();
  }, []);

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
          setData(respGetCategoryList.Data);
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
    getCategoryList();
  }

  return(
    <>
      <table key='table' className='grocerylist-table'>
        <thead>
          <tr className='header-row'>
            <td>
              <img src={process.env.PUBLIC_URL + '/download.png'} className="category-add-image" alt='meaningfull text' onClick={getCategoryList}></img>
            </td>
            <td className='grocerylist-table-title'>
              GROCERY LIST
            </td>
            <td>
              {isAddingCategory? 
                <Loading></Loading>
                :
                <img src={process.env.PUBLIC_URL + '/add.png'} className="category-add-image" alt='meaningfull text' onClick={addNewCategory}></img>}
            </td>
          </tr>
        </thead>
        {isGettingCategoryList?
          <tbody>
            <tr>
              <td></td>
                <td className="loading-items"><Loading></Loading></td>            
              <td></td>
            </tr>
          </tbody>
          :
          <tbody key='tbody'>
            { data.map((category) => (
              <CategoryRow 
                key={'category' + category.CategoryId} 
                redrawCallback={redrawCallback}
                category={category}></CategoryRow>
            ))}
          </tbody>}
      </table>
    </>
  );
}

export default Table;