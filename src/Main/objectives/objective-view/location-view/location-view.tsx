import { useEffect, useState } from "react";
import './location-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Location } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import Loading from "../../../../loading/loading";
import PressImage from "../../../../press-image/press-image";

export function locationNew(){
  return {
    Title: '',
    Url: '',
  }
}

interface LocationViewProps extends ItemViewProps{
  location: Location,
}

export const LocationView: React.FC<LocationViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { location, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const [newTitle, setNewTitle] = useState<string>(location.Title);
  const [newUrl, setNewUrl] = useState<string>(location.Url);
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  
  const [isSavingLocation, setIsSavingLocation] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUrl(event.target.value);
  }

  const handleTitleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditLocation();
    }
    else if(event.key === 'Escape'){
      cancelEditLocation();
    }
  }

  const handleUrlKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditLocation();
    }
    else if(event.key === 'Escape'){
      cancelEditLocation();
    }
  }

  const doneEditLocation = async () => {
    setIsSavingLocation(true);
    const newLocation: Location = {
      ...location, 
      Title: newTitle.trim(), 
      Url: newUrl,
      LastModified: new Date().toISOString()};

    if(newLocation.Title !== location.Title
      || newLocation.Url !== location.Url 
      || newLocation.Pos !== location.Pos) {
      setIsEditingLocation(true);

      const data = await objectiveslistApi.putObjectiveItem(newLocation);

      if(data){
        setIsEditingLocation(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingLocation(false);
      }, 200); 
    }
    else{
      setIsEditingLocation(false);
      setNewTitle(location.Title);
      setNewUrl(location.Url);
    }

    setIsSavingLocation(false);
  }

  const cancelEditLocation = () => {
    setNewTitle(location.Title);
    setNewUrl(location.Url);
    setIsEditingLocation(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(location);

    if(data){
      putItemInDisplay(location, true);
    }

    setIsDeleting(false);
  }

  return (
    <div className={'locationContainer'+ itemGetTheme(theme, isSelected, isEndingPos, location.Url.trim()!=='')}>
      {isSavingLocation?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingLocation?
          <div className='locationEditingContainer'>
            <div className='locationSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='white'}></Loading>
                :
                <PressImage isBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='locationCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newTitle}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleKeyDown} 
                placeholder='Title'>
              </input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newUrl}
                onChange={handleUrlInputChange}
                onKeyDown={handleUrlKeyDown} 
                placeholder="Google maps URL"
                autoFocus></input>
            </div>
            <div className='locationSideContainer'>
              <PressImage isBlack={props.isLoadingBlack} onClick={doneEditLocation} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage isBlack={props.isLoadingBlack} onClick={cancelEditLocation} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className={'locationTitleLine' + itemTextColor(theme)} onClick={() => {if(!isEditingPos)setIsEditingLocation(true)}}>{location.Title}</div>
        )
      }
      {!isEditingLocation && <img className={'urlImage ' + ((location.Url && location.Url.trim()) !== ''?'':'urlImageNoPointer')} onClick={() => {if(!isEditingPos && location.Url && location.Url.trim())window.open(location.Url, '_blank', 'noopener,noreferrer');}} src={process.env.PUBLIC_URL + '/location' + ((location.Url && location.Url.trim()) === ''?'':'-filled') + itemTintColor(theme) + '.png'}></img>}
    </div>
  );
}