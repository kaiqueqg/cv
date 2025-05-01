import { ReactNode, useEffect, useState } from "react";
import './LinkView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Link } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import PressImage from "../../../../PressImage/PressImage";
import { useLogContext } from "../../../../Contexts/LogContext";

export function linkNew(){
  return {
    Title: '',
    Link: '',
  }
}

interface LinkViewProps extends ItemViewProps{
  link: Link,
}

export const LinkView: React.FC<LinkViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { log } = useLogContext();
  const { link, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

  const [newTitle, setNewTitle] = useState<string>(link.Title);
  const [newLink, setNewLink] = useState<string>(link.Link);
  const [isEditingLinks, setIsEditingLinks] = useState<boolean>(false);
  
  const [isSavingLinks, setIsSavingLinks] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleLinkInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLink(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditLinks();
    }
    else if(event.key === 'Escape'){
      cancelEditLinks();
    }
  }

  const handleLinkKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditLinks();
    }
    else if(event.key === 'Escape'){
      setNewTitle('');
      setNewLink('');
    }
  }

  const doneEditLinks = async () => {
    setIsSavingLinks(true);

    const newValue: Link = {
      ...link, 
      Title: newTitle.trim(), 
      Link: newLink.trim(),
      LastModified: new Date().toISOString()
    };
      
    if(newValue.Title !== link.Title
      || newValue.Link !== link.Link 
      || newValue.Pos !== link.Pos) {
      setIsEditingLinks(true);

      const data = await objectiveslistApi.putObjectiveItem(newValue);

      if(data){
        setIsEditingLinks(false);
        putItemInDisplay(data);
      }

      setTimeout(() => {
        setIsEditingLinks(false);
      }, 200); 
    }
    else{
      setIsEditingLinks(false);
      setNewTitle(link.Title);
      setNewLink(link.Link);
    }

    setIsSavingLinks(false);
  }

  const cancelEditLinks = () => {
    setNewTitle(link.Title);
    setNewLink(link.Link);
    setIsEditingLinks(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(link);

    if(data){
      putItemInDisplay(link, true);
    }

    setIsDeleting(false);
  }

  const openLink = () => {
    if(link.Link.trim() !== '') window.open(link.Link.trim(), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={'linksContainer' + itemGetTheme(theme, isSelected, isEndingPos, link.Link.trim() !== '')}>
      {isSavingLinks?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingLinks?
          <div className='linksEditingContainer'>
            <div className='linksSideContainer'>
              {isDeleting?
                <Loading IsBlack={theme==='darkWhite'}></Loading>
                :
                <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
              }
            </div>
            <div className='linksCenterContainer'>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newTitle}
                onChange={handleTitleInputChange}
                onKeyDown={handleKeyDown} 
                placeholder='Title'>
              </input>
              <input 
                className={itemInputColor(theme)}
                type='text'
                value={newLink}
                onChange={handleLinkInputChange}
                onKeyDown={handleLinkKeyDown}
                placeholder='Link url'>
              </input>
            </div>
            <div className='linksSideContainer'>
              <PressImage onClick={doneEditLinks} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
              <PressImage onClick={cancelEditLinks} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            </div>
          </div>
          :
          <div className={'titleLine' + itemTextColor(theme)} onClick={() => {if(!isEditingPos)setIsEditingLinks(true)}}>{link.Title}</div>
        )
      }
      {!isEditingLinks &&
        (link.Link.trim() === ''?
          <PressImage onClick={openLink} src={process.env.PUBLIC_URL + '/link-grey.png'}/>
          :
          <PressImage onClick={openLink} src={process.env.PUBLIC_URL + '/link' + itemTintColor(theme) + '.png'}/>
        )
      }
    </div>
  );
}