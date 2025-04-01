import { ReactNode, useEffect, useState } from "react";
import './LinksView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Link, Links } from "../../../../TypesObjectives";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";
import { link } from "fs";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
      Links: [],
    }
  )
}

interface LinksViewProps extends ItemViewProps{
  links: Links,
}

const LinksView: React.FC<LinksViewProps> = (props) => {
  const { user, setUser } = useUserContext();
  const { links, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [newTitle, setNewTitle] = useState<string>(links.Title);
  const [newLinkTitle, setNewLinkTitle] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  const [newLinks, setNewLinks] = useState<Link[]>(links.Links);
  const [isEditingLinks, setIsEditingLinks] = useState<boolean>(false);
  const [newLinkTitleWarning, setNewLinkTitleWarning] = useState<boolean>(false);
  const [newLinkUrlWarning, setNewLinkUrlWarning] = useState<boolean>(false);
  
  const [isSavingLinks, setIsSavingLinks] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const handleTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleLinkTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLinkTitle(event.target.value);
  }

  const handleLinkUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewLinkUrl(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEditLinks();
    }
    else if(event.key === 'Escape'){
      cancelEditLinks();
    }
  }

  const handleUrlKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.shiftKey){
      if(event.key === 'Enter'){
        doneEditLinks();
      }
    }
    else{
      if(event.key === 'Enter'){
        addLinkToLinks();
      }
      else if(event.key === 'Escape'){
        setNewLinkTitle('');
        setNewLinkUrl('');
      }
    }
  }

  const doneEditLinks = async () => {
    setIsSavingLinks(true);
    const newValue: Links = {
      ...links, 
      Title: newTitle.trim(), 
      Links: newLinks,
      LastModified: new Date().toISOString()};

    if(newValue.Title !== links.Title
      || newValue.Links !== links.Links 
      || newValue.Pos !== links.Pos) {
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
      setNewTitle(links.Title);
      setNewLinks(links.Links);
    }

    setIsSavingLinks(false);
  }

  const cancelEditLinks = () => {
    setNewTitle(links.Title);
    setNewLinks(links.Links);
    setIsEditingLinks(false);
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItem(links);

    if(data){
      putItemInDisplay(links, true);
    }

    setIsDeleting(false);
  }

  const addLinkToLinks = () => {
    // if(newLinkTitle.trim() === ''){
    //   setNewLinkTitleWarning(true);
    //   setTimeout(()=>{
    //     setNewLinkTitleWarning(false);
    //   }, 3000);
    // }
    if(newLinkUrl.trim() === ''){
      setNewLinkUrlWarning(true);
      setTimeout(()=>{
        setNewLinkUrlWarning(false);
      }, 3000);
    }
    if(newLinkUrl.trim() !== ''){
      const exist = newLinks.find((e)=>(e.Title === newLinkTitle.trim() && e.Url === newLinkUrl.trim()))
      if(!exist){
        setNewLinks([...newLinks, {Title: newLinkTitle.trim()===''?links.Title:newLinkTitle.trim(), Url: newLinkUrl}])
      }

      setNewLinkTitle('');
      setNewLinkUrl('');
      setNewLinkTitleWarning(false);
      setNewLinkUrlWarning(false);
    }
  }

  const removeLinkFromLinks = (link: Link) => {
    const newValue = newLinks.filter((e)=>(e.Title !== link.Title && e.Url !== link.Url));
    setNewLinks([...newValue]);
  }

  const openLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  const openLinks = () => {
    if(!isEditingPos && links.Links.length > 0){
      links.Links.forEach(element => {
        window.open(element.Url, '_blank', 'noopener,noreferrer');
      });
    }
  }

  const getTheme = () => {
    let rtnTheme = 'linksContainer';
    if(links.Title.trim() !== '' && links.Links.length > 0){
      rtnTheme += ' linksContainerClear';
    }
    else{
      if(theme === 'darkBlue'){
        rtnTheme += ' linksContainerBlue';
      }
      else if(theme === 'darkRed'){
        rtnTheme += ' linksContainerRed';
      }
      else if(theme === 'darkGreen'){
        rtnTheme += ' linksContainerGreen';
      }
      else if(theme === 'darkWhite'){
        rtnTheme += ' linksContainerWhite';
      }
      else if(theme === 'noTheme'){
        rtnTheme += ' linksContainerNoTheme';
      }
      else{
        rtnTheme += ' linksContainerNoTheme';
      }
    }

    rtnTheme += isSelected? ' linksContainerSelected':'';
    rtnTheme += isEndingPos&&isSelected? ' linksContainerSelectedEnding':'';
    rtnTheme += (links.Title.trim() !== '' && links.Links.length > 0)? ' linksContainerNoBackground':'';
    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' linksTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' linksTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' linksTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' linksTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' linksTextNoTheme'
    }
    else{
      return ' linksTextNoTheme';
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
      v+= 'linksInputBlue linksTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'linksInputRed linksTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'linksInputGreen linksTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'linksInputWhite linksTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'linksInputNoTheme linksTextNoTheme'
    }
    else{
      v+= 'linksInputNoTheme linksTextNoTheme';
    }

    return 'linksInput ' + v;
  }

  const getDisplayLinkList = ():ReactNode => {
    if(newLinks.length === 0){
      return (<div className={'linkLine'}>Link list empty...</div>)
    }
    else{
      return newLinks.map((link, i) => (
        <div key={'linkline'+link.Title} className={'linkLine'}>
          <img className={'inputImage'} onClick={()=>removeLinkFromLinks(link)} src={process.env.PUBLIC_URL + '/trash' + getTintColor() + '.png'}></img>
          <div className={'linkLineTitle ' + getTextColor()}>{link.Title}</div>
          <img className={'inputImage'} onClick={()=>openLink(link.Url)} src={process.env.PUBLIC_URL + '/link' + getTintColor() + '.png'}></img>
        </div>
      ));
    }
  }

  return (
    <div className={getTheme()}>
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
              <div className={'linkLineContainer'}>
                <input 
                  className={getInputColor()}
                  type='text'
                  value={newTitle}
                  onChange={handleTitleInputChange}
                  onKeyDown={handleKeyDown} 
                  placeholder='Title'>
                </input>
              </div>
              <div className={'linkLineContainer'}>
                <input 
                  className={getInputColor() + (newLinkTitleWarning?' linksInputWarning':'')}
                  type='text'
                  value={newLinkTitle}
                  onChange={handleLinkTitleInputChange}
                  onKeyDown={handleUrlKeyDown} 
                  placeholder='Link Title'>
                </input>
                <input 
                  className={getInputColor() + (newLinkUrlWarning?' linksInputWarning':'')}
                  type='text'
                  value={newLinkUrl}
                  onChange={handleLinkUrlInputChange}
                  onKeyDown={handleUrlKeyDown} 
                  placeholder='Url'>
                </input>
                <img className='inputImage' onClick={addLinkToLinks} src={process.env.PUBLIC_URL + '/add' + getTintColor() + '.png'}></img>
              </div>
              <div className={'linksListContainer'}>
                {getDisplayLinkList()}
              </div>
            </div>
            <div className='linksSideContainer'>
              <PressImage onClick={doneEditLinks} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}/>
              <PressImage onClick={cancelEditLinks} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}/>
            </div>
          </div>
          :
          <div className={'titleLine' + getTextColor()} onClick={() => {if(!isEditingPos)setIsEditingLinks(true)}}>{links.Title}</div>
        )
      }
      {!isEditingLinks &&
        <img className={'linkImage ' + ((links.Links && links.Links.length > 0)?'':'linkImageNoPointer')} onClick={openLinks} src={process.env.PUBLIC_URL + '/links' + getTintColor() + '.png'}></img>
      }
    </div>
  );
}

export default LinksView;