import { useEffect, useState } from "react";
import './WaitView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Wait } from "../../../../TypesObjectives";
import Loading from "../../../../Loading/Loading";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import log from "../../../../Log/Log";

interface WaitViewProps extends ItemViewProps{
  wait: Wait,
  theme: string,
}

const WaitView: React.FC<WaitViewProps> = (props) => {
  const { wait, putItemInDisplay, theme, isEditingPos, isSelected, isEndingPos } = props;

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

  const getTheme = () => {
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'waitContainer waitContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'waitContainer waitContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'waitContainer waitContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'waitContainer waitContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'waitContainer waitContainerNoTheme';
    }
    else{
      rtnTheme = 'waitContainer waitContainerNoTheme';
    }
    rtnTheme += isSelected? ' waitContainerSelected':'';
    rtnTheme += isEndingPos&&isSelected? ' waitContainerSelectedEnding':'';
    rtnTheme += wait.Title.trim() !== ''? ' waitContainerNoBackground':'';

    return rtnTheme;
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' waitTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' waitTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' waitTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' waitTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' waitTextNoTheme'
    }
    else{
      return ' waitTextNoTheme';
    }
  }

  const getTintColor = () => {
    if(theme === 'darkWhite')
      return '-black';
    else
      return '';
  }

  const getInputColor = () => {
    let v = '';
    if(theme === 'darkBlue'){
      v+= 'waitInputBlue waitTextBlue'
    }
    else if(theme === 'darkRed'){
      v+= 'waitInputRed waitTextRed'
    }
    else if(theme === 'darkGreen'){
      v+= 'waitInputGreen waitTextGreen'
    }
    else if(theme === 'darkWhite'){
      v+= 'waitInputWhite waitTextWhite'
    }
    else if(theme === 'noTheme'){
      v+= 'waitInputNoTheme waitTextNoTheme'
    }
    else{
      v+= 'waitInputNoTheme waitTextNoTheme';
    }

    return 'waitInput ' + v;
  }

  return (
    <div className={getTheme()}>
      {isSavingTitle?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingTitle?
          <div className='waitTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
            }
            <input 
              className={getInputColor()}
              type='text'
              placeholder='Wait text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
          </div>
          :
          <div className={'waitTitle' + getTextColor()} onClick={()=>{if(!isEditingPos)onChangeEditTitle()}}>{wait.Title}</div>
        )
      }
    {!isEditingTitle && <img className='waitImage' src={process.env.PUBLIC_URL + '/wait' + getTintColor() + '.png'}></img>}
    </div>
  );
}

export default WaitView;