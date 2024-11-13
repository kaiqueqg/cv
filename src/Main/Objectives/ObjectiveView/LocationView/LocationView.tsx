import { useEffect, useState } from "react";
import './LocationView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Location } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";

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
      Title: newTitle, 
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
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'locationContainer locationContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'locationContainer locationContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'locationContainer locationContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'locationContainer locationContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'locationContainer locationContainerNoTheme';
    }
    else{
      rtnTheme = 'locationContainer locationContainerNoTheme';
    }

    return rtnTheme + (isSelected? ' locationContainerSelected':'') + (isEndingPos&&isSelected? ' locationContainerSelectedEnding':'');
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
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  return (
    <div className={getTheme()}>
      {isSavingLocation?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingLocation?
          <div className='locationEditingContainer'>
            <div className='locationLeftContainer'>
              <input 
                className={'locationInput' + getTextColor()}
                type='text'
                value={newTitle}
                onChange={handleTitleInputChange}
                onKeyDown={handleTitleKeyDown} 
                placeholder='Title'>
              </input>
              <input 
                className={'locationInput' + getTextColor()}
                type='text'
                value={newUrl}
                onChange={handleUrlInputChange}
                onKeyDown={handleUrlKeyDown} 
                placeholder="Google maps URL"
                autoFocus></input>
            </div>
            <div className='locationRightContainer'>
              <img className='inputImage' onClick={doneEditLocation} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
              <img className='inputImage' onClick={cancelEditLocation} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
              }
            </div>
          </div>
          :
          <div className={'titleLine' + getTextColor()} onClick={() => {if(!isEditingPos)setIsEditingLocation(true)}}>{location.Title}</div>
        )
      }
      {!isEditingLocation && <img className='urlImage' onClick={() => {if(!isEditingPos)window.open(location.Url, '_blank', 'noopener,noreferrer');}} src={process.env.PUBLIC_URL + '/location' + getTintColor() + '.png'}></img>}
    </div>
  );
}

export default LocationView;