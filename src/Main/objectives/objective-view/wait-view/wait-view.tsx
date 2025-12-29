import { useEffect, useState } from "react";
import './wait-view.scss';
import { useUserContext } from "../../../../contexts/user-context";
import { Item, ItemViewProps, Wait } from "../../../../TypesObjectives";
import Loading from "../../../../loading/loading";
// import { objectiveslistApi } from "../../../../requests-sdk/requests-sdk";
import log from "../../../../log/log";
import PressImage from "../../../../press-image/press-image";
import { useRequestContext } from "../../../../contexts/request-context";
import { useThemeContext, SCSS } from "../../../../contexts/theme-context";

export function waitNew() { return { Title: '' } }

interface WaitViewProps extends ItemViewProps{
  wait: Wait,
  theme: string,
}

export const WaitView: React.FC<WaitViewProps> = (props) => {
  const { identityApi, objectiveslistApi, s3Api } = useRequestContext();
  const { scss } = useThemeContext();
  const { wait, putItemsInDisplay, removeItemsInDisplay, theme, isDisabled, isSelected, itemTintColor } = props;

  const [newTitle, setNewTitle] = useState<string>('');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
  }, []);

  const onChangeEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  }

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      doneEdit();
    }
    else if(event.key === 'Escape'){
      cancelEdit();
    }
  }

  const deleteItem = async () => {
    setIsDeleting(true);

    const data = await objectiveslistApi.deleteObjectiveItems([wait]);

    if(data){
      removeItemsInDisplay([wait]);
    }

    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newWait: Wait = {...wait, Title: newTitle.trim(), LastModified: new Date().toISOString()};

    if(newWait.Title !== wait.Title || newWait.Pos !== wait.Pos) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItems([newWait]);

      if(data){
        setIsEditingTitle(false);
        putItemsInDisplay(data);
      }

      setTimeout(() => {
        setIsSavingTitle(false);
      }, 200); 
    }
    else{
      setIsEditingTitle(false);
      setNewTitle(wait.Title);
    }
  }

  const cancelEdit = () => {
    setNewTitle(wait.Title);
    setIsEditingTitle(false);
  }

  return (
    <div className={'waitContainer' + scss(theme, [SCSS.ITEM_BG, SCSS.BORDERCOLOR_CONTRAST], wait.Title.trim() !==  '')}>
      {isSavingTitle?
        <Loading IsBlack={theme==='white'}></Loading>
        :
        (isEditingTitle?
          <div className='waitTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='white'}></Loading>
              :
              <PressImage isLoadingBlack={props.isLoadingBlack} onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm rawImage isLoading={isDeleting}/>
            }
            <input 
              className={'input-simple-base ' + scss(theme, [SCSS.INPUT])}
              type='text'
              placeholder='Wait text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <PressImage isLoadingBlack={props.isLoadingBlack} onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'} rawImage/>
            <PressImage isLoadingBlack={props.isLoadingBlack} onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'} rawImage/>
          </div>
          :
          <div className={'waitTitle' + scss(theme, [SCSS.TEXT], wait.Title.trim() !==  '')} onClick={()=>{if(!isDisabled)onChangeEditTitle()}}>{wait.Title}</div>
        )
      }
    {!isEditingTitle && <img className='waitImage' src={process.env.PUBLIC_URL + '/wait' + itemTintColor(theme) + '.png'}></img>}
    </div>
  );
}