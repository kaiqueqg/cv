import { useEffect, useState } from "react";
import './house-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { House, Item, ItemViewProps } from "../../../../TypesObjectives";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { useThemeContext, SCSS } from "../../../../contexts/theme-context";

export function houseNew(){
  return {
    Title: '',
    Listing: '',
    MapLink: '',
    MeterSquare: '',
    Rating: 0,
    Address: '',
    TotalPrice: 0,
    Contacted: false,
    Details: '',
    Attention: '',
  }
}

interface HouseViewProps extends ItemViewProps{
  house: House,
}

export const HouseView: React.FC<HouseViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { identityApi, objectiveslistApi } = useRequestContext();
  const { scss } = useThemeContext();
  const { house, theme, putItemsInDisplay, removeItemsInDisplay, isDisabled, isSelecting, isSelected, itemTintColor } = props;

  const [newHouse, setNewHouse] = useState<House>(house);
  const [isEditingHouse, setIsEditingHouse] = useState<boolean>(false);
  
  const [isSavingHouse, setIsSavingHouse] = useState<boolean>(false);
  const [isSavingWasContacted, setIsSavingWasContacted] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, [house]);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, Title: event.target.value});
  }
  const handleListingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, Listing: event.target.value});
  }
  const handleMapLinkInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, MapLink: event.target.value});
  }
  const handleMeterSquareInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, MeterSquare: event.target.value});
  }
  const handleRatingInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, Rating: Number(event.target.value)});
  }
  const handleAddressInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, Address: event.target.value});
  }
  const handleTotalPriceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewHouse({...newHouse, TotalPrice: Number(event.target.value)});
  }
  const handleDetailsInputChange = (event: any) => {
    setNewHouse({...newHouse, Details: event.target.value});
  }
  const handleAttentionInputChange = (event: any) => {
    setNewHouse({...newHouse, Attention: event.target.value});
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditHouse();
    }
    else if(event.key === 'Escape'){
      cancelEditHouse();
    }
  }

  const handleLongTextKeyDown = async (event: any) => {
    if(event.key === 'Enter' && event.shiftKey){
      doneEditHouse();
    }
    else if(event.key === 'Escape'){
      cancelEditHouse();
    }
  }

  const onChangeWasContacted = async () => {
    setIsSavingWasContacted(true);

    try {
      const newItem: House = { ...house, WasContacted: !house.WasContacted, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItems([newItem]);

      if(data){
        setIsSavingWasContacted(false);
        putItemsInDisplay(data);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }
    setIsSavingWasContacted(false);
  }

  const doneEditHouse = async () => {
    setIsSavingHouse(true);
    const newItem: House = {
      ...newHouse,
      Title: newHouse.Title.trim(),
      Listing: newHouse.Listing.trim(),
      MapLink: newHouse.MapLink.trim(),
      MeterSquare: newHouse.MeterSquare.trim(),
      Rating: newHouse.Rating,
      Address: newHouse.Address.trim(),
      TotalPrice: newHouse.TotalPrice,
      Details: newHouse.Details.trim(),
      Attention: newHouse.Attention.trim(),  
    };

    if(newHouse.Title !== house.Title
      || newItem.Listing !== house.Listing
      || newItem.MapLink !== house.MapLink
      || newItem.MeterSquare !== house.MeterSquare
      || newItem.Rating !== house.Rating
      || newItem.Address !== house.Address
      || newItem.TotalPrice !== house.TotalPrice
      || newItem.Details !== house.Details
      || newItem.Attention !== house.Attention) {
      setIsEditingHouse(true);

      const data = await objectiveslistApi.putObjectiveItems([newItem]);

      if(data){
        setIsEditingHouse(false);
        putItemsInDisplay(data);
        setNewHouse(newHouse);
      }

      setTimeout(() => {
        setIsEditingHouse(false);
      }, 200); 
    }
    else{
      setIsEditingHouse(false);
      setNewHouse(house);
    }

    setIsSavingHouse(false);
  }

  const cancelEditHouse = () => {
    setNewHouse(house);
    setIsEditingHouse(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([house]);

    if(data){
      removeItemsInDisplay([house]);
    }

    setIsDeleting(false);
  }

  const openMapLink = () => {
    if(house.MapLink.trim() !== '') window.open(house.MapLink, '_blank', 'noopener,noreferrer')
  }

  const openListing = () => {
    if(house.Listing.trim() !== '') window.open(house.Listing, '_blank', 'noopener,noreferrer')
  }

  const getDisplayText = () => {
    let rtn = '';
    rtn += house.Title;
    return rtn;
  }

  const getEditingView = ():JSX.Element => {
    return(
      <div className='inputsContainer'>
        <div className='houseSideContainer'>
          {isDeleting?
            <Loading IsBlack={theme==='white'}></Loading>
            :
            <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage/>
          }
        </div>
        <div className='houseCenterContainer'>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='text'
            value={newHouse.Title}
            onChange={handleTitleInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="Title"
            autoFocus></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='text'
            value={newHouse.Listing}
            onChange={handleListingInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="Listing"
            ></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='text'
            value={newHouse.MapLink}
            onChange={handleMapLinkInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="MapLink"
            ></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='text'
            value={newHouse.MeterSquare}
            onChange={handleMeterSquareInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="m²"
            ></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='number'
            value={newHouse.Rating === 0 ? '' : newHouse.Rating}
            onChange={handleRatingInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Rating"
            min={0}></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='text'
            value={newHouse.Address}
            onChange={handleAddressInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="Address"
            ></input>
          <input 
            className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
            type='number'
            value={newHouse.TotalPrice === 0 ? '' : newHouse.TotalPrice}
            onChange={handleTotalPriceInputChange}
            onKeyDown={handleKeyDown}
            placeholder="TotalPrice"
            min={0}></input>
          <textarea 
            className={'houseTextArea' + scss(theme, [SCSS.TEXT, SCSS.BORDERCOLOR])}
            value={newHouse.Details}
            onChange={handleDetailsInputChange}
            onKeyDown={handleLongTextKeyDown} 
            placeholder='Details'
            ></textarea>
          <textarea 
            className={'houseTextArea' + scss(theme, [SCSS.TEXT, SCSS.BORDERCOLOR])}
            value={newHouse.Attention}
            onChange={handleAttentionInputChange}
            onKeyDown={handleLongTextKeyDown} 
            placeholder='Attention'
            ></textarea>
        </div>
        <div className='houseSideContainer'>
          <PressImage isLoadingBlack={props.isLoadingBlack} onClick={doneEditHouse} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} rawImage/>
          <PressImage isLoadingBlack={props.isLoadingBlack} onClick={cancelEditHouse} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} rawImage/>
        </div>
      </div>
    )
  }

  const getRatingView = () => {
    if(!house.Rating || house.Rating === 0) return;
    
    return(
      <div className={'houseInfo' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {house.Rating}
      </div>
    )
  }

  const getMeterSquareView = () => {
    if(!house.MeterSquare || house.MeterSquare.trim() === '') return;

    return(
      <div className={'houseInfo' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {house.MeterSquare+'m²'}
      </div>
    )
  }

  const getTotalPrice = () => {
    if(!house.TotalPrice || house.TotalPrice === 0) return;
    
    return(
      <div className={'houseInfo' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {'$' + house.TotalPrice.toString()}
      </div>
    )
  }

  const getAdressView = () => {
    if(!house.Address || house.Address === '') return;
    
    return(
      <div className={'houseInfo' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {house.Address}
      </div>
    )
  }

  const getDetailsView = () => {
    if(!house.Details || house.Details.trim() === '') return;
    
    return(
      <div className={'houseDisplayDetailsLine' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {house.Details}
      </div>
    )
  }

  const getAttentionView = () => {
    if(!house.Attention || house.Attention.trim() === '') return;

    return(
      <div className='houseDisplayAttention' onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
        {house.Attention}
      </div>
    )
  }

  const getListingView = () => {
    if(!house.Listing || house.Listing.trim() === '') return;

    return(
      <PressImage isLoadingBlack={props.isLoadingBlack} onClick={openListing} src={process.env.PUBLIC_URL + '/link' + itemTintColor(theme) + '.png'}></PressImage>
    )
  }

  const getMapLinkView = () => {
    if(!house.MapLink || house.MapLink.trim() === '') return;
    
    return(
      <PressImage isLoadingBlack={props.isLoadingBlack} onClick={openMapLink} src={process.env.PUBLIC_URL + '/location-filled' + itemTintColor(theme) + '.png'}></PressImage>
    )
  }

  const getDisplayView = (): JSX.Element => {
    return(
      <div className={'houseDisplayContainer '}>
        <div className='houseDisplayMainContainer'>
          <div className='houseDisplayMainTextContainer'>
            <div className='houseDisplayMainLongTextContainer' onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
              <div className={'houseLine' + scss(theme, [SCSS.TEXT])} onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
                {getDisplayText()}
              </div>
            </div>
            <div className='houseDisplayMainShortTextContainer' onClick={() => {if(!isDisabled)setIsEditingHouse(true)}}>
              {getRatingView()}
              {getMeterSquareView()}
              {getTotalPrice()}
            </div>
            {getAdressView()}
          </div>
          {getListingView()}
          {getMapLinkView()}
          {!isEditingHouse &&
            (isSavingWasContacted?
              <Loading IsBlack={theme==='white'||theme==='pink'}></Loading>
              :
              (house.WasContacted?
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeWasContacted()}} src={process.env.PUBLIC_URL + '/done.png'} rawImage/>
                :
                <PressImage isLoadingBlack={props.isLoadingBlack} onClick={() => {if(!isDisabled)onChangeWasContacted()}} src={process.env.PUBLIC_URL + '/home.png'}/>
              )
            )
          }
        </div>
        <div className='houseDisplaySecondaryContainer'>
          {getDetailsView()}
          {getAttentionView()}
        </div>
      </div>
    )
  }

  return (
    <div className={'houseContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], house.WasContacted, isSelecting, isSelected)}>
      {isSavingHouse?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingHouse?
          getEditingView() 
          :
          getDisplayView()
        )
      }
    </div>
  );
}