import { useEffect, useState } from "react";
import './WaitView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Wait } from "../../../../TypesObjectives";
import Loading from "../../../../Loading/Loading";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import log from "../../../../Log/Log";
import PressImage from "../../../../PressImage/PressImage";

export const New = () => {
  return(
    {
      Title: '',
    }
  )
}

interface WaitViewProps extends ItemViewProps{
  wait: Wait,
  theme: string,
}

const WaitView: React.FC<WaitViewProps> = (props) => {
  const { wait, putItemInDisplay, theme, isEditingPos, isSelected, isEndingPos, itemGetTheme, itemTextColor, itemInputColor, itemTintColor } = props;

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

    const data = await objectiveslistApi.deleteObjectiveItem(wait);

    if(data){
      putItemInDisplay(wait, true);
    }

    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newWait: Wait = {...wait, Title: newTitle.trim(), LastModified: new Date().toISOString()};

    if(newWait.Title !== wait.Title || newWait.Pos !== wait.Pos) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItem(newWait);

      if(data){
        setIsEditingTitle(false);
        putItemInDisplay(data);
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
    <div className={'waitContainer' + itemGetTheme(theme, isSelected, isEndingPos)}>
      {isSavingTitle?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingTitle?
          <div className='waitTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <PressImage onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'} confirm={true}/>
            }
            <input 
              className={itemInputColor(theme)}
              type='text'
              placeholder='Wait text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <PressImage onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + itemTintColor(theme) + '.png'}/>
            <PressImage onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + itemTintColor(theme) + '.png'}/>
          </div>
          :
          <div className={'waitTitle' + itemTextColor(theme)} onClick={()=>{if(!isEditingPos)onChangeEditTitle()}}>{wait.Title}</div>
        )
      }
    {!isEditingTitle && <img className='waitImage' src={process.env.PUBLIC_URL + '/wait' + itemTintColor(theme) + '.png'}></img>}
    </div>
  );
}

export default WaitView;