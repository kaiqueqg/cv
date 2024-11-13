import { useEffect, useState } from "react";
import './StepView.scss';
import { useUserContext } from "../../../../Contexts/UserContext";
import { Item, ItemViewProps, Step } from "../../../../TypesObjectives";
import log from "../../../../Log/Log";
import { objectiveslistApi } from "../../../../Requests/RequestFactory";
import Loading from "../../../../Loading/Loading";


interface StepViewProps extends ItemViewProps{
  step: Step,
}

const StepView: React.FC<StepViewProps> = (props) => {
  const { step, theme, putItemInDisplay, isEditingPos, isSelected, isEndingPos } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);
  const [isSavingDone, setIsSavingDone] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(step.Title);

  useEffect(() => {
  }, []);

  const onChangeDone = async () => {
    setIsSavingDone(true);

    try {
      const newItem: Step = { ...step, Done: !step.Done, LastModified: new Date().toISOString()};
      const data = await objectiveslistApi.putObjectiveItem(newItem);

      if(data){
        putItemInDisplay(data);
        setIsSavingDone(false);
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setTimeout(() => {
      setIsSavingDone(false);
    }, 200); 
  }

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
    const data = await objectiveslistApi.deleteObjectiveItem(step);

    if(data){
      setIsEditingTitle(false);
      putItemInDisplay(step, true);
    }
    setIsDeleting(false);
  }

  const doneEdit = async () => {
    const newStep: Step = {...step, Title: newTitle, LastModified: new Date().toISOString()};

    if(newStep.Title !== step.Title || newStep.Done !== step.Done || newStep.Pos !== step.Pos) {
      setIsSavingTitle(true);

      const data = await objectiveslistApi.putObjectiveItem(newStep);

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
    }
  }

  const cancelEdit = () => {
    setNewTitle(step.Title);
    setIsEditingTitle(false);
  }

  const getTheme = () => {
    let rtnTheme;
    if(theme === 'darkBlue'){
      rtnTheme = 'stepContainer stepContainerBlue';
    }
    else if(theme === 'darkRed'){
      rtnTheme = 'stepContainer stepContainerRed';
    }
    else if(theme === 'darkGreen'){
      rtnTheme = 'stepContainer stepContainerGreen';
    }
    else if(theme === 'darkWhite'){
      rtnTheme = 'stepContainer stepContainerWhite';
    }
    else if(theme === 'noTheme'){
      rtnTheme = 'stepContainer stepContainerNoTheme';
    }
    else{
      rtnTheme = 'stepContainer stepContainerNoTheme';
    }

    return rtnTheme + (isSelected? ' stepContainerSelected':'') + (isEndingPos&&isSelected?' stepContainerSelectedEnding':'');
  }

  const getTextColor = () => {
    if(theme === 'darkBlue'){
      return ' stepTextBlue'
    }
    else if(theme === 'darkRed'){
      return ' stepTextRed'
    }
    else if(theme === 'darkGreen'){
      return ' stepTextGreen'
    }
    else if(theme === 'darkWhite'){
      return ' stepTextWhite'
    }
    else if(theme === 'noTheme'){
      return ' stepTextNoTheme'
    }
    else{
      return ' stepTextBlue';
    }
  }

  const getTextFadeColor = () => {
    if(theme === 'darkBlue'){
      return ' stepTextFadeBlue'
    }
    else if(theme === 'darkRed'){
      return ' stepTextFadeRed'
    }
    else if(theme === 'darkGreen'){
      return ' stepTextFadeGreen'
    }
    else if(theme === 'darkWhite'){
      return ' stepTextFadeWhite'
    }
    else if(theme === 'noTheme'){
      return ' stepTextFadeNoTheme'
    }
    else{
      return ' stepTextFadeBlue';
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
      {isSavingTitle?
        <Loading IsBlack={theme==='darkWhite'}></Loading>
        :
        (isEditingTitle?
          <div className='stepTitleContainer'>
            {isDeleting?
              <Loading IsBlack={theme==='darkWhite'}></Loading>
              :
              <img className='inputImage' onClick={deleteItem} src={process.env.PUBLIC_URL + '/trash-red.png'}></img>
            }
            <input 
              className={'stepInput' + getTextColor()}
              type='text'
              value={newTitle}
              onChange={handleTextInputChange}
              onKeyDown={handleKeyDown} autoFocus></input>
            <img className='inputImage' onClick={cancelEdit} src={process.env.PUBLIC_URL + '/cancel' + getTintColor() + '.png'}></img>
            <img className='inputImage' onClick={doneEdit} src={process.env.PUBLIC_URL + '/done' + getTintColor() + '.png'}></img>
          </div>
          :
          <div className={'stepTitle' + (step.Done? getTextFadeColor():getTextColor())} onClick={() => {if(!isEditingPos)onChangeEditTitle();}}>{step.Title}</div>
        )
      }
      {!isEditingTitle &&
        (isSavingDone?
          <Loading IsBlack={theme==='darkWhite'}></Loading>
          :
          (step.Done?
            <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step-filled-grey.png'}></img>
            :
            <img className='stepImage' onClick={() => {if(!isEditingPos)onChangeDone();}} src={process.env.PUBLIC_URL + '/step' + getTintColor() + '.png'}></img>
          )
        )
      }
    </div>
  );
}

export default StepView;