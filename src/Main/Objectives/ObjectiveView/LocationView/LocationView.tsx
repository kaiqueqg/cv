import { useEffect, useState } from "react";
import './LocationView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Location } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
      Url: '',
    }
  )
}

interface LocationViewProps extends ItemViewProps{
  location: Location,
}

const LocationView: React.FC<LocationViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { location, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

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

  const getTheme = () => {
    let rtnTheme = 'locationContainer';

    if(location.Url.trim() !== ''){
      rtnTheme += ' locationContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' locationContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' locationContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' locationContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' locationContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' locationContainerNoTheme';
      }
      else{
        rtnTheme += ' locationContainerNoTheme';
      }
    }

    rtnTheme += (location.Title.trim() !== '' && location.Url.trim() !== '')? ' locationContainerNoBackground':'';
    rtnTheme += isSelected? ' locationContainerSelected':'';
    rtnTheme += isEndingPos&&isSelected? ' locationContainerSelectedEnding':'';
    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' locationTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' locationTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' locationTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' locationTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' locationTextNoTheme'
    }
    else{
      return ' locationTextNoTheme';
    }
  }

  const getTintColor = () => {
    let tint = '';
    if(theme === 'darkWhite') tint += '-black';
    return tint;
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'locationInputBlue locationTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'locationInputRed locationTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'locationInputGreen locationTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'locationInputWhite locationTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'locationInputNoTheme locationTextNoTheme'
    }
    else{
      v+= 'locationInputNoTheme locationTextNoTheme';
    }

    return 'locationInput ' + v;
  }

  return (
    <div className={getTheme()}>
      {isSavingLocation?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingLocation?
          <div className='locationEditingContainer'>
            <div className='locationSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='locationCenterContainer'>
              <input 
                className={getInputColor()}
                type='text'
                value={newTitle}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleKeyDown} 
                placeholder='Title'>
              </input>
              <input 
                className={getInputColor()}
                type='text'
                value={newUrl}
                onChange={handleUrlInputChange}
                onKeyDown={handleUrlKeyDown} 
                placeholder="Google maps URL"
                autoFocus></input>
            </div>
            <div className='locationSideContainer'>
              <PressImage onClick={doneEditLocation} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}/>
              <PressImage onClick={cancelEditLocation} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}/>
            </div>
          </div>
          :
          <div className={'titleLine' + getTextColor()} onClick={() => {if(!isEditingPos)setIsEditingLocation(true)}}>{location.Title}</div>
        )
      }
      {!isEditingLocation && <img className={'urlImage ' + ((location.Url && location.Url.trim()) !== ''?'':'urlImageNoPointer')} onClick={() => {if(!isEditingPos && location.Url && location.Url.trim())window.open(location.Url, '_blank', 'noopener,noreferrer');}} src={process.env.PUBLIC_URL + '/location' + ((location.Url && location.Url.trim()) === ''?'':'-filled') + getTintColor() + '.png'}></img>}
    </div>
  );
}

export default LocationView;